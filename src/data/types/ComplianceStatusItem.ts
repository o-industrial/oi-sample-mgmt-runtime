import { z } from 'zod';

/**
 * Compliance standard status for the dashboard status bar.
 */
export const ComplianceStatusItemSchema = z.object({
  StandardId: z.string().describe('Compliance standard identifier'),
  Label: z.string().describe('Display label'),
  Compliant: z.boolean().describe('Whether currently compliant'),
});

export type ComplianceStatusItem = z.infer<typeof ComplianceStatusItemSchema>;
