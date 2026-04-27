import type { SampleRecord } from "./types/SampleRecord.ts";
import type { ManifestRecord } from "./types/ManifestRecord.ts";
import type { StudyRecord } from "./types/StudyRecord.ts";
import type { EthicsApprovalRecord } from "./types/EthicsApprovalRecord.ts";
import type { AuditEventRecord } from "./types/AuditEventRecord.ts";
import type { TransferRecord } from "./types/TransferRecord.ts";
import type { ReturnRecord } from "./types/ReturnRecord.ts";
import type { ReconciliationRecord } from "./types/ReconciliationRecord.ts";
import type { DispositionRecord } from "./types/DispositionRecord.ts";
import type { ReviewRecord } from "./types/ReviewRecord.ts";
import type { NotificationRecord } from "./types/NotificationRecord.ts";
import type { ApprovalRecord } from "./types/ApprovalRecord.ts";
import type { StudyRoleMappingRecord } from "./types/StudyRoleMappingRecord.ts";

// ── OI-sourced seed data (13 records) ──────────────────────────────────

const SAMPLES: SampleRecord[] = [
  {
    SampleId: "SMP-2026-88421-001",
    StudyId: "BEACON-3",
    OriginSite: "London Clinical Lab",
    ReceivedAt: "2026-04-16 09:15",
    Status: "received",
    StorageLocation: "Freezer A / Shelf 2 / Rack 3 / Box 7 / Pos 12",
    LastAction: "Barcode scanned at receipt",
  },
  {
    SampleId: "SMP-2026-88421-002",
    StudyId: "BEACON-3",
    OriginSite: "London Clinical Lab",
    ReceivedAt: "2026-04-16 09:15",
    Status: "processing",
    StorageLocation: "Lab Bench 4",
    LastAction: "Aliquot in progress",
  },
  {
    SampleId: "SMP-2026-87102-001",
    StudyId: "MERIDIAN-1",
    OriginSite: "GSK Stevenage",
    ReceivedAt: "2026-04-11 14:30",
    Status: "in-storage",
    StorageLocation: "Freezer B / Shelf 1 / Rack 5 / Box 2 / Pos 8",
    LastAction: "Stored after processing",
  },
  {
    SampleId: "SMP-2026-85200-003",
    StudyId: "ATLAS-7",
    OriginSite: "Philadelphia Research Center",
    ReceivedAt: "2026-04-05 10:00",
    Status: "transferred",
    StorageLocation: "",
    LastAction: "Transferred to GSK Ware",
  },
  {
    SampleId: "SMP-2026-83100-001",
    StudyId: "BEACON-3",
    OriginSite: "London Clinical Lab",
    ReceivedAt: "2026-03-20 08:45",
    Status: "disposed",
    StorageLocation: "",
    LastAction: "Disposed -- HBSM custodian approved",
  },
  {
    SampleId: "SMP-2026-83100-002",
    StudyId: "MERIDIAN-1",
    OriginSite: "GSK Stevenage",
    ReceivedAt: "2026-03-18 11:20",
    Status: "depleted",
    StorageLocation: "",
    LastAction: "Depleted -- scientist attestation",
  },
];

const MANIFESTS: ManifestRecord[] = [
  {
    ManifestId: "MAN-2026-0412",
    StudyId: "BEACON-3",
    ExpectedSamples: 48,
    Status: "ready",
    ReceivedAt: "2026-04-12 09:15",
  },
  {
    ManifestId: "MAN-2026-0411",
    StudyId: "MERIDIAN-1",
    ExpectedSamples: 24,
    Status: "attention",
    ReceivedAt: "2026-04-11 14:30",
  },
  {
    ManifestId: "MAN-2026-0410",
    StudyId: "ATLAS-7",
    ExpectedSamples: 12,
    Status: "volume-hold",
    ReceivedAt: "2026-04-10 11:00",
  },
  {
    ManifestId: "MAN-2026-0409",
    StudyId: "BEACON-3",
    ExpectedSamples: 36,
    Status: "problem",
    ReceivedAt: "2026-04-09 16:45",
  },
];

const STUDIES: StudyRecord[] = [
  { StudyId: "BEACON-3", Label: "BEACON-3 Phase III" },
  { StudyId: "MERIDIAN-1", Label: "MERIDIAN-1 Phase II" },
  { StudyId: "ATLAS-7", Label: "ATLAS-7 Phase I" },
];

const ETHICS_APPROVALS: EthicsApprovalRecord[] = [
  {
    StudyId: "ONCO-2024-03",
    Protocol: "Phase III Oncology -- Biospecimen Collection",
    ApprovalDate: "2024-03-15",
    ExpiryDate: "2026-04-23",
    Status: "expiring",
    DaysUntilExpiry: 7,
  },
  {
    StudyId: "BEACON-3",
    Protocol: "Phase III -- Circulating Tumor DNA Analysis",
    ApprovalDate: "2025-09-01",
    ExpiryDate: "2027-09-01",
    Status: "active",
    DaysUntilExpiry: 503,
  },
  {
    StudyId: "LEGACY-2023-01",
    Protocol: "Phase II -- Archived Biobank Study",
    ApprovalDate: "2023-01-10",
    ExpiryDate: "2025-01-10",
    Status: "expired",
    DaysUntilExpiry: 0,
  },
];

// ── Web-app-owned seed data ───────────────────────────────────────────

const AUDIT_EVENTS: AuditEventRecord[] = [
  {
    EventId: "EVT-0001",
    Timestamp: "2026-04-16 09:15:22",
    UserId: "liora.vasquez",
    ActionType: "Scan",
    EntityType: "Sample",
    EntityId: "SMP-2026-88421-001",
    AlcoaPrinciple: "Contemporaneous",
    Status: "success",
  },
  {
    EventId: "EVT-0002",
    Timestamp: "2026-04-16 09:12:05",
    UserId: "liora.vasquez",
    ActionType: "Create",
    EntityType: "Manifest",
    EntityId: "MAN-2026-0412",
    AlcoaPrinciple: "Original",
    Status: "success",
  },
  {
    EventId: "EVT-0003",
    Timestamp: "2026-04-16 09:10:00",
    UserId: "system",
    ActionType: "Create",
    EntityType: "TemperatureLog",
    EntityId: "TMP-SENSOR-04-2026-0416",
    AlcoaPrinciple: "Contemporaneous",
    Status: "success",
  },
  {
    EventId: "EVT-0004",
    Timestamp: "2026-04-15 16:30:11",
    UserId: "priya.lindqvist",
    ActionType: "Approve",
    EntityType: "EthicsApproval",
    EntityId: "BEACON-3",
    AlcoaPrinciple: "Attributable",
    Status: "success",
  },
  {
    EventId: "EVT-0005",
    Timestamp: "2026-04-15 14:22:33",
    UserId: "declan.okafor",
    ActionType: "Approve",
    EntityType: "Transfer",
    EntityId: "TRF-2026-0087",
    AlcoaPrinciple: "Attributable",
    Status: "success",
  },
  {
    EventId: "EVT-0006",
    Timestamp: "2026-04-15 11:05:47",
    UserId: "system",
    ActionType: "Update",
    EntityType: "Manifest",
    EntityId: "MAN-2026-0409",
    AlcoaPrinciple: "Accurate",
    Status: "failed",
  },
  {
    EventId: "EVT-0007",
    Timestamp: "2026-04-15 10:00:00",
    UserId: "annika.desrosiers",
    ActionType: "Export",
    EntityType: "AuditTrail",
    EntityId: "EXPORT-2026-0415",
    AlcoaPrinciple: "Legible",
    Status: "success",
  },
  {
    EventId: "EVT-0008",
    Timestamp: "2026-04-14 23:00:00",
    UserId: "system",
    ActionType: "Archive",
    EntityType: "Manifest",
    EntityId: "MAN-2026-0408",
    AlcoaPrinciple: "Enduring",
    Status: "success",
  },
  {
    EventId: "EVT-0009",
    Timestamp: "2026-04-14 08:30:00",
    UserId: "dr.priya.lindqvist",
    ActionType: "Grant",
    EntityType: "AccessRight",
    EntityId: "renata.solberg",
    AlcoaPrinciple: "Available",
    Status: "success",
  },
  {
    EventId: "EVT-0010",
    Timestamp: "2026-04-16 09:05:00",
    UserId: "liora.vasquez",
    ActionType: "Create",
    EntityType: "ManifestLine",
    EntityId: "SMP-2026-88421-001",
    AlcoaPrinciple: "Original",
    Status: "success",
  },
  {
    EventId: "EVT-0011",
    Timestamp: "2026-04-16 10:30:00",
    UserId: "liora.vasquez",
    ActionType: "StatusUpdate",
    EntityType: "Sample",
    EntityId: "SMP-2026-88421-001",
    AlcoaPrinciple: "Contemporaneous",
    Status: "success",
  },
  {
    EventId: "EVT-0012",
    Timestamp: "2026-04-16 14:00:00",
    UserId: "declan.okafor",
    ActionType: "Approve",
    EntityType: "CustodyTransfer",
    EntityId: "SMP-2026-88421-001",
    AlcoaPrinciple: "Attributable",
    Status: "success",
  },
  {
    EventId: "EVT-0013",
    Timestamp: "2026-04-17 08:45:00",
    UserId: "annika.desrosiers",
    ActionType: "Audit",
    EntityType: "Sample",
    EntityId: "SMP-2026-88421-001",
    AlcoaPrinciple: "Enduring",
    Status: "success",
  },
];

const TRANSFERS: TransferRecord[] = [
  {
    TransferId: "TRF-2026-0087",
    Type: "inter-site",
    SampleIds: ["SMP-2026-85200-003"],
    Source: "Collegeville US",
    Destination: "GSK Ware UK",
    RequestedBy: "liora.vasquez",
    RequestedAt: "2026-04-14 10:00",
    Status: "ready",
    StatusReason: "Approved -- courier confirmed",
    SlaDeadline: "2026-04-18 17:00",
    LastAction: "Approved by custodian",
  },
  {
    TransferId: "TRF-2026-0088",
    Type: "inter-freezer",
    SampleIds: ["SMP-2026-88421-001"],
    Source: "Freezer A / Shelf 2",
    Destination: "Freezer C / Shelf 1",
    RequestedBy: "liora.vasquez",
    RequestedAt: "2026-04-15 14:30",
    Status: "attention",
    StatusReason: "Pending approval",
    SlaDeadline: "2026-04-17 17:00",
    LastAction: "Awaiting custodian approval",
  },
  {
    TransferId: "TRF-2026-0089",
    Type: "inter-study",
    SampleIds: ["SMP-2026-87102-001"],
    Source: "MERIDIAN-1",
    Destination: "BEACON-3",
    RequestedBy: "declan.okafor",
    RequestedAt: "2026-04-13 09:00",
    Status: "volume-hold",
    StatusReason: "Transfer queue full",
    SlaDeadline: "2026-04-20 17:00",
    LastAction: "Queued -- capacity constraint",
  },
  {
    TransferId: "TRF-2026-0090",
    Type: "inter-site",
    SampleIds: ["SMP-2026-88421-002"],
    Source: "Collegeville US",
    Destination: "GSK Stevenage UK",
    RequestedBy: "liora.vasquez",
    RequestedAt: "2026-04-08 11:00",
    Status: "problem",
    StatusReason: "Overdue -- SLA breached",
    SlaDeadline: "2026-04-12 17:00",
    LastAction: "Escalated to lab manager",
  },
  {
    TransferId: "TRF-2026-0091",
    Type: "inter-freezer",
    SampleIds: ["SMP-2026-87102-001"],
    Source: "Lab Bench 2",
    Destination: "Freezer B / Shelf 1",
    RequestedBy: "priya.lindqvist",
    RequestedAt: "2026-04-16 08:00",
    Status: "ready",
    StatusReason: "Return to storage approved",
    SlaDeadline: "2026-04-16 17:00",
    LastAction: "Ready for pickup",
  },
  {
    TransferId: "TRF-2026-0092",
    Type: "inter-site",
    SampleIds: ["SMP-2026-83100-002"],
    Source: "GSK Stevenage UK",
    Destination: "Collegeville US",
    RequestedBy: "declan.okafor",
    RequestedAt: "2026-04-15 16:00",
    Status: "attention",
    StatusReason: "Courier booking pending",
    SlaDeadline: "2026-04-19 17:00",
    LastAction: "Awaiting courier confirmation",
  },
];

const RETURNS: ReturnRecord[] = [
  {
    ReturnId: "RET-2026-0001",
    SampleIds: ["SMP-2026-85200-003"],
    Destination: "Philadelphia Research Center",
    Reason: "Study ATLAS-7 closed -- return to sponsor",
    RequestedBy: "dr.yara.brennan",
    RequestedAt: "2026-04-14 11:30",
    Status: "ready",
    PackagingInstructions: "Ambient shipping, triple-wrapped",
    Outcome: "returned",
    LastAction: "Shipped via World Courier",
  },
  {
    ReturnId: "RET-2026-0002",
    SampleIds: ["SMP-2026-88421-001", "SMP-2026-88421-002"],
    Destination: "London Clinical Lab",
    Reason: "Additional analysis required at originating site",
    RequestedBy: "dr.tobias.nakamura",
    RequestedAt: "2026-04-15 09:00",
    Status: "attention",
    PackagingInstructions: "Frozen shipping, dry ice required",
    LastAction: "Awaiting custodian approval",
  },
  {
    ReturnId: "RET-2026-0003",
    SampleIds: ["SMP-2026-87102-001"],
    Destination: "GSK Stevenage",
    Reason: "Scientist consumed sample in analysis",
    RequestedBy: "dr.liora.vasquez",
    RequestedAt: "2026-04-13 14:00",
    Status: "ready",
    PackagingInstructions: "",
    Outcome: "depleted",
    DepletionContext:
      "Consumed in ctDNA extraction -- BEACON-3 biomarker panel",
    LastAction: "Depletion attested by scientist",
  },
  {
    ReturnId: "RET-2026-0004",
    SampleIds: ["SMP-2026-83100-001"],
    Destination: "London Clinical Lab",
    Reason: "Sample integrity issue -- return for re-analysis",
    RequestedBy: "dr.yara.brennan",
    RequestedAt: "2026-04-10 16:00",
    Status: "problem",
    PackagingInstructions: "Frozen shipping, temperature monitoring required",
    LastAction: "Expired hold period -- escalated",
  },
  {
    ReturnId: "RET-2026-0005",
    SampleIds: ["SMP-2026-83100-002"],
    Destination: "GSK Ware UK",
    Reason: "Biobank transfer per retention policy",
    RequestedBy: "dr.tobias.nakamura",
    RequestedAt: "2026-04-16 10:00",
    Status: "volume-hold",
    PackagingInstructions: "Ambient, standard packaging",
    LastAction: "Queued -- courier capacity full",
  },
];

const RECONCILIATIONS: ReconciliationRecord[] = [
  {
    ReconciliationId: "REC-2026-0001",
    ManifestId: "MAN-2026-0412",
    DiscrepancyType: "count-mismatch",
    ExpectedCount: 48,
    ActualCount: 46,
    MissingFields: [],
    Status: "ready",
    Resolution: "2 samples held at customs -- confirmed with courier",
    ResolvedBy: "liora.vasquez",
    ResolvedAt: "2026-04-13 15:00",
    SlaDeadline: "2026-04-14 17:00",
    LastAction: "Resolved -- customs hold confirmed",
  },
  {
    ReconciliationId: "REC-2026-0002",
    ManifestId: "MAN-2026-0411",
    DiscrepancyType: "metadata-gap",
    ExpectedCount: 24,
    ActualCount: 24,
    MissingFields: ["Subject", "Visit"],
    Status: "attention",
    SlaDeadline: "2026-04-19 17:00",
    LastAction: "Awaiting site response for missing metadata",
  },
  {
    ReconciliationId: "REC-2026-0003",
    ManifestId: "MAN-2026-0409",
    DiscrepancyType: "barcode-conflict",
    ExpectedCount: 36,
    ActualCount: 36,
    MissingFields: ["2D Barcode"],
    Status: "problem",
    SlaDeadline: "2026-04-15 17:00",
    LastAction: "Escalated -- duplicate 2D barcode across 2 tubes",
  },
  {
    ReconciliationId: "REC-2026-0004",
    ManifestId: "MAN-2026-0410",
    DiscrepancyType: "format-error",
    ExpectedCount: 12,
    ActualCount: 12,
    MissingFields: ["Period"],
    Status: "volume-hold",
    SlaDeadline: "2026-04-20 17:00",
    LastAction: "Queued -- staff fully allocated",
  },
  {
    ReconciliationId: "REC-2026-0005",
    ManifestId: "MAN-2026-0412",
    DiscrepancyType: "count-mismatch",
    ExpectedCount: 48,
    ActualCount: 47,
    MissingFields: [],
    Status: "attention",
    SlaDeadline: "2026-04-18 17:00",
    LastAction: "1 unlabeled tube under investigation",
  },
];

const DISPOSITIONS: DispositionRecord[] = [
  {
    DispositionId: "DSP-2026-0001",
    SampleId: "SMP-2026-83100-001",
    Decision: "destroy",
    Status: "ready",
    FinalReportDate: "2026-01-15",
    DispositionDeadline: "2026-04-15 17:00",
    TreatmentStatus: "unblinded",
    CustodianSignoff: {
      SignedBy: "dr.yara.brennan",
      SignedAt: "2026-04-10 14:00",
    },
    TwoPersonAuth: {
      ScannedBy: "liora.vasquez",
      VerifiedBy: "declan.okafor",
      At: "2026-04-10 14:15",
    },
    EvidenceDocuments: [{
      Name: "Destruction Certificate",
      Url: "/docs/DSP-2026-0001-cert.pdf",
    }],
    LastAction: "Disposed -- two-person auth complete",
  },
  {
    DispositionId: "DSP-2026-0002",
    SampleId: "SMP-2026-87102-001",
    Decision: "retain",
    Status: "attention",
    FinalReportDate: "2026-03-01",
    DispositionDeadline: "2026-06-01 17:00",
    TreatmentStatus: "unblinded",
    EvidenceDocuments: [],
    LastAction: "Awaiting custodian approval for biobank routing",
  },
  {
    DispositionId: "DSP-2026-0003",
    SampleId: "SMP-2026-83100-002",
    Decision: "deplete",
    Status: "ready",
    FinalReportDate: "2026-02-20",
    DispositionDeadline: "2026-05-20 17:00",
    EvidenceDocuments: [{
      Name: "Scientist Attestation",
      Url: "/docs/DSP-2026-0003-attest.pdf",
    }],
    LastAction: "Depletion attested -- ctDNA extraction for MERIDIAN-1",
  },
  {
    DispositionId: "DSP-2026-0004",
    SampleId: "SMP-2026-85200-003",
    Decision: "pending",
    Status: "volume-hold",
    FinalReportDate: "2026-04-01",
    DispositionDeadline: "2026-07-01 17:00",
    TreatmentStatus: "blinded",
    EvidenceDocuments: [],
    LastAction: "Queued -- disposition batch not yet scheduled",
  },
  {
    DispositionId: "DSP-2026-0005",
    SampleId: "SMP-2026-88421-002",
    Decision: "destroy",
    Status: "problem",
    FinalReportDate: "2026-02-01",
    DispositionDeadline: "2026-05-01 17:00",
    TreatmentStatus: "unblinded",
    EvidenceDocuments: [],
    LastAction:
      "Overdue -- destruction deadline approaching without custodian signoff",
  },
];

const REVIEWS: ReviewRecord[] = [
  {
    ReviewId: "REV-2026-0001",
    Type: "reception",
    EntityId: "SMP-2026-83100-001",
    Status: "pending",
    ValidationResult: "warnings",
    ExceptionFlags: ["Temperature deviation logged"],
    SubmittedBy: "liora.vasquez",
    SubmittedAt: "2026-04-16 09:30",
    LastAction: "System validation flagged temperature deviation",
  },
  {
    ReviewId: "REV-2026-0002",
    Type: "reconciliation",
    EntityId: "REC-2026-0001",
    Status: "pending",
    ValidationResult: "failed",
    ExceptionFlags: [
      "Count mismatch: expected 5, found 4",
      "Barcode scan failed",
    ],
    SubmittedBy: "liora.vasquez",
    SubmittedAt: "2026-04-14 14:00",
    LastAction: "System validation failed — multiple exceptions",
  },
  {
    ReviewId: "REV-2026-0003",
    Type: "disposition",
    EntityId: "DSP-2026-0002",
    Status: "approved",
    ValidationResult: "warnings",
    ExceptionFlags: ["Approaching retention deadline"],
    SubmittedBy: "declan.okafor",
    SubmittedAt: "2026-04-13 10:00",
    ReviewedBy: "liora.vasquez",
    ReviewedAt: "2026-04-13 14:30",
    Decision: "approved",
    LastAction: "Approved by liora.vasquez",
  },
  {
    ReviewId: "REV-2026-0004",
    Type: "reception",
    EntityId: "SMP-2026-87102-001",
    Status: "rejected",
    ValidationResult: "failed",
    ExceptionFlags: ["Missing chain-of-custody form"],
    SubmittedBy: "priya.lindqvist",
    SubmittedAt: "2026-04-12 11:00",
    ReviewedBy: "liora.vasquez",
    ReviewedAt: "2026-04-12 16:00",
    Decision: "rejected",
    LastAction: "Rejected by liora.vasquez — incomplete documentation",
  },
  {
    ReviewId: "REV-2026-0005",
    Type: "reconciliation",
    EntityId: "REC-2026-0003",
    Status: "escalated",
    ValidationResult: "failed",
    ExceptionFlags: ["Duplicate barcode detected", "Study protocol mismatch"],
    SubmittedBy: "declan.okafor",
    SubmittedAt: "2026-04-11 09:00",
    ReviewedBy: "liora.vasquez",
    ReviewedAt: "2026-04-11 15:00",
    Decision: "escalated",
    LastAction: "Escalated by liora.vasquez — requires CSV Group Head review",
  },
];

const NOTIFICATIONS: NotificationRecord[] = [
  {
    NotificationId: "NTF-0001",
    UserId: "liora.vasquez",
    Type: "approval-request",
    EntityType: "Review",
    EntityId: "REV-2026-0001",
    Message:
      "Review REV-2026-0001 requires your approval — temperature deviation flagged",
    Read: false,
    CreatedAt: "2026-04-16 10:00",
    ActionUrl: "/review",
  },
  {
    NotificationId: "NTF-0002",
    UserId: "liora.vasquez",
    Type: "deadline-approaching",
    EntityType: "Disposition",
    EntityId: "DSP-2026-0005",
    Message:
      "Disposition DSP-2026-0005 deadline approaching — destruction overdue",
    Read: false,
    CreatedAt: "2026-04-16 08:00",
    ActionUrl: "/disposition",
  },
  {
    NotificationId: "NTF-0003",
    UserId: "liora.vasquez",
    Type: "status-change",
    EntityType: "Transfer",
    EntityId: "TRF-2026-0090",
    Message: "Transfer TRF-2026-0090 escalated — SLA breached",
    Read: true,
    CreatedAt: "2026-04-15 17:00",
    ActionUrl: "/transfer",
  },
  {
    NotificationId: "NTF-0004",
    UserId: "liora.vasquez",
    Type: "escalation",
    EntityType: "Reconciliation",
    EntityId: "REC-2026-0003",
    Message:
      "Reconciliation REC-2026-0003 escalated — duplicate barcode requires CSV Group Head review",
    Read: false,
    CreatedAt: "2026-04-15 12:00",
    ActionUrl: "/reconciliation",
  },
  {
    NotificationId: "NTF-0005",
    UserId: "declan.okafor",
    Type: "approval-request",
    EntityType: "Review",
    EntityId: "REV-2026-0002",
    Message:
      "Review REV-2026-0002 requires your approval — count mismatch and barcode scan failure",
    Read: false,
    CreatedAt: "2026-04-14 15:00",
    ActionUrl: "/review",
  },
  {
    NotificationId: "NTF-0006",
    UserId: "declan.okafor",
    Type: "status-change",
    EntityType: "Review",
    EntityId: "REV-2026-0003",
    Message: "Review REV-2026-0003 approved by liora.vasquez",
    Read: true,
    CreatedAt: "2026-04-13 14:30",
    ActionUrl: "/review",
  },
  {
    NotificationId: "NTF-0007",
    UserId: "annika.desrosiers",
    Type: "deadline-approaching",
    EntityType: "EthicsApproval",
    EntityId: "ONCO-2024-03",
    Message:
      "Ethics approval ONCO-2024-03 expires in 7 days — renewal required",
    Read: false,
    CreatedAt: "2026-04-16 07:00",
    ActionUrl: "/report/ethics-approval",
  },
  {
    NotificationId: "NTF-0008",
    UserId: "renata.solberg",
    Type: "status-change",
    EntityType: "Sample",
    EntityId: "SMP-2026-88421-001",
    Message: "Sample SMP-2026-88421-001 received at London Clinical Lab",
    Read: false,
    CreatedAt: "2026-04-16 09:30",
    ActionUrl: "/track/samples",
  },
  {
    NotificationId: "NTF-0009",
    UserId: "dr.emile.kowalczyk",
    Type: "escalation",
    EntityType: "Review",
    EntityId: "REV-2026-0005",
    Message: "Review REV-2026-0005 escalated — requires CSV Group Head review",
    Read: false,
    CreatedAt: "2026-04-15 16:00",
    ActionUrl: "/reconciliation",
  },
];

const STUDY_ROLE_MAPPINGS: StudyRoleMappingRecord[] = [
  {
    MappingId: "SRM-BEACON3-hbsm_custodian",
    StudyId: "BEACON-3",
    Role: "hbsm_custodian",
    UserIds: ["declan.okafor"],
  },
  {
    MappingId: "SRM-BEACON3-lab_manager",
    StudyId: "BEACON-3",
    Role: "lab_manager",
    UserIds: ["priya.lindqvist"],
  },
  {
    MappingId: "SRM-BEACON3-study_lead",
    StudyId: "BEACON-3",
    Role: "study_lead",
    UserIds: ["renata.solberg"],
  },
  {
    MappingId: "SRM-MERIDIAN1-hbsm_custodian",
    StudyId: "MERIDIAN-1",
    Role: "hbsm_custodian",
    UserIds: ["declan.okafor"],
  },
  {
    MappingId: "SRM-MERIDIAN1-lab_manager",
    StudyId: "MERIDIAN-1",
    Role: "lab_manager",
    UserIds: ["priya.lindqvist"],
  },
  {
    MappingId: "SRM-MERIDIAN1-study_lead",
    StudyId: "MERIDIAN-1",
    Role: "study_lead",
    UserIds: ["dr.tobias.nakamura"],
  },
  {
    MappingId: "SRM-ATLAS7-hbsm_custodian",
    StudyId: "ATLAS-7",
    Role: "hbsm_custodian",
    UserIds: ["declan.okafor"],
  },
  {
    MappingId: "SRM-ATLAS7-lab_manager",
    StudyId: "ATLAS-7",
    Role: "lab_manager",
    UserIds: ["priya.lindqvist"],
  },
  {
    MappingId: "SRM-ATLAS7-study_lead",
    StudyId: "ATLAS-7",
    Role: "study_lead",
    UserIds: ["dr.yara.brennan"],
  },
];

const APPROVALS: ApprovalRecord[] = [
  {
    ApprovalId: "APR-0001",
    Type: "disposition",
    RecordId: "DSP-2026-0002",
    StudyRef: "MERIDIAN-1",
    InitiatedBy: "liora.vasquez",
    InitiatedAt: "2026-04-15 10:00",
    AssignedTo: ["declan.okafor"],
    Status: "pending",
    Context: { Decision: "retain", SampleId: "SMP-2026-87102-001" },
  },
  {
    ApprovalId: "APR-0002",
    Type: "transfer",
    RecordId: "TRF-2026-0088",
    StudyRef: "BEACON-3",
    InitiatedBy: "liora.vasquez",
    InitiatedAt: "2026-04-15 14:45",
    AssignedTo: ["declan.okafor"],
    Status: "pending",
    Context: {
      Type: "inter-freezer",
      Source: "Freezer A / Shelf 2",
      Destination: "Freezer C / Shelf 1",
    },
  },
  {
    ApprovalId: "APR-0003",
    Type: "disposition",
    RecordId: "DSP-2026-0001",
    StudyRef: "ATLAS-7",
    InitiatedBy: "liora.vasquez",
    InitiatedAt: "2026-04-09 09:00",
    AssignedTo: ["declan.okafor"],
    Status: "approved",
    Decision: {
      DecidedBy: "declan.okafor",
      Decision: "approved",
      Timestamp: "2026-04-10 14:00",
    },
    Context: { Decision: "destroy", SampleId: "SMP-2026-83100-001" },
  },
  {
    ApprovalId: "APR-0004",
    Type: "return-confirmation",
    RecordId: "RET-2026-0002",
    StudyRef: "BEACON-3",
    InitiatedBy: "declan.okafor",
    InitiatedAt: "2026-04-15 09:30",
    AssignedTo: ["dr.tobias.nakamura"],
    Status: "pending",
    Context: {
      Destination: "London Clinical Lab",
      Reason: "Additional analysis required",
    },
  },
];

// ── Seed functions ─────────────────────────────────────────────────────

export async function seedOIData(kv: Deno.Kv): Promise<number> {
  let count = 0;

  for (const sample of SAMPLES) {
    await kv.set(["Samples", sample.SampleId], sample);
    count++;
  }

  for (const manifest of MANIFESTS) {
    await kv.set(["Manifests", manifest.ManifestId], manifest);
    count++;
  }

  for (const study of STUDIES) {
    await kv.set(["Studies", study.StudyId], study);
    count++;
  }

  for (const approval of ETHICS_APPROVALS) {
    await kv.set(["EthicsApprovals", approval.StudyId], approval);
    count++;
  }

  return count;
}

export async function seedWorkflowData(kv: Deno.Kv): Promise<number> {
  let count = 0;

  for (const event of AUDIT_EVENTS) {
    await kv.set(["AuditEvents", event.EventId], event);
    count++;
  }

  for (const transfer of TRANSFERS) {
    await kv.set(["Transfers", transfer.TransferId], transfer);
    count++;
  }

  for (const ret of RETURNS) {
    await kv.set(["Returns", ret.ReturnId], ret);
    count++;
  }

  for (const rec of RECONCILIATIONS) {
    await kv.set(["Reconciliations", rec.ReconciliationId], rec);
    count++;
  }

  for (const disp of DISPOSITIONS) {
    await kv.set(["Dispositions", disp.DispositionId], disp);
    count++;
  }

  for (const review of REVIEWS) {
    await kv.set(["Reviews", review.ReviewId], review);
    count++;
  }

  for (const notification of NOTIFICATIONS) {
    await kv.set(["Notifications", notification.NotificationId], notification);
    count++;
  }

  for (const mapping of STUDY_ROLE_MAPPINGS) {
    await kv.set(["StudyRoleMappings", mapping.MappingId], mapping);
    count++;
  }

  for (const approval of APPROVALS) {
    await kv.set(["Approvals", approval.ApprovalId], approval);
    count++;
  }

  return count;
}
