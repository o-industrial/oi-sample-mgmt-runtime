import { PageProps } from '@fathym/eac-applications/preact';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../src/state/OISampleMgmtWebState.ts';
import { useTranslation } from '../../../src/utils/useTranslation.ts';
import ReconciliationTable from '../../components/ReconciliationTable.tsx';
import ManifestComparison from '../../components/ManifestComparison.tsx';
import { createClientFromRequest } from '../../../src/client/createClientFromRequest.ts';

// --- Types (TitleCase for server data — C4) ---

type TurboTaxStatus = 'ready' | 'attention' | 'volume-hold' | 'problem';

type ReconciliationItem = {
  ReconciliationId: string;
  ManifestId: string;
  DiscrepancyType: string;
  DiscrepancyLabel: string;
  ExpectedCount: number;
  ActualCount: number;
  MissingFieldsLabel: string;
  Status: TurboTaxStatus;
  StatusLabel: string;
  SlaDeadline: string;
  LastAction: string;
};

type ReconciliationPageData = {
  Heading: string;
  Subtitle: string;
  SearchPlaceholder: string;
  StatusCards: Array<{ Label: string; Count: number }>;
  ColumnHeaders: {
    ReconciliationId: string;
    ManifestId: string;
    DiscrepancyType: string;
    Expected: string;
    Actual: string;
    MissingFields: string;
    Status: string;
    SlaDeadline: string;
    Actions: string;
  };
  FilterLabels: {
    AllTypes: string;
    AllStatuses: string;
    Types: Array<{ Value: string; Label: string }>;
    Statuses: Array<{ Value: string; Label: string }>;
  };
  Reconciliations: ReconciliationItem[];
  TotalCount: number;
  ResolveLabel: string;
  EmptyNoReconciliations: string;
  EmptyNoMatch: string;
  CanResolve: boolean;
  ResolutionLabels: {
    ResolutionTypeLabel: string;
    ResolutionTypes: Array<{ Value: string; Label: string }>;
    NoteLabel: string;
    CorrectionReasonLabel: string;
    SubmitLabel: string;
    CancelLabel: string;
  };
  ComparisonData: {
    ReconciliationId: string;
    ManifestId: string;
    Fields: Array<{
      Field: string;
      Expected: string;
      Actual: string;
      Status: 'match' | 'mismatch' | 'missing';
    }>;
  } | null;
  ComparisonLabels: {
    Heading: string;
    ExpectedCol: string;
    ActualCol: string;
    FieldCol: string;
    StatusCol: string;
    ResolutionLabel: string;
    ReasonLabel: string;
    SubmitLabel: string;
    MatchLabel: string;
    MismatchLabel: string;
    MissingLabel: string;
  };
};

// --- Discrepancy-type-to-i18n key helper ---

function discrepancyKey(type: string): string {
  switch (type) {
    case 'count-mismatch':
      return 'countMismatch';
    case 'metadata-gap':
      return 'metadataGap';
    case 'barcode-conflict':
      return 'barcodeConflict';
    case 'format-error':
      return 'formatError';
    default:
      return type;
  }
}

// --- Handler ---

export const handler: EaCRuntimeHandlerSet<
  OISampleMgmtWebState,
  ReconciliationPageData
> = {
  GET: async (req, ctx) => {
    if (!ctx.State.AccessRights.includes('samples:receive')) {
      return new Response('Forbidden', { status: 403 });
    }

    const { t } = useTranslation(ctx.State.Strings);
    const rights = ctx.State.AccessRights;

    const client = await createClientFromRequest(req);
    const rawReconciliations = await client.Reconciliations.List();

    const unresolvedRec = rawReconciliations.find(
      (r) => r.Status !== 'ready',
    );
    const comparisonData = unresolvedRec
      ? {
        ReconciliationId: unresolvedRec.ReconciliationId,
        ManifestId: unresolvedRec.ManifestId,
        Fields: unresolvedRec.MissingFields.map((f) => ({
          Field: f,
          Expected: String(unresolvedRec.ExpectedCount),
          Actual: String(unresolvedRec.ActualCount),
          Status: 'mismatch' as const,
        })),
      }
      : null;

    const reconciliations: ReconciliationItem[] = rawReconciliations.map(
      (r) => ({
        ReconciliationId: r.ReconciliationId,
        ManifestId: r.ManifestId,
        DiscrepancyType: r.DiscrepancyType,
        DiscrepancyLabel: t(
          `reconciliation.discrepancy.${discrepancyKey(r.DiscrepancyType)}`,
        ),
        ExpectedCount: r.ExpectedCount,
        ActualCount: r.ActualCount,
        MissingFieldsLabel: r.MissingFields.join(', '),
        Status: r.Status as TurboTaxStatus,
        StatusLabel: t(
          `reconciliation.status.${
            r.Status === 'volume-hold' ? 'volumeHold' : r.Status
          }`,
        ),
        SlaDeadline: r.SlaDeadline,
        LastAction: r.LastAction,
      }),
    );

    const statusCounts = {
      ready: reconciliations.filter((r) => r.Status === 'ready').length,
      attention: reconciliations.filter((r) => r.Status === 'attention')
        .length,
      volumeHold: reconciliations.filter(
        (r) => r.Status === 'volume-hold',
      ).length,
      problem: reconciliations.filter((r) => r.Status === 'problem').length,
    };

    return ctx.Render({
      ...ctx.Data,
      Heading: t('reconciliation.heading'),
      Subtitle: t('reconciliation.subtitle'),
      SearchPlaceholder: t('reconciliation.search.placeholder'),
      StatusCards: [
        {
          Label: t('reconciliation.card.total'),
          Count: reconciliations.length,
        },
        {
          Label: t('reconciliation.card.ready'),
          Count: statusCounts.ready,
        },
        {
          Label: t('reconciliation.card.attention'),
          Count: statusCounts.attention,
        },
        {
          Label: t('reconciliation.card.volumeHold'),
          Count: statusCounts.volumeHold,
        },
        {
          Label: t('reconciliation.card.problem'),
          Count: statusCounts.problem,
        },
      ],
      ColumnHeaders: {
        ReconciliationId: t('reconciliation.col.reconciliationId'),
        ManifestId: t('reconciliation.col.manifestId'),
        DiscrepancyType: t('reconciliation.col.discrepancyType'),
        Expected: t('reconciliation.col.expected'),
        Actual: t('reconciliation.col.actual'),
        MissingFields: t('reconciliation.col.missingFields'),
        Status: t('reconciliation.col.status'),
        SlaDeadline: t('reconciliation.col.slaDeadline'),
        Actions: t('reconciliation.col.actions'),
      },
      FilterLabels: {
        AllTypes: t('reconciliation.filter.allTypes'),
        AllStatuses: t('reconciliation.filter.allStatuses'),
        Types: [
          {
            Value: 'count-mismatch',
            Label: t('reconciliation.discrepancy.countMismatch'),
          },
          {
            Value: 'metadata-gap',
            Label: t('reconciliation.discrepancy.metadataGap'),
          },
          {
            Value: 'barcode-conflict',
            Label: t('reconciliation.discrepancy.barcodeConflict'),
          },
          {
            Value: 'format-error',
            Label: t('reconciliation.discrepancy.formatError'),
          },
        ],
        Statuses: [
          { Value: 'ready', Label: t('reconciliation.status.ready') },
          {
            Value: 'attention',
            Label: t('reconciliation.status.attention'),
          },
          {
            Value: 'volume-hold',
            Label: t('reconciliation.status.volumeHold'),
          },
          { Value: 'problem', Label: t('reconciliation.status.problem') },
        ],
      },
      Reconciliations: reconciliations,
      TotalCount: reconciliations.length,
      ResolveLabel: t('reconciliation.resolve'),
      EmptyNoReconciliations: t('reconciliation.emptyNoReconciliations'),
      EmptyNoMatch: t('reconciliation.emptyNoMatch'),
      CanResolve: rights.includes('samples:receive'),
      ResolutionLabels: {
        ResolutionTypeLabel: t('reconciliation.resolutionType.label'),
        ResolutionTypes: [
          { Value: 'Mark Duplicate', Label: t('reconciliation.resolutionType.markDuplicate') },
          { Value: 'Correct Count', Label: t('reconciliation.resolutionType.correctCount') },
          { Value: 'Update Metadata', Label: t('reconciliation.resolutionType.updateMetadata') },
          { Value: 'Other', Label: t('reconciliation.resolutionType.other') },
        ],
        NoteLabel: t('reconciliation.resolutionNote.label'),
        CorrectionReasonLabel: t('reconciliation.correctionReason.label'),
        SubmitLabel: t('reconciliation.submit'),
        CancelLabel: t('reconciliation.cancel'),
      },
      ComparisonData: comparisonData,
      ComparisonLabels: {
        Heading: t('manifestComparison.heading'),
        ExpectedCol: t('manifestComparison.expectedCol'),
        ActualCol: t('manifestComparison.actualCol'),
        FieldCol: t('manifestComparison.fieldCol'),
        StatusCol: t('manifestComparison.statusCol'),
        ResolutionLabel: t('manifestComparison.resolutionLabel'),
        ReasonLabel: t('manifestComparison.reasonLabel'),
        SubmitLabel: t('manifestComparison.submitLabel'),
        MatchLabel: t('manifestComparison.matchLabel'),
        MismatchLabel: t('manifestComparison.mismatchLabel'),
        MissingLabel: t('manifestComparison.missingLabel'),
      },
    });
  },
};

// --- Component ---

export default function Reconciliation(
  { Data }: PageProps<ReconciliationPageData>,
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
      <ReconciliationTable
        reconciliations={d.Reconciliations.map((r) => ({
          reconciliationId: r.ReconciliationId,
          manifestId: r.ManifestId,
          discrepancyType: r.DiscrepancyType,
          discrepancyLabel: r.DiscrepancyLabel,
          expectedCount: r.ExpectedCount,
          actualCount: r.ActualCount,
          missingFieldsLabel: r.MissingFieldsLabel,
          status: r.Status,
          statusLabel: r.StatusLabel,
          slaDeadline: r.SlaDeadline,
          lastAction: r.LastAction,
        }))}
        totalCount={d.TotalCount}
        searchPlaceholder={d.SearchPlaceholder}
        columnHeaders={{
          reconciliationId: d.ColumnHeaders.ReconciliationId,
          manifestId: d.ColumnHeaders.ManifestId,
          discrepancyType: d.ColumnHeaders.DiscrepancyType,
          expected: d.ColumnHeaders.Expected,
          actual: d.ColumnHeaders.Actual,
          missingFields: d.ColumnHeaders.MissingFields,
          status: d.ColumnHeaders.Status,
          slaDeadline: d.ColumnHeaders.SlaDeadline,
          actions: d.ColumnHeaders.Actions,
        }}
        filterLabels={{
          allTypes: d.FilterLabels.AllTypes,
          allStatuses: d.FilterLabels.AllStatuses,
          types: d.FilterLabels.Types.map((t) => ({
            value: t.Value,
            label: t.Label,
          })),
          statuses: d.FilterLabels.Statuses.map((s) => ({
            value: s.Value,
            label: s.Label,
          })),
        }}
        resolveLabel={d.ResolveLabel}
        emptyNoReconciliations={d.EmptyNoReconciliations}
        emptyNoMatch={d.EmptyNoMatch}
        canResolve={d.CanResolve}
        apiBase=''
        resolutionLabels={{
          resolutionTypeLabel: d.ResolutionLabels.ResolutionTypeLabel,
          resolutionTypes: d.ResolutionLabels.ResolutionTypes.map((rt) => ({
            value: rt.Value,
            label: rt.Label,
          })),
          noteLabel: d.ResolutionLabels.NoteLabel,
          correctionReasonLabel: d.ResolutionLabels.CorrectionReasonLabel,
          submitLabel: d.ResolutionLabels.SubmitLabel,
          cancelLabel: d.ResolutionLabels.CancelLabel,
        }}
      />

      {d.ComparisonData && (
        <ManifestComparison
          reconciliationId={d.ComparisonData.ReconciliationId}
          manifestId={d.ComparisonData.ManifestId}
          fields={d.ComparisonData.Fields.map((f) => ({
            field: f.Field,
            expected: f.Expected,
            actual: f.Actual,
            status: f.Status,
          }))}
          labels={{
            heading: d.ComparisonLabels.Heading,
            expectedCol: d.ComparisonLabels.ExpectedCol,
            actualCol: d.ComparisonLabels.ActualCol,
            fieldCol: d.ComparisonLabels.FieldCol,
            statusCol: d.ComparisonLabels.StatusCol,
            resolutionLabel: d.ComparisonLabels.ResolutionLabel,
            reasonLabel: d.ComparisonLabels.ReasonLabel,
            submitLabel: d.ComparisonLabels.SubmitLabel,
            matchLabel: d.ComparisonLabels.MatchLabel,
            mismatchLabel: d.ComparisonLabels.MismatchLabel,
            missingLabel: d.ComparisonLabels.MissingLabel,
          }}
          apiBase=''
          canResolve={d.CanResolve}
        />
      )}
    </div>
  );
}
