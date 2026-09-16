"use client";

import { FormEvent, useState } from "react";

interface ComparisonRow {
  category: string;
  business_analysis: string;
  competitor_analysis: string;
}

interface ComparisonResult {
  business: string;
  competitor: string;
  key_insight: string;
  recommended_positioning: string;
  rows: ComparisonRow[];
}

const categories = [
  { number: "01", title: "Positioning", text: "How each brand presents its value." },
  { number: "02", title: "Audience", text: "Who each business is built to attract." },
  { number: "03", title: "Strengths", text: "Where each side creates an advantage." },
  { number: "04", title: "Differentiation", text: "Where meaningful opportunities may exist." },
];

function SparkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.8 13.8 9l6.2 3-6.2 1.8L12 20l-1.8-6.2L4 12l6.2-3L12 2.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <span className="check-icon" aria-hidden="true">✓</span>
  );
}

export default function Home() {
  const [business, setBusiness] = useState("");
  const [competitor, setCompetitor] = useState("");
  const [industry, setIndustry] = useState("");
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!business.trim() || !competitor.trim()) {
      setError("Please enter your business and a competitor.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

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

      setResult(data);
      window.setTimeout(() => {
        document.getElementById("comparison-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate comparison.");
    } finally {
      setLoading(false);
    }
  }

  function loadExample() {
    setBusiness("Notion");
    setCompetitor("Asana");
    setIndustry("Project management software");
    setError("");
  }

  function resetComparison() {
    setResult(null);
    setError("");
    setBusiness("");
    setCompetitor("");
    setIndustry("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="page-shell">
      <style jsx global>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          margin: 0;
          background: #f7f9fe;
          color: #101a3d;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        button, input { font: inherit; }
        button { cursor: pointer; }

        .page-shell {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 82% 13%, rgba(94, 116, 255, .13), transparent 25%),
            radial-gradient(circle at 8% 28%, rgba(38, 124, 255, .08), transparent 23%),
            linear-gradient(180deg, #fbfcff 0%, #f5f8ff 100%);
        }

        .topbar {
          height: 72px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(27, 45, 90, .07);
          background: rgba(255,255,255,.82);
          backdrop-filter: blur(18px);
          position: relative;
          z-index: 10;
        }
        .topbar-inner {
          width: min(1240px, calc(100% - 48px));
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          color: #101a3d;
          text-decoration: none;
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -.8px;
        }
        .brand span { color: #1768f2; }
        .back-link {
          color: #66738f;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          transition: color .2s ease;
        }
        .back-link:hover { color: #1768f2; }

        .hero {
          position: relative;
          width: min(1240px, calc(100% - 48px));
          min-height: 690px;
          margin: 0 auto;
          padding: 76px 0 86px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(440px, 540px);
          gap: 70px;
          align-items: center;
        }
        .hero::before {
          content: "";
          position: absolute;
          width: 520px;
          height: 520px;
          right: -160px;
          top: 20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(79,103,255,.14), transparent 67%);
          pointer-events: none;
        }
        .hero-copy { position: relative; z-index: 2; }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #58709f;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 25px;
        }
        .eyebrow-line { width: 36px; height: 2px; background: #2875f4; }
        .eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: #2875f4; box-shadow: 0 0 0 5px rgba(40,117,244,.09); }
        .hero-title {
          margin: 0;
          max-width: 690px;
          font-size: clamp(52px, 5.1vw, 78px);
          line-height: .99;
          letter-spacing: -4.2px;
          font-weight: 800;
          color: #101a3d;
        }
        .gradient-text {
          display: block;
          background: linear-gradient(90deg, #1768f2 0%, #5c54ff 52%, #c52cff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .hero-description {
          max-width: 610px;
          margin: 28px 0 0;
          color: #62708e;
          font-size: 17px;
          line-height: 1.7;
        }
        .benefits {
          display: flex;
          flex-wrap: wrap;
          gap: 22px;
          margin-top: 28px;
          color: #6d7891;
          font-size: 12px;
          font-weight: 600;
        }
        .benefit { display: flex; align-items: center; gap: 8px; }
        .check-icon {
          width: 20px;
          height: 20px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #eaf2ff;
          color: #1768f2;
          font-size: 11px;
          font-weight: 900;
        }

        .form-card {
          position: relative;
          z-index: 3;
          border: 1px solid rgba(192,204,228,.78);
          border-radius: 28px;
          padding: 30px;
          background: rgba(255,255,255,.84);
          box-shadow: 0 30px 80px rgba(49,72,130,.12), 0 2px 8px rgba(49,72,130,.04);
          backdrop-filter: blur(20px);
        }
        .form-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(255,255,255,.8), rgba(240,245,255,.3));
          pointer-events: none;
        }
        .form-content { position: relative; z-index: 1; }
        .form-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 18px; margin-bottom: 25px; }
        .form-kicker { color: #1768f2; font-size: 11px; font-weight: 800; letter-spacing: 1.3px; text-transform: uppercase; }
        .form-title { margin: 6px 0 0; color: #172242; font-size: 25px; line-height: 1.2; letter-spacing: -.7px; font-weight: 800; }
        .spark-badge {
          width: 42px; height: 42px; flex: 0 0 42px; display: grid; place-items: center;
          border-radius: 13px; color: #5b58ff; background: linear-gradient(135deg, #eef3ff, #f5edff);
          border: 1px solid #e0e5f5;
        }
        .field { margin-top: 18px; }
        .field label { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #273452; font-size: 12px; font-weight: 700; }
        .optional { color: #9aa7bf; font-weight: 500; }
        .field input {
          width: 100%; height: 52px; padding: 0 15px; border: 1px solid #dce3f0; border-radius: 13px;
          background: rgba(249,251,255,.9); color: #172242; outline: none; transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
        }
        .field input::placeholder { color: #a6b0c3; }
        .field input:focus { border-color: #80a9ff; background: #fff; box-shadow: 0 0 0 4px rgba(42,116,245,.09); }
        .error { margin-top: 16px; padding: 12px 14px; border: 1px solid #f2c9d0; border-radius: 12px; background: #fff4f5; color: #b3384b; font-size: 12px; line-height: 1.5; }
        .submit {
          width: 100%; height: 56px; margin-top: 22px; border: 0; border-radius: 13px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          background: linear-gradient(135deg, #1768f2, #5b55ff); color: #fff; font-size: 14px; font-weight: 750;
          box-shadow: 0 14px 28px rgba(45,93,220,.2); transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
        }
        .submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 18px 34px rgba(45,93,220,.27); }
        .submit:disabled { cursor: not-allowed; opacity: .65; }
        .spinner { width: 17px; height: 17px; border: 2px solid rgba(255,255,255,.45); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .example { margin-top: 15px; display: flex; justify-content: center; align-items: center; gap: 7px; color: #8995ad; font-size: 11px; }
        .example button { padding: 0; border: 0; background: transparent; color: #1768f2; font-size: 11px; font-weight: 700; }
        .example button:hover { text-decoration: underline; }

        .process {
          border-top: 1px solid rgba(38,58,105,.08);
          border-bottom: 1px solid rgba(38,58,105,.08);
          background: rgba(244,247,255,.8);
        }
        .process-inner { width: min(1240px, calc(100% - 48px)); margin: 0 auto; padding: 58px 0 62px; }
        .process-heading { max-width: 650px; }
        .section-label { display: flex; align-items: center; gap: 14px; color: #71809e; font-size: 16px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
        .section-label::before { content: ""; width: 44px; height: 3px; border-radius: 3px; background: #397df4; }
        .process-title { margin: 13px 0 0; color: #111b3f; font-size: clamp(32px, 4vw, 49px); line-height: 1.02; letter-spacing: -2.2px; font-weight: 800; }
        .process-title span { color: #5961e8; }
        .process-grid { margin-top: 38px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .process-card { min-height: 168px; padding: 22px; border: 1px solid #e0e6f2; border-radius: 20px; background: rgba(255,255,255,.75); box-shadow: 0 10px 30px rgba(54,77,130,.05); }
        .process-number { color: #4d83f6; font-size: 11px; font-weight: 800; letter-spacing: 1px; }
        .process-card h3 { margin: 20px 0 8px; color: #172242; font-size: 16px; letter-spacing: -.2px; }
        .process-card p { margin: 0; color: #7a879f; font-size: 12px; line-height: 1.6; }

        .results { width: min(1120px, calc(100% - 48px)); margin: 0 auto; padding: 86px 0; scroll-margin-top: 30px; animation: resultIn .5s ease both; }
        @keyframes resultIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .result-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 24px; }
        .result-kicker { display: flex; align-items: center; gap: 8px; color: #1768f2; font-size: 11px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; }
        .result-kicker::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: #25bf87; box-shadow: 0 0 0 5px rgba(37,191,135,.1); }
        .result-title { margin: 9px 0 0; color: #111b3f; font-size: 32px; line-height: 1.1; letter-spacing: -1.4px; font-weight: 800; }
        .vs { color: #9aa6bd; font-weight: 600; margin: 0 7px; }
        .result-note { color: #96a1b5; font-size: 11px; }
        .insight, .positioning { display: flex; gap: 15px; padding: 22px; border-radius: 18px; }
        .insight { border: 1px solid #dce8ff; background: linear-gradient(135deg, #f1f6ff, #faf8ff); }
        .positioning { margin-top: 16px; border: 1px solid #e6defe; background: linear-gradient(135deg, #f7f4ff, #fff9fd); }
        .insight-icon { width: 40px; height: 40px; flex: 0 0 40px; display: grid; place-items: center; border-radius: 12px; color: #4e67ed; background: #e9efff; }
        .positioning .insight-icon { color: #8a49df; background: #f0e7ff; }
        .result-label { color: #536ea8; font-size: 10px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; }
        .positioning .result-label { color: #8650bf; }
        .result-copy { margin: 8px 0 0; color: #596985; font-size: 13px; line-height: 1.75; }
        .table-wrap { margin-top: 18px; overflow: hidden; border: 1px solid #dfe5f1; border-radius: 20px; background: #fff; box-shadow: 0 18px 50px rgba(49,72,130,.07); }
        .table-scroll { overflow-x: auto; }
        table { width: 100%; min-width: 760px; border-collapse: collapse; }
        thead tr { background: #f5f7fc; }
        th { padding: 18px 20px; text-align: left; border-bottom: 1px solid #e4e8f1; color: #78849c; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
        th + th, td + td { border-left: 1px solid #e8ebf2; }
        th.business-head, th.competitor-head { color: #1d2a4b; font-size: 15px; letter-spacing: -.2px; text-transform: none; }
        tbody tr { transition: background .2s ease; }
        tbody tr:hover { background: #fafbff; }
        tbody tr:not(:last-child) td { border-bottom: 1px solid #edf0f5; }
        td { padding: 22px 20px; vertical-align: top; }
        td.category-cell { width: 21%; }
        .category-name { color: #376fe0; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
        .analysis-copy { margin: 0; color: #65718a; font-size: 12px; line-height: 1.75; }
        .footer { width: min(1240px, calc(100% - 48px)); margin: 0 auto; padding: 32px 0 45px; color: #a0abc0; text-align: center; font-size: 10px; }

        @media (max-width: 980px) {
          .hero { grid-template-columns: 1fr; gap: 40px; padding: 60px 0 70px; }
          .hero-copy { text-align: center; }
          .eyebrow, .benefits { justify-content: center; }
          .hero-title, .hero-description { margin-left: auto; margin-right: auto; }
          .form-card { width: min(620px, 100%); margin: 0 auto; }
          .process-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .topbar-inner, .hero, .process-inner, .footer, .results { width: calc(100% - 32px); }
          .topbar { height: 64px; }
          .hero { min-height: auto; padding: 45px 0 55px; }
          .hero-title { font-size: 48px; letter-spacing: -2.8px; }
          .hero-description { font-size: 15px; }
          .benefits { gap: 13px 18px; }
          .form-card { padding: 22px; border-radius: 22px; }
          .form-title { font-size: 22px; }
          .process-grid { grid-template-columns: 1fr; }
          .section-label { font-size: 13px; letter-spacing: 1.5px; gap: 10px; }
          .section-label::before { width: 32px; height: 2px; }
          .process-inner { padding: 46px 0 50px; }
          .result-header { align-items: flex-start; flex-direction: column; }
          .result-title { font-size: 27px; }
          .results { padding: 60px 0; }
        }
      `}</style>

      <header className="topbar">
        <div className="topbar-inner">
          <a href="/" className="brand">JASEIR <span>AI</span></a>
          <a href="/" className="back-link">AI Agent Hub →</a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            AI COMPETITIVE INTELLIGENCE
          </div>

          <h1 className="hero-title">
            See where you
            <span className="gradient-text">stand out.</span>
          </h1>

          <p className="hero-description">
            Compare your business with a competitor across positioning, audience,
            strengths and differentiation — then turn the analysis into a clear strategic direction.
          </p>

          <div className="benefits">
            {categories.slice(0, 3).map((item) => (
              <div className="benefit" key={item.number}>
                <CheckIcon />
                {item.title}
              </div>
            ))}
          </div>
        </div>

        <div className="form-card">
          <div className="form-content">
            <div className="form-top">
              <div>
                <div className="form-kicker">Compare two businesses</div>
                <h2 className="form-title">Find your competitive signal.</h2>
              </div>
              <div className="spark-badge"><SparkIcon /></div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="business">Your business</label>
                <input id="business" type="text" value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="e.g. Notion or https://notion.com" />
              </div>

              <div className="field">
                <label htmlFor="competitor">Competitor</label>
                <input id="competitor" type="text" value={competitor} onChange={(e) => setCompetitor(e.target.value)} placeholder="e.g. Asana or https://asana.com" />
              </div>

              <div className="field">
                <label htmlFor="industry">Industry <span className="optional">Optional</span></label>
                <input id="industry" type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Project management software" />
              </div>

              {error && <div className="error">{error}</div>}

              <button className="submit" type="submit" disabled={loading}>
                {loading ? <><span className="spinner" /> Analyzing competitors...</> : <><SparkIcon /> Compare competitors <ArrowIcon /></>}
              </button>
            </form>

            <div className="example">
              <span>Not sure what to enter?</span>
              <button type="button" onClick={loadExample}>Try Notion vs Asana</button>
            </div>
          </div>
        </div>
      </section>

      <section className="process">
        <div className="process-inner">
          <div className="process-heading">
            <div className="section-label">How the analysis works</div>
            <h2 className="process-title">From comparison to <span>clearer direction.</span></h2>
          </div>

          <div className="process-grid">
            {categories.map((item) => (
              <article className="process-card" key={item.number}>
                <div className="process-number">{item.number}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {result && (
        <section className="results" id="comparison-results">
          <div className="result-header">
            <div>
              <div className="result-kicker">AI Analysis</div>
              <h2 className="result-title">
                {result.business}<span className="vs">vs</span>{result.competitor}
              </h2>
            </div>
            <div className="result-note">AI-generated comparison</div>
          </div>

          <div className="insight">
            <div className="insight-icon"><SparkIcon /></div>
            <div>
              <div className="result-label">Key Competitive Insight</div>
              <p className="result-copy">{result.key_insight}</p>
            </div>
          </div>

          <div className="table-wrap">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th className="business-head">{result.business}</th>
                    <th className="competitor-head">{result.competitor}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row) => (
                    <tr key={row.category}>
                      <td className="category-cell"><span className="category-name">{row.category}</span></td>
                      <td><p className="analysis-copy">{row.business_analysis}</p></td>
                      <td><p className="analysis-copy">{row.competitor_analysis}</p></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="positioning">
            <div className="insight-icon"><SparkIcon /></div>
            <div>
              <div className="result-label">Recommended Positioning</div>
              <p className="result-copy">{result.recommended_positioning}</p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
            <button type="button" onClick={resetComparison} className="back-link" style={{ border: "1px solid #dce3ef", background: "#fff", borderRadius: 12, padding: "12px 18px" }}>
              ← Compare another competitor
            </button>
          </div>
        </section>
      )}

      <footer className="footer">
        AI-generated insights are for strategic exploration and may not reflect the latest company information.
      </footer>
    </main>
  );
}
