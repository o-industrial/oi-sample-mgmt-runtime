import { z } from 'zod';

/**
 * Study-role mapping — which users hold which role for a given study.
 * Used by the approval routing engine to auto-route approval requests.
 */
export const StudyRoleMappingRecordSchema = z.object({
  MappingId: z.string().describe('Unique mapping identifier'),
  StudyId: z.string().describe('Study reference'),
  Role: z.string().describe('Role name (e.g., hbsm_custodian, lab_manager)'),
  UserIds: z.array(z.string()).describe(
    'Users holding this role for this study',
  ),
});

export type StudyRoleMappingRecord = z.infer<
  typeof StudyRoleMappingRecordSchema
>;
