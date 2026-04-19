import { PageProps } from '@fathym/eac-applications/preact';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../../src/state/OISampleMgmtWebState.ts';
import { useTranslation } from '../../../../src/utils/useTranslation.ts';
import SampleTrackingTable from '../../../components/SampleTrackingTable.tsx';
import { createClientFromRequest } from '../../../../src/client/createClientFromRequest.ts';

// --- Types (TitleCase for server data — C4) ---

type SampleStatus =
  | 'received'
  | 'processing'
  | 'in-storage'
  | 'transferred'
  | 'disposed'
  | 'depleted';

type SampleRecord = {
  SampleId: string;
  StudyId: string;
  OriginSite: string;
  ReceivedAt: string;
  Status: SampleStatus;
  StatusLabel: string;
  StorageLocation: string;
  LastAction: string;
};

type SampleTrackingData = {
  Heading: string;
  Subtitle: string;
  SearchPlaceholder: string;
  StatusCards: Array<{ Label: string; Count: number }>;
  ColumnHeaders: {
    SampleId: string;
    Study: string;
    OriginSite: string;
    Received: string;
    Status: string;
    Storage: string;
    LastAction: string;
    Actions: string;
  };
  Samples: SampleRecord[];
  TotalCount: number;
  UpdateLabel: string;
  ViewReportLabel: string;
  EmptyNoSamples: string;
  EmptyNoMatch: string;
  CanReceive: boolean;
};

// --- Handler ---

export const handler: EaCRuntimeHandlerSet<
  OISampleMgmtWebState,
  SampleTrackingData
> = {
  GET: async (req, ctx) => {
    const { t } = useTranslation(ctx.State.Strings);
    const rights = ctx.State.AccessRights;

    const client = await createClientFromRequest(req);
    const rawSamples = await client.Samples.List();

    const samples: SampleRecord[] = rawSamples.map((s) => ({
      ...s,
      StatusLabel: t(
        `track.samples.status.${
          s.Status === 'in-storage' ? 'inStorage' : s.Status
        }`,
      ),
    }));

    const statusCounts = {
      received: samples.filter((s) => s.Status === 'received').length,
      processing: samples.filter((s) => s.Status === 'processing').length,
      inStorage: samples.filter((s) => s.Status === 'in-storage').length,
      transferred: samples.filter((s) => s.Status === 'transferred').length,
    };

    return ctx.Render({
      ...ctx.Data,
      Heading: t('track.samples.heading'),
      Subtitle: t('track.samples.subtitle'),
      SearchPlaceholder: t('track.samples.search.placeholder'),
      StatusCards: [
        {
          Label: t('track.samples.card.totalReceived'),
          Count: samples.length,
        },
        {
          Label: t('track.samples.card.inProcessing'),
          Count: statusCounts.processing,
        },
        {
          Label: t('track.samples.card.inStorage'),
          Count: statusCounts.inStorage,
        },
        {
          Label: t('track.samples.card.transferred'),
          Count: statusCounts.transferred,
        },
      ],
      ColumnHeaders: {
        SampleId: t('track.samples.col.sampleId'),
        Study: t('track.samples.col.study'),
        OriginSite: t('track.samples.col.originSite'),
        Received: t('track.samples.col.received'),
        Status: t('track.samples.col.status'),
        Storage: t('track.samples.col.storage'),
        LastAction: t('track.samples.col.lastAction'),
        Actions: t('track.samples.col.actions'),
      },
      Samples: samples,
      TotalCount: samples.length,
      UpdateLabel: t('track.samples.update'),
      ViewReportLabel: t('track.samples.viewReport'),
      EmptyNoSamples: t('track.samples.emptyNoSamples'),
      EmptyNoMatch: t('track.samples.emptyNoMatch'),
      CanReceive: rights.includes('samples:receive'),
    });
  },
};

// --- Component ---

export default function SampleTracking(
  { Data }: PageProps<SampleTrackingData>,
) {
  const d = Data!;

  return (
    <div class='space-y-6'>
      {/* Header */}
      <div>
        <h1 class='text-xl font-bold text-primary'>{d.Heading}</h1>
        <p class='text-sm text-on-surface-secondary mt-1'>{d.Subtitle}</p>
      </div>

      {/* Status summary cards */}
      <div class='grid grid-cols-4 gap-4'>
        {d.StatusCards.map((card) => (
          <div
            key={card.Label}
            class='rounded-lg border border-border bg-surface-card p-4'
          >
            <p class='text-sm text-on-surface-secondary'>{card.Label}</p>
            <p class='text-3xl font-bold mt-1 text-on-surface'>{card.Count}</p>
          </div>
        ))}
      </div>

      {/* Interactive table island — TitleCase → camelCase marshaling (C4/C6) */}
      <SampleTrackingTable
        samples={d.Samples.map((s) => ({
          sampleId: s.SampleId,
          studyId: s.StudyId,
          originSite: s.OriginSite,
          receivedAt: s.ReceivedAt,
          status: s.Status,
          statusLabel: s.StatusLabel,
          storageLocation: s.StorageLocation,
          lastAction: s.LastAction,
        }))}
        totalCount={d.TotalCount}
        searchPlaceholder={d.SearchPlaceholder}
        columnHeaders={{
          sampleId: d.ColumnHeaders.SampleId,
          study: d.ColumnHeaders.Study,
          originSite: d.ColumnHeaders.OriginSite,
          received: d.ColumnHeaders.Received,
          status: d.ColumnHeaders.Status,
          storage: d.ColumnHeaders.Storage,
          lastAction: d.ColumnHeaders.LastAction,
          actions: d.ColumnHeaders.Actions,
        }}
        updateLabel={d.UpdateLabel}
        viewReportLabel={d.ViewReportLabel}
        emptyNoSamples={d.EmptyNoSamples}
        emptyNoMatch={d.EmptyNoMatch}
        canReceive={d.CanReceive}
      />
    </div>
  );
}
