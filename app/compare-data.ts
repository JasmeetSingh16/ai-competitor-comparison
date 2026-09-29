/* ------------------------------------------------------------------ */
/* Types, sample match-ups and the example comparison (a real output   */
/* for Notion vs Asana) used in the hero and the empty state.          */
/* ------------------------------------------------------------------ */

export interface ComparisonRow {
  category: string;
  business_analysis: string;
  competitor_analysis: string;
}

export interface ComparisonResult {
  business: string;
  competitor: string;
  key_insight: string;
  recommended_positioning: string;
  rows: ComparisonRow[];
}

export const sampleMatchups = [
  { business: "Notion", competitor: "Asana", industry: "Project management software" },
  { business: "Swiggy", competitor: "Zomato", industry: "Food delivery in India" },
  { business: "Shopify", competitor: "WooCommerce", industry: "Ecommerce platforms" },
];

export const exampleComparison: ComparisonResult = {
  "business": "Notion",
  "competitor": "Asana",
  "key_insight": "Notion’s strength lies in its versatility as an all‑in‑one workspace, whereas Asana excels in focused task tracking and workflow automation, creating tension around the trade‑off between flexibility and specialized task management.",
  "recommended_positioning": "Position Notion as the integrated knowledge‑management platform that turns every project into a living workspace—combining documents, databases, calendars, and task boards—so teams can manage both information and work in a single, deeply customizable environment.",
  "rows": [
    {
      "category": "Positioning",
      "business_analysis": "All‑in‑one workspace blending notes, docs, databases, and task boards into a single platform.",
      "competitor_analysis": "Task‑centric project management tool with robust workflow automation and reporting features."
    },
    {
      "category": "Target Audience",
      "business_analysis": "Knowledge‑heavy teams, creators, and small to midsize companies needing flexible information organization.",
      "competitor_analysis": "Project‑heavy teams, agile teams, and larger enterprises prioritizing task tracking and team coordination."
    },
    {
      "category": "Key Strength",
      "business_analysis": "High customization, modular design, and integration of multiple content types in one UI.",
      "competitor_analysis": "Strong task routing, time tracking, and reporting capabilities with enterprise‑level integrations."
    },
    {
      "category": "Key Weakness",
      "business_analysis": "Limited out‑of‑the‑box task automation and complex project‑management features.",
      "competitor_analysis": "Less flexible for document creation and knowledge management, heavier learning curve for custom configurations."
    },
    {
      "category": "Differentiator",
      "business_analysis": "Unified workspace that treats documents, databases, and tasks as interchangeable building blocks.",
      "competitor_analysis": "Specialized, process‑driven task management with built‑in automation and compliance tools."
    },
    {
      "category": "Positioning Opportunity",
      "business_analysis": "Leverage the growing demand for hybrid work tools that combine project tracking with collaborative knowledge bases.",
      "competitor_analysis": "Enhance focus on streamlined task workflows for high‑volume project environments."
    }
  ]
};
