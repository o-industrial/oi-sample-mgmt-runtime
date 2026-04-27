import { PageProps } from "@fathym/eac-applications/preact";
import { EaCRuntimeHandlerSet } from "@fathym/eac/runtime/pipelines";
import { OISampleMgmtWebState } from "../../../src/state/OISampleMgmtWebState.ts";
import { useTranslation } from "../../../src/utils/useTranslation.ts";
import TransferTable from "../../components/TransferTable.tsx";
import { createClientFromRequest } from "../../../src/client/createClientFromRequest.ts";

// --- Types (TitleCase for server data — C4) ---

type TransferType = "inter-freezer" | "inter-site" | "inter-study";
type TurboTaxStatus = "ready" | "attention" | "volume-hold" | "problem";

type TransferItem = {
  TransferId: string;
  Type: TransferType;
  TypeLabel: string;
  SampleCount: number;
  Source: string;
  Destination: string;
  Status: TurboTaxStatus;
  StatusLabel: string;
  StatusReason: string;
  SlaDeadline: string;
  LastAction: string;
};

type TransferPageData = {
  Heading: string;
  Subtitle: string;
  SearchPlaceholder: string;
  StatusCards: Array<{ Label: string; Count: number }>;
  ColumnHeaders: {
    TransferId: string;
    Type: string;
    Source: string;
    Destination: string;
    SampleCount: string;
    Status: string;
    SlaDeadline: string;
    LastAction: string;
    Actions: string;
  };
  FilterLabels: {
    AllTypes: string;
    AllStatuses: string;
    Types: Array<{ Value: string; Label: string }>;
    Statuses: Array<{ Value: string; Label: string }>;
  };
  Transfers: TransferItem[];
  TotalCount: number;
  ApproveLabel: string;
  EmptyNoTransfers: string;
  EmptyNoMatch: string;
  CanApprove: boolean;
};

// --- Type-to-i18n key helper ---

function typeKey(type: string): string {
  switch (type) {
    case "inter-freezer":
      return "interFreezer";
    case "inter-site":
      return "interSite";
    case "inter-study":
      return "interStudy";
    default:
      return type;
  }
}

// --- Handler ---

export const handler: EaCRuntimeHandlerSet<
  OISampleMgmtWebState,
  TransferPageData
> = {
  GET: async (req, ctx) => {
    if (!ctx.State.AccessRights.includes("samples:receive")) {
      return new Response("Forbidden", { status: 403 });
    }

    const { t } = useTranslation(ctx.State.Strings);
    const rights = ctx.State.AccessRights;

    const client = await createClientFromRequest(req);
    const rawTransfers = await client.Transfers.List();

    const transfers: TransferItem[] = rawTransfers.map((tr) => ({
      TransferId: tr.TransferId,
      Type: tr.Type as TransferType,
      TypeLabel: t(`transfer.type.${typeKey(tr.Type)}`),
      SampleCount: tr.SampleIds.length,
      Source: tr.Source,
      Destination: tr.Destination,
      Status: tr.Status as TurboTaxStatus,
      StatusLabel: t(
        `transfer.status.${
          tr.Status === "volume-hold" ? "volumeHold" : tr.Status
        }`,
      ),
      StatusReason: tr.StatusReason,
      SlaDeadline: tr.SlaDeadline,
      LastAction: tr.LastAction,
    }));

    const statusCounts = {
      ready: transfers.filter((t) => t.Status === "ready").length,
      attention: transfers.filter((t) => t.Status === "attention").length,
      volumeHold: transfers.filter((t) => t.Status === "volume-hold").length,
      problem: transfers.filter((t) => t.Status === "problem").length,
    };

    return ctx.Render({
      ...ctx.Data,
      Heading: t("transfer.heading"),
      Subtitle: t("transfer.subtitle"),
      SearchPlaceholder: t("transfer.search.placeholder"),
      StatusCards: [
        { Label: t("transfer.card.total"), Count: transfers.length },
        { Label: t("transfer.card.ready"), Count: statusCounts.ready },
        {
          Label: t("transfer.card.attention"),
          Count: statusCounts.attention,
        },
        {
          Label: t("transfer.card.volumeHold"),
          Count: statusCounts.volumeHold,
        },
        { Label: t("transfer.card.problem"), Count: statusCounts.problem },
      ],
      ColumnHeaders: {
        TransferId: t("transfer.col.transferId"),
        Type: t("transfer.col.type"),
        Source: t("transfer.col.source"),
        Destination: t("transfer.col.destination"),
        SampleCount: t("transfer.col.sampleCount"),
        Status: t("transfer.col.status"),
        SlaDeadline: t("transfer.col.slaDeadline"),
        LastAction: t("transfer.col.lastAction"),
        Actions: t("transfer.col.actions"),
      },
      FilterLabels: {
        AllTypes: t("transfer.filter.allTypes"),
        AllStatuses: t("transfer.filter.allStatuses"),
        Types: [
          {
            Value: "inter-freezer",
            Label: t("transfer.type.interFreezer"),
          },
          { Value: "inter-site", Label: t("transfer.type.interSite") },
          { Value: "inter-study", Label: t("transfer.type.interStudy") },
        ],
        Statuses: [
          { Value: "ready", Label: t("transfer.status.ready") },
          { Value: "attention", Label: t("transfer.status.attention") },
          {
            Value: "volume-hold",
            Label: t("transfer.status.volumeHold"),
          },
          { Value: "problem", Label: t("transfer.status.problem") },
        ],
      },
      Transfers: transfers,
      TotalCount: transfers.length,
      ApproveLabel: t("transfer.approve"),
      EmptyNoTransfers: t("transfer.emptyNoTransfers"),
      EmptyNoMatch: t("transfer.emptyNoMatch"),
      CanApprove: rights.includes("custody:approve"),
    });
  },
};

// --- Component ---

export default function Transfer(
  { Data }: PageProps<TransferPageData>,
) {
  const d = Data!;

  return (
    <div class="space-y-6">
      {/* Header */}
      <div>
        <h1 class="text-xl font-bold text-primary">{d.Heading}</h1>
        <p class="text-sm text-on-surface-secondary mt-1">{d.Subtitle}</p>
      </div>

      {/* Status summary cards */}
      <div class="grid grid-cols-5 gap-4">
        {d.StatusCards.map((card) => (
          <div
            key={card.Label}
            class="rounded-lg border border-border bg-surface-card p-4"
          >
            <p class="text-sm text-on-surface-secondary">{card.Label}</p>
            <p class="text-3xl font-bold mt-1 text-on-surface">
              {card.Count}
            </p>
          </div>
        ))}
      </div>

      {/* Interactive table island — TitleCase → camelCase marshaling (C4/C6) */}
      <TransferTable
        transfers={d.Transfers.map((tr) => ({
          transferId: tr.TransferId,
          type: tr.Type,
          typeLabel: tr.TypeLabel,
          sampleCount: tr.SampleCount,
          source: tr.Source,
          destination: tr.Destination,
          status: tr.Status,
          statusLabel: tr.StatusLabel,
          statusReason: tr.StatusReason,
          slaDeadline: tr.SlaDeadline,
          lastAction: tr.LastAction,
        }))}
        totalCount={d.TotalCount}
        searchPlaceholder={d.SearchPlaceholder}
        columnHeaders={{
          transferId: d.ColumnHeaders.TransferId,
          type: d.ColumnHeaders.Type,
          source: d.ColumnHeaders.Source,
          destination: d.ColumnHeaders.Destination,
          sampleCount: d.ColumnHeaders.SampleCount,
          status: d.ColumnHeaders.Status,
          slaDeadline: d.ColumnHeaders.SlaDeadline,
          lastAction: d.ColumnHeaders.LastAction,
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
        approveLabel={d.ApproveLabel}
        emptyNoTransfers={d.EmptyNoTransfers}
        emptyNoMatch={d.EmptyNoMatch}
        canApprove={d.CanApprove}
        apiBase=""
      />
    </div>
  );
}
