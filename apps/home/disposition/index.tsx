import { PageProps } from '@fathym/eac-applications/preact';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../src/state/OISampleMgmtWebState.ts';
import { useTranslation } from '../../../src/utils/useTranslation.ts';
import DispositionTable from '../../components/DispositionTable.tsx';
import { createClientFromRequest } from '../../../src/client/createClientFromRequest.ts';

// --- Types (TitleCase for server data — C4) ---

type TurboTaxStatus = 'ready' | 'attention' | 'volume-hold' | 'problem';

type DispositionItem = {
  DispositionId: string;
  SampleId: string;
  Decision: string;
  DecisionLabel: string;
  Status: TurboTaxStatus;
  StatusLabel: string;
  DispositionDeadline: string;
  Treatment: string;
  TreatmentLabel: string;
  EvidenceCount: number;
  LastAction: string;
};

type DispositionPageData = {
  Heading: string;
  Subtitle: string;
  SearchPlaceholder: string;
  StatusCards: Array<{ Label: string; Count: number }>;
  ColumnHeaders: {
    DispositionId: string;
    SampleId: string;
    Decision: string;
    Status: string;
    Deadline: string;
    TreatmentStatus: string;
    Evidence: string;
    Actions: string;
  };
  FilterLabels: {
    AllDecisions: string;
    AllStatuses: string;
    Decisions: Array<{ Value: string; Label: string }>;
    Statuses: Array<{ Value: string; Label: string }>;
  };
  Dispositions: DispositionItem[];
  TotalCount: number;
  ApproveLabel: string;
  EmptyNoDispositions: string;
  EmptyNoMatch: string;
  CanApprove: boolean;
};

// --- Handler ---

export const handler: EaCRuntimeHandlerSet<
  OISampleMgmtWebState,
  DispositionPageData
> = {
  GET: async (req, ctx) => {
    if (!ctx.State.AccessRights.includes('custody:approve')) {
      return new Response('Forbidden', { status: 403 });
    }

    const { t } = useTranslation(ctx.State.Strings);
    const rights = ctx.State.AccessRights;

    const client = await createClientFromRequest(req);
    const rawDispositions = await client.Dispositions.List();

    const dispositions: DispositionItem[] = rawDispositions.map((d) => ({
      DispositionId: d.DispositionId,
      SampleId: d.SampleId,
      Decision: d.Decision,
      DecisionLabel: t(`disposition.decision.${d.Decision}`),
      Status: d.Status as TurboTaxStatus,
      StatusLabel: t(
        `disposition.status.${
          d.Status === 'volume-hold' ? 'volumeHold' : d.Status
        }`,
      ),
      DispositionDeadline: d.DispositionDeadline,
      Treatment: d.TreatmentStatus ?? '',
      TreatmentLabel: d.TreatmentStatus
        ? t(`disposition.treatment.${d.TreatmentStatus}`)
        : '',
      EvidenceCount: d.EvidenceDocuments.length,
      LastAction: d.LastAction,
    }));

    const statusCounts = {
      ready: dispositions.filter((d) => d.Status === 'ready').length,
      attention: dispositions.filter((d) => d.Status === 'attention').length,
      volumeHold: dispositions.filter((d) => d.Status === 'volume-hold')
        .length,
      problem: dispositions.filter((d) => d.Status === 'problem').length,
    };

    return ctx.Render({
      ...ctx.Data,
      Heading: t('disposition.heading'),
      Subtitle: t('disposition.subtitle'),
      SearchPlaceholder: t('disposition.search.placeholder'),
      StatusCards: [
        {
          Label: t('disposition.card.total'),
          Count: dispositions.length,
        },
        {
          Label: t('disposition.card.ready'),
          Count: statusCounts.ready,
        },
        {
          Label: t('disposition.card.attention'),
          Count: statusCounts.attention,
        },
        {
          Label: t('disposition.card.volumeHold'),
          Count: statusCounts.volumeHold,
        },
        {
          Label: t('disposition.card.problem'),
          Count: statusCounts.problem,
        },
      ],
      ColumnHeaders: {
        DispositionId: t('disposition.col.dispositionId'),
        SampleId: t('disposition.col.sampleId'),
        Decision: t('disposition.col.decision'),
        Status: t('disposition.col.status'),
        Deadline: t('disposition.col.deadline'),
        TreatmentStatus: t('disposition.col.treatmentStatus'),
        Evidence: t('disposition.col.evidence'),
        Actions: t('disposition.col.actions'),
      },
      FilterLabels: {
        AllDecisions: t('disposition.filter.allDecisions'),
        AllStatuses: t('disposition.filter.allStatuses'),
        Decisions: [
          {
            Value: 'destroy',
            Label: t('disposition.decision.destroy'),
          },
          {
            Value: 'retain',
            Label: t('disposition.decision.retain'),
          },
          {
            Value: 'deplete',
            Label: t('disposition.decision.deplete'),
          },
          {
            Value: 'pending',
            Label: t('disposition.decision.pending'),
          },
        ],
        Statuses: [
          { Value: 'ready', Label: t('disposition.status.ready') },
          {
            Value: 'attention',
            Label: t('disposition.status.attention'),
          },
          {
            Value: 'volume-hold',
            Label: t('disposition.status.volumeHold'),
          },
          { Value: 'problem', Label: t('disposition.status.problem') },
        ],
      },
      Dispositions: dispositions,
      TotalCount: dispositions.length,
      ApproveLabel: t('disposition.approve'),
      EmptyNoDispositions: t('disposition.emptyNoDispositions'),
      EmptyNoMatch: t('disposition.emptyNoMatch'),
      CanApprove: rights.includes('custody:approve'),
    });
  },
};

// --- Component ---

export default function Disposition(
  { Data }: PageProps<DispositionPageData>,
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
      <div class='grid grid-cols-5 gap-4'>
        {d.StatusCards.map((card) => (
          <div
            key={card.Label}
            class='rounded-lg border border-border bg-surface-card p-4'
          >
            <p class='text-sm text-on-surface-secondary'>{card.Label}</p>
            <p class='text-3xl font-bold mt-1 text-on-surface'>
              {card.Count}
            </p>
          </div>
        ))}
      </div>

      {/* Interactive table island — TitleCase → camelCase marshaling (C4/C6) */}
      <DispositionTable
        dispositions={d.Dispositions.map((disp) => ({
          dispositionId: disp.DispositionId,
          sampleId: disp.SampleId,
          decision: disp.Decision,
          decisionLabel: disp.DecisionLabel,
          status: disp.Status,
          statusLabel: disp.StatusLabel,
          dispositionDeadline: disp.DispositionDeadline,
          treatment: disp.Treatment,
          treatmentLabel: disp.TreatmentLabel,
          evidenceCount: disp.EvidenceCount,
          lastAction: disp.LastAction,
        }))}
        totalCount={d.TotalCount}
        searchPlaceholder={d.SearchPlaceholder}
        columnHeaders={{
          dispositionId: d.ColumnHeaders.DispositionId,
          sampleId: d.ColumnHeaders.SampleId,
          decision: d.ColumnHeaders.Decision,
          status: d.ColumnHeaders.Status,
          deadline: d.ColumnHeaders.Deadline,
          treatmentStatus: d.ColumnHeaders.TreatmentStatus,
          evidence: d.ColumnHeaders.Evidence,
          actions: d.ColumnHeaders.Actions,
        }}
        filterLabels={{
          allDecisions: d.FilterLabels.AllDecisions,
          allStatuses: d.FilterLabels.AllStatuses,
          decisions: d.FilterLabels.Decisions.map((dec) => ({
            value: dec.Value,
            label: dec.Label,
          })),
          statuses: d.FilterLabels.Statuses.map((s) => ({
            value: s.Value,
            label: s.Label,
          })),
        }}
        approveLabel={d.ApproveLabel}
        emptyNoDispositions={d.EmptyNoDispositions}
        emptyNoMatch={d.EmptyNoMatch}
        canApprove={d.CanApprove}
      />
    </div>
  );
}
