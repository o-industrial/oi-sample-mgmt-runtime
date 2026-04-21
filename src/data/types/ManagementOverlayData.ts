import { z } from 'zod';
import { ManagerEffortEntrySchema } from './ManagerEffortEntry.ts';
import { CapacityForecastSchema } from './CapacityForecast.ts';

/**
 * Management overlay data — effort tracking + capacity forecasting.
 */
export const ManagementOverlayDataSchema = z.object({
  EffortData: z.array(ManagerEffortEntrySchema).describe(
    'Manager effort distribution',
  ),
  CapacityData: CapacityForecastSchema.describe('Capacity forecast'),
});

export type ManagementOverlayData = z.infer<typeof ManagementOverlayDataSchema>;
