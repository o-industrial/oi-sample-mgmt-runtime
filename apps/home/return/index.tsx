import { PageProps } from '@fathym/eac-applications/preact';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../src/state/OISampleMgmtWebState.ts';
import { useTranslation } from '../../../src/utils/useTranslation.ts';
import ReturnTable from '../../components/ReturnTable.tsx';
import { createClientFromRequest } from '../../../src/client/createClientFromRequest.ts';

// --- Types (TitleCase for server data — C4) ---

type TurboTaxStatus = 'ready' | 'attention' | 'volume-hold' | 'problem';

type ReturnItem = {
  ReturnId: string;
  SampleCount: number;
  Destination: string;
  Reason: string;
  RequestedBy: string;
  RequestedAt: string;
  Status: TurboTaxStatus;
  StatusLabel: string;
  PackagingInstructions: string;
  Outcome: string;
  OutcomeLabel: string;
  LastAction: string;
};

type ReturnPageData = {
  Heading: string;
  Subtitle: string;
  SearchPlaceholder: string;
  StatusCards: Array<{ Label: string; Count: number }>;
  ColumnHeaders: {
    ReturnId: string;
    Destination: string;
    SampleCount: string;
    RequestedBy: string;
    RequestedAt: string;
    Status: string;
    Packaging: string;
    Outcome: string;
    Actions: string;
  };
  FilterLabels: {
    AllStatuses: string;
    Statuses: Array<{ Value: string; Label: string }>;
  };
  Returns: ReturnItem[];
  TotalCount: number;
  ApproveLabel: string;
  EmptyNoReturns: string;
  EmptyNoMatch: string;
  CanApprove: boolean;
};

// --- Handler ---

export const handler: EaCRuntimeHandlerSet<
  OISampleMgmtWebState,
  ReturnPageData
> = {
  GET: async (req, ctx) => {
    if (!ctx.State.AccessRights.includes('samples:view')) {
      return new Response('Forbidden', { status: 403 });
    }

    const { t } = useTranslation(ctx.State.Strings);
    const rights = ctx.State.AccessRights;

    const client = await createClientFromRequest(req);
    const rawReturns = await client.Returns.List();

    const returns: ReturnItem[] = rawReturns.map((r) => {
      const outcome = r.Outcome ?? 'pending';
      return {
        ReturnId: r.ReturnId,
        SampleCount: r.SampleIds.length,
        Destination: r.Destination,
        Reason: r.Reason,
        RequestedBy: r.RequestedBy,
        RequestedAt: r.RequestedAt,
        Status: r.Status as TurboTaxStatus,
        StatusLabel: t(
          `return.status.${
            r.Status === 'volume-hold' ? 'volumeHold' : r.Status
          }`,
        ),
        PackagingInstructions: r.PackagingInstructions,
        Outcome: outcome,
        OutcomeLabel: t(`return.outcome.${outcome}`),
        LastAction: r.LastAction,
      };
    });

    const statusCounts = {
      ready: returns.filter((r) => r.Status === 'ready').length,
      attention: returns.filter((r) => r.Status === 'attention').length,
      volumeHold: returns.filter((r) => r.Status === 'volume-hold').length,
      problem: returns.filter((r) => r.Status === 'problem').length,
    };

    return ctx.Render({
      ...ctx.Data,
      Heading: t('return.heading'),
      Subtitle: t('return.subtitle'),
      SearchPlaceholder: t('return.search.placeholder'),
      StatusCards: [
        { Label: t('return.card.total'), Count: returns.length },
        { Label: t('return.card.ready'), Count: statusCounts.ready },
        {
          Label: t('return.card.attention'),
          Count: statusCounts.attention,
        },
        {
          Label: t('return.card.volumeHold'),
          Count: statusCounts.volumeHold,
        },
        { Label: t('return.card.problem'), Count: statusCounts.problem },
      ],
      ColumnHeaders: {
        ReturnId: t('return.col.returnId'),
        Destination: t('return.col.destination'),
        SampleCount: t('return.col.sampleCount'),
        RequestedBy: t('return.col.requestedBy'),
        RequestedAt: t('return.col.requestedAt'),
        Status: t('return.col.status'),
        Packaging: t('return.col.packaging'),
        Outcome: t('return.col.outcome'),
        Actions: t('return.col.actions'),
      },
      FilterLabels: {
        AllStatuses: t('return.filter.allStatuses'),
        Statuses: [
          { Value: 'ready', Label: t('return.status.ready') },
          { Value: 'attention', Label: t('return.status.attention') },
          {
            Value: 'volume-hold',
            Label: t('return.status.volumeHold'),
          },
          { Value: 'problem', Label: t('return.status.problem') },
        ],
      },
      Returns: returns,
      TotalCount: returns.length,
      ApproveLabel: t('return.approve'),
      EmptyNoReturns: t('return.emptyNoReturns'),
      EmptyNoMatch: t('return.emptyNoMatch'),
      CanApprove: rights.includes('custody:approve'),
    });
  },
};

// --- Component ---

export default function Return(
  { Data }: PageProps<ReturnPageData>,
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
      <ReturnTable
        returns={d.Returns.map((r) => ({
          returnId: r.ReturnId,
          sampleCount: r.SampleCount,
          destination: r.Destination,
          reason: r.Reason,
          requestedBy: r.RequestedBy,
          requestedAt: r.RequestedAt,
          status: r.Status,
          statusLabel: r.StatusLabel,
          packagingInstructions: r.PackagingInstructions,
          outcome: r.Outcome,
          outcomeLabel: r.OutcomeLabel,
          lastAction: r.LastAction,
        }))}
        totalCount={d.TotalCount}
        searchPlaceholder={d.SearchPlaceholder}
        columnHeaders={{
          returnId: d.ColumnHeaders.ReturnId,
          destination: d.ColumnHeaders.Destination,
          sampleCount: d.ColumnHeaders.SampleCount,
          requestedBy: d.ColumnHeaders.RequestedBy,
          requestedAt: d.ColumnHeaders.RequestedAt,
          status: d.ColumnHeaders.Status,
          packaging: d.ColumnHeaders.Packaging,
          outcome: d.ColumnHeaders.Outcome,
          actions: d.ColumnHeaders.Actions,
        }}
        filterLabels={{
          allStatuses: d.FilterLabels.AllStatuses,
          statuses: d.FilterLabels.Statuses.map((s) => ({
            value: s.Value,
            label: s.Label,
          })),
        }}
        approveLabel={d.ApproveLabel}
        emptyNoReturns={d.EmptyNoReturns}
        emptyNoMatch={d.EmptyNoMatch}
        canApprove={d.CanApprove}
        apiBase=''
      />
    </div>
  );
}
