import { z } from 'zod';
import { TurboTaxStatusSchema } from './TurboTaxStatus.ts';
import { CustodianSignoffSchema } from './CustodianSignoff.ts';
import { TwoPersonAuthSchema } from './TwoPersonAuth.ts';
import { EvidenceDocumentSchema } from './EvidenceDocument.ts';

/**
 * End-of-study disposition decision for a sample.
 * Requires custodian sign-off and optional two-person auth for controlled substances.
 */
export const DispositionRecordSchema = z.object({
  DispositionId: z.string().describe('Unique disposition identifier'),
  SampleId: z.string().describe('Sample being dispositioned'),
  Decision: z.enum(['destroy', 'retain', 'deplete', 'pending']).describe('Disposition decision'),
  Status: TurboTaxStatusSchema.describe('Current TurboTax triage state'),
  FinalReportDate: z.string().describe('Date of final clinical report'),
  DispositionDeadline: z.string().describe('Deadline for disposition action'),
  TreatmentStatus: z.enum(['blinded', 'unblinded']).optional().describe('Blinding status'),
  CustodianSignoff: CustodianSignoffSchema.optional().describe('Custodian sign-off if completed'),
  TwoPersonAuth: TwoPersonAuthSchema.optional().describe('Two-person auth for controlled substances'),
  EvidenceDocuments: z.array(EvidenceDocumentSchema).describe('Attached evidence documents'),
  LastAction: z.string().describe('Most recent action description'),
});

export type DispositionRecord = z.infer<typeof DispositionRecordSchema>;
