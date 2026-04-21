import { z } from 'zod';
import { TurboTaxStatusSchema } from './TurboTaxStatus.ts';

/**
 * Sample movement between freezers, sites, or study allocations.
 * Approval chain + SLA deadline.
 */
export const TransferRecordSchema = z.object({
  TransferId: z.string().describe(
    'Unique transfer identifier (e.g. TRF-2026-0087)',
  ),
  Type: z.enum(['inter-freezer', 'inter-site', 'inter-study']).describe(
    'Transfer type',
  ),
  SampleIds: z.array(z.string()).describe(
    'Sample IDs included in this transfer',
  ),
  Source: z.string().describe('Source location or study'),
  Destination: z.string().describe('Destination location or study'),
  RequestedBy: z.string().describe('User who requested the transfer'),
  RequestedAt: z.string().describe('Timestamp of request'),
  Status: TurboTaxStatusSchema.describe('Current TurboTax triage state'),
  StatusReason: z.string().describe('Human-readable status explanation'),
  SlaDeadline: z.string().describe('SLA deadline timestamp'),
  LastAction: z.string().describe('Most recent action description'),
});

export type TransferRecord = z.infer<typeof TransferRecordSchema>;
