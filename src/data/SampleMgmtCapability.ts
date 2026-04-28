// deno-lint-ignore-file require-await
import { Capability } from '@fathym/steward/capabilities';
import { z } from 'zod';
import type { AuditEventRecord } from './types/AuditEventRecord.ts';
import type { TransferRecord } from './types/TransferRecord.ts';
import type { ReturnRecord } from './types/ReturnRecord.ts';
import type { ReconciliationRecord } from './types/ReconciliationRecord.ts';
import type { DispositionRecord } from './types/DispositionRecord.ts';
import type { ReviewRecord } from './types/ReviewRecord.ts';
import type { NotificationRecord } from './types/NotificationRecord.ts';
import type { ApprovalRecord } from './types/ApprovalRecord.ts';
import type { StudyRoleMappingRecord } from './types/StudyRoleMappingRecord.ts';
import { seedWorkflowData } from './seed.ts';

export type SampleMgmtHooks = {
  ListAuditEvents(
    filter?: { UserId?: string; ActionType?: string },
  ): Promise<AuditEventRecord[]>;
  CreateAuditEvent(
    data: Omit<AuditEventRecord, 'EventId'>,
  ): Promise<AuditEventRecord>;
  ListTransfers(
    filter?: { Type?: string; Status?: string },
  ): Promise<TransferRecord[]>;
  ListReturns(): Promise<ReturnRecord[]>;
  ListReconciliations(): Promise<ReconciliationRecord[]>;
  ListDispositions(): Promise<DispositionRecord[]>;
  ListReviews(filter?: { Status?: string }): Promise<ReviewRecord[]>;
  DecideReview(
    reviewId: string,
    decision: 'approved' | 'rejected' | 'escalated',
    userId: string,
    reason?: string,
  ): Promise<ReviewRecord>;
  ListNotifications(userId: string): Promise<NotificationRecord[]>;
  MarkNotificationAsRead(notificationId: string): Promise<NotificationRecord>;
  CreateNotification(
    data: Omit<NotificationRecord, 'NotificationId'>,
  ): Promise<NotificationRecord>;
  ListStudyRoleMappings(
    studyId?: string,
  ): Promise<StudyRoleMappingRecord[]>;
  GetApproversForStudy(
    studyId: string,
    role: string,
  ): Promise<string[]>;
  ListApprovals(
    filter?: { Status?: string; Type?: string },
  ): Promise<ApprovalRecord[]>;
  InitiateApproval(data: {
    Type: ApprovalRecord['Type'];
    RecordId: string;
    StudyRef: string;
    InitiatedBy: string;
    Context: Record<string, unknown>;
  }): Promise<ApprovalRecord>;
  RecordApprovalDecision(
    approvalId: string,
    decision: 'approved' | 'rejected' | 'escalated',
    userId: string,
    reason?: string,
  ): Promise<ApprovalRecord>;
  CreateTransfer(data: {
    Type: TransferRecord['Type'];
    SampleIds: string[];
    Source: string;
    Destination: string;
    RequestedBy: string;
    StudyRef: string;
    StatusReason: string;
    SlaDeadline: string;
  }): Promise<TransferRecord>;
  UpdateTransferStatus(
    transferId: string,
    status: TransferRecord['Status'],
    statusReason: string,
    userId: string,
  ): Promise<TransferRecord>;
  CreateReturn(data: {
    SampleIds: string[];
    Destination: string;
    Reason: string;
    RequestedBy: string;
    PackagingInstructions: string;
    StudyRef: string;
  }): Promise<ReturnRecord>;
  UpdateReturnStatus(
    returnId: string,
    status: ReturnRecord['Status'],
    userId: string,
    outcome?: string,
    depletionContext?: string,
  ): Promise<ReturnRecord>;
  CreateReconciliation(data: {
    ManifestId: string;
    DiscrepancyType: string;
    ExpectedCount: number;
    ActualCount: number;
    MissingFields: string[];
    SlaDeadline: string;
    UserId: string;
  }): Promise<ReconciliationRecord>;
  ResolveReconciliation(
    reconciliationId: string,
    resolution: string,
    correctionReason: string,
    userId: string,
  ): Promise<ReconciliationRecord>;
  Seed(): Promise<{ Seeded: number }>;
};

export function SampleMgmtCapability() {
  return Capability('SampleMgmt', 'Web-app-owned workflow state')
    .Output(z.custom<SampleMgmtHooks>())
    .Execute(async () => {
      const kv = await Deno.openKv(Deno.env.get('DATA_DENO_KV_PATH'));

      async function listAll<T>(prefix: string): Promise<T[]> {
        const entries = kv.list<T>({ prefix: [prefix] });
        const results: T[] = [];
        for await (const entry of entries) results.push(entry.value);
        return results;
      }

      const APPROVAL_ROLE_MAP: Record<string, string> = {
        'disposition': 'hbsm_custodian',
        'transfer': 'hbsm_custodian',
        'archive-retrieval': 'lab_manager',
        'manager-review': 'lab_manager',
        'return-confirmation': 'study_lead',
      };

      return {
        async ListAuditEvents(filter?) {
          const all = await listAll<AuditEventRecord>('AuditEvents');
          if (!filter) return all;
          return all.filter((e) => {
            if (filter.UserId && e.UserId !== filter.UserId) return false;
            if (filter.ActionType && e.ActionType !== filter.ActionType) {
              return false;
            }
            return true;
          });
        },

        async CreateAuditEvent(data: Omit<AuditEventRecord, 'EventId'>) {
          const EventId = `EVT-${crypto.randomUUID().slice(0, 8)}`;
          const record: AuditEventRecord = { EventId, ...data };
          await kv.set(['AuditEvents', EventId], record);
          return record;
        },

        async ListTransfers(filter?) {
          const all = await listAll<TransferRecord>('Transfers');
          if (!filter) return all;
          return all.filter((t) => {
            if (filter.Type && t.Type !== filter.Type) return false;
            if (filter.Status && t.Status !== filter.Status) return false;
            return true;
          });
        },

        async ListReturns() {
          return listAll<ReturnRecord>('Returns');
        },

        async ListReconciliations() {
          return listAll<ReconciliationRecord>('Reconciliations');
        },

        async ListDispositions() {
          return listAll<DispositionRecord>('Dispositions');
        },

        async ListReviews(filter?) {
          const all = await listAll<ReviewRecord>('Reviews');
          if (!filter) return all;
          return all.filter((r) => {
            if (filter.Status && r.Status !== filter.Status) return false;
            return true;
          });
        },

        async DecideReview(
          reviewId: string,
          decision: 'approved' | 'rejected' | 'escalated',
          userId: string,
          reason?: string,
        ) {
          const entry = await kv.get<ReviewRecord>(['Reviews', reviewId]);
          if (!entry.value) throw new Error(`Review ${reviewId} not found`);
          const now = new Date().toISOString();
          let lastAction = `${decision} by ${userId}`;
          if (decision === 'rejected' && reason) {
            lastAction += ` — ${reason}`;
          }
          const updated: ReviewRecord = {
            ...entry.value,
            Status: decision,
            Decision: decision,
            ReviewedBy: userId,
            ReviewedAt: now,
            LastAction: lastAction,
          };
          await kv.set(['Reviews', reviewId], updated);

          // ALCOA+ audit event for every review decision (Attributable + Contemporaneous)
          const auditId = `EVT-${crypto.randomUUID().slice(0, 8)}`;
          await kv.set(['AuditEvents', auditId], {
            EventId: auditId,
            Timestamp: now,
            UserId: userId,
            ActionType: 'Approve',
            EntityType: 'Review',
            EntityId: reviewId,
            AlcoaPrinciple: 'Attributable',
            Status: 'success',
          } as AuditEventRecord);

          // Notify the review submitter that their review was decided
          const ntfId = `NTF-${crypto.randomUUID().slice(0, 8)}`;
          await kv.set(['Notifications', ntfId], {
            NotificationId: ntfId,
            UserId: entry.value.SubmittedBy,
            Type: 'status-change',
            EntityType: 'Review',
            EntityId: reviewId,
            Message: `Review ${reviewId} ${decision} by ${userId}`,
            Read: false,
            CreatedAt: now,
            ActionUrl: '/review',
          } as NotificationRecord);

          return updated;
        },

        async ListNotifications(userId: string) {
          const all = await listAll<NotificationRecord>('Notifications');
          return all.filter((n) => n.UserId === userId);
        },

        async MarkNotificationAsRead(notificationId: string) {
          const entry = await kv.get<NotificationRecord>([
            'Notifications',
            notificationId,
          ]);
          if (!entry.value) {
            throw new Error(`Notification ${notificationId} not found`);
          }
          const updated: NotificationRecord = { ...entry.value, Read: true };
          await kv.set(['Notifications', notificationId], updated);
          return updated;
        },

        async CreateNotification(
          data: Omit<NotificationRecord, 'NotificationId'>,
        ) {
          const NotificationId = `NTF-${crypto.randomUUID().slice(0, 8)}`;
          const record: NotificationRecord = { NotificationId, ...data };
          await kv.set(['Notifications', NotificationId], record);
          return record;
        },

        async ListStudyRoleMappings(studyId?: string) {
          const all = await listAll<StudyRoleMappingRecord>(
            'StudyRoleMappings',
          );
          if (!studyId) return all;
          return all.filter((m) => m.StudyId === studyId);
        },

        async GetApproversForStudy(studyId: string, role: string) {
          const mappings = await listAll<StudyRoleMappingRecord>(
            'StudyRoleMappings',
          );
          const match = mappings.find(
            (m) => m.StudyId === studyId && m.Role === role,
          );
          return match?.UserIds ?? [];
        },

        async ListApprovals(filter?: { Status?: string; Type?: string }) {
          const all = await listAll<ApprovalRecord>('Approvals');
          if (!filter) return all;
          return all.filter((a) => {
            if (filter.Status && a.Status !== filter.Status) return false;
            if (filter.Type && a.Type !== filter.Type) return false;
            return true;
          });
        },

        async InitiateApproval(data) {
          const now = new Date().toISOString();
          const requiredRole = APPROVAL_ROLE_MAP[data.Type] ?? 'lab_manager';

          const mappings = await listAll<StudyRoleMappingRecord>(
            'StudyRoleMappings',
          );
          const match = mappings.find(
            (m) => m.StudyId === data.StudyRef && m.Role === requiredRole,
          );
          const assignedTo = match?.UserIds ?? [];

          const ApprovalId = `APR-${crypto.randomUUID().slice(0, 8)}`;
          const record: ApprovalRecord = {
            ApprovalId,
            Type: data.Type,
            RecordId: data.RecordId,
            StudyRef: data.StudyRef,
            InitiatedBy: data.InitiatedBy,
            InitiatedAt: now,
            AssignedTo: assignedTo,
            Status: 'pending',
            Context: data.Context,
          };
          await kv.set(['Approvals', ApprovalId], record);

          for (const userId of assignedTo) {
            const ntfId = `NTF-${crypto.randomUUID().slice(0, 8)}`;
            await kv.set(['Notifications', ntfId], {
              NotificationId: ntfId,
              UserId: userId,
              Type: 'approval-request',
              EntityType: data.Type,
              EntityId: data.RecordId,
              Message:
                `${data.Type} ${data.RecordId} for Study ${data.StudyRef} requires your approval`,
              Read: false,
              CreatedAt: now,
              ActionUrl: `/${
                data.Type === 'return-confirmation' ? 'return' : data.Type
              }`,
            } as NotificationRecord);
          }

          const auditId = `EVT-${crypto.randomUUID().slice(0, 8)}`;
          await kv.set(['AuditEvents', auditId], {
            EventId: auditId,
            Timestamp: now,
            UserId: data.InitiatedBy,
            ActionType: 'InitiateApproval',
            EntityType: data.Type,
            EntityId: data.RecordId,
            AlcoaPrinciple: 'Attributable',
            Status: 'success',
          } as AuditEventRecord);

          return record;
        },

        async RecordApprovalDecision(
          approvalId: string,
          decision: 'approved' | 'rejected' | 'escalated',
          userId: string,
          reason?: string,
        ) {
          const entry = await kv.get<ApprovalRecord>([
            'Approvals',
            approvalId,
          ]);
          if (!entry.value) {
            throw new Error(`Approval ${approvalId} not found`);
          }

          const now = new Date().toISOString();
          const updated: ApprovalRecord = {
            ...entry.value,
            Status: decision,
            Decision: {
              DecidedBy: userId,
              Decision: decision,
              Reason: reason,
              Timestamp: now,
            },
          };
          await kv.set(['Approvals', approvalId], updated);

          const ntfId = `NTF-${crypto.randomUUID().slice(0, 8)}`;
          await kv.set(['Notifications', ntfId], {
            NotificationId: ntfId,
            UserId: entry.value.InitiatedBy,
            Type: 'status-change',
            EntityType: entry.value.Type,
            EntityId: entry.value.RecordId,
            Message:
              `Your ${entry.value.Type} approval for ${entry.value.RecordId} was ${decision} by ${userId}`,
            Read: false,
            CreatedAt: now,
            ActionUrl: `/${
              entry.value.Type === 'return-confirmation'
                ? 'return'
                : entry.value.Type
            }`,
          } as NotificationRecord);

          const auditId = `EVT-${crypto.randomUUID().slice(0, 8)}`;
          await kv.set(['AuditEvents', auditId], {
            EventId: auditId,
            Timestamp: now,
            UserId: userId,
            ActionType: `Approval${
              decision.charAt(0).toUpperCase() + decision.slice(1)
            }`,
            EntityType: entry.value.Type,
            EntityId: entry.value.RecordId,
            AlcoaPrinciple: 'Attributable',
            Status: 'success',
          } as AuditEventRecord);

          return updated;
        },

        async CreateTransfer(data) {
          const now = new Date().toISOString();
          const TransferId = `TRF-${crypto.randomUUID().slice(0, 8)}`;
          const record: TransferRecord = {
            TransferId,
            Type: data.Type,
            SampleIds: data.SampleIds,
            Source: data.Source,
            Destination: data.Destination,
            RequestedBy: data.RequestedBy,
            RequestedAt: now,
            Status: 'attention',
            StatusReason: data.StatusReason,
            SlaDeadline: data.SlaDeadline,
            LastAction: `Created by ${data.RequestedBy}`,
          };
          await kv.set(['Transfers', TransferId], record);

          const auditId = `EVT-${crypto.randomUUID().slice(0, 8)}`;
          await kv.set(['AuditEvents', auditId], {
            EventId: auditId,
            Timestamp: now,
            UserId: data.RequestedBy,
            ActionType: 'Create',
            EntityType: 'Transfer',
            EntityId: TransferId,
            AlcoaPrinciple: 'Contemporaneous',
            Status: 'success',
          } as AuditEventRecord);

          const requiredRole = APPROVAL_ROLE_MAP['transfer'] ??
            'hbsm_custodian';
          const mappings = await listAll<StudyRoleMappingRecord>(
            'StudyRoleMappings',
          );
          const match = mappings.find(
            (m) => m.StudyId === data.StudyRef && m.Role === requiredRole,
          );
          const approvers = match?.UserIds ?? [];

          for (const userId of approvers) {
            const ntfId = `NTF-${crypto.randomUUID().slice(0, 8)}`;
            await kv.set(['Notifications', ntfId], {
              NotificationId: ntfId,
              UserId: userId,
              Type: 'approval-request',
              EntityType: 'Transfer',
              EntityId: TransferId,
              Message: `Transfer ${TransferId} requires your approval`,
              Read: false,
              CreatedAt: now,
              ActionUrl: '/transfer',
            } as NotificationRecord);
          }

          return record;
        },

        async UpdateTransferStatus(transferId, status, statusReason, userId) {
          const entry = await kv.get<TransferRecord>([
            'Transfers',
            transferId,
          ]);
          if (!entry.value) {
            throw new Error(`Transfer ${transferId} not found`);
          }
          const now = new Date().toISOString();
          const updated: TransferRecord = {
            ...entry.value,
            Status: status,
            StatusReason: statusReason,
            LastAction: `${status} by ${userId}`,
          };
          await kv.set(['Transfers', transferId], updated);

          const auditId = `EVT-${crypto.randomUUID().slice(0, 8)}`;
          await kv.set(['AuditEvents', auditId], {
            EventId: auditId,
            Timestamp: now,
            UserId: userId,
            ActionType: 'StatusUpdate',
            EntityType: 'Transfer',
            EntityId: transferId,
            AlcoaPrinciple: 'Attributable',
            Status: 'success',
          } as AuditEventRecord);

          const ntfId = `NTF-${crypto.randomUUID().slice(0, 8)}`;
          await kv.set(['Notifications', ntfId], {
            NotificationId: ntfId,
            UserId: entry.value.RequestedBy,
            Type: 'status-change',
            EntityType: 'Transfer',
            EntityId: transferId,
            Message: `Transfer ${transferId} ${status} by ${userId}`,
            Read: false,
            CreatedAt: now,
            ActionUrl: '/transfer',
          } as NotificationRecord);

          return updated;
        },

        async CreateReturn(data) {
          const now = new Date().toISOString();
          const ReturnId = `RET-${crypto.randomUUID().slice(0, 8)}`;
          const record: ReturnRecord = {
            ReturnId,
            SampleIds: data.SampleIds,
            Destination: data.Destination,
            Reason: data.Reason,
            RequestedBy: data.RequestedBy,
            RequestedAt: now,
            Status: 'attention',
            PackagingInstructions: data.PackagingInstructions,
            LastAction: `Created by ${data.RequestedBy}`,
          };
          await kv.set(['Returns', ReturnId], record);

          const auditId = `EVT-${crypto.randomUUID().slice(0, 8)}`;
          await kv.set(['AuditEvents', auditId], {
            EventId: auditId,
            Timestamp: now,
            UserId: data.RequestedBy,
            ActionType: 'Create',
            EntityType: 'Return',
            EntityId: ReturnId,
            AlcoaPrinciple: 'Contemporaneous',
            Status: 'success',
          } as AuditEventRecord);

          const requiredRole = APPROVAL_ROLE_MAP['return-confirmation'] ??
            'study_lead';
          const mappings = await listAll<StudyRoleMappingRecord>(
            'StudyRoleMappings',
          );
          const match = mappings.find(
            (m) => m.StudyId === data.StudyRef && m.Role === requiredRole,
          );
          const approvers = match?.UserIds ?? [];

          for (const userId of approvers) {
            const ntfId = `NTF-${crypto.randomUUID().slice(0, 8)}`;
            await kv.set(['Notifications', ntfId], {
              NotificationId: ntfId,
              UserId: userId,
              Type: 'approval-request',
              EntityType: 'Return',
              EntityId: ReturnId,
              Message: `Return ${ReturnId} requires your approval`,
              Read: false,
              CreatedAt: now,
              ActionUrl: '/return',
            } as NotificationRecord);
          }

          return record;
        },

        async UpdateReturnStatus(
          returnId,
          status,
          userId,
          outcome?,
          depletionContext?,
        ) {
          const entry = await kv.get<ReturnRecord>(['Returns', returnId]);
          if (!entry.value) {
            throw new Error(`Return ${returnId} not found`);
          }
          const now = new Date().toISOString();
          const updated: ReturnRecord = {
            ...entry.value,
            Status: status,
            Outcome: outcome ?? entry.value.Outcome,
            DepletionContext: depletionContext ?? entry.value.DepletionContext,
            LastAction: `${status} by ${userId}`,
          };
          await kv.set(['Returns', returnId], updated);

          const auditId = `EVT-${crypto.randomUUID().slice(0, 8)}`;
          await kv.set(['AuditEvents', auditId], {
            EventId: auditId,
            Timestamp: now,
            UserId: userId,
            ActionType: 'StatusUpdate',
            EntityType: 'Return',
            EntityId: returnId,
            AlcoaPrinciple: 'Attributable',
            Status: 'success',
          } as AuditEventRecord);

          const ntfId = `NTF-${crypto.randomUUID().slice(0, 8)}`;
          await kv.set(['Notifications', ntfId], {
            NotificationId: ntfId,
            UserId: entry.value.RequestedBy,
            Type: 'status-change',
            EntityType: 'Return',
            EntityId: returnId,
            Message: `Return ${returnId} ${status} by ${userId}`,
            Read: false,
            CreatedAt: now,
            ActionUrl: '/return',
          } as NotificationRecord);

          return updated;
        },

        async CreateReconciliation(data) {
          const now = new Date().toISOString();
          const ReconciliationId = `REC-${crypto.randomUUID().slice(0, 8)}`;
          const record: ReconciliationRecord = {
            ReconciliationId,
            ManifestId: data.ManifestId,
            DiscrepancyType: data.DiscrepancyType,
            ExpectedCount: data.ExpectedCount,
            ActualCount: data.ActualCount,
            MissingFields: data.MissingFields,
            Status: 'attention',
            SlaDeadline: data.SlaDeadline,
            LastAction: `Created by ${data.UserId}`,
          };
          await kv.set(['Reconciliations', ReconciliationId], record);

          const auditId = `EVT-${crypto.randomUUID().slice(0, 8)}`;
          await kv.set(['AuditEvents', auditId], {
            EventId: auditId,
            Timestamp: now,
            UserId: data.UserId,
            ActionType: 'Create',
            EntityType: 'Reconciliation',
            EntityId: ReconciliationId,
            AlcoaPrinciple: 'Contemporaneous',
            Status: 'success',
          } as AuditEventRecord);

          return record;
        },

        async ResolveReconciliation(
          reconciliationId,
          resolution,
          correctionReason,
          userId,
        ) {
          if (!correctionReason || correctionReason.trim().length === 0) {
            throw new Error(
              'CorrectionReason is required for reconciliation resolution (GxP)',
            );
          }
          const entry = await kv.get<ReconciliationRecord>([
            'Reconciliations',
            reconciliationId,
          ]);
          if (!entry.value) {
            throw new Error(
              `Reconciliation ${reconciliationId} not found`,
            );
          }
          const now = new Date().toISOString();
          const updated: ReconciliationRecord = {
            ...entry.value,
            Status: 'ready',
            Resolution: resolution,
            ResolvedBy: userId,
            ResolvedAt: now,
            CorrectionReason: correctionReason,
            LastAction: `Resolved by ${userId}`,
          };
          await kv.set(['Reconciliations', reconciliationId], updated);

          const auditId = `EVT-${crypto.randomUUID().slice(0, 8)}`;
          await kv.set(['AuditEvents', auditId], {
            EventId: auditId,
            Timestamp: now,
            UserId: userId,
            ActionType: 'Resolve',
            EntityType: 'Reconciliation',
            EntityId: reconciliationId,
            AlcoaPrinciple: 'Attributable',
            Status: 'success',
          } as AuditEventRecord);

          return updated;
        },

        async Seed() {
          const count = await seedWorkflowData(kv);
          return { Seeded: count };
        },
      } as SampleMgmtHooks;
    });
}
