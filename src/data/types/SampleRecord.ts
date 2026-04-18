import { z } from 'zod';
import { SampleStatusSchema } from './SampleStatus.ts';

/**
 * Core domain entity — one physical tube/vial from receipt through end-of-life.
 * Tricoded (1D, 2D, human-readable). Storage uses 8-level freezer hierarchy.
 */
export const SampleRecordSchema = z.object({
  SampleId: z.string().describe('Unique sample identifier (e.g. SMP-2026-88421-001)'),
  StudyId: z.string().describe('Study this sample belongs to'),
  OriginSite: z.string().describe('Site where sample originated'),
  ReceivedAt: z.string().describe('Timestamp of receipt'),
  Status: SampleStatusSchema.describe('Current lifecycle status'),
  StorageLocation: z.string().describe('8-level freezer hierarchy position'),
  LastAction: z.string().describe('Most recent action description'),
});

export type SampleRecord = z.infer<typeof SampleRecordSchema>;
