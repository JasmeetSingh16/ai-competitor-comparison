"use client";

import { ArrowRight, Lightbulb, Quote, RotateCcw, Sparkles, TriangleAlert } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { EmptyPreview, WorkspaceSection } from "../components/agent/AgentTemplate";
import { CopyButton, LoadingSteps } from "../components/agent/AgentUi";
import ReportGate, { GoogleReturn, ReportCta } from "../components/agent/ReportGate";
import type { ReportGateInfo } from "../lib/lead-gate";
import { exampleComparison, sampleMatchups, type ComparisonResult } from "./compare-data";
import { inputOf, previewOf, summaryOf } from "./report-gate";

const LOADING_STEPS = [
  "Reading both brands",
  "Comparing positioning",
  "Weighing strengths & gaps",
  "Writing your positioning",
];

export default function CompetitorCompare() {
  const [business, setBusiness] = useState("");
  const [competitor, setCompetitor] = useState("");
  const [industry, setIndustry] = useState("");
  const [result, setResult] = useState<ComparisonResult | null>(null);
  // Set while the full comparison is locked behind the email form.
  const [gate, setGate] = useState<ReportGateInfo | null>(null);
  // What was compared (the fields stay editable afterwards).
  const [submitted, setSubmitted] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sampleIndex, setSampleIndex] = useState(-1);

  const formRef = useRef<HTMLFormElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!business.trim() || !competitor.trim()) {
      setError("Please enter your business and a competitor.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setGate(null);
    outputRef.current?.scrollIntoView({ block: "start" });

    try {
      const response = await fetch("/ai-competitor-comparison/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business, competitor, industry }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      const { gate: gateInfo, ...report } = data as ComparisonResult & { gate?: ReportGateInfo | null };
      setResult(report);
      setGate(gateInfo ?? null);
      setSubmitted(inputOf({ business, competitor, industry }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate comparison.");
      formRef.current?.scrollIntoView({ block: "start" });
    } finally {
      setLoading(false);
    }
  }

  function loadExample() {
    const next = (sampleIndex + 1) % sampleMatchups.length;
    const s = sampleMatchups[next];
    setSampleIndex(next);
    setBusiness(s.business);
    setCompetitor(s.competitor);
    setIndustry(s.industry);
    setError("");
  }

  function resetComparison() {
    setResult(null);
    setGate(null);
    setError("");
    setBusiness("");
    setCompetitor("");
    setIndustry("");
    formRef.current?.scrollIntoView({ block: "start" });
  }

  return (
    <WorkspaceSection
      title="Compare two businesses"
      text="Enter your brand and one competitor — names or URLs both work. Add the industry for sharper results."
      actions={
        <button type="button" className="jk-btn jk-btn--soft" onClick={loadExample} disabled={loading}>
          <Sparkles size={16} aria-hidden="true" />
          {sampleIndex < 0 ? "Try sample data" : "Try another sample"}
        </button>
      }
    >
      <form ref={formRef} onSubmit={handleSubmit} className="jk-card cc-form" noValidate>
        <div className="cc-sides">
          <div className="jk-field cc-side cc-side--you">
            <label htmlFor="business" className="jk-label">
              Your business
            </label>
            <input
              id="business"
              type="text"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="e.g. Notion or https://notion.com"
              className="jk-input"
            />
          </div>

          <span className="cc-vs" aria-hidden="true">
            VS
          </span>

          <div className="jk-field cc-side cc-side--them">
            <label htmlFor="competitor" className="jk-label">
              Competitor
            </label>
            <input
              id="competitor"
              type="text"
              value={competitor}
              onChange={(e) => setCompetitor(e.target.value)}
              placeholder="e.g. Asana or https://asana.com"
              className="jk-input"
            />
          </div>
        </div>

        <div className="cc-form-foot">
          <div className="jk-field min-w-0 flex-1">
            <label htmlFor="industry" className="jk-label">
              Industry <small>Optional</small>
            </label>
            <input
              id="industry"
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Project management software"
              className="jk-input"
            />
          </div>
          <button type="submit" disabled={loading} className="jk-btn jk-btn--primary jk-btn--lg cc-submit">
            {loading ? "Comparing…" : "Compare"}
            {!loading && <ArrowRight size={18} aria-hidden="true" />}
          </button>
        </div>

        {error && (
          <div className="jk-error mx-5 mb-5 sm:mx-8 sm:mb-8" role="alert">
            <TriangleAlert size={18} aria-hidden="true" className="mt-px shrink-0" />
            {error}
          </div>
        )}
      </form>

      <p className="jk-sr" role="status">
        {result && !loading ? "Comparison ready." : ""}
      </p>

      {/* Back from "Continue with Google": unlock the saved report. */}

      <GoogleReturn

        agent="competitor-comparison"

        onFull={(full) => {

          setResult(full as ComparisonResult);

          setGate(null);

        }}

      />


      <div ref={outputRef} className="cc-output">
        {loading ? (
          <div className="jk-card">
            <LoadingSteps steps={LOADING_STEPS} interval={900} />
          </div>
        ) : result ? (
          <>
            <VersusBoard
              result={gate ? previewOf(result) : result}
              onReset={resetComparison}
              part={gate ? "preview" : "all"}
            />
            {gate ? (
              <ReportGate
                agent="competitor-comparison"
                gate={gate}
                input={submitted}
                summary={summaryOf(result)}
                onUnlock={(full) => {
                  if (full) setResult(full as ComparisonResult);
                  setGate(null);
                }}
              >
                {/* Sealed comparisons aren't in the page yet: blur the example's rows instead. */}
                <VersusBoard result={gate.token ? exampleComparison : result} part="locked" />
              </ReportGate>
            ) : (
              <ReportCta />
            )}
          </>
        ) : (
          <EmptyPreview
            title="Your head-to-head appears here"
            text="Positioning, audience, strengths, weaknesses and differentiators side by side — plus where you can win."
          >
            <VersusBoard result={exampleComparison} />
          </EmptyPreview>
        )}
      </div>
    </WorkspaceSection>
  );
}

/* ------------------------------------------------------------------ */
/* VERSUS BOARD                                                        */
/* ------------------------------------------------------------------ */

function initials(name: string) {
  const clean = name.replace(/^https?:\/\/(www\.)?/, "").trim();
  return clean.slice(0, 1).toUpperCase() || "?";
}

/**
 * part: "all" = the full comparison; "preview" = before the email form
 * (just the two names); "locked" = everything else, blurred behind the form.
 */
function VersusBoard({
  result,
  onReset,
  part = "all",
}: {
  result: ComparisonResult;
  onReset?: () => void;
  part?: "all" | "preview" | "locked";
}) {
  const asText = [
    `${result.business} vs ${result.competitor}`,
    "",
    `Key insight: ${result.key_insight}`,
    "",
    ...result.rows.map(
      (r) =>
        `${r.category}\n  ${result.business}: ${r.business_analysis}\n  ${result.competitor}: ${r.competitor_analysis}`,
    ),
    "",
    `Recommended positioning: ${result.recommended_positioning}`,
  ].join("\n");

  return (
    <article aria-label={`${result.business} versus ${result.competitor}`}>
      {part !== "locked" && (
        <>
          <header className="cc-report-head">
            <p className="jk-eyebrow">Head-to-head</p>
            {onReset && (
              <div className="flex flex-wrap gap-2">
                {part === "all" && <CopyButton text={asText} label="Copy comparison" />}
                <button type="button" className="jk-copy" onClick={onReset}>
                  <RotateCcw size={15} aria-hidden="true" />
                  Compare another
                </button>
              </div>
            )}
          </header>

          {/* Title plates */}
          <div className="cc-plates">
            <div className="cc-plate cc-plate--you">
              <span className="cc-mark">{initials(result.business)}</span>
              <div className="min-w-0">
                <p className="cc-plate-role">You</p>
                <h3 className="cc-plate-name">{result.business}</h3>
              </div>
            </div>
            <span className="cc-vs cc-vs--lg" aria-hidden="true">
              VS
            </span>
            <div className="cc-plate cc-plate--them">
              <span className="cc-mark">{initials(result.competitor)}</span>
              <div className="min-w-0">
                <p className="cc-plate-role">Competitor</p>
                <h3 className="cc-plate-name">{result.competitor}</h3>
              </div>
            </div>
          </div>
        </>
      )}

      {part !== "preview" && (
        <>
          <section className="cc-insight" aria-label="Key competitive insight">
            <Lightbulb size={20} aria-hidden="true" />
            <div>
              <p className="cc-insight-label">Key insight</p>
              <p className="mt-1 text-[16px] leading-7">{result.key_insight}</p>
            </div>
          </section>
        </>
      )}

      {/* Rows */}
      {part !== "preview" && (
        <ol className="cc-rows">
          {result.rows.map((row) => (
            <li key={row.category} className="cc-row">
              <p className="cc-cat">{row.category}</p>
              <div className="cc-cell cc-cell--you">
                <p className="cc-cell-who">{result.business}</p>
                <p>{row.business_analysis}</p>
              </div>
              <div className="cc-cell cc-cell--them">
                <p className="cc-cell-who">{result.competitor}</p>
                <p>{row.competitor_analysis}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      {part !== "preview" && (
        <section className="cc-position" aria-label="Recommended positioning">
          <Quote size={26} aria-hidden="true" />
          <div>
            <p className="cc-position-label">Recommended positioning for {result.business}</p>
            <p className="cc-position-text">{result.recommended_positioning}</p>
            {onReset && (
              <div className="mt-4">
                <CopyButton text={result.recommended_positioning} label="Copy positioning" />
              </div>
            )}
          </div>
        </section>
      )}

      {part === "all" && (
        <p className="jk-fineprint mx-auto mt-6 max-w-2xl text-center">
          AI-generated insights are for strategic exploration and may not reflect the latest company information.
        </p>
      )}
    </article>
  );
}
