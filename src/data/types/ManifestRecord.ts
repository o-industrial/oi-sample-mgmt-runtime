import { z } from 'zod';
import { TurboTaxStatusSchema } from './TurboTaxStatus.ts';

/**
 * Regulatory document listing expected samples for a shipment.
 * Starting point of the RECEIVE workflow. Drives the Incoming Shipments dashboard pane.
 */
export const ManifestRecordSchema = z.object({
  ManifestId: z.string().describe(
    'Unique manifest identifier (e.g. MAN-2026-0412)',
  ),
  StudyId: z.string().describe('Study this manifest belongs to'),
  ShipmentId: z.string().optional().describe('Associated shipment identifier'),
  ExpectedSamples: z.number().describe('Number of expected samples'),
  OriginSite: z.string().optional().describe('Sending site'),
  DestinationSite: z.string().optional().describe('Receiving site'),
  WaybillNumber: z.string().optional().describe('Courier tracking number'),
  Carrier: z.string().optional().describe('Courier/carrier name'),
  Period: z.string().optional().describe(
    'Regulatory control point for blinding',
  ),
  Status: TurboTaxStatusSchema.describe('Current TurboTax triage state'),
  ReceivedAt: z.string().describe('Timestamp of receipt'),
});

export type ManifestRecord = z.infer<typeof ManifestRecordSchema>;
