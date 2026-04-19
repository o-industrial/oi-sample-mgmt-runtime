import { Capability } from '@fathym/steward/capabilities';
import { z } from 'zod';
import type { AuditEventRecord } from './types/AuditEventRecord.ts';
import type { TransferRecord } from './types/TransferRecord.ts';
import type { ReturnRecord } from './types/ReturnRecord.ts';
import type { ReconciliationRecord } from './types/ReconciliationRecord.ts';
import type { DispositionRecord } from './types/DispositionRecord.ts';
import type { ReviewRecord } from './types/ReviewRecord.ts';
import type { NotificationRecord } from './types/NotificationRecord.ts';
import { seedWorkflowData } from './seed.ts';

export type SampleMgmtHooks = {
  ListAuditEvents(filter?: { UserId?: string; ActionType?: string }): Promise<AuditEventRecord[]>;
  CreateAuditEvent(data: Omit<AuditEventRecord, 'EventId'>): Promise<AuditEventRecord>;
  ListTransfers(filter?: { Type?: string; Status?: string }): Promise<TransferRecord[]>;
  ListReturns(): Promise<ReturnRecord[]>;
  ListReconciliations(): Promise<ReconciliationRecord[]>;
  ListDispositions(): Promise<DispositionRecord[]>;
  ListReviews(filter?: { Status?: string }): Promise<ReviewRecord[]>;
  DecideReview(reviewId: string, decision: 'approved' | 'rejected' | 'escalated', userId: string, reason?: string): Promise<ReviewRecord>;
  ListNotifications(userId: string): Promise<NotificationRecord[]>;
  MarkNotificationAsRead(notificationId: string): Promise<NotificationRecord>;
  CreateNotification(data: Omit<NotificationRecord, 'NotificationId'>): Promise<NotificationRecord>;
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

      return {
        async ListAuditEvents(filter?) {
          const all = await listAll<AuditEventRecord>('AuditEvents');
          if (!filter) return all;
          return all.filter((e) => {
            if (filter.UserId && e.UserId !== filter.UserId) return false;
            if (filter.ActionType && e.ActionType !== filter.ActionType) return false;
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
          const entry = await kv.get<NotificationRecord>(['Notifications', notificationId]);
          if (!entry.value) throw new Error(`Notification ${notificationId} not found`);
          const updated: NotificationRecord = { ...entry.value, Read: true };
          await kv.set(['Notifications', notificationId], updated);
          return updated;
        },

        async CreateNotification(data: Omit<NotificationRecord, 'NotificationId'>) {
          const NotificationId = `NTF-${crypto.randomUUID().slice(0, 8)}`;
          const record: NotificationRecord = { NotificationId, ...data };
          await kv.set(['Notifications', NotificationId], record);
          return record;
        },

        async Seed() {
          const count = await seedWorkflowData(kv);
          return { Seeded: count };
        },
      } as SampleMgmtHooks;
    });
}
