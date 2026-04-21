import { z } from 'zod';
import { TurboTaxStatusSchema } from './TurboTaxStatus.ts';

/**
 * Manifest discrepancy — created when received samples don't match manifest.
 * Requires reason-for-change.
 */
export const ReconciliationRecordSchema = z.object({
  ReconciliationId: z.string().describe('Unique reconciliation identifier'),
  ManifestId: z.string().describe('Associated manifest'),
  DiscrepancyType: z.string().describe('Type of discrepancy found'),
  ExpectedCount: z.number().describe('Expected sample count from manifest'),
  ActualCount: z.number().describe('Actual count received'),
  MissingFields: z.array(z.string()).describe('Fields with discrepancies'),
  Status: TurboTaxStatusSchema.describe('Current TurboTax triage state'),
  Resolution: z.string().optional().describe('How discrepancy was resolved'),
  ResolvedBy: z.string().optional().describe('User who resolved'),
  ResolvedAt: z.string().optional().describe('Resolution timestamp'),
  CorrectionReason: z.string().optional().describe(
    'Reason-for-change (GxP requirement)',
  ),
  SlaDeadline: z.string().describe('SLA deadline for resolution'),
  LastAction: z.string().describe('Most recent action description'),
});

export type ReconciliationRecord = z.infer<typeof ReconciliationRecordSchema>;
