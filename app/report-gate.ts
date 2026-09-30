/* ------------------------------------------------------------------ */
/* What the free preview shows before the "Get your full report" form. */
/* Used by the API route (to build the preview it sends) and the page  */
/* (when the report isn't sealed and is only blurred).                 */
/* ------------------------------------------------------------------ */

import type { ComparisonResult } from "./compare-data";

/** Comparison rows shown in the preview. */
export const PREVIEW_ROWS = 3;

/** Key insight plus the first three comparison rows. */
export function previewOf(result: ComparisonResult): ComparisonResult {
  return { ...result, rows: result.rows.slice(0, PREVIEW_ROWS), recommended_positioning: "" };
}

export function inputOf({ business, competitor, industry }: { business: string; competitor: string; industry?: string }) {
  return `${business} vs ${competitor}${industry ? ` (${industry})` : ""}`;
}

export function summaryOf(result: ComparisonResult): string {
  return `Key insight: ${result.key_insight}`;
}
