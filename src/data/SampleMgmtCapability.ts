import { Capability } from '@fathym/steward/capabilities';
import { z } from 'zod';
import type {
  AuditEventRecord,
  EthicsApprovalRecord,
  TransferRecord,
  ReturnRecord,
  ReconciliationRecord,
  DispositionRecord,
  ReviewRecord,
  NotificationRecord,
} from './types/mod.ts';
import { seedWorkflowData } from './seed.ts';

export type SampleMgmtHooks = {
  ListAuditEvents(filter?: { UserId?: string; ActionType?: string }): Promise<AuditEventRecord[]>;
  CreateAuditEvent(data: Omit<AuditEventRecord, 'EventId'>): Promise<AuditEventRecord>;
  ListEthicsApprovals(): Promise<EthicsApprovalRecord[]>;
  ListTransfers(filter?: { Type?: string; Status?: string }): Promise<TransferRecord[]>;
  ListReturns(): Promise<ReturnRecord[]>;
  ListReconciliations(): Promise<ReconciliationRecord[]>;
  ListDispositions(): Promise<DispositionRecord[]>;
  ListReviews(filter?: { Status?: string }): Promise<ReviewRecord[]>;
  ListNotifications(userId: string): Promise<NotificationRecord[]>;
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

        async ListEthicsApprovals() {
          return listAll<EthicsApprovalRecord>('EthicsApprovals');
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

        async ListNotifications(userId: string) {
          const all = await listAll<NotificationRecord>('Notifications');
          return all.filter((n) => n.UserId === userId);
        },

        async Seed() {
          const count = await seedWorkflowData(kv);
          return { Seeded: count };
        },
      } as SampleMgmtHooks;
    });
}
