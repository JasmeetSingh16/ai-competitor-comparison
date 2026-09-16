import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const comparisonSchema = {
  type: "object",
  properties: {
    business: {
      type: "string",
    },

    competitor: {
      type: "string",
    },

    key_insight: {
      type: "string",
    },

    recommended_positioning: {
      type: "string",
    },

    rows: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: {
            type: "string",
          },

          business_analysis: {
            type: "string",
          },

          competitor_analysis: {
            type: "string",
          },
        },

        required: [
          "category",
          "business_analysis",
          "competitor_analysis",
        ],

        additionalProperties: false,
      },
    },
  },

  required: [
    "business",
    "competitor",
    "key_insight",
    "recommended_positioning",
    "rows",
  ],

  additionalProperties: false,
};

function isUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

function isSafeHostname(hostname: string) {
  const host = hostname.toLowerCase();

  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.endsWith(".local")
  ) {
    return false;
  }

  if (
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    host.startsWith("169.254.")
  ) {
    return false;
  }

  if (host.startsWith("172.")) {
    const secondPart = Number(host.split(".")[1]);

    if (
      secondPart >= 16 &&
      secondPart <= 31
    ) {
      return false;
    }
  }

  return true;
}

async function fetchWebsite(urlString: string) {
  try {
    const url = new URL(urlString);

    if (!isSafeHostname(url.hostname)) {
      return "";
    }

    const response = await fetch(urlString, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AICompetitorAnalyzer/1.0)",
        Accept:
          "text/html,application/xhtml+xml",
      },

      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return "";
    }

    const contentType =
      response.headers.get("content-type") || "";

    if (!contentType.includes("text/html")) {
      return "";
    }

    const html = await response.text();

    const text = html
      .replace(
        /<script[\s\S]*?<\/script>/gi,
        " "
      )
      .replace(
        /<style[\s\S]*?<\/style>/gi,
        " "
      )
      .replace(
        /<svg[\s\S]*?<\/svg>/gi,
        " "
      )
      .replace(
        /<noscript[\s\S]*?<\/noscript>/gi,
        " "
      )
      .replace(
        /<nav[\s\S]*?<\/nav>/gi,
        " "
      )
      .replace(
        /<footer[\s\S]*?<\/footer>/gi,
        " "
      )
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, " ")
      .trim();

    return text.slice(0, 12000);
  } catch (error) {
    console.error(
      `Failed to fetch website: ${urlString}`,
      error
    );

    return "";
  }
}

export async function POST(request: Request) {
  try {
    const {
      business,
      competitor,
      industry,
    } = await request.json();

    if (
      !business?.trim() ||
      !competitor?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Business and competitor are required.",
        },
        { status: 400 }
      );
    }

    let businessWebsiteContent = "";
    let competitorWebsiteContent = "";

    if (isUrl(business.trim())) {
      businessWebsiteContent =
        await fetchWebsite(business.trim());
    }

    if (isUrl(competitor.trim())) {
      competitorWebsiteContent =
        await fetchWebsite(competitor.trim());
    }

    const businessContext =
      businessWebsiteContent
        ? `
WEBSITE CONTENT FOR FIRST BUSINESS:

${businessWebsiteContent}
`
        : `
No website content was provided for the first business.
Use general knowledge and avoid unsupported specific claims.
`;

    const competitorContext =
      competitorWebsiteContent
        ? `
WEBSITE CONTENT FOR COMPETITOR:

${competitorWebsiteContent}
`
        : `
No website content was provided for the competitor.
Use general knowledge and avoid unsupported specific claims.
`;

    const response =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",

        messages: [
          {
            role: "system",

            content: `
You are an expert competitive positioning strategist.

Analyze two businesses and produce a concise competitive
strategy report.

If website content is provided, treat it as the primary
source for understanding that business.

Do not invent specific facts.

You must produce:

1. A comparison table with exactly six categories.
2. One key competitive insight.
3. One recommended positioning angle.

The six comparison categories are:

- Positioning
- Target Audience
- Key Strength
- Key Weakness
- Differentiator
- Positioning Opportunity

For every category:

business_analysis = analysis of the first business.

competitor_analysis = analysis of the competitor.

Do not put company names alone into these fields.

KEY INSIGHT:

Write 1-3 sentences explaining the biggest strategic
difference between the two businesses.

The insight should identify what each business is really
competing on and where the strongest competitive tension is.

RECOMMENDED POSITIONING:

Give the FIRST BUSINESS a practical positioning angle
that could help it stand apart from the competitor.

It should be specific enough to inspire marketing messaging.

Avoid generic advice such as:
"focus on your customers"
"improve your marketing"
"provide better service"

Instead explain WHAT the business should emphasize
and WHY that angle can differentiate it.

Keep everything concise and useful to a business owner.

Return only the structured JSON.
`,
          },

          {
            role: "user",

            content: `
FIRST BUSINESS:
${business}

COMPETITOR:
${competitor}

INDUSTRY:
${industry?.trim() || "Not specified"}

${businessContext}

${competitorContext}

Compare the FIRST BUSINESS against the COMPETITOR.

Provide:

- Six comparison categories
- One key competitive insight
- One recommended positioning angle for the first business
`,
          },
        ],

        response_format: {
          type: "json_schema",

          json_schema: {
            name: "competitor_comparison",

            strict: true,

            schema: comparisonSchema,
          },
        },
      });

    const content =
      response.choices[0]?.message?.content;

    if (!content) {
      throw new Error(
        "No response from Groq."
      );
    }

    const result = JSON.parse(content);

    return NextResponse.json(result);

  } catch (error) {
    console.error(
      "Comparison error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate comparison. Please try again.",
      },
      { status: 500 }
    );
  }
}