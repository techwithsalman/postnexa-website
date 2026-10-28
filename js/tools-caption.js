/**
 * PostNexa - Social Media Caption Generator (Pure Client-Side Engine)
 * ==================================================================
 * Generates tailored, high-converting social media captions across
 * Instagram, TikTok, Facebook, LinkedIn, and YouTube without API fees or login.
 */

(function () {
  'use strict';

  // Hook banks organized by tone and intent
  const HOOKS = {
    professional: [
      "Here is the single biggest shift in {topic} we are seeing this year:",
      "Most professionals get {topic} completely backwards. Here is what actually works:",
      "If you want to scale your results with {topic}, start by eliminating these 3 mistakes:",
      "A candid breakdown on {topic} for leaders and founders navigating 2026:",
      "The exact framework our team relies on to master {topic}:"
    ],
    casual: [
      "Let's be completely honest about {topic} for a second...",
      "Can we normalize not stressing out over {topic}? Here's my take:",
      "I tested this new approach to {topic} so you don't have to:",
      "The best advice I ever received about {topic} (and why it stuck with me):",
      "Anyone else feeling this way about {topic} lately?"
    ],
    humorous: [
      "Me trying to explain {topic} to someone without getting excited:",
      "Nobody talks about the unglamorous side of {topic}, so I will:",
      "My 2026 goal: master {topic} without losing my sanity. Step 1:",
      "Current mood: attempting {topic} and hoping for the best.",
      "If {topic} was easy, we wouldn't need coffee to survive it."
    ],
    inspiring: [
      "You don't need permission to start winning at {topic}. You just need momentum:",
      "Small daily actions in {topic} compound into transformations no one saw coming:",
      "Remember why you started this journey with {topic}. Keep pushing:",
      "Success with {topic} rarely looks flashy on day one. Trust the process:",
      "The gap between where you are and where you want to be with {topic} is consistency:"
    ],
    promotional: [
      "Ready to elevate your {topic}? Here is something special we put together:",
      "Stop wasting hours on {topic}. Here is the modern solution you have been waiting for:",
      "Limited time focus: Transform the way you approach {topic} starting today:",
      "Introducing a smarter, faster way to execute your {topic}:",
      "If you have been waiting for the right moment to upgrade your {topic}, this is it:"
    ],
    educational: [
      "Step-by-step breakdown: How to master {topic} in under 10 minutes:",
      "3 non-obvious rules of {topic} that top performers never ignore:",
      "Save this post: The ultimate 2026 checklist for {topic}:",
      "The anatomy of high-performing {topic} explained simply:",
      "Beginner to advanced: Everything you need to understand about {topic}:"
    ]
  };

  // Body frameworks tailored by platform
  const PLATFORM_CONFIG = {
    instagram: {
      name: "Instagram",
      charLimit: 2200,
      optimalLength: "150 - 300 characters for high readability",
      spacingStyle: "double-spaced with clean line breaks",
      hashtagCount: 4,
      defaultCtas: [
        "Double-tap if you agree and save this for later reference! 📌",
        "Which point resonated most with you? Drop your thoughts in the comments 👇",
        "Tap the link in bio to learn how PostNexa streamlines your workflow! 🚀",
        "Share this with a creator or team member who needs to see it today ✨"
      ]
    },
    tiktok: {
      name: "TikTok",
      charLimit: 4000,
      optimalLength: "Under 150 characters with conversational hooks",
      spacingStyle: "punchy, direct lines",
      hashtagCount: 4,
      defaultCtas: [
        "What do you think? Sound off in the comments! 💬",
        "Hit the plus for more creator tips and workflows! ➕",
        "Save this video before your next content shoot! 📲",
        "Tag someone who struggles with this daily 😂"
      ]
    },
    facebook: {
      name: "Facebook",
      charLimit: 63206,
      optimalLength: "200 - 400 characters focusing on conversation",
      spacingStyle: "conversational paragraphs",
      hashtagCount: 2,
      defaultCtas: [
        "What has been your experience with this? Join the conversation below!",
        "Feel free to share this post with friends or colleagues who will find it helpful.",
        "Click the link to explore PostNexa's intelligent social scheduling tools.",
        "Drop a reaction if you found this perspective valuable!"
      ]
    },
    linkedin: {
      name: "LinkedIn",
      charLimit: 3000,
      optimalLength: "Story format with single-sentence paragraph breaks",
      spacingStyle: "spaced lines with concise takeaways",
      hashtagCount: 3,
      defaultCtas: [
        "How is your organization approaching this in 2026? I would welcome your thoughts.",
        "Repost ♻️ if you believe this perspective can help others in your network.",
        "What would you add to this list? Let's connect and discuss in the comments.",
        "Explore how PostNexa helps modern marketing teams streamline social workflows."
      ]
    },
    youtube: {
      name: "YouTube",
      charLimit: 5000,
      optimalLength: "Descriptive with timestamps & keyword integration",
      spacingStyle: "structured sections with chapters and resource links",
      hashtagCount: 3,
      defaultCtas: [
        "Make sure to Like and Subscribe for weekly tutorials and product strategies! 🔔",
        "Leave a comment with your favorite takeaway from today's video!",
        "Check out PostNexa at the link below for free social management tools:",
        "Timestamps and referenced resources are detailed below in the description 👇"
      ]
    }
  };

  // Curated fallback tags based on common subjects
  const NICHE_TAGS = {
    general: ["#SocialMediaTips", "#CreatorEconomy", "#PostNexa", "#ContentStrategy"],
    marketing: ["#DigitalMarketing", "#MarketingStrategy", "#GrowthHacking", "#SocialMediaMarketing"],
    business: ["#SmallBusiness", "#Entrepreneurship", "#BusinessGrowth", "#StartupLife"],
    fitness: ["#FitnessGoals", "#WorkoutMotivation", "#HealthyLifestyle", "#FitnessJourney"],
    tech: ["#TechTrends", "#SaaS", "#ProductivityTools", "#Automation"],
    creator: ["#ContentCreator", "#CreatorLife", "#ReelsViral", "#TikTokCreators"],
    fashion: ["#FashionInspo", "#StyleInspiration", "#DailyLook", "#TrendAlert"],
    food: ["#FoodieGram", "#QuickRecipes", "#FoodInspiration", "#DeliciousEats"]
  };

  function detectNicheTags(topic) {
    const t = topic.toLowerCase();
    if (t.includes('market') || t.includes('seo') || t.includes('brand') || t.includes('lead')) return NICHE_TAGS.marketing;
    if (t.includes('business') || t.includes('sale') || t.includes('founder') || t.includes('agency')) return NICHE_TAGS.business;
    if (t.includes('fit') || t.includes('gym') || t.includes('health') || t.includes('diet')) return NICHE_TAGS.fitness;
    if (t.includes('tech') || t.includes('app') || t.includes('ai') || t.includes('soft') || t.includes('code')) return NICHE_TAGS.tech;
    if (t.includes('creat') || t.includes('video') || t.includes('reel') || t.includes('post') || t.includes('photo')) return NICHE_TAGS.creator;
    if (t.includes('cloth') || t.includes('wear') || t.includes('style') || t.includes('outfit')) return NICHE_TAGS.fashion;
    if (t.includes('food') || t.includes('cook') || t.includes('eat') || t.includes('recipe')) return NICHE_TAGS.food;
    return NICHE_TAGS.general;
  }

  function generateCaptions(options) {
    const { topic, context, platform, tone, length, ctaType, includeTags } = options;
    const cleanTopic = topic.trim() || "Social Media Growth";
    const hooksList = HOOKS[tone] || HOOKS.professional;
    const plat = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.instagram;
    const tags = detectNicheTags(cleanTopic).slice(0, plat.hashtagCount).join(" ");

    // Pick CTA
    let chosenCta = plat.defaultCtas[0];
    if (ctaType === 'question') chosenCta = plat.defaultCtas[1] || plat.defaultCtas[0];
    if (ctaType === 'link') chosenCta = plat.defaultCtas[2] || plat.defaultCtas[0];
    if (ctaType === 'share') chosenCta = plat.defaultCtas[3] || plat.defaultCtas[0];

    const results = [];

    // --- Variation 1: Direct Value & Framework ---
    const hook1 = hooksList[0].replace('{topic}', cleanTopic);
    let body1 = "";
    if (length === 'short') {
      body1 = context ? `${context}\n\n` : `Consistent execution beats sporadic perfection every single time.\n\n`;
    } else if (length === 'long') {
      body1 = `Here is the framework that changes the game:\n\n1. Define your primary message clearly.\n2. Prioritize user value over self-promotion.\n3. Analyze engagement data and double down on what resonates.\n\n${context ? `Context to remember: ${context}\n\n` : ''}`;
    } else {
      body1 = `When you focus on delivering high-signal value, your audience naturally engages and shares. Quality content always compounds over time.\n\n${context ? `${context}\n\n` : ''}`;
    }
    const var1 = `${hook1}\n\n${body1}${chosenCta}${includeTags ? `\n\n${tags}` : ''}`;
    results.push({
      title: "Variation 1 • Actionable & Direct",
      text: var1.trim(),
      charCount: var1.trim().length,
      platform: plat.name
    });

    // --- Variation 2: Relatable Story & Context ---
    const hook2 = (hooksList[1] || hooksList[0]).replace('{topic}', cleanTopic);
    let body2 = "";
    if (length === 'short') {
      body2 = `The difference between average and top-tier results comes down to simple daily habits.\n\n`;
    } else if (length === 'long') {
      body2 = `A while back, we noticed a recurring theme: people spend hours overcomplicating ${cleanTopic}, when simplicity is what actually drives momentum.\n\nInstead of juggling ten conflicting strategies, choose one reliable workflow and stick with it for 30 straight days.\n\n`;
    } else {
      body2 = `Most people overcomplicate the process. The secret isn't more hours in the day—it's having a proven, repeatable system in place.\n\n`;
    }
    const var2 = `${hook2}\n\n${body2}${plat.defaultCtas[1] || chosenCta}${includeTags ? `\n\n${tags}` : ''}`;
    results.push({
      title: "Variation 2 • Relatable & Conversational",
      text: var2.trim(),
      charCount: var2.trim().length,
      platform: plat.name
    });

    // --- Variation 3: Thought-Leadership / Quick Tips ---
    const hook3 = (hooksList[2] || hooksList[0]).replace('{topic}', cleanTopic);
    let body3 = "";
    if (platform === 'linkedin') {
      body3 = `3 high-impact principles to apply today:\n\n→ Principle A: Simplify your messaging before you amplify it.\n→ Principle B: Solve one real problem per post.\n→ Principle C: Respect your audience's time with clear formatting.\n\n`;
    } else if (platform === 'tiktok') {
      body3 = `Try this today: Focus on your first 3 seconds, keep the energy high, and deliver the payoff without fluff.\n\n`;
    } else {
      body3 = `Quick 3-step checklist:\n✨ Clarify your hook.\n✨ Deliver immediate, actionable insight.\n✨ Close with a genuine prompt for discussion.\n\n`;
    }
    const var3 = `${hook3}\n\n${body3}${chosenCta}${includeTags ? `\n\n${tags}` : ''}`;
    results.push({
      title: "Variation 3 • Quick Tips & Checklists",
      text: var3.trim(),
      charCount: var3.trim().length,
      platform: plat.name
    });

    return results;
  }

  // Initialize UI bindings when DOM is ready
  function init() {
    const form = document.getElementById('captionGenForm');
    const resultsContainer = document.getElementById('captionResults');
    const generateBtn = document.getElementById('generateCaptionBtn');
    if (!form || !resultsContainer || !generateBtn) return;

    // Platform chip listeners
    const platformChips = form.querySelectorAll('.sc-platform-chip');
    platformChips.forEach(chip => {
      chip.addEventListener('click', function () {
        platformChips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const input = form.querySelector('input[name="platform"]');
        if (input) input.value = this.getAttribute('data-value');
      });
    });

    // Tone chip listeners
    const toneChips = form.querySelectorAll('.sc-tone-chip');
    toneChips.forEach(chip => {
      chip.addEventListener('click', function () {
        toneChips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const input = form.querySelector('input[name="tone"]');
        if (input) input.value = this.getAttribute('data-value');
      });
    });

    // Length chip listeners
    const lengthChips = form.querySelectorAll('.sc-length-chip');
    lengthChips.forEach(chip => {
      chip.addEventListener('click', function () {
        lengthChips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const input = form.querySelector('input[name="length"]');
        if (input) input.value = this.getAttribute('data-value');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const topic = document.getElementById('captionTopic')?.value || "";
      if (!topic.trim()) {
        alert("Please enter a topic or subject for your caption.");
        document.getElementById('captionTopic')?.focus();
        return;
      }

      const context = document.getElementById('captionContext')?.value || "";
      const platform = form.querySelector('.sc-platform-chip.active')?.getAttribute('data-value') || "instagram";
      const tone = form.querySelector('.sc-tone-chip.active')?.getAttribute('data-value') || "professional";
      const length = form.querySelector('.sc-length-chip.active')?.getAttribute('data-value') || "medium";
      const ctaType = document.getElementById('captionCta')?.value || "question";
      const includeTags = document.getElementById('captionIncludeTags')?.checked ?? true;

      generateBtn.disabled = true;
      generateBtn.innerHTML = `<span>Generating Captions...</span>`;

      setTimeout(() => {
        const captions = generateCaptions({ topic, context, platform, tone, length, ctaType, includeTags });
        renderResults(captions);
        generateBtn.disabled = false;
        generateBtn.innerHTML = `<span>Generate Captions ➔</span>`;
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    });
  }

  function renderResults(captions) {
    const container = document.getElementById('captionResults');
    if (!container) return;
    container.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'sc-results-header';
    header.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 20px;">
        <h3 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0;">Generated Captions (${captions.length} Options)</h3>
        <span style="font-size: 13px; color: #64748B;">Click any text box below to edit before copying</span>
      </div>
    `;
    container.appendChild(header);

    captions.forEach((cap, idx) => {
      const card = document.createElement('div');
      card.className = 'sc-caption-card';
      card.innerHTML = `
        <div class="sc-caption-card-head">
          <span class="sc-caption-card-title">${cap.title}</span>
          <span class="sc-caption-count" id="count-${idx}">${cap.charCount} chars</span>
        </div>
        <textarea class="sc-caption-textarea" id="textarea-${idx}" rows="7" aria-label="${cap.title}">${cap.text}</textarea>
        <div class="sc-caption-card-foot">
          <div class="sc-caption-tips">
            <span>Platform: <strong>${cap.platform}</strong></span>
          </div>
          <button type="button" class="sc-btn-copy" data-target="textarea-${idx}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>Copy Caption</span>
          </button>
        </div>
      `;
      container.appendChild(card);

      const ta = card.querySelector(`#textarea-${idx}`);
      const counter = card.querySelector(`#count-${idx}`);
      if (ta && counter) {
        ta.addEventListener('input', () => {
          counter.textContent = `${ta.value.length} chars`;
        });
      }

      const copyBtn = card.querySelector('.sc-btn-copy');
      if (copyBtn && ta) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(ta.value).then(() => {
            const originalHtml = copyBtn.innerHTML;
            copyBtn.innerHTML = `
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Copied! ✓</span>
            `;
            copyBtn.classList.add('copied');
            setTimeout(() => {
              copyBtn.innerHTML = originalHtml;
              copyBtn.classList.remove('copied');
            }, 2000);
          }).catch(() => {
            ta.select();
            document.execCommand('copy');
            alert('Copied to clipboard!');
          });
        });
      }
    });

    container.style.display = 'block';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
