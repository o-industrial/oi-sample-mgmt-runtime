import { useState } from "preact/hooks";

export const IsIsland = true;

// --- Prop types (camelCase for island props — C6/C7) ---

type CustodyEventRow = {
  eventId: string;
  timestamp: string;
  eventType: string;
  eventLabel: string;
  description: string;
  performedBy: string;
  evidenceLinks: string[];
  alcoaPrinciples: string[];
};

type CustodyReportProps = {
  events: CustodyEventRow[];
  viewLabels: { timeline: string; table: string };
  columnHeaders: {
    timestamp: string;
    event: string;
    description: string;
    performedBy: string;
    alcoa: string;
    evidence: string;
  };
  exportPdfLabel: string;
  eventCountLabel: string;
};

// --- Semantic token color map (C5) ---

const EVENT_COLORS: Record<string, string> = {
  received: "bg-status-ready",
  scan: "bg-link",
  create: "bg-link",
  update: "bg-status-attention",
  approve: "bg-status-ready",
  transferred: "bg-status-hold",
  returned: "bg-status-attention",
  depleted: "bg-secondary",
  disposed: "bg-status-problem",
  reconciled: "bg-primary",
  audit: "bg-secondary",
  statusupdate: "bg-status-attention",
};

// --- Component ---

export default function CustodyReport({
  events,
  viewLabels,
  columnHeaders,
  exportPdfLabel,
  eventCountLabel,
}: CustodyReportProps) {
  const [view, setView] = useState<"timeline" | "table">("timeline");

  function handlePrint() {
    globalThis.print();
  }

  return (
    <div class="space-y-4">
      {/* Controls bar */}
      <div class="flex items-center justify-between print:hidden">
        <div class="flex gap-1">
          <button
            type="button"
            onClick={() => setView("timeline")}
            class={`px-3 py-1.5 text-xs rounded-md font-medium ${
              view === "timeline"
                ? "bg-primary text-on-primary"
                : "text-on-surface-secondary hover:bg-surface-card"
            }`}
          >
            {viewLabels.timeline}
          </button>
          <button
            type="button"
            onClick={() => setView("table")}
            class={`px-3 py-1.5 text-xs rounded-md font-medium ${
              view === "table"
                ? "bg-primary text-on-primary"
                : "text-on-surface-secondary hover:bg-surface-card"
            }`}
          >
            {viewLabels.table}
          </button>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-xs text-on-surface-muted">
            {events.length} {eventCountLabel}
          </span>
          <button
            type="button"
            onClick={handlePrint}
            class="px-4 py-1.5 border border-border rounded-md text-xs text-on-surface hover:bg-surface-elevated transition-colors"
          >
            {exportPdfLabel}
          </button>
        </div>
      </div>

      {/* Timeline View */}
      {view === "timeline" && (
        <div class="relative pl-8">
          {/* Vertical line */}
          <div class="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />

          {events.map((evt, i) => (
            <div
              key={evt.eventId}
              class={`relative pb-6 ${i === events.length - 1 ? "pb-0" : ""}`}
            >
              {/* Dot */}
              <div
                class={`absolute left-[-1.15rem] top-1 w-3 h-3 rounded-full border-2 border-surface ${
                  EVENT_COLORS[evt.eventType] ?? "bg-surface-inset"
                }`}
              />

              {/* Content */}
              <div class="rounded-lg border border-border bg-surface-card p-3">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-mono text-xs text-on-surface-muted">
                    {evt.timestamp}
                  </span>
                  <span
                    class={`px-2 py-0.5 rounded text-xs font-medium text-white ${
                      EVENT_COLORS[evt.eventType] ?? "bg-surface-inset"
                    }`}
                  >
                    {evt.eventLabel}
                  </span>
                </div>
                <p class="text-sm text-on-surface">{evt.description}</p>
                <div class="flex items-center gap-4 mt-1 text-xs text-on-surface-secondary">
                  <span>{evt.performedBy}</span>
                  {evt.alcoaPrinciples.length > 0 && (
                    <span class="px-1.5 py-0.5 bg-surface-elevated text-link rounded text-xs">
                      {evt.alcoaPrinciples.join(", ")}
                    </span>
                  )}
                  {evt.evidenceLinks.length > 0 && (
                    <span class="text-link">
                      {evt.evidenceLinks.length} doc(s)
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div class="rounded-lg border border-border bg-surface-card overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-surface-elevated border-b border-border">
              <tr class="text-left text-on-surface-secondary">
                <th class="px-4 py-3 font-medium">
                  {columnHeaders.timestamp}
                </th>
                <th class="px-4 py-3 font-medium">{columnHeaders.event}</th>
                <th class="px-4 py-3 font-medium">
                  {columnHeaders.description}
                </th>
                <th class="px-4 py-3 font-medium">
                  {columnHeaders.performedBy}
                </th>
                <th class="px-4 py-3 font-medium">{columnHeaders.alcoa}</th>
                <th class="px-4 py-3 font-medium">
                  {columnHeaders.evidence}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border-subtle">
              {events.map((evt) => (
                <tr key={evt.eventId} class="hover:bg-surface-elevated">
                  <td class="px-4 py-3 font-mono text-xs text-on-surface">
                    {evt.timestamp}
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class={`px-2 py-0.5 rounded text-xs font-medium text-white ${
                        EVENT_COLORS[evt.eventType] ?? "bg-surface-inset"
                      }`}
                    >
                      {evt.eventLabel}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-on-surface">{evt.description}</td>
                  <td class="px-4 py-3 text-on-surface-secondary">
                    {evt.performedBy}
                  </td>
                  <td class="px-4 py-3">
                    {evt.alcoaPrinciples.map((p) => (
                      <span
                        key={p}
                        class="px-1.5 py-0.5 bg-surface-elevated text-link rounded text-xs mr-1"
                      >
                        {p}
                      </span>
                    ))}
                  </td>
                  <td class="px-4 py-3 text-xs text-link">
                    {evt.evidenceLinks.length > 0
                      ? `${evt.evidenceLinks.length} doc(s)`
                      : "\u2014"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
