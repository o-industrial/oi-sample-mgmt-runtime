import { z } from 'zod';

/**
 * Sample lifecycle status — tracks a sample from receipt through end-of-life.
 *
 * - `received`: Sample scanned into system at receipt.
 * - `processing`: Active analytical work (aliquoting, assay, etc.).
 * - `in-storage`: Stored in freezer hierarchy (8-level location).
 * - `transferred`: Moved to a different site, freezer, or study allocation.
 * - `disposed`: Formally destroyed with HBSM custodian approval.
 * - `depleted`: Consumed during analytical process — scientist attestation, no custodian needed.
 */
export const SampleStatusSchema = z.enum([
  'received',
  'processing',
  'in-storage',
  'transferred',
  'disposed',
  'depleted',
]).describe(
  'Sample lifecycle status from receipt through end-of-life (disposed/depleted are terminal)',
);

export type SampleStatus = z.infer<typeof SampleStatusSchema>;
