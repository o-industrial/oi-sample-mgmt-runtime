import { z } from 'zod';

/**
 * Research study/protocol that samples belong to.
 * Used for study dropdown selections and filtering.
 */
export const StudyRecordSchema = z.object({
  StudyId: z.string().describe('Unique study identifier (e.g. BEACON-3)'),
  Label: z.string().describe('Display label (e.g. BEACON-3 Phase III)'),
});

export type StudyRecord = z.infer<typeof StudyRecordSchema>;
