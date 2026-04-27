import { z } from "zod";

/**
 * Unified chain-of-custody event for the sample lifetime report.
 * Composed from AuditEvents, Transfers, Returns, and Dispositions.
 */
export const CustodyEventSchema = z.object({
  EventId: z.string().describe("Unique event identifier"),
  Timestamp: z.string().describe("ISO timestamp"),
  EventType: z.string().describe(
    "received, scanned, transferred, returned, reconciled, disposed, depleted, approved, updated",
  ),
  Description: z.string().describe("Human-readable event description"),
  PerformedBy: z.string().describe(
    "User who performed the action (Attributable)",
  ),
  EvidenceLinks: z.array(z.string()).describe(
    "Links to manifests, approvals, ELN records",
  ),
  AlcoaPrinciples: z.array(z.string()).describe(
    "ALCOA+ principles satisfied",
  ),
});

export type CustodyEvent = z.infer<typeof CustodyEventSchema>;

export const CustodyTimelineRecordSchema = z.object({
  Sample: z.object({
    SampleId: z.string(),
    StudyId: z.string(),
    OriginSite: z.string(),
    ReceivedAt: z.string(),
    Status: z.string(),
    StorageLocation: z.string(),
  }),
  Events: z.array(CustodyEventSchema),
  CurrentState: z.string(),
});

export type CustodyTimelineRecord = z.infer<
  typeof CustodyTimelineRecordSchema
>;
