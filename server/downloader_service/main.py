"""
PostNexa Video Downloader Backend Service
=========================================
A secure, high-performance FastAPI microservice powered by yt-dlp and FFmpeg.
Provides verified video inspection, format resolution, and audio/video merging for:
- TikTok
- YouTube (Videos & Shorts)
- Facebook (Public Videos & Reels)
- Instagram (Public Videos & Reels)

Security Features:
- Strict domain allowlisting & SSRF prevention (IP resolution & private network blocking)
- Concurrency limiting via asyncio.Semaphore
- In-memory sliding-window IP rate limiting
- File size (100 MB) & duration (10 min) ceilings
- Automated temporary file lifecycle management (cleanup on stream end)
- Zero exposure or storage of user credentials/cookies
"""

import os
import sys
import time
import uuid
import shutil
import socket
import logging
import asyncio
import tempfile
import ipaddress
from urllib.parse import urlparse
from typing import Optional, Dict, Any

from fastapi import FastAPI, Request, HTTPException, Query, BackgroundTasks
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
import imageio_ffmpeg

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("postnexa-downloader")

# Detect FFmpeg executable
try:
    FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()
    logger.info("Discovered FFmpeg binary at: %s", FFMPEG_EXE)
except Exception as e:
    FFMPEG_EXE = "ffmpeg"
    logger.warning("Falling back to system ffmpeg command: %s", e)

# Operational Limits
MAX_DURATION_SECONDS = 600       # 10 minutes maximum duration
MAX_FILE_BYTES = 100 * 1024 * 1024  # 100 MiB ceiling
MAX_CONCURRENT_DOWNLOADS = 3    # Limit CPU/RAM exhaustion
CONCURRENCY_SEMAPHORE = asyncio.Semaphore(MAX_CONCURRENT_DOWNLOADS)

# Rate Limiting configuration: 20 requests per minute per IP
RATE_LIMIT_BUCKET: Dict[str, list] = {}
RATE_LIMIT_WINDOW = 60.0
RATE_LIMIT_MAX = 20

# In-memory download token cache (maps token -> metadata & temporary state)
TOKEN_CACHE: Dict[str, Dict[str, Any]] = {}
CACHE_LOCK = asyncio.Lock()

# Base Temporary directory
TEMP_STORAGE_DIR = os.path.join(tempfile.gettempdir(), "postnexa_downloads")
os.makedirs(TEMP_STORAGE_DIR, exist_ok=True)

# Allowed platform domain suffixes
ALLOWED_DOMAINS = [
    "tiktok.com",
    "vm.tiktok.com",
    "vt.tiktok.com",
    "youtube.com",
    "youtu.be",
    "music.youtube.com",
    "instagram.com",
    "facebook.com",
    "fb.watch",
    "postnexa.world",
    "pages.dev"
]

# Initialize FastAPI
app = FastAPI(
    title="PostNexa Media Downloader Service",
    description="Authorized social media video resolution and streaming engine for PostNexa",
    version="1.0.0"
)

# Enable CORS for PostNexa web origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://postnexa.world",
        "https://www.postnexa.world",
        "https://app.postnexa.world",
        "https://postnexa-website.pages.dev",
        "http://localhost:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


def is_private_ip(ip_str: str) -> bool:
    """Checks if an IP address belongs to private, loopback, multicast, or reserved blocks."""
    try:
        ip = ipaddress.ip_address(ip_str)
        return (
            ip.is_private or
            ip.is_loopback or
            ip.is_link_local or
            ip.is_multicast or
            ip.is_reserved or
            ip.is_unspecified
        )
    except ValueError:
        return True


def validate_target_url(raw_url: str) -> Dict[str, Any]:
    """Strict SSRF and domain verification for incoming media URLs."""
    if not raw_url or len(raw_url) > 2048:
        raise HTTPException(status_code=400, detail="URL is invalid or exceeds maximum length.")

    parsed = urlparse(raw_url)
    if parsed.scheme.lower() not in ("http", "https"):
        raise HTTPException(status_code=400, detail="Only HTTP and HTTPS URLs are supported.")

    hostname = (parsed.hostname or "").lower().strip()
    if not hostname:
        raise HTTPException(status_code=400, detail="Missing hostname in URL.")

    # Check allowed domain whitelist
    is_allowed_domain = any(
        hostname == domain or hostname.endswith("." + domain)
        for domain in ALLOWED_DOMAINS
    )
    if not is_allowed_domain:
        raise HTTPException(status_code=400, detail="Platform domain is not supported.")

    # SSRF: Resolve hostname and ensure it does not route to internal infrastructure
    try:
        addr_info = socket.getaddrinfo(hostname, None, socket.AF_UNSPEC, socket.SOCK_STREAM)
        for family, _, _, _, sockaddr in addr_info:
            ip_str = sockaddr[0]
            if is_private_ip(ip_str):
                logger.warning("SSRF blocked attempt to target private IP: %s (%s)", hostname, ip_str)
                raise HTTPException(status_code=403, detail="Destination resolves to a restricted private network.")
    except socket.gaierror:
        raise HTTPException(status_code=400, detail="Failed to resolve hostname for the provided URL.")

    # Detect platform
    platform = "all"
    if "tiktok.com" in hostname:
        platform = "tiktok"
    elif "instagram.com" in hostname:
        platform = "instagram"
    elif "facebook.com" in hostname or "fb.watch" in hostname:
        platform = "facebook"
    elif "youtube.com" in hostname or "youtu.be" in hostname:
        platform = "youtube"

    return {
        "url": raw_url,
        "hostname": hostname,
        "platform": platform
    }


def enforce_rate_limit(request: Request):
    """Enforces per-client sliding window rate limits."""
    client_ip = request.headers.get("cf-connecting-ip") or request.headers.get("x-forwarded-for")
    if client_ip:
        client_ip = client_ip.split(",")[0].strip()
    else:
        client_ip = request.client.host if request.client else "unknown"

    now = time.time()
    timestamps = RATE_LIMIT_BUCKET.setdefault(client_ip, [])
    # Filter out entries older than window
    timestamps = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW]
    if len(timestamps) >= RATE_LIMIT_MAX:
        retry_after = int(RATE_LIMIT_WINDOW - (now - timestamps[0])) + 1
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Please wait {retry_after} seconds.",
            headers={"Retry-After": str(retry_after)}
        )
    timestamps.append(now)
    RATE_LIMIT_BUCKET[client_ip] = timestamps


def format_duration(seconds: Optional[int]) -> str:
    """Formats seconds into readable mm:ss or hh:mm:ss."""
    if not seconds or seconds <= 0:
        return "Video"
    mins, secs = divmod(int(seconds), 60)
    hours, mins = divmod(mins, 60)
    if hours > 0:
        return f"{hours}:{mins:02d}:{secs:02d}"
    return f"{mins}:{secs:02d}"


def format_bytes(num_bytes: Optional[int]) -> str:
    """Formats bytes to MB."""
    if not num_bytes or num_bytes <= 0:
        return ""
    mb = num_bytes / (1024 * 1024)
    if mb >= 1:
        return f"{mb:.2f} MB"
    return f"{num_bytes / 1024:.0f} KB"


def cleanup_old_files():
    """Removes temporary files older than 15 minutes."""
    now = time.time()
    try:
        for fname in os.listdir(TEMP_STORAGE_DIR):
            fpath = os.path.join(TEMP_STORAGE_DIR, fname)
            if os.path.isfile(fpath):
                if now - os.path.getmtime(fpath) > 900:  # 15 minutes
                    try:
                        os.remove(fpath)
                    except OSError:
                        pass
    except Exception as e:
        logger.error("Error during temporary file cleanup: %s", e)


@app.on_event("startup")
async def startup_event():
    logger.info("PostNexa Downloader Backend initialized successfully.")


@app.get("/")
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "PostNexa Media Downloader Service",
        "version": "1.0.0",
        "ffmpeg": bool(FFMPEG_EXE),
        "supportedPlatforms": ["tiktok", "youtube", "facebook", "instagram"]
    }


@app.get("/fetch")
async def fetch_media_info(request: Request, url: str = Query(..., description="Target video URL")):
    """
    Metadata inspection endpoint.
    Compatible with PostNexa Cloudflare Pages queryExternalMediaProvider standard.
    """
    enforce_rate_limit(request)
    validated = validate_target_url(url)
    target_url = validated["url"]
    platform = validated["platform"]

    cleanup_old_files()

    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": False,
        "skip_download": True,
        "ffmpeg_location": FFMPEG_EXE,
        "js_runtimes": {"node": {}},
        "socket_timeout": 8,
    }

    try:
        # Run blocking yt-dlp inspection in thread pool
        loop = asyncio.get_event_loop()
        info = await loop.run_in_executor(None, lambda: _extract_info_safe(target_url, ydl_opts))

        if not info:
            return JSONResponse(
                status_code=404,
                content={
                    "ok": False,
                    "errorCode": "VIDEO_UNAVAILABLE",
                    "message": "The requested video could not be found or access was restricted by platform privacy settings."
                }
            )

        duration = info.get("duration")
        if duration and duration > MAX_DURATION_SECONDS:
            return JSONResponse(
                status_code=413,
                content={
                    "ok": False,
                    "errorCode": "FILE_TOO_LARGE",
                    "message": f"Video duration ({format_duration(duration)}) exceeds the maximum allowed limit of 10 minutes."
                }
            )

        title = info.get("title") or f"{platform.capitalize()} Video"
        author = info.get("uploader") or info.get("creator") or f"{platform.capitalize()} Creator"
        thumbnail = info.get("thumbnail")

        # Generate download token
        token = str(uuid.uuid4())
        estimated_size = None
        for fmt in info.get("formats", []):
            if fmt.get("filesize"):
                estimated_size = max(estimated_size or 0, fmt["filesize"])
            elif fmt.get("filesize_approx"):
                estimated_size = max(estimated_size or 0, fmt["filesize_approx"])

        async with CACHE_LOCK:
            TOKEN_CACHE[token] = {
                "url": target_url,
                "platform": platform,
                "title": title,
                "duration": duration,
                "created_at": time.time()
            }

        stream_url = f"/stream?token={token}"

        # Standard PostNexa schema
        return {
            "ok": True,
            "status": True,
            "platform": platform,
            "title": title,
            "author": author,
            "duration": format_duration(duration),
            "thumbnail": thumbnail,
            "sizeBytes": estimated_size,
            "sizeFormatted": format_bytes(estimated_size),
            "videoUrl": stream_url,
            "download_url": stream_url,
            "media": [
                {
                    "format": "mp4",
                    "quality": "hd",
                    "url": stream_url,
                    "download_url": stream_url
                }
            ]
        }

    except Exception as exc:
        err_msg = str(exc)
        logger.warning("Extraction error for url %s: %s", target_url, err_msg)
        if "empty media response" in err_msg or "login" in err_msg.lower() or "not granting access" in err_msg:
            return JSONResponse(
                status_code=403,
                content={
                    "ok": False,
                    "errorCode": "PRIVATE_OR_RESTRICTED",
                    "message": f"This {platform.capitalize()} video requires account authentication or is private. Only public videos can be downloaded."
                }
            )
        return JSONResponse(
            status_code=502,
            content={
                "ok": False,
                "errorCode": "PROVIDER_UNAVAILABLE",
                "message": f"Unable to retrieve media from {platform.capitalize()}. Please verify the link is public and active."
            }
        )


def _extract_info_safe(url: str, opts: dict):
    with yt_dlp.YoutubeDL(opts) as ydl:
        return ydl.extract_info(url, download=False)


@app.get("/stream")
async def stream_media_file(
    request: Request,
    token: str = Query(..., description="Secure video resolution token"),
    background_tasks: BackgroundTasks = None
):
    """
    Downloads, merges (via FFmpeg if needed), and streams the binary MP4 file.
    Automatically deletes temporary files upon stream completion.
    """
    enforce_rate_limit(request)

    async with CACHE_LOCK:
        cached = TOKEN_CACHE.get(token)
    if not cached:
        raise HTTPException(status_code=404, detail="Download session expired or invalid. Please check link again.")

    target_url = cached["url"]
    platform = cached["platform"]
    title = cached["title"]

    # Sanitize download filename
    slug = "".join(c if c.isalnum() else "-" for c in title.lower()).strip("-")[:50] or "video"
    filename = f"postnexa-{platform}-{slug}.mp4"

    # Enforce concurrency limit to protect server resources
    await CONCURRENCY_SEMAPHORE.acquire()

    temp_id = str(uuid.uuid4())
    temp_output_template = os.path.join(TEMP_STORAGE_DIR, f"{temp_id}.%(ext)s")
    target_mp4_path = os.path.join(TEMP_STORAGE_DIR, f"{temp_id}.mp4")

    ydl_opts = {
        "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
        "outtmpl": temp_output_template,
        "merge_output_format": "mp4",
        "ffmpeg_location": FFMPEG_EXE,
        "quiet": True,
        "no_warnings": True,
        "socket_timeout": 15,
        "max_filesize": MAX_FILE_BYTES,
    }

    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, lambda: _download_safe(target_url, ydl_opts))

        # Check for output file
        if not os.path.exists(target_mp4_path):
            # Check if extension was different
            candidates = [
                os.path.join(TEMP_STORAGE_DIR, f)
                for f in os.listdir(TEMP_STORAGE_DIR)
                if f.startswith(temp_id) and not f.endswith(".part")
            ]
            if candidates:
                target_mp4_path = candidates[0]
            else:
                CONCURRENCY_SEMAPHORE.release()
                raise HTTPException(status_code=502, detail="Failed to assemble video file.")

        file_size = os.path.getsize(target_mp4_path)

        def iterfile():
            try:
                with open(target_mp4_path, "rb") as f:
                    while chunk := f.read(64 * 1024):
                        yield chunk
            finally:
                CONCURRENCY_SEMAPHORE.release()
                try:
                    if os.path.exists(target_mp4_path):
                        os.remove(target_mp4_path)
                except OSError:
                    pass

        headers = {
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Type": "video/mp4",
            "Content-Length": str(file_size),
            "Cache-Control": "no-store, no-cache, must-revalidate",
            "Accept-Ranges": "bytes"
        }

        return StreamingResponse(iterfile(), headers=headers)

    except yt_dlp.utils.MaxDownloadsReached:
        CONCURRENCY_SEMAPHORE.release()
        raise HTTPException(status_code=413, detail="File size exceeds maximum download limit.")
    except Exception as exc:
        CONCURRENCY_SEMAPHORE.release()
        # Clean up any partial files
        for f in os.listdir(TEMP_STORAGE_DIR):
            if f.startswith(temp_id):
                try:
                    os.remove(os.path.join(TEMP_STORAGE_DIR, f))
                except OSError:
                    pass
        logger.error("Download streaming failure: %s", exc)
        raise HTTPException(status_code=502, detail="Unable to assemble video stream.")


def _download_safe(url: str, opts: dict):
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download([url])


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    logger.info("Starting PostNexa Downloader Microservice on http://0.0.0.0:%d", port)
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
