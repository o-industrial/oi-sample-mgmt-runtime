export { SampleMgmtAPIClient, type SampleMgmtClientOptions } from './SampleMgmtAPIClient.ts';
export { createClientFromRequest } from './createClientFromRequest.ts';
export type {
  SampleRecord,
  ManifestRecord,
  StudyRecord,
  AuditEventRecord,
  EthicsApprovalRecord,
  TransferRecord,
  ReturnRecord,
  ReconciliationRecord,
  PaneViewData,
  ManagementOverlayData,
  ManagerEffortEntry,
  CapacityForecast,
} from '../data/types/mod.ts';

import { SampleMgmtAPIClient, type SampleMgmtClientOptions } from './SampleMgmtAPIClient.ts';

export function createSampleMgmtClient(options: SampleMgmtClientOptions = {}): SampleMgmtAPIClient {
  return new SampleMgmtAPIClient(options);
}
