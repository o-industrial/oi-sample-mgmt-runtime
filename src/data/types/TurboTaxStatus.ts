import { z } from "zod";

/**
 * TurboTax exception triage state — every item on every pane carries one of these.
 *
 * - `ready`: Happy path, auto-proceeds. Operator does not touch it.
 * - `attention`: System knows exactly what's wrong. Guided resolution steps.
 * - `volume-hold`: Resource constraint (not data quality). Item valid but no capacity.
 * - `problem`: Escalation with full context. Nobody starts from scratch.
 */
export const TurboTaxStatusSchema = z.enum([
  "ready",
  "attention",
  "volume-hold",
  "problem",
]).describe(
  "TurboTax exception triage state: ready (green), attention (amber), volume-hold (blue), problem (red)",
);

export type TurboTaxStatus = z.infer<typeof TurboTaxStatusSchema>;
