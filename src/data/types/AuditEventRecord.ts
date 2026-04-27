import { z } from "zod";

/**
 * ALCOA+ compliant audit event — append-only, never updated or deleted.
 * Every data mutation creates one.
 */
export const AuditEventRecordSchema = z.object({
  EventId: z.string().describe("Unique event identifier (e.g. EVT-0001)"),
  Timestamp: z.string().describe("ISO timestamp of when event occurred"),
  UserId: z.string().describe("User who performed the action (Attributable)"),
  ActionType: z.string().describe(
    "Action performed (Scan, Create, Approve, Update, etc.)",
  ),
  EntityType: z.string().describe(
    "Type of entity affected (Sample, Manifest, Transfer, etc.)",
  ),
  EntityId: z.string().describe("ID of the affected entity"),
  AlcoaPrinciple: z.string().describe("Primary ALCOA+ principle satisfied"),
  Status: z.enum(["success", "failed"]).describe(
    "Whether the action succeeded",
  ),
});

export type AuditEventRecord = z.infer<typeof AuditEventRecordSchema>;
