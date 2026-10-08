/**
 * PostNexa - Centralized Pricing & Subscription Configuration
 * Single source of truth for all marketing pricing tables, cards, and toggles.
 * Synchronized directly with live PostNexa application subscription plans.
 * Parent Brand: Tech With Salman
 */

const PRICING_CONFIG = {
  currency: "$",
  disclaimer: "Displayed pricing tiers and plan quotas represent the official PostNexa subscription plans. Billing is managed securely through your PostNexa account portal.",
  plans: [
    {
      id: "free",
      name: "Free",
      isFeatured: false,
      badge: null,
      desc: "Perfect for testing PostNexa and getting started with basic social scheduling.",
      monthly: {
        price: 0,
        displayPrice: "$0",
        period: "/ forever",
        billingNote: "Free forever"
      },
      annual: {
        price: 0,
        displayPrice: "$0",
        period: "/ forever",
        billingNote: "Free forever",
        savingsNote: ""
      },
      limits: [
        "Up to 4 connected social accounts",
        "100 scheduled/published posts / mo",
        "Instagram Auto DM: Up to 3 posts",
        "Bulk video uploads: 20 / month",
        "Up to 1 team member"
      ],
      ctaText: "Get Started",
      ctaUrl: "https://app.techwithsalman.online/",
      ctaClass: "sc-btn-outline"
    },
    {
      id: "starter",
      name: "Starter",
      isFeatured: false,
      badge: null,
      desc: "Ideal for solo creators and small businesses building social consistency.",
      monthly: {
        price: 24,
        displayPrice: "$24",
        period: "/ month",
        billingNote: "Billed monthly ($24/mo)"
      },
      annual: {
        price: 228,
        displayPrice: "$228",
        period: "/ year",
        monthlyEquivalent: "$19/mo",
        billingNote: "Billed annually ($19/mo) • Save 20.8%",
        savingsNote: "Save $60/yr (20.8% off)"
      },
      limits: [
        "Up to 15 connected social accounts",
        "500 scheduled/published posts / mo",
        "Instagram Auto DM: Up to 20 posts",
        "Bulk video uploads: 100 / month",
        "Up to 2 team members"
      ],
      ctaText: "Choose Starter",
      ctaUrl: "https://app.techwithsalman.online/billing",
      ctaClass: "sc-btn-primary"
    },
    {
      id: "pro",
      name: "Pro",
      isFeatured: true,
      badge: "Featured Plan",
      desc: "For active creators, influencers, and growing social brands.",
      monthly: {
        price: 59,
        displayPrice: "$59",
        period: "/ month",
        billingNote: "Billed monthly ($59/mo)"
      },
      annual: {
        price: 588,
        displayPrice: "$588",
        period: "/ year",
        monthlyEquivalent: "$49/mo",
        billingNote: "Billed annually ($49/mo) • Save 16.9%",
        savingsNote: "Save $120/yr (16.9% off)"
      },
      limits: [
        "Up to 30 connected social accounts",
        "1,500 scheduled/published posts / mo",
        "Instagram Auto DM: Up to 75 posts",
        "Bulk video uploads: 500 / month",
        "Up to 5 team members"
      ],
      ctaText: "Choose Pro",
      ctaUrl: "https://app.techwithsalman.online/billing",
      ctaClass: "sc-btn-primary sc-btn-pill"
    },
    {
      id: "agency",
      name: "Agency",
      isFeatured: false,
      badge: null,
      desc: "For digital marketing agencies managing multi-client rosters and teams.",
      monthly: {
        price: 149,
        displayPrice: "$149",
        period: "/ month",
        billingNote: "Billed monthly ($149/mo)"
      },
      annual: {
        price: 1548,
        displayPrice: "$1,548",
        period: "/ year",
        monthlyEquivalent: "$129/mo",
        billingNote: "Billed annually ($129/mo) • Save 13.4%",
        savingsNote: "Save $240/yr (13.4% off)"
      },
      limits: [
        "Up to 100 connected social accounts",
        "5,000 scheduled/published posts / mo",
        "Instagram Auto DM: Up to 250 posts",
        "Bulk video uploads: 2,000 / month",
        "Up to 20 team members"
      ],
      ctaText: "Choose Agency",
      ctaUrl: "https://app.techwithsalman.online/billing",
      ctaClass: "sc-btn-outline"
    }
  ],
  comparisonFeatures: [
    {
      feature: "Connected Social Accounts",
      free: "4 accounts",
      starter: "15 accounts",
      pro: "30 accounts",
      agency: "100 accounts"
    },
    {
      feature: "Monthly Post Publishing Limit",
      free: "100 posts / mo",
      starter: "500 posts / mo",
      pro: "1,500 posts / mo",
      agency: "5,000 posts / mo"
    },
    {
      feature: "Instagram Auto DM Volume",
      free: "Up to 3 posts",
      starter: "Up to 20 posts",
      pro: "Up to 75 posts",
      agency: "Up to 250 posts"
    },
    {
      feature: "Bulk Video Uploads",
      free: "20 / mo",
      starter: "100 / mo",
      pro: "500 / mo",
      agency: "2,000 / mo"
    },
    {
      feature: "Team Members Included",
      free: "1 member",
      starter: "Up to 2 members",
      pro: "Up to 5 members",
      agency: "Up to 20 members"
    },
    {
      feature: "Visual Content Calendar",
      free: "✓",
      starter: "✓",
      pro: "✓",
      agency: "✓"
    },
    {
      feature: "Direct Meta & YouTube Publishing",
      free: "✓",
      starter: "✓",
      pro: "✓",
      agency: "✓"
    },
    {
      feature: "Bulk CSV & Multi-Post Uploader",
      free: "—",
      starter: "✓",
      pro: "✓",
      agency: "✓"
    },
    {
      feature: "AI Caption Generator",
      free: "Beta Access",
      starter: "Beta Access",
      pro: "Beta Access",
      agency: "Beta Access"
    },
    {
      feature: "Support Level",
      free: "Community",
      starter: "Email Support",
      pro: "Priority Support",
      agency: "Dedicated Specialist"
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRICING_CONFIG;
}
