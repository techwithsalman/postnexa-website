/**
 * PostNexa - Free Social Media Content Calendar Generator
 * ========================================================
 * Generates tailored 7-day or 30-day multi-platform social media calendars
 * with inline editing and one-click CSV export without requiring an account.
 */

(function () {
  'use strict';

  const NICHE_IDEAS = {
    saas: [
      { pillar: "Educational", format: "Carousel (5 slides)", hook: "How to automate {topic} in 3 simple steps", cta: "Save this carousel for your next team sprint 📌" },
      { pillar: "Social Proof", format: "Case Study Graphic", hook: "How one company reduced manual hours by 60% with {topic}", cta: "Drop a comment if you want the full case study breakdown 👇" },
      { pillar: "Educational", format: "Short Video / Reel", hook: "The single biggest misconception about {topic} in 2026", cta: "What has been your experience? Let's discuss in the comments." },
      { pillar: "Entertaining", format: "Meme / Relatable Post", hook: "Me trying to manage {topic} before having a system vs. after", cta: "Tag a coworker who understands this struggle 😂" },
      { pillar: "Promotional", format: "Product Demo Clip", hook: "A quick 45-second look inside PostNexa's {topic} workflow", cta: "Try PostNexa free at app.postnexa.world (link in bio) 🚀" },
      { pillar: "Educational", format: "Checklist / Infographic", hook: "Your complete Q4 checklist for mastering {topic}", cta: "Share this with a team member who is planning for next month ✨" },
      { pillar: "Social Proof", format: "Customer Quote", hook: "'This completely changed how our agency delivers results' — User Review", cta: "Explore our free tools at postnexa.world/tools/" }
    ],
    creator: [
      { pillar: "Educational", format: "30s Tutorial Reel", hook: "Stop making this rookie mistake with your {topic}", cta: "Hit the follow button for daily creator workflows! ➕" },
      { pillar: "Entertaining", format: "Behind The Scenes", hook: "What a 12-hour content shoot for {topic} actually looks like", cta: "Which clip was your favorite? Let me know below!" },
      { pillar: "Educational", format: "Carousel (Tips)", hook: "5 tools I genuinely use every week for {topic}", cta: "Save this post before your next video shoot 📌" },
      { pillar: "Social Proof", format: "Milestone / Transformation", hook: "How 90 days of consistent {topic} changed my organic reach", cta: "If you are starting your journey, drop your handle below!" },
      { pillar: "Promotional", format: "Resource / Freebie Share", hook: "I packaged my exact {topic} templates for free", cta: "Link in bio to download the free guide today 📲" },
      { pillar: "Educational", format: "Hot Take / Perspective", hook: "Why the traditional advice on {topic} is completely dead in 2026", cta: "Do you agree or disagree? Sound off below! 💬" },
      { pillar: "Entertaining", format: "Q&A Community Story", hook: "Answering the most common question I get asked about {topic}", cta: "Drop your next question in the comments for part 2!" }
    ],
    ecommerce: [
      { pillar: "Educational", format: "Product Highlight Video", hook: "3 reasons why customers love our new {topic} collection", cta: "Tap the link in bio to explore the latest drops 🛍️" },
      { pillar: "Social Proof", format: "Customer Unboxing Reel", hook: "Watch this unboxing of {topic} from one of our verified buyers", cta: "Share your unboxing photos with #PostNexa for a feature!" },
      { pillar: "Entertaining", format: "Behind The Scenes / Packing", hook: "Pack an order with me for a loyal {topic} customer", cta: "Guess which item ordered was the most popular this week!" },
      { pillar: "Promotional", format: "Limited Time Offer", hook: "Seasonal flash deal: Upgrade your {topic} essentials today", cta: "Shop the weekend special via the link in bio!" },
      { pillar: "Educational", format: "Care & Styling Guide", hook: "How to properly care for and maintain your {topic}", cta: "Save this guide so you don't lose it later 📌" },
      { pillar: "Social Proof", format: "Review Round-up", hook: "Top 5 verified 5-star reviews of our {topic} this month", cta: "Have you tried it yet? Leave your review below!" },
      { pillar: "Educational", format: "Comparison / Versus", hook: "Cheap alternatives vs our premium {topic}: Here is the difference", cta: "Experience the difference yourself at the link in bio." }
    ],
    agency: [
      { pillar: "Educational", format: "Infographic / Breakdown", hook: "How top agencies structure their {topic} approval pipeline", cta: "Save this workflow for your next client onboarding 📌" },
      { pillar: "Social Proof", format: "Client Growth Metric", hook: "How we took a client from 2k to 50k monthly impressions with {topic}", cta: "DM us 'GROWTH' to see how we structure custom client campaigns." },
      { pillar: "Educational", format: "Carousel (Audit)", hook: "3 red flags we look for when auditing a brand's {topic}", cta: "Want a quick audit of your social accounts? Drop your link below!" },
      { pillar: "Promotional", format: "Platform Announcement", hook: "Streamline multi-account publishing with PostNexa workspaces", cta: "Visit postnexa.world to manage all client channels from one place." },
      { pillar: "Entertaining", format: "Agency Life Meme", hook: "Waiting for client feedback on {topic} on a Friday at 4:55 PM", cta: "Tag an agency manager who feels this in their soul 😂" },
      { pillar: "Educational", format: "Strategy Breakdown", hook: "The 2026 algorithm blueprint for agency-led {topic}", cta: "Repost if you found this breakdown valuable ♻️" },
      { pillar: "Social Proof", format: "Testimonial Card", hook: "'Managing 15 client brands used to be chaos. Now it takes 1 hour a week.'", cta: "See how PostNexa helps agencies scale sustainably." }
    ],
    fitness: [
      { pillar: "Educational", format: "Exercise Form Video", hook: "Stop making this common form mistake with {topic}", cta: "Save this video for your next workout session 🏋️" },
      { pillar: "Social Proof", format: "Client Transformation", hook: "Meet Sarah: Down 15 lbs and building real strength through {topic}", cta: "Drop some fire emojis in the comments to celebrate her win! 🔥" },
      { pillar: "Educational", format: "Meal / Nutrition Tip", hook: "What I eat in a day to support high-intensity {topic}", cta: "Comment 'RECIPES' for a free high-protein grocery list." },
      { pillar: "Entertaining", format: "Gym Humor / Relatable", hook: "That feeling when you finish your final set of {topic}", cta: "Tag your workout partner who always complains during this 😂" },
      { pillar: "Promotional", format: "Program Intake / Coaching", hook: "Accepting 5 new clients for our 8-week {topic} accelerator", cta: "Link in bio to submit your application before spots fill up!" },
      { pillar: "Educational", format: "Recovery & Sleep Tips", hook: "Why sleep and recovery dictate 70% of your results in {topic}", cta: "Double-tap if you are prioritizing recovery this week." },
      { pillar: "Social Proof", format: "Community Highlight", hook: "Shoutout to our community members who crushed {topic} this week", cta: "Join our free fitness community at the link in bio!" }
    ]
  };

  let generatedCalendarData = [];

  function generateCalendar(options) {
    const { niche, topic, platforms, durationDays, postsPerWeek, startDateStr } = options;
    const cleanTopic = topic.trim() || "Social Media Content";
    const templateList = NICHE_IDEAS[niche] || NICHE_IDEAS.saas;

    const chosenPlatforms = platforms.length > 0 ? platforms : ["Instagram", "Facebook", "TikTok", "LinkedIn"];
    const totalPosts = durationDays === 7 ? Math.min(postsPerWeek, 7) : Math.round((postsPerWeek / 7) * 30);

    const startDate = startDateStr ? new Date(startDateStr) : new Date();
    // Default to tomorrow or clean day
    const calendar = [];

    let currentDay = new Date(startDate);
    let postCount = 0;
    let templateIdx = 0;
    let platformIdx = 0;

    // Distribute posts across days
    const interval = Math.max(1, Math.floor(durationDays / totalPosts));

    for (let dayOffset = 0; dayOffset < durationDays && postCount < totalPosts; dayOffset += interval) {
      const postDate = new Date(currentDay);
      postDate.setDate(currentDay.getDate() + dayOffset);

      const dayName = postDate.toLocaleDateString('en-US', { weekday: 'short' });
      const dateFormatted = postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const isoDate = postDate.toISOString().split('T')[0];

      const template = templateList[templateIdx % templateList.length];
      const platform = chosenPlatforms[platformIdx % chosenPlatforms.length];

      const renderedHook = template.hook.replace('{topic}', cleanTopic);

      calendar.push({
        id: postCount + 1,
        date: dateFormatted,
        isoDate: isoDate,
        day: dayName,
        platform: platform,
        pillar: template.pillar,
        format: template.format,
        hook: renderedHook,
        cta: template.cta
      });

      postCount++;
      templateIdx++;
      platformIdx++;
    }

    return calendar;
  }

  function init() {
    const form = document.getElementById('calendarGenForm');
    const resultsContainer = document.getElementById('calendarResults');
    if (!form || !resultsContainer) return;

    // Set default start date to today
    const dateInput = document.getElementById('calendarStartDate');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const niche = document.getElementById('calendarNiche')?.value || "saas";
      const topic = document.getElementById('calendarTopic')?.value || "Content Strategy";
      const durationDays = parseInt(document.getElementById('calendarDuration')?.value || "30", 10);
      const postsPerWeek = parseInt(document.getElementById('calendarFrequency')?.value || "5", 10);
      const startDateStr = document.getElementById('calendarStartDate')?.value || "";

      // Gather checked platforms
      const checkedBoxes = form.querySelectorAll('input[name="platforms"]:checked');
      const platforms = Array.from(checkedBoxes).map(cb => cb.value);

      const btn = document.getElementById('generateCalendarBtn');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span>Building Your Calendar...</span>`;
      }

      setTimeout(() => {
        generatedCalendarData = generateCalendar({ niche, topic, platforms, durationDays, postsPerWeek, startDateStr });
        renderCalendarTable(generatedCalendarData);
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = `<span>Generate Content Calendar ➔</span>`;
        }
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    });
  }

  function renderCalendarTable(data) {
    const container = document.getElementById('calendarResults');
    if (!container) return;
    container.innerHTML = '';

    const wrap = document.createElement('div');
    wrap.className = 'sc-calendar-wrap';
    wrap.innerHTML = `
      <div class="sc-calendar-toolbar">
        <div>
          <h3 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0;">Editorial Content Calendar (${data.length} Scheduled Posts)</h3>
          <p style="margin: 4px 0 0; font-size: 13.5px; color: #64748B;">You can edit any cell directly before exporting to CSV or Excel.</p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button type="button" class="sc-btn sc-btn-primary" id="exportCsvBtn" style="padding: 10px 20px; font-size: 14px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Download CSV Plan</span>
          </button>
        </div>
      </div>

      <div class="sc-table-responsive">
        <table class="sc-calendar-table" id="calendarTable">
          <thead>
            <tr>
              <th style="width: 120px;">Date</th>
              <th style="width: 110px;">Platform</th>
              <th style="width: 120px;">Pillar</th>
              <th style="width: 140px;">Format</th>
              <th>Hook & Content Idea (Editable)</th>
              <th style="width: 220px;">Call to Action (Editable)</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr data-id="${row.id}">
                <td>
                  <strong>${row.date}</strong><br>
                  <span style="font-size: 12px; color: #64748B;">${row.day}</span>
                </td>
                <td>
                  <span class="sc-platform-pill sc-plat-${row.platform.toLowerCase()}">${row.platform}</span>
                </td>
                <td>
                  <span class="sc-pillar-pill sc-pillar-${row.pillar.toLowerCase().replace(/\s+/g, '')}">${row.pillar}</span>
                </td>
                <td style="font-size: 13px; color: #334155;">
                  ${row.format}
                </td>
                <td>
                  <div contenteditable="true" class="sc-editable-cell cell-hook" data-id="${row.id}">${row.hook}</div>
                </td>
                <td>
                  <div contenteditable="true" class="sc-editable-cell cell-cta" data-id="${row.id}">${row.cta}</div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="sc-calendar-footer-cta">
        <div style="background: #FFF6EE; border: 1px solid #FED7AA; border-radius: 14px; padding: 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
          <div>
            <h4 style="margin: 0 0 4px; font-size: 16px; font-weight: 800; color: #9A3412;">Ready to schedule these posts across your social accounts?</h4>
            <p style="margin: 0; font-size: 13.5px; color: #431407;">Import your exported CSV directly into PostNexa's Bulk Scheduler to auto-publish across TikTok, Instagram, Facebook, and YouTube.</p>
          </div>
          <a href="https://app.postnexa.world/signup" class="sc-btn sc-btn-primary" target="_blank" rel="noopener" style="padding: 10px 22px; font-size: 13.5px;">Start Free with PostNexa ➔</a>
        </div>
      </div>
    `;

    container.appendChild(wrap);

    // Track in-cell edits
    wrap.querySelectorAll('.cell-hook').forEach(el => {
      el.addEventListener('blur', function () {
        const id = parseInt(this.getAttribute('data-id'), 10);
        const item = generatedCalendarData.find(d => d.id === id);
        if (item) item.hook = this.innerText.trim();
      });
    });

    wrap.querySelectorAll('.cell-cta').forEach(el => {
      el.addEventListener('blur', function () {
        const id = parseInt(this.getAttribute('data-id'), 10);
        const item = generatedCalendarData.find(d => d.id === id);
        if (item) item.cta = this.innerText.trim();
      });
    });

    // CSV Export button
    const csvBtn = document.getElementById('exportCsvBtn');
    if (csvBtn) {
      csvBtn.addEventListener('click', exportToCsv);
    }

    container.style.display = 'block';
  }

  function exportToCsv() {
    if (!generatedCalendarData || generatedCalendarData.length === 0) {
      alert("No calendar data available to export.");
      return;
    }

    const headers = ["ID", "Date", "Day", "Platform", "Content_Pillar", "Recommended_Format", "Hook_And_Topic", "Call_To_Action"];
    const rows = generatedCalendarData.map(r => [
      r.id,
      `"${r.date}"`,
      `"${r.day}"`,
      `"${r.platform}"`,
      `"${r.pillar}"`,
      `"${r.format}"`,
      `"${(r.hook || '').replace(/"/g, '""')}"`,
      `"${(r.cta || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `postnexa-editorial-calendar-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
