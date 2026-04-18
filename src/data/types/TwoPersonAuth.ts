import { z } from 'zod';

/**
 * Two-person authentication for high-risk operations (e.g. controlled substance disposal).
 */
export const TwoPersonAuthSchema = z.object({
  ScannedBy: z.string().describe('First person who scanned'),
  VerifiedBy: z.string().describe('Second person who verified'),
  At: z.string().describe('Timestamp of verification'),
});

export type TwoPersonAuth = z.infer<typeof TwoPersonAuthSchema>;
