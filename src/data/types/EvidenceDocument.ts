import { z } from "zod";

/**
 * Evidence document attached to disposition or review records.
 */
export const EvidenceDocumentSchema = z.object({
  Name: z.string().describe("Document name"),
  Url: z.string().describe("Document URL"),
});

export type EvidenceDocument = z.infer<typeof EvidenceDocumentSchema>;
