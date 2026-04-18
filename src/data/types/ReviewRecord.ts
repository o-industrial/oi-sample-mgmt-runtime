import { z } from 'zod';

/**
 * Manager review record — covers reception, reconciliation, and disposition reviews.
 */
export const ReviewRecordSchema = z.object({
  ReviewId: z.string().describe('Unique review identifier'),
  Type: z.enum(['reception', 'reconciliation', 'disposition']).describe('Review type'),
  EntityId: z.string().describe('ID of the entity being reviewed'),
  Status: z.enum(['pending', 'approved', 'rejected', 'escalated']).describe('Review status'),
  ValidationResult: z.enum(['passed', 'failed', 'warnings']).describe('Automated validation result'),
  ExceptionFlags: z.array(z.string()).describe('Flags raised during validation'),
  SubmittedBy: z.string().describe('User who submitted for review'),
  SubmittedAt: z.string().describe('Timestamp of submission'),
  ReviewedBy: z.string().optional().describe('User who reviewed'),
  ReviewedAt: z.string().optional().describe('Timestamp of review'),
  Decision: z.enum(['approved', 'rejected', 'escalated']).optional().describe('Review decision'),
  LastAction: z.string().describe('Most recent action description'),
});

export type ReviewRecord = z.infer<typeof ReviewRecordSchema>;
