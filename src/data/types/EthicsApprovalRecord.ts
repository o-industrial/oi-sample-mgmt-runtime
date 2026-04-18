import { z } from 'zod';

/**
 * ICH GCP ethics committee approval. Temporal TurboTax triggers monitor expiry dates.
 */
export const EthicsApprovalRecordSchema = z.object({
  StudyId: z.string().describe('Study this approval covers'),
  Protocol: z.string().describe('Protocol description'),
  ApprovalDate: z.string().describe('Date approval was granted'),
  ExpiryDate: z.string().describe('Date approval expires'),
  Status: z.enum(['active', 'expiring', 'expired']).describe('Current approval status'),
  DaysUntilExpiry: z.number().describe('Days remaining until expiry'),
});

export type EthicsApprovalRecord = z.infer<typeof EthicsApprovalRecordSchema>;
