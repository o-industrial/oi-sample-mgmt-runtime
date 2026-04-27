import { PageProps } from "@fathym/eac-applications/preact";
import { EaCRuntimeHandlerSet } from "@fathym/eac/runtime/pipelines";
import { OISampleMgmtWebState } from "../../../../src/state/OISampleMgmtWebState.ts";
import { useTranslation } from "../../../../src/utils/useTranslation.ts";
import { createClientFromRequest } from "../../../../src/client/createClientFromRequest.ts";
import CustodyReport from "../../../components/CustodyReport.tsx";

// --- Types (TitleCase for server data) ---

type CustodyEventView = {
  EventId: string;
  Timestamp: string;
  EventType: string;
  EventLabel: string;
  Description: string;
  PerformedBy: string;
  EvidenceLinks: string[];
  AlcoaPrinciples: string[];
};

type SampleSummary = {
  SampleId: string;
  StudyId: string;
  OriginSite: string;
  ReceivedAt: string;
  Status: string;
  StatusLabel: string;
  StorageLocation: string;
};

type CustodyPageData = {
  Heading: string;
  Subtitle: string;
  SubNavLabels: {
    AuditTrail: string;
    EthicsApproval: string;
    Custody: string;
  };
  SearchPlaceholder: string;
  SearchButtonLabel: string;
  EmptyLabel: string;
  NotFoundLabel: string;
  SampleLabels: {
    SampleId: string;
    Study: string;
    Origin: string;
    Received: string;
    Status: string;
    Storage: string;
  };
  ViewLabels: { Timeline: string; Table: string };
  ColumnHeaders: {
    Timestamp: string;
    Event: string;
    Description: string;
    PerformedBy: string;
    Alcoa: string;
    Evidence: string;
  };
  ExportPdfLabel: string;
  EventCountLabel: string;
  SearchedSampleId: string | null;
  Sample: SampleSummary | null;
  Events: CustodyEventView[];
  NotFound: boolean;
};

// --- Handler ---

export const handler: EaCRuntimeHandlerSet<
  OISampleMgmtWebState,
  CustodyPageData
> = {
  GET: async (req, ctx) => {
    if (!ctx.State.AccessRights.includes("compliance:view")) {
      return new Response("Forbidden", { status: 403 });
    }

    const { t } = useTranslation(ctx.State.Strings);
    const url = new URL(req.url);
    const sampleId = url.searchParams.get("sampleId") || null;

    let sample: SampleSummary | null = null;
    let events: CustodyEventView[] = [];
    let notFound = false;

    if (sampleId) {
      const client = await createClientFromRequest(req);
      const timeline = await client.Custody.Get(sampleId);

      if (timeline) {
        sample = {
          ...timeline.Sample,
          StatusLabel: t(
            `track.samples.status.${
              timeline.Sample.Status === "in-storage"
                ? "inStorage"
                : timeline.Sample.Status
            }`,
          ),
        };

        events = timeline.Events.map((e) => ({
          ...e,
          EventLabel: t(`report.custody.event.${e.EventType}`) || e.EventType,
        }));
      } else {
        notFound = true;
      }
    }

    return ctx.Render({
      ...ctx.Data,
      Heading: t("report.custody.heading"),
      Subtitle: t("report.custody.subtitle"),
      SubNavLabels: {
        AuditTrail: t("report.auditTrail.heading"),
        EthicsApproval: t("report.ethics.heading"),
        Custody: t("report.custody.heading"),
      },
      SearchPlaceholder: t("report.custody.search.placeholder"),
      SearchButtonLabel: t("report.custody.search.button"),
      EmptyLabel: t("report.custody.empty"),
      NotFoundLabel: t("report.custody.notFound"),
      SampleLabels: {
        SampleId: t("report.custody.sample.sampleId"),
        Study: t("report.custody.sample.study"),
        Origin: t("report.custody.sample.origin"),
        Received: t("report.custody.sample.received"),
        Status: t("report.custody.sample.status"),
        Storage: t("report.custody.sample.storage"),
      },
      ViewLabels: {
        Timeline: t("report.custody.view.timeline"),
        Table: t("report.custody.view.table"),
      },
      ColumnHeaders: {
        Timestamp: t("report.custody.col.timestamp"),
        Event: t("report.custody.col.event"),
        Description: t("report.custody.col.description"),
        PerformedBy: t("report.custody.col.performedBy"),
        Alcoa: t("report.custody.col.alcoa"),
        Evidence: t("report.custody.col.evidence"),
      },
      ExportPdfLabel: t("report.custody.exportPdf"),
      EventCountLabel: t("report.custody.eventCount"),
      SearchedSampleId: sampleId,
      Sample: sample,
      Events: events,
      NotFound: notFound,
    });
  },
};

// --- Component ---

export default function CustodyPage({ Data }: PageProps<CustodyPageData>) {
  const d = Data!;

  return (
    <div class="space-y-6">
      {/* Sub-navigation */}
      <div class="flex gap-1 print:hidden">
        <a
          href="/report/audit-trail"
          data-eac-bypass-base
          class="px-4 py-2 rounded-md text-sm font-medium text-on-surface-secondary hover:bg-surface-card transition-colors"
        >
          {d.SubNavLabels.AuditTrail}
        </a>
        <a
          href="/report/ethics-approval"
          data-eac-bypass-base
          class="px-4 py-2 rounded-md text-sm font-medium text-on-surface-secondary hover:bg-surface-card transition-colors"
        >
          {d.SubNavLabels.EthicsApproval}
        </a>
        <a
          href="/report/custody"
          data-eac-bypass-base
          class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-on-primary"
        >
          {d.SubNavLabels.Custody}
        </a>
      </div>

      {/* Header */}
      <div>
        <h1 class="text-xl font-bold text-primary">{d.Heading}</h1>
        <p class="text-sm text-on-surface-secondary mt-1">{d.Subtitle}</p>
      </div>

      {/* Search bar (HTML form — no island needed, no action attr per H10) */}
      <form
        method="GET"
        class="flex gap-2 rounded-lg border border-border bg-surface-card p-4 print:hidden"
      >
        <input
          type="text"
          name="sampleId"
          value={d.SearchedSampleId ?? ""}
          placeholder={d.SearchPlaceholder}
          class="flex-1 border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-focus"
        />
        <button
          type="submit"
          class="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium hover:opacity-80 transition-opacity"
        >
          {d.SearchButtonLabel}
        </button>
      </form>

      {/* Empty state */}
      {!d.SearchedSampleId && (
        <div class="rounded-lg border border-border bg-surface-card p-8 text-center">
          <p class="text-on-surface-muted">{d.EmptyLabel}</p>
        </div>
      )}

      {/* Not found */}
      {d.NotFound && (
        <div class="rounded-lg border border-status-problem bg-status-problem-bg p-4">
          <p class="text-status-problem-text text-sm">{d.NotFoundLabel}</p>
        </div>
      )}

      {/* Sample header card */}
      {d.Sample && (
        <div class="rounded-lg border border-border bg-surface-card p-4">
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p class="text-on-surface-secondary text-xs">
                {d.SampleLabels.SampleId}
              </p>
              <p class="font-mono font-medium text-on-surface">
                {d.Sample.SampleId}
              </p>
            </div>
            <div>
              <p class="text-on-surface-secondary text-xs">
                {d.SampleLabels.Study}
              </p>
              <p class="text-on-surface">{d.Sample.StudyId}</p>
            </div>
            <div>
              <p class="text-on-surface-secondary text-xs">
                {d.SampleLabels.Origin}
              </p>
              <p class="text-on-surface">{d.Sample.OriginSite}</p>
            </div>
            <div>
              <p class="text-on-surface-secondary text-xs">
                {d.SampleLabels.Received}
              </p>
              <p class="font-mono text-xs text-on-surface">
                {d.Sample.ReceivedAt}
              </p>
            </div>
            <div>
              <p class="text-on-surface-secondary text-xs">
                {d.SampleLabels.Status}
              </p>
              <p class="text-on-surface font-medium">
                {d.Sample.StatusLabel}
              </p>
            </div>
            <div>
              <p class="text-on-surface-secondary text-xs">
                {d.SampleLabels.Storage}
              </p>
              <p class="text-on-surface">
                {d.Sample.StorageLocation || "\u2014"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline / Table report */}
      {d.Sample && d.Events.length > 0 && (
        <CustodyReport
          events={d.Events.map((e) => ({
            eventId: e.EventId,
            timestamp: e.Timestamp,
            eventType: e.EventType,
            eventLabel: e.EventLabel,
            description: e.Description,
            performedBy: e.PerformedBy,
            evidenceLinks: e.EvidenceLinks,
            alcoaPrinciples: e.AlcoaPrinciples,
          }))}
          viewLabels={{
            timeline: d.ViewLabels.Timeline,
            table: d.ViewLabels.Table,
          }}
          columnHeaders={{
            timestamp: d.ColumnHeaders.Timestamp,
            event: d.ColumnHeaders.Event,
            description: d.ColumnHeaders.Description,
            performedBy: d.ColumnHeaders.PerformedBy,
            alcoa: d.ColumnHeaders.Alcoa,
            evidence: d.ColumnHeaders.Evidence,
          }}
          exportPdfLabel={d.ExportPdfLabel}
          eventCountLabel={d.EventCountLabel}
        />
      )}
    </div>
  );
}
