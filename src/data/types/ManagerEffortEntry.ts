import { z } from 'zod';

/**
 * Manager effort tracking — workload distribution entry.
 */
export const ManagerEffortEntrySchema = z.object({
  Manager: z.string().describe('Manager name'),
  Count: z.number().describe('Number of items managed'),
});

export type ManagerEffortEntry = z.infer<typeof ManagerEffortEntrySchema>;
