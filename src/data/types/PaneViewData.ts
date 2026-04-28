import { z } from 'zod';

/**
 * Aggregated TurboTax status counts for a dashboard pane.
 */
export const PaneViewDataSchema = z.object({
  Id: z.string().describe('Pane identifier'),
  Total: z.number().describe('Total item count'),
  Ready: z.number().describe('Items in ready state'),
  Attention: z.number().describe('Items needing attention'),
  VolumeHold: z.number().describe('Items on volume hold'),
  Problem: z.number().describe('Items with problems'),
});

export type PaneViewData = z.infer<typeof PaneViewDataSchema>;
