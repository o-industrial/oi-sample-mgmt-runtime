import { useState } from 'preact/hooks';

export const IsIsland = true;

// --- Prop types (camelCase for island props — C6/C7) ---

type TurboTaxStatus = 'ready' | 'attention' | 'volume-hold' | 'problem';

type ReturnRow = {
  returnId: string;
  sampleCount: number;
  destination: string;
  reason: string;
  requestedBy: string;
  requestedAt: string;
  status: TurboTaxStatus;
  statusLabel: string;
  packagingInstructions: string;
  outcome: string;
  outcomeLabel: string;
  lastAction: string;
};

type ReturnTableProps = {
  returns: ReturnRow[];
  totalCount: number;
  searchPlaceholder: string;
  columnHeaders: {
    returnId: string;
    destination: string;
    sampleCount: string;
    requestedBy: string;
    requestedAt: string;
    status: string;
    packaging: string;
    outcome: string;
    actions: string;
  };
  filterLabels: {
    allStatuses: string;
    statuses: Array<{ value: string; label: string }>;
  };
  approveLabel: string;
  emptyNoReturns: string;
  emptyNoMatch: string;
  canApprove: boolean;
};

// --- Status badge semantic token map (C5) ---

const STATUS_CLASSES: Record<string, string> = {
  ready: 'bg-status-ready-bg text-status-ready-text',
  attention: 'bg-status-attention-bg text-status-attention-text',
  'volume-hold': 'bg-status-hold-bg text-status-hold-text',
  problem: 'bg-status-problem-bg text-status-problem-text',
};

const OUTCOME_CLASSES: Record<string, string> = {
  returned: 'bg-status-ready-bg text-status-ready-text',
  depleted: 'bg-surface-inset text-on-surface-muted',
  pending: 'bg-status-attention-bg text-status-attention-text',
};

// --- Component ---

export default function ReturnTable({
  returns,
  totalCount,
  searchPlaceholder,
  columnHeaders,
  filterLabels,
  approveLabel,
  emptyNoReturns,
  emptyNoMatch,
  canApprove,
}: ReturnTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = returns.filter((r) => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (
      search &&
      !r.returnId.toLowerCase().includes(search.toLowerCase()) &&
      !r.destination.toLowerCase().includes(search.toLowerCase()) &&
      !r.requestedBy.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const colCount = canApprove ? 8 : 7;

  return (
    <div class='space-y-4'>
      {/* Filter bar */}
      <div class='flex flex-wrap gap-4 rounded-lg border border-border bg-surface-card p-4'>
        <input
          type='text'
          placeholder={searchPlaceholder}
          value={search}
          onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
          class='flex-1 min-w-[200px] border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-focus'
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter((e.target as HTMLSelectElement).value)}
          class='border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface'
        >
          <option value=''>{filterLabels.allStatuses}</option>
          {filterLabels.statuses.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Return table */}
      <div class='rounded-lg border border-border bg-surface-card overflow-hidden'>
        <table class='w-full text-sm'>
          <thead class='bg-surface-elevated border-b border-border'>
            <tr class='text-left text-on-surface-secondary'>
              <th class='px-4 py-3 font-medium'>
                {columnHeaders.returnId}
              </th>
              <th class='px-4 py-3 font-medium'>
                {columnHeaders.destination}
              </th>
              <th class='px-4 py-3 font-medium'>
                {columnHeaders.sampleCount}
              </th>
              <th class='px-4 py-3 font-medium'>
                {columnHeaders.requestedBy}
              </th>
              <th class='px-4 py-3 font-medium'>{columnHeaders.status}</th>
              <th class='px-4 py-3 font-medium'>{columnHeaders.outcome}</th>
              <th class='px-4 py-3 font-medium'>
                {columnHeaders.packaging}
              </th>
              {canApprove && (
                <th class='px-4 py-3 font-medium'>
                  {columnHeaders.actions}
                </th>
              )}
            </tr>
          </thead>
          <tbody class='divide-y divide-border-subtle'>
            {filtered.length === 0
              ? (
                <tr>
                  <td
                    colSpan={colCount}
                    class='px-4 py-8 text-center text-on-surface-muted'
                  >
                    {totalCount === 0 ? emptyNoReturns : emptyNoMatch}
                  </td>
                </tr>
              )
              : filtered.map((r) => (
                <tr key={r.returnId} class='hover:bg-surface-elevated'>
                  <td class='px-4 py-3 font-mono text-xs font-medium text-on-surface'>
                    {r.returnId}
                  </td>
                  <td class='px-4 py-3 text-on-surface-secondary'>
                    {r.destination}
                  </td>
                  <td class='px-4 py-3 text-on-surface'>
                    {r.sampleCount}
                  </td>
                  <td class='px-4 py-3 text-on-surface-secondary'>
                    {r.requestedBy}
                  </td>
                  <td class='px-4 py-3'>
                    <span
                      class={`px-2 py-1 rounded text-xs font-semibold ${
                        STATUS_CLASSES[r.status] ??
                          'bg-surface-inset text-on-surface-muted'
                      }`}
                      title={r.lastAction}
                    >
                      {r.statusLabel}
                    </span>
                  </td>
                  <td class='px-4 py-3'>
                    <span
                      class={`px-2 py-1 rounded text-xs font-medium ${
                        OUTCOME_CLASSES[r.outcome] ??
                          'bg-surface-inset text-on-surface-muted'
                      }`}
                    >
                      {r.outcomeLabel}
                    </span>
                  </td>
                  <td class='px-4 py-3 text-xs text-on-surface-muted max-w-[200px] truncate'>
                    {r.packagingInstructions || '\u2014'}
                  </td>
                  {canApprove && (
                    <td class='px-4 py-3'>
                      <button
                        type='button'
                        class='px-3 py-1 border border-border rounded text-xs text-on-surface hover:bg-surface-elevated transition-colors'
                      >
                        {approveLabel}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
