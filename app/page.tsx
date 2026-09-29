import {
  Columns2,
  Crosshair,
  FileSearch,
  Flag,
  Presentation,
  Radar,
  Swords,
  Target,
  TrendingUp,
} from "lucide-react";
import { AgentHero, AgentPage, HowItWorks, RelatedAgents, UseCases } from "../components/agent/AgentTemplate";
import CompetitorCompare from "./CompetitorCompare";

const SLUG = "competitor-comparison";

const heroRows = [
  { cat: "Positioning", you: "All-in-one workspace", them: "Task-first PM tool", edge: "you" },
  { cat: "Audience", you: "Knowledge-heavy teams", them: "Large project teams", edge: "even" },
  { cat: "Strength", you: "Deep customisation", them: "Workflow automation", edge: "them" },
];

function HeroPreview() {
  return (
    <div className="cc-hero-card" aria-hidden="true">
      <div className="jk-card overflow-hidden">
        <div className="cc-hero-plates">
          <div className="cc-hero-plate cc-hero-plate--you">
            <span className="cc-mark">N</span>
            Notion
          </div>
          <span className="cc-vs">VS</span>
          <div className="cc-hero-plate cc-hero-plate--them">
            Asana
            <span className="cc-mark">A</span>
          </div>
        </div>
        <ul className="grid gap-2 p-4">
          {heroRows.map((r) => (
            <li key={r.cat} className="cc-hero-row">
              <span className={`cc-hero-cell${r.edge === "you" ? " is-edge" : ""}`}>{r.you}</span>
              <span className="cc-hero-cat">{r.cat}</span>
              <span className={`cc-hero-cell cc-hero-cell--them${r.edge === "them" ? " is-edge" : ""}`}>{r.them}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-[var(--jk-line)] bg-[var(--jk-surface-2)] px-5 py-4">
          <p className="jk-label-sm">Where you can win</p>
          <p className="mt-1 text-[14.5px] leading-6 text-[var(--jk-ink)]">
            Own &ldquo;docs and projects in one place&rdquo; for teams tired of switching tools.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AgentPage slug={SLUG}>
      <AgentHero
        slug={SLUG}
        headline={
          <>
            See where you win — <em>and where you&apos;re losing.</em>
          </>
        }
        lede="Name your business and a competitor. You get a side-by-side read on positioning, audience, strengths, weaknesses and differentiators, plus a positioning line you can actually use."
        chips={[
          { icon: Columns2, label: "Side-by-side, six angles" },
          { icon: Crosshair, label: "Finds the gap to own" },
          { icon: Flag, label: "Positioning line included" },
        ]}
        preview={<HeroPreview />}
      />

      <CompetitorCompare />

      <HowItWorks
        title={
          <>
            Two brands in. <em>One clear angle</em> out.
          </>
        }
        text="Most competitor research ends as a spreadsheet. This ends with a sentence you can put on your homepage."
        steps={[
          {
            icon: Swords,
            title: "Name the match-up",
            text: "Your business and one competitor — by name or URL. Adding the industry keeps the comparison on the right playing field.",
          },
          {
            icon: Columns2,
            title: "Compared side by side",
            text: "Positioning, target audience, key strength, key weakness, differentiator and the opportunity each side has — row by row.",
          },
          {
            icon: Target,
            title: "Where to position",
            text: "The key insight names the tension between you, and the recommended positioning turns it into a line you can test.",
          },
        ]}
      />

      <UseCases
        title="When teams compare"
        items={[
          {
            icon: Presentation,
            title: "Sharpening your pitch",
            text: "Before a website rewrite or a sales deck, see exactly how a prospect would compare you — and lead with the difference that matters.",
            who: "For founders and marketing leads",
          },
          {
            icon: FileSearch,
            title: "Battle cards for sales",
            text: "Turn each row into objection handling for the competitor you meet most.",
            who: "For sales teams",
          },
          {
            icon: TrendingUp,
            title: "Entering a new market",
            text: "Compare against the local leader before you set pricing and messaging.",
            who: "For growth and strategy teams",
          },
          {
            icon: Radar,
            title: "Ongoing competitor watch",
            text: "We can track your top competitors' sites and messaging and flag changes monthly.",
            who: "Built by Jaseir for your stack",
          },
        ]}
      />

      <RelatedAgents slug={SLUG} zone={{ kind: "agent", slug: SLUG }} />
    </AgentPage>
  );
}
