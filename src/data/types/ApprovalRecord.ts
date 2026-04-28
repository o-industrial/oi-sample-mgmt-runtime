import { z } from 'zod';

/**
 * Approval request — generic approval routing for dispositions, transfers,
 * returns, archive retrievals, and manager reviews.
 */
export const ApprovalRecordSchema = z.object({
  ApprovalId: z.string().describe('Unique approval identifier'),
  Type: z.enum([
    'disposition',
    'transfer',
    'archive-retrieval',
    'manager-review',
    'return-confirmation',
  ]).describe('Approval workflow type'),
  RecordId: z.string().describe('ID of the entity requiring approval'),
  StudyRef: z.string().describe('Study reference for role-mapping lookup'),
  InitiatedBy: z.string().describe('User who initiated the approval request'),
  InitiatedAt: z.string().describe('Timestamp of initiation'),
  AssignedTo: z.array(z.string()).describe(
    'User IDs routed to via study-role mapping',
  ),
  Status: z.enum(['pending', 'approved', 'rejected', 'escalated']).describe(
    'Current approval status',
  ),
  Decision: z.object({
    DecidedBy: z.string(),
    Decision: z.enum(['approved', 'rejected', 'escalated']),
    Reason: z.string().optional(),
    Timestamp: z.string(),
  }).optional().describe('Populated when decision is made'),
  Context: z.record(z.string(), z.unknown()).describe('Type-specific context'),
});

export type ApprovalRecord = z.infer<typeof ApprovalRecordSchema>;
