import { z } from 'zod';

/**
 * Custodian sign-off for disposition decisions.
 */
export const CustodianSignoffSchema = z.object({
  SignedBy: z.string().describe('Custodian who signed off'),
  SignedAt: z.string().describe('Timestamp of sign-off'),
});

export type CustodianSignoff = z.infer<typeof CustodianSignoffSchema>;
