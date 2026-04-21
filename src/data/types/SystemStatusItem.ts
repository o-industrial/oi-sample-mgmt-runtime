import { z } from 'zod';

/**
 * System component status for the dashboard status bar.
 */
export const SystemStatusItemSchema = z.object({
  ComponentId: z.string().describe('Component identifier'),
  Label: z.string().describe('Display label'),
  Status: z.enum(['online', 'connecting', 'offline']).describe(
    'Current status',
  ),
  Note: z.string().optional().describe('Optional status note'),
});

export type SystemStatusItem = z.infer<typeof SystemStatusItemSchema>;
