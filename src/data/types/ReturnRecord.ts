import { z } from "zod";
import { TurboTaxStatusSchema } from "./TurboTaxStatus.ts";

/**
 * Scientist-initiated return request.
 * Can result in physical return OR depletion attestation.
 */
export const ReturnRecordSchema = z.object({
  ReturnId: z.string().describe("Unique return identifier"),
  SampleIds: z.array(z.string()).describe("Sample IDs being returned"),
  Destination: z.string().describe("Return destination"),
  Reason: z.string().describe("Reason for return"),
  RequestedBy: z.string().describe("User who requested the return"),
  RequestedAt: z.string().describe("Timestamp of request"),
  Status: TurboTaxStatusSchema.describe("Current TurboTax triage state"),
  PackagingInstructions: z.string().describe("Packaging requirements"),
  Outcome: z.string().optional().describe("Return outcome if completed"),
  DepletionContext: z.string().optional().describe(
    "Depletion context if sample consumed",
  ),
  LastAction: z.string().describe("Most recent action description"),
});

export type ReturnRecord = z.infer<typeof ReturnRecordSchema>;
