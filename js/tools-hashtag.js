/**
 * PostNexa - Free Social Media Hashtag Generator (Client-Side)
 * =============================================================
 * Categorizes and generates high-performing hashtag groups for Instagram,
 * TikTok, LinkedIn, YouTube, and X without requiring login.
 */

(function () {
  'use strict';

  const NICHE_DATABASE = {
    marketing: {
      high: ["DigitalMarketing", "SocialMediaMarketing", "MarketingStrategy", "ContentMarketing", "MarketingTips"],
      mid: ["GrowthMarketing", "SocialMediaManager", "SocialMediaStrategy", "MarketingAgency", "Marketing101"],
      niche: ["OrganicSocialGrowth", "SocialMediaOS", "MarketingWorkflow", "PostNexa", "ContentRepurposing"]
    },
    business: {
      high: ["SmallBusiness", "Entrepreneurship", "BusinessOwner", "StartupLife", "BusinessGrowth"],
      mid: ["SmallBizTips", "FounderStory", "BusinessMindset", "ScaleYourBusiness", "Bootstrapped"],
      niche: ["SaaSFluence", "MicroSaaS", "B2BMarketing", "FounderDaily", "RemoteBusiness"]
    },
    creator: {
      high: ["ContentCreator", "CreatorEconomy", "VideoCreator", "ReelsCreator", "TikTokCreator"],
      mid: ["CreatorLife", "BehindTheScenes", "VideoEditing", "ContentCreationTips", "ShortFormVideo"],
      niche: ["RepurposingContent", "ContentCalendar", "CreatorWorkflow", "ViralReelsTips", "VideoStrategy"]
    },
    tech: {
      high: ["TechNews", "ArtificialIntelligence", "SoftwareEngineer", "ProductivityTools", "TechStartup"],
      mid: ["NoCode", "AutomationTools", "CloudComputing", "AppDeveloper", "TechInnovation"],
      niche: ["SaaSGrowth", "SocialAutomation", "TechProductivity", "WorkflowAutomation", "DevCommunity"]
    },
    fitness: {
      high: ["FitnessMotivation", "WorkoutRoutine", "HealthyLifestyle", "GymLife", "FitnessGoals"],
      mid: ["PersonalTrainer", "StrengthTraining", "FitnessCoach", "HomeWorkout", "NutritionTips"],
      niche: ["FunctionalFitness", "DailyMovement", "MindfulLiving", "CleanEatingHabits", "FitnessJourney2026"]
    },
    ecommerce: {
      high: ["Ecommerce", "OnlineStore", "ShopSmall", "ProductLaunch", "ShopLocal"],
      mid: ["EcommerceTips", "ShopifyStore", "DTCBrand", "RetailBusiness", "ProductDesign"],
      niche: ["CustomerUnboxing", "PackagingDesign", "SustainableEcommerce", "StorefrontGrowth", "HandmadeSmallBiz"]
    },
    realestate: {
      high: ["RealEstate", "RealtorLife", "HomeInspiration", "DreamHome", "HouseHunting"],
      mid: ["RealEstateAgent", "PropertyTour", "InteriorInspo", "FirstTimeHomeBuyer", "LuxuryListing"],
      niche: ["NeighborhoodGuide", "MarketTrends2026", "HomeStagingTips", "RealtorMarketing", "ListingWalkthrough"]
    },
    fashion: {
      high: ["FashionInspo", "StyleInspiration", "OOTD", "OutfitOfTheDay", "StreetStyle"],
      mid: ["WardrobeEssentials", "SustainableFashion", "CapsuleWardrobe", "StyleTips", "FashionStylist"],
      niche: ["ThriftedLook", "SlowFashionCommunity", "EverydayOutfitInspo", "MinimalistWardrobe", "TrendAlert2026"]
    },
    food: {
      high: ["Foodie", "FoodPorn", "EasyRecipes", "HomeCooking", "DeliciousEats"],
      mid: ["QuickMeals", "HealthyRecipes", "CookingAtHome", "FoodPhotography", "MealPrepSunday"],
      niche: ["OnePotMeal", "PlantBasedRecipe", "WeeknightDinners", "KitchenHacks", "HomemadeFromScratch"]
    },
    travel: {
      high: ["TravelGram", "Wanderlust", "TravelInspiration", "BucketList", "TravelPhotography"],
      mid: ["HiddenGems", "TravelTips", "SoloTraveler", "WeekendGetaway", "RoadTripAdventures"],
      niche: ["BudgetTravelHacks", "OffTheBeatenTrack", "LocalCuisine", "TravelItinerary", "SlowTravelMoments"]
    }
  };

  const PLATFORM_GUIDELINES = {
    instagram: {
      name: "Instagram",
      limit: 30,
      recommended: "3 to 5 hyper-targeted hashtags",
      note: "Instagram's 2026 algorithm prioritizes SEO keywords in captions; 3-5 specific hashtags work better than 30 generic tags."
    },
    tiktok: {
      name: "TikTok",
      limit: 10,
      recommended: "3 to 5 relevant hashtags",
      note: "Blend 1 broad tag with 2-3 niche tags for the TikTok 'For You' page recommendation engine."
    },
    linkedin: {
      name: "LinkedIn",
      limit: 5,
      recommended: "3 professional hashtags",
      note: "LinkedIn's feed categorizes posts using 3 relevant industry tags for subscriber feeds."
    },
    youtube: {
      name: "YouTube",
      limit: 15,
      recommended: "3 video hashtags in description",
      note: "The first 3 hashtags in your description appear above the video title on YouTube."
    },
    x: {
      name: "X (Twitter)",
      limit: 4,
      recommended: "1 to 2 focused hashtags",
      note: "Posts with 1 or 2 targeted hashtags generate significantly higher retweets without looking cluttered."
    }
  };

  function toCamelCase(str) {
    return str
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
  }

  function detectNicheKey(input) {
    const text = input.toLowerCase();
    for (const key of Object.keys(NICHE_DATABASE)) {
      if (text.includes(key)) return key;
    }
    if (text.includes('ad') || text.includes('seo') || text.includes('media') || text.includes('post') || text.includes('brand')) return 'marketing';
    if (text.includes('startup') || text.includes('sale') || text.includes('money') || text.includes('lead') || text.includes('agency')) return 'business';
    if (text.includes('video') || text.includes('reel') || text.includes('clip') || text.includes('tiktok') || text.includes('youtube')) return 'creator';
    if (text.includes('ai') || text.includes('code') || text.includes('software') || text.includes('computer') || text.includes('saas')) return 'tech';
    if (text.includes('gym') || text.includes('diet') || text.includes('wellness') || text.includes('running') || text.includes('train')) return 'fitness';
    if (text.includes('store') || text.includes('shop') || text.includes('product') || text.includes('order')) return 'ecommerce';
    if (text.includes('house') || text.includes('home') || text.includes('realty') || text.includes('apartment') || text.includes('broker')) return 'realestate';
    if (text.includes('outfit') || text.includes('wear') || text.includes('dress') || text.includes('cloth') || text.includes('beauty')) return 'fashion';
    if (text.includes('cook') || text.includes('eat') || text.includes('bake') || text.includes('dish') || text.includes('restaurant')) return 'food';
    if (text.includes('trip') || text.includes('vacation') || text.includes('hotel') || text.includes('explore') || text.includes('flight')) return 'travel';
    return 'marketing'; // default
  }

  function generateTags(keyword, platform) {
    const cleanWord = keyword.trim();
    const nicheKey = detectNicheKey(cleanWord);
    const db = NICHE_DATABASE[nicheKey] || NICHE_DATABASE.marketing;
    const customTag = toCamelCase(cleanWord);

    const high = [...db.high];
    const mid = [...db.mid];
    const niche = [...db.niche];

    if (customTag && !high.includes(customTag) && !mid.includes(customTag) && !niche.includes(customTag)) {
      niche.unshift(customTag);
      niche.unshift(`${customTag}Tips`);
      mid.unshift(`${customTag}Daily`);
    }

    return {
      high: high.map(t => `#${t}`),
      mid: mid.map(t => `#${t}`),
      niche: niche.map(t => `#${t}`)
    };
  }

  let selectedTags = new Set();

  function init() {
    const form = document.getElementById('hashtagGenForm');
    const resultsContainer = document.getElementById('hashtagResults');
    const keywordInput = document.getElementById('hashtagKeyword');
    if (!form || !resultsContainer || !keywordInput) return;

    // Platform chip selectors
    const chips = form.querySelectorAll('.sc-platform-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', function () {
        chips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const hidden = form.querySelector('input[name="platform"]');
        if (hidden) hidden.value = this.getAttribute('data-value');
        updateGuidelines(this.getAttribute('data-value'));
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const kw = keywordInput.value.trim();
      if (!kw) {
        alert('Please enter a keyword or niche topic.');
        keywordInput.focus();
        return;
      }
      const platform = form.querySelector('.sc-platform-chip.active')?.getAttribute('data-value') || 'instagram';

      selectedTags.clear();
      const groups = generateTags(kw, platform);
      renderHashtags(groups, platform);
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function updateGuidelines(platform) {
    const guideBox = document.getElementById('platformHashtagGuideline');
    if (!guideBox) return;
    const info = PLATFORM_GUIDELINES[platform] || PLATFORM_GUIDELINES.instagram;
    guideBox.innerHTML = `
      <div style="background: #FFF9F5; border: 1px solid #FED7AA; border-radius: 12px; padding: 14px 18px; font-size: 13.5px; color: #431407;">
        <strong>${info.name} 2026 Recommendation:</strong> ${info.recommended}. ${info.note}
      </div>
    `;
  }

  function renderHashtags(groups, platform) {
    const container = document.getElementById('hashtagResults');
    if (!container) return;
    container.innerHTML = '';

    const allTags = [...groups.niche, ...groups.mid, ...groups.high];
    // Default select first 5 tags
    allTags.slice(0, 5).forEach(t => selectedTags.add(t));

    const info = PLATFORM_GUIDELINES[platform] || PLATFORM_GUIDELINES.instagram;

    const tray = document.createElement('div');
    tray.className = 'sc-hashtag-tray';
    tray.innerHTML = `
      <div class="sc-tray-header">
        <div>
          <h3 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0;">Selected Hashtags (<span id="selectedCount">${selectedTags.size}</span> / ${info.limit})</h3>
          <p style="margin: 4px 0 0; font-size: 13px; color: #64748B;">Click any tag below to add or remove it from your selection</p>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="sc-btn-subtle" id="selectAllBtn">Select All</button>
          <button type="button" class="sc-btn-subtle" id="clearAllBtn">Clear</button>
          <button type="button" class="sc-btn-copy" id="copySelectedTagsBtn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>Copy Selected</span>
          </button>
        </div>
      </div>
      <div class="sc-selected-box" id="selectedBox"></div>
    `;
    container.appendChild(tray);

    function updateSelectedView() {
      const box = document.getElementById('selectedBox');
      const countEl = document.getElementById('selectedCount');
      if (countEl) countEl.textContent = selectedTags.size;
      if (!box) return;

      if (selectedTags.size === 0) {
        box.innerHTML = `<span style="font-size: 13.5px; color: #94A3B8; font-style: italic;">No tags selected yet. Click the tags below to build your set.</span>`;
        return;
      }

      box.innerHTML = Array.from(selectedTags).map(tag => `
        <span class="sc-tag-pill active" data-tag="${tag}">${tag} <span class="remove-x">×</span></span>
      `).join(' ');

      box.querySelectorAll('.sc-tag-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const t = pill.getAttribute('data-tag');
          selectedTags.delete(t);
          updateSelectedView();
          syncTagButtons();
        });
      });
    }

    function syncTagButtons() {
      container.querySelectorAll('.sc-tag-pill-btn').forEach(btn => {
        const t = btn.getAttribute('data-tag');
        if (selectedTags.has(t)) {
          btn.classList.add('selected');
        } else {
          btn.classList.remove('selected');
        }
      });
    }

    // Render categorized groups
    const categories = [
      { title: "Targeted & Niche Tags (High Intent, Lower Competition)", tags: groups.niche, badge: "Best for Discovery" },
      { title: "Mid-Volume Community Tags (Steady Engagement)", tags: groups.mid, badge: "Community" },
      { title: "Broad & Popular Tags (High Search Volume)", tags: groups.high, badge: "Broad Reach" }
    ];

    categories.forEach(cat => {
      const section = document.createElement('div');
      section.className = 'sc-hashtag-group';
      section.innerHTML = `
        <div class="sc-group-head">
          <h4 style="font-size: 15px; font-weight: 700; color: #1E293B; margin: 0;">${cat.title}</h4>
          <span class="sc-badge-tag">${cat.badge}</span>
        </div>
        <div class="sc-tag-cloud">
          ${cat.tags.map(t => `
            <button type="button" class="sc-tag-pill-btn ${selectedTags.has(t) ? 'selected' : ''}" data-tag="${t}">
              ${t}
            </button>
          `).join('')}
        </div>
      `;
      container.appendChild(section);
    });

    container.querySelectorAll('.sc-tag-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.getAttribute('data-tag');
        if (selectedTags.has(t)) {
          selectedTags.delete(t);
        } else {
          if (selectedTags.size >= info.limit) {
            alert(`You have reached the maximum of ${info.limit} hashtags for ${info.name}.`);
            return;
          }
          selectedTags.add(t);
        }
        updateSelectedView();
        syncTagButtons();
      });
    });

    // Button actions
    const selectAllBtn = document.getElementById('selectAllBtn');
    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', () => {
        allTags.slice(0, info.limit).forEach(t => selectedTags.add(t));
        updateSelectedView();
        syncTagButtons();
      });
    }

    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        selectedTags.clear();
        updateSelectedView();
        syncTagButtons();
      });
    }

    const copyBtn = document.getElementById('copySelectedTagsBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (selectedTags.size === 0) {
          alert('Please select at least one hashtag to copy.');
          return;
        }
        const textToCopy = Array.from(selectedTags).join(' ');
        navigator.clipboard.writeText(textToCopy).then(() => {
          const original = copyBtn.innerHTML;
          copyBtn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Copied ${selectedTags.size} Tags! ✓</span>
          `;
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.innerHTML = original;
            copyBtn.classList.remove('copied');
          }, 2000);
        }).catch(() => {
          prompt('Copy hashtags below:', textToCopy);
        });
      });
    }

    updateSelectedView();
    container.style.display = 'block';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
