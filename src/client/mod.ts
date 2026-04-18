export { SampleMgmtAPIClient, type SampleMgmtClientOptions } from './SampleMgmtAPIClient.ts';
export { createClientFromRequest } from './createClientFromRequest.ts';
export type { SampleRecord } from '../data/types/SampleRecord.ts';
export type { ManifestRecord } from '../data/types/ManifestRecord.ts';
export type { StudyRecord } from '../data/types/StudyRecord.ts';
export type { AuditEventRecord } from '../data/types/AuditEventRecord.ts';
export type { EthicsApprovalRecord } from '../data/types/EthicsApprovalRecord.ts';
export type { TransferRecord } from '../data/types/TransferRecord.ts';
export type { ReturnRecord } from '../data/types/ReturnRecord.ts';
export type { ReconciliationRecord } from '../data/types/ReconciliationRecord.ts';
export type { DispositionRecord } from '../data/types/DispositionRecord.ts';
export type { PaneViewData } from '../data/types/PaneViewData.ts';
export type { ManagementOverlayData } from '../data/types/ManagementOverlayData.ts';
export type { ManagerEffortEntry } from '../data/types/ManagerEffortEntry.ts';
export type { CapacityForecast } from '../data/types/CapacityForecast.ts';
export type { ReviewRecord } from '../data/types/ReviewRecord.ts';

import { SampleMgmtAPIClient, type SampleMgmtClientOptions } from './SampleMgmtAPIClient.ts';

export function createSampleMgmtClient(options: SampleMgmtClientOptions = {}): SampleMgmtAPIClient {
  return new SampleMgmtAPIClient(options);
}
