import type {
  SampleRecord,
  ManifestRecord,
  StudyRecord,
  AuditEventRecord,
  EthicsApprovalRecord,
  TransferRecord,
  ReturnRecord,
  ReconciliationRecord,
} from './types/mod.ts';

// ── OI-sourced seed data (13 records) ──────────────────────────────────

const SAMPLES: SampleRecord[] = [
  { SampleId: 'SMP-2026-88421-001', StudyId: 'BEACON-3', OriginSite: 'London Clinical Lab', ReceivedAt: '2026-04-16 09:15', Status: 'received', StorageLocation: 'Freezer A / Shelf 2 / Rack 3 / Box 7 / Pos 12', LastAction: 'Barcode scanned at receipt' },
  { SampleId: 'SMP-2026-88421-002', StudyId: 'BEACON-3', OriginSite: 'London Clinical Lab', ReceivedAt: '2026-04-16 09:15', Status: 'processing', StorageLocation: 'Lab Bench 4', LastAction: 'Aliquot in progress' },
  { SampleId: 'SMP-2026-87102-001', StudyId: 'MERIDIAN-1', OriginSite: 'GSK Stevenage', ReceivedAt: '2026-04-11 14:30', Status: 'in-storage', StorageLocation: 'Freezer B / Shelf 1 / Rack 5 / Box 2 / Pos 8', LastAction: 'Stored after processing' },
  { SampleId: 'SMP-2026-85200-003', StudyId: 'ATLAS-7', OriginSite: 'Philadelphia Research Center', ReceivedAt: '2026-04-05 10:00', Status: 'transferred', StorageLocation: '', LastAction: 'Transferred to GSK Ware' },
  { SampleId: 'SMP-2026-83100-001', StudyId: 'BEACON-3', OriginSite: 'London Clinical Lab', ReceivedAt: '2026-03-20 08:45', Status: 'disposed', StorageLocation: '', LastAction: 'Disposed -- HBSM custodian approved' },
  { SampleId: 'SMP-2026-83100-002', StudyId: 'MERIDIAN-1', OriginSite: 'GSK Stevenage', ReceivedAt: '2026-03-18 11:20', Status: 'depleted', StorageLocation: '', LastAction: 'Depleted -- scientist attestation' },
];

const MANIFESTS: ManifestRecord[] = [
  { ManifestId: 'MAN-2026-0412', StudyId: 'BEACON-3', ExpectedSamples: 48, Status: 'ready', ReceivedAt: '2026-04-12 09:15' },
  { ManifestId: 'MAN-2026-0411', StudyId: 'MERIDIAN-1', ExpectedSamples: 24, Status: 'attention', ReceivedAt: '2026-04-11 14:30' },
  { ManifestId: 'MAN-2026-0410', StudyId: 'ATLAS-7', ExpectedSamples: 12, Status: 'volume-hold', ReceivedAt: '2026-04-10 11:00' },
  { ManifestId: 'MAN-2026-0409', StudyId: 'BEACON-3', ExpectedSamples: 36, Status: 'problem', ReceivedAt: '2026-04-09 16:45' },
];

const STUDIES: StudyRecord[] = [
  { StudyId: 'BEACON-3', Label: 'BEACON-3 Phase III' },
  { StudyId: 'MERIDIAN-1', Label: 'MERIDIAN-1 Phase II' },
  { StudyId: 'ATLAS-7', Label: 'ATLAS-7 Phase I' },
];

// ── Web-app-owned seed data (15 records) ───────────────────────────────

const AUDIT_EVENTS: AuditEventRecord[] = [
  { EventId: 'EVT-0001', Timestamp: '2026-04-16 09:15:22', UserId: 'elena.martinez', ActionType: 'Scan', EntityType: 'Sample', EntityId: 'SMP-2026-88421-001', AlcoaPrinciple: 'Contemporaneous', Status: 'success' },
  { EventId: 'EVT-0002', Timestamp: '2026-04-16 09:12:05', UserId: 'elena.martinez', ActionType: 'Create', EntityType: 'Manifest', EntityId: 'MAN-2026-0412', AlcoaPrinciple: 'Original', Status: 'success' },
  { EventId: 'EVT-0003', Timestamp: '2026-04-16 09:10:00', UserId: 'system', ActionType: 'Create', EntityType: 'TemperatureLog', EntityId: 'TMP-SENSOR-04-2026-0416', AlcoaPrinciple: 'Contemporaneous', Status: 'success' },
  { EventId: 'EVT-0004', Timestamp: '2026-04-15 16:30:11', UserId: 'sarah.chen', ActionType: 'Approve', EntityType: 'EthicsApproval', EntityId: 'BEACON-3', AlcoaPrinciple: 'Attributable', Status: 'success' },
  { EventId: 'EVT-0005', Timestamp: '2026-04-15 14:22:33', UserId: 'james.wilson', ActionType: 'Approve', EntityType: 'Transfer', EntityId: 'TRF-2026-0087', AlcoaPrinciple: 'Attributable', Status: 'success' },
  { EventId: 'EVT-0006', Timestamp: '2026-04-15 11:05:47', UserId: 'system', ActionType: 'Update', EntityType: 'Manifest', EntityId: 'MAN-2026-0409', AlcoaPrinciple: 'Accurate', Status: 'failed' },
];

const ETHICS_APPROVALS: EthicsApprovalRecord[] = [
  { StudyId: 'ONCO-2024-03', Protocol: 'Phase III Oncology -- Biospecimen Collection', ApprovalDate: '2024-03-15', ExpiryDate: '2026-04-23', Status: 'expiring', DaysUntilExpiry: 7 },
  { StudyId: 'BEACON-3', Protocol: 'Phase III -- Circulating Tumor DNA Analysis', ApprovalDate: '2025-09-01', ExpiryDate: '2027-09-01', Status: 'active', DaysUntilExpiry: 503 },
  { StudyId: 'LEGACY-2023-01', Protocol: 'Phase II -- Archived Biobank Study', ApprovalDate: '2023-01-10', ExpiryDate: '2025-01-10', Status: 'expired', DaysUntilExpiry: 0 },
];

const TRANSFERS: TransferRecord[] = [
  { TransferId: 'TRF-2026-0087', Type: 'inter-site', SampleIds: ['SMP-2026-85200-003'], Source: 'Collegeville US', Destination: 'GSK Ware UK', RequestedBy: 'elena.martinez', RequestedAt: '2026-04-14 10:00', Status: 'ready', StatusReason: 'Approved -- courier confirmed', SlaDeadline: '2026-04-18 17:00', LastAction: 'Approved by custodian' },
  { TransferId: 'TRF-2026-0088', Type: 'inter-freezer', SampleIds: ['SMP-2026-88421-001'], Source: 'Freezer A / Shelf 2', Destination: 'Freezer C / Shelf 1', RequestedBy: 'elena.martinez', RequestedAt: '2026-04-15 14:30', Status: 'attention', StatusReason: 'Pending approval', SlaDeadline: '2026-04-17 17:00', LastAction: 'Awaiting custodian approval' },
  { TransferId: 'TRF-2026-0089', Type: 'inter-study', SampleIds: ['SMP-2026-87102-001'], Source: 'MERIDIAN-1', Destination: 'BEACON-3', RequestedBy: 'james.wilson', RequestedAt: '2026-04-13 09:00', Status: 'volume-hold', StatusReason: 'Transfer queue full', SlaDeadline: '2026-04-20 17:00', LastAction: 'Queued -- capacity constraint' },
  { TransferId: 'TRF-2026-0090', Type: 'inter-site', SampleIds: ['SMP-2026-88421-002'], Source: 'Collegeville US', Destination: 'GSK Stevenage UK', RequestedBy: 'elena.martinez', RequestedAt: '2026-04-08 11:00', Status: 'problem', StatusReason: 'Overdue -- SLA breached', SlaDeadline: '2026-04-12 17:00', LastAction: 'Escalated to lab manager' },
  { TransferId: 'TRF-2026-0091', Type: 'inter-freezer', SampleIds: ['SMP-2026-87102-001'], Source: 'Lab Bench 2', Destination: 'Freezer B / Shelf 1', RequestedBy: 'sarah.chen', RequestedAt: '2026-04-16 08:00', Status: 'ready', StatusReason: 'Return to storage approved', SlaDeadline: '2026-04-16 17:00', LastAction: 'Ready for pickup' },
  { TransferId: 'TRF-2026-0092', Type: 'inter-site', SampleIds: ['SMP-2026-83100-002'], Source: 'GSK Stevenage UK', Destination: 'Collegeville US', RequestedBy: 'james.wilson', RequestedAt: '2026-04-15 16:00', Status: 'attention', StatusReason: 'Courier booking pending', SlaDeadline: '2026-04-19 17:00', LastAction: 'Awaiting courier confirmation' },
];

const RETURNS: ReturnRecord[] = [
  { ReturnId: 'RET-2026-0001', SampleIds: ['SMP-2026-85200-003'], Destination: 'Philadelphia Research Center', Reason: 'Study ATLAS-7 closed -- return to sponsor', RequestedBy: 'dr.sarah.kumar', RequestedAt: '2026-04-14 11:30', Status: 'ready', PackagingInstructions: 'Ambient shipping, triple-wrapped', Outcome: 'returned', LastAction: 'Shipped via World Courier' },
  { ReturnId: 'RET-2026-0002', SampleIds: ['SMP-2026-88421-001', 'SMP-2026-88421-002'], Destination: 'London Clinical Lab', Reason: 'Additional analysis required at originating site', RequestedBy: 'dr.james.chen', RequestedAt: '2026-04-15 09:00', Status: 'attention', PackagingInstructions: 'Frozen shipping, dry ice required', LastAction: 'Awaiting custodian approval' },
  { ReturnId: 'RET-2026-0003', SampleIds: ['SMP-2026-87102-001'], Destination: 'GSK Stevenage', Reason: 'Scientist consumed sample in analysis', RequestedBy: 'dr.elena.martinez', RequestedAt: '2026-04-13 14:00', Status: 'ready', PackagingInstructions: '', Outcome: 'depleted', DepletionContext: 'Consumed in ctDNA extraction -- BEACON-3 biomarker panel', LastAction: 'Depletion attested by scientist' },
  { ReturnId: 'RET-2026-0004', SampleIds: ['SMP-2026-83100-001'], Destination: 'London Clinical Lab', Reason: 'Sample integrity issue -- return for re-analysis', RequestedBy: 'dr.sarah.kumar', RequestedAt: '2026-04-10 16:00', Status: 'problem', PackagingInstructions: 'Frozen shipping, temperature monitoring required', LastAction: 'Expired hold period -- escalated' },
  { ReturnId: 'RET-2026-0005', SampleIds: ['SMP-2026-83100-002'], Destination: 'GSK Ware UK', Reason: 'Biobank transfer per retention policy', RequestedBy: 'dr.james.chen', RequestedAt: '2026-04-16 10:00', Status: 'volume-hold', PackagingInstructions: 'Ambient, standard packaging', LastAction: 'Queued -- courier capacity full' },
];

const RECONCILIATIONS: ReconciliationRecord[] = [
  { ReconciliationId: 'REC-2026-0001', ManifestId: 'MAN-2026-0412', DiscrepancyType: 'count-mismatch', ExpectedCount: 48, ActualCount: 46, MissingFields: [], Status: 'ready', Resolution: '2 samples held at customs -- confirmed with courier', ResolvedBy: 'elena.martinez', ResolvedAt: '2026-04-13 15:00', SlaDeadline: '2026-04-14 17:00', LastAction: 'Resolved -- customs hold confirmed' },
  { ReconciliationId: 'REC-2026-0002', ManifestId: 'MAN-2026-0411', DiscrepancyType: 'metadata-gap', ExpectedCount: 24, ActualCount: 24, MissingFields: ['Subject', 'Visit'], Status: 'attention', SlaDeadline: '2026-04-19 17:00', LastAction: 'Awaiting site response for missing metadata' },
  { ReconciliationId: 'REC-2026-0003', ManifestId: 'MAN-2026-0409', DiscrepancyType: 'barcode-conflict', ExpectedCount: 36, ActualCount: 36, MissingFields: ['2D Barcode'], Status: 'problem', SlaDeadline: '2026-04-15 17:00', LastAction: 'Escalated -- duplicate 2D barcode across 2 tubes' },
  { ReconciliationId: 'REC-2026-0004', ManifestId: 'MAN-2026-0410', DiscrepancyType: 'format-error', ExpectedCount: 12, ActualCount: 12, MissingFields: ['Period'], Status: 'volume-hold', SlaDeadline: '2026-04-20 17:00', LastAction: 'Queued -- staff fully allocated' },
  { ReconciliationId: 'REC-2026-0005', ManifestId: 'MAN-2026-0412', DiscrepancyType: 'count-mismatch', ExpectedCount: 48, ActualCount: 47, MissingFields: [], Status: 'attention', SlaDeadline: '2026-04-18 17:00', LastAction: '1 unlabeled tube under investigation' },
];

// ── Seed functions ─────────────────────────────────────────────────────

export async function seedOIData(kv: Deno.Kv): Promise<number> {
  let count = 0;

  for (const sample of SAMPLES) {
    await kv.set(['Samples', sample.SampleId], sample);
    count++;
  }

  for (const manifest of MANIFESTS) {
    await kv.set(['Manifests', manifest.ManifestId], manifest);
    count++;
  }

  for (const study of STUDIES) {
    await kv.set(['Studies', study.StudyId], study);
    count++;
  }

  return count;
}

export async function seedWorkflowData(kv: Deno.Kv): Promise<number> {
  let count = 0;

  for (const event of AUDIT_EVENTS) {
    await kv.set(['AuditEvents', event.EventId], event);
    count++;
  }

  for (const approval of ETHICS_APPROVALS) {
    await kv.set(['EthicsApprovals', approval.StudyId], approval);
    count++;
  }

  for (const transfer of TRANSFERS) {
    await kv.set(['Transfers', transfer.TransferId], transfer);
    count++;
  }

  for (const ret of RETURNS) {
    await kv.set(['Returns', ret.ReturnId], ret);
    count++;
  }

  for (const rec of RECONCILIATIONS) {
    await kv.set(['Reconciliations', rec.ReconciliationId], rec);
    count++;
  }

  return count;
}
