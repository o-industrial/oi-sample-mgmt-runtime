import { useState } from "preact/hooks";

export const IsIsland = true;

// --- Prop types (camelCase for island props — C6/C7) ---

type TurboTaxStatus = "ready" | "attention" | "volume-hold" | "problem";

type ReconciliationRow = {
  reconciliationId: string;
  manifestId: string;
  discrepancyType: string;
  discrepancyLabel: string;
  expectedCount: number;
  actualCount: number;
  missingFieldsLabel: string;
  status: TurboTaxStatus;
  statusLabel: string;
  slaDeadline: string;
  lastAction: string;
};

type ReconciliationTableProps = {
  reconciliations: ReconciliationRow[];
  totalCount: number;
  searchPlaceholder: string;
  columnHeaders: {
    reconciliationId: string;
    manifestId: string;
    discrepancyType: string;
    expected: string;
    actual: string;
    missingFields: string;
    status: string;
    slaDeadline: string;
    actions: string;
  };
  filterLabels: {
    allTypes: string;
    allStatuses: string;
    types: Array<{ value: string; label: string }>;
    statuses: Array<{ value: string; label: string }>;
  };
  resolveLabel: string;
  emptyNoReconciliations: string;
  emptyNoMatch: string;
  canResolve: boolean;
  apiBase: string;
};

// --- Status badge semantic token map (C5) ---

const STATUS_CLASSES: Record<string, string> = {
  ready: "bg-status-ready-bg text-status-ready-text",
  attention: "bg-status-attention-bg text-status-attention-text",
  "volume-hold": "bg-status-hold-bg text-status-hold-text",
  problem: "bg-status-problem-bg text-status-problem-text",
};

const DISCREPANCY_CLASSES: Record<string, string> = {
  "count-mismatch": "bg-status-problem-bg text-status-problem-text",
  "metadata-gap": "bg-status-attention-bg text-status-attention-text",
  "barcode-conflict": "bg-secondary text-on-primary",
  "format-error": "bg-surface-inset text-on-surface-muted",
};

// --- Component ---

export default function ReconciliationTable({
  reconciliations: initialReconciliations,
  totalCount,
  searchPlaceholder,
  columnHeaders,
  filterLabels,
  resolveLabel,
  emptyNoReconciliations,
  emptyNoMatch,
  canResolve,
  apiBase,
}: ReconciliationTableProps) {
  const [reconciliations, setReconciliations] = useState(
    initialReconciliations,
  );
  const [acting, setActing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  async function handleResolve(reconciliationId: string) {
    const resolution = globalThis.prompt("Resolution:");
    if (resolution === null) return;
    const correctionReason = globalThis.prompt(
      "Correction reason (required for GxP):",
    );
    if (correctionReason === null || correctionReason.trim().length === 0) {
      return;
    }

    setActing(reconciliationId);
    try {
      const res = await fetch(`${apiBase}/api/reconciliations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resolve",
          ReconciliationId: reconciliationId,
          Resolution: resolution,
          CorrectionReason: correctionReason,
          UserId: "current-user",
        }),
      });
      if (res.ok) {
        setReconciliations((prev) =>
          prev.filter((r) => r.reconciliationId !== reconciliationId)
        );
      }
    } finally {
      setActing(null);
    }
  }

  const filtered = reconciliations.filter((r) => {
    if (typeFilter && r.discrepancyType !== typeFilter) return false;
    if (statusFilter && r.status !== statusFilter) return false;
    if (
      search &&
      !r.reconciliationId.toLowerCase().includes(search.toLowerCase()) &&
      !r.manifestId.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const isOverdue = (deadline: string): boolean => {
    try {
      return new Date(deadline) < new Date();
    } catch {
      return false;
    }
  };

  const colCount = canResolve ? 9 : 8;

  return (
    <div class="space-y-4">
      {/* Filter bar */}
      <div class="flex flex-wrap gap-4 rounded-lg border border-border bg-surface-card p-4">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
          class="flex-1 min-w-[200px] border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-focus"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter((e.target as HTMLSelectElement).value)}
          class="border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface"
        >
          <option value="">{filterLabels.allTypes}</option>
          {filterLabels.types.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter((e.target as HTMLSelectElement).value)}
          class="border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface"
        >
          <option value="">{filterLabels.allStatuses}</option>
          {filterLabels.statuses.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Reconciliation table */}
      <div class="rounded-lg border border-border bg-surface-card overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-surface-elevated border-b border-border">
            <tr class="text-left text-on-surface-secondary">
              <th class="px-4 py-3 font-medium">
                {columnHeaders.reconciliationId}
              </th>
              <th class="px-4 py-3 font-medium">
                {columnHeaders.manifestId}
              </th>
              <th class="px-4 py-3 font-medium">
                {columnHeaders.discrepancyType}
              </th>
              <th class="px-4 py-3 font-medium text-right">
                {columnHeaders.expected}
              </th>
              <th class="px-4 py-3 font-medium text-right">
                {columnHeaders.actual}
              </th>
              <th class="px-4 py-3 font-medium">
                {columnHeaders.missingFields}
              </th>
              <th class="px-4 py-3 font-medium">{columnHeaders.status}</th>
              <th class="px-4 py-3 font-medium">
                {columnHeaders.slaDeadline}
              </th>
              {canResolve && (
                <th class="px-4 py-3 font-medium">
                  {columnHeaders.actions}
                </th>
              )}
            </tr>
          </thead>
          <tbody class="divide-y divide-border-subtle">
            {filtered.length === 0
              ? (
                <tr>
                  <td
                    colSpan={colCount}
                    class="px-4 py-8 text-center text-on-surface-muted"
                  >
                    {totalCount === 0 ? emptyNoReconciliations : emptyNoMatch}
                  </td>
                </tr>
              )
              : filtered.map((r) => {
                const delta = r.actualCount - r.expectedCount;
                return (
                  <tr
                    key={r.reconciliationId}
                    class="hover:bg-surface-elevated"
                  >
                    <td class="px-4 py-3 font-mono text-xs font-medium text-on-surface">
                      {r.reconciliationId}
                    </td>
                    <td class="px-4 py-3 font-mono text-xs text-on-surface-secondary">
                      {r.manifestId}
                    </td>
                    <td class="px-4 py-3">
                      <span
                        class={`px-2 py-1 rounded text-xs font-medium ${
                          DISCREPANCY_CLASSES[r.discrepancyType] ??
                            "bg-surface-inset text-on-surface-muted"
                        }`}
                      >
                        {r.discrepancyLabel}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-right text-on-surface tabular-nums">
                      {r.expectedCount}
                    </td>
                    <td
                      class={`px-4 py-3 text-right tabular-nums font-medium ${
                        delta !== 0
                          ? "text-status-problem-text"
                          : "text-on-surface"
                      }`}
                    >
                      {r.actualCount}
                      {delta !== 0 && (
                        <span class="ml-1 text-xs">({delta})</span>
                      )}
                    </td>
                    <td class="px-4 py-3 text-xs text-on-surface-muted max-w-[160px] truncate">
                      {r.missingFieldsLabel || "\u2014"}
                    </td>
                    <td class="px-4 py-3">
                      <span
                        class={`px-2 py-1 rounded text-xs font-semibold ${
                          STATUS_CLASSES[r.status] ??
                            "bg-surface-inset text-on-surface-muted"
                        }`}
                        title={r.lastAction}
                      >
                        {r.statusLabel}
                      </span>
                    </td>
                    <td
                      class={`px-4 py-3 font-mono text-xs ${
                        isOverdue(r.slaDeadline)
                          ? "text-status-problem-text font-semibold"
                          : "text-on-surface-muted"
                      }`}
                    >
                      {r.slaDeadline}
                    </td>
                    {canResolve && (
                      <td class="px-4 py-3">
                        <button
                          type="button"
                          disabled={acting === r.reconciliationId}
                          onClick={() => handleResolve(r.reconciliationId)}
                          class="px-3 py-1 border border-border rounded text-xs text-on-surface hover:bg-surface-elevated transition-colors disabled:opacity-50"
                        >
                          {resolveLabel}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
