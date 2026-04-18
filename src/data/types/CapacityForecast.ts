import { z } from 'zod';

/**
 * Capacity forecasting data — current vs projected vs breakpoint.
 */
export const CapacityForecastSchema = z.object({
  Current: z.number().describe('Current capacity utilization'),
  Projected: z.number().describe('Projected capacity'),
  Breakpoint: z.number().describe('Capacity breakpoint threshold'),
});

export type CapacityForecast = z.infer<typeof CapacityForecastSchema>;
