// deno-lint-ignore-file require-await
import { Capability } from '@fathym/steward/capabilities';
import { z } from 'zod';
import type { SampleRecord } from './types/SampleRecord.ts';
import type { SampleStatus } from './types/SampleStatus.ts';
import type { ManifestRecord } from './types/ManifestRecord.ts';
import type { StudyRecord } from './types/StudyRecord.ts';
import type { EthicsApprovalRecord } from './types/EthicsApprovalRecord.ts';
import type { TurboTaxStatus } from './types/TurboTaxStatus.ts';
import type { ManagerEffortEntry } from './types/ManagerEffortEntry.ts';
import type { CapacityForecast } from './types/CapacityForecast.ts';
import { seedOIData } from './seed.ts';

export type OIWarmQueryHooks = {
  LIMSDataSync(): Promise<SampleRecord[]>;
  Last100Barcodes(): Promise<SampleRecord[]>;
  AllBarcodes(): Promise<SampleRecord[]>;
  LatestManifest(): Promise<ManifestRecord[]>;
  ListStudies(): Promise<StudyRecord[]>;
  ListEthicsApprovals(): Promise<EthicsApprovalRecord[]>;
  EffortTracking(): Promise<ManagerEffortEntry[]>;
  CapacityForecasting(): Promise<CapacityForecast>;
  CreateSample(data: Omit<SampleRecord, 'SampleId'>): Promise<SampleRecord>;
  UpdateSampleStatus(
    id: string,
    status: SampleStatus,
    lastAction: string,
  ): Promise<SampleRecord>;
  CreateManifest(
    data: Omit<ManifestRecord, 'ManifestId'>,
  ): Promise<ManifestRecord>;
  UpdateManifestStatus(
    id: string,
    status: TurboTaxStatus,
  ): Promise<ManifestRecord>;
  Seed(): Promise<{ Seeded: number }>;
};

export function OIWarmQueryCapability() {
  return Capability('OIWarmQuery', 'Mocks OI warm query responses for pilot')
    .Output(z.custom<OIWarmQueryHooks>())
    .Execute(async () => {
      const kv = await Deno.openKv(Deno.env.get('DATA_DENO_KV_PATH'));

      async function listAll<T>(prefix: string): Promise<T[]> {
        const entries = kv.list<T>({ prefix: [prefix] });
        const results: T[] = [];
        for await (const entry of entries) results.push(entry.value);
        return results;
      }

      return {
        async LIMSDataSync() {
          return listAll<SampleRecord>('Samples');
        },

        async Last100Barcodes() {
          const all = await listAll<SampleRecord>('Samples');
          return all.slice(-100);
        },

        async AllBarcodes() {
          return listAll<SampleRecord>('Samples');
        },

        async LatestManifest() {
          return listAll<ManifestRecord>('Manifests');
        },

        async ListStudies() {
          return listAll<StudyRecord>('Studies');
        },

        async ListEthicsApprovals() {
          return listAll<EthicsApprovalRecord>('EthicsApprovals');
        },

        async EffortTracking() {
          return [
            { Manager: 'Dr. Vasquez', Count: 24 },
            { Manager: 'N. Ferreira', Count: 18 },
            { Manager: 'A. Desrosiers', Count: 31 },
            { Manager: 'T. Lindberg', Count: 12 },
          ] as ManagerEffortEntry[];
        },

        async CapacityForecasting() {
          return {
            Current: 85,
            Projected: 120,
            Breakpoint: 100,
          } as CapacityForecast;
        },

        async CreateSample(data: Omit<SampleRecord, 'SampleId'>) {
          const SampleId = `SMP-${crypto.randomUUID().slice(0, 8)}`;
          const record: SampleRecord = { SampleId, ...data };
          await kv.set(['Samples', SampleId], record);
          return record;
        },

        async UpdateSampleStatus(
          id: string,
          status: SampleStatus,
          lastAction: string,
        ) {
          const entry = await kv.get<SampleRecord>(['Samples', id]);
          if (!entry.value) throw new Error(`Sample ${id} not found`);
          const updated: SampleRecord = {
            ...entry.value,
            Status: status,
            LastAction: lastAction,
          };
          await kv.set(['Samples', id], updated);
          return updated;
        },

        async CreateManifest(data: Omit<ManifestRecord, 'ManifestId'>) {
          const ManifestId = `MAN-${crypto.randomUUID().slice(0, 8)}`;
          const record: ManifestRecord = { ManifestId, ...data };
          await kv.set(['Manifests', ManifestId], record);
          return record;
        },

        async UpdateManifestStatus(id: string, status: TurboTaxStatus) {
          const entry = await kv.get<ManifestRecord>(['Manifests', id]);
          if (!entry.value) throw new Error(`Manifest ${id} not found`);
          const updated: ManifestRecord = { ...entry.value, Status: status };
          await kv.set(['Manifests', id], updated);
          return updated;
        },

        async Seed() {
          const count = await seedOIData(kv);
          return { Seeded: count };
        },
      } as OIWarmQueryHooks;
    });
}
