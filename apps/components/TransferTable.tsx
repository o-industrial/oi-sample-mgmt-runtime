import { useState } from 'preact/hooks';

export const IsIsland = true;

// --- Prop types (camelCase for island props — C6/C7) ---

type TransferType = 'inter-freezer' | 'inter-site' | 'inter-study';
type TurboTaxStatus = 'ready' | 'attention' | 'volume-hold' | 'problem';

type TransferRow = {
  transferId: string;
  type: TransferType;
  typeLabel: string;
  sampleCount: number;
  source: string;
  destination: string;
  status: TurboTaxStatus;
  statusLabel: string;
  statusReason: string;
  slaDeadline: string;
  lastAction: string;
};

type TransferTableProps = {
  transfers: TransferRow[];
  totalCount: number;
  searchPlaceholder: string;
  columnHeaders: {
    transferId: string;
    type: string;
    source: string;
    destination: string;
    sampleCount: string;
    status: string;
    slaDeadline: string;
    lastAction: string;
    actions: string;
  };
  filterLabels: {
    allTypes: string;
    allStatuses: string;
    types: Array<{ value: string; label: string }>;
    statuses: Array<{ value: string; label: string }>;
  };
  approveLabel: string;
  emptyNoTransfers: string;
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

const TYPE_CLASSES: Record<string, string> = {
  'inter-freezer': 'bg-surface-inset text-on-surface-muted',
  'inter-site': 'bg-status-attention-bg text-status-attention-text',
  'inter-study': 'bg-secondary text-on-primary',
};

// --- Component ---

export default function TransferTable({
  transfers,
  totalCount,
  searchPlaceholder,
  columnHeaders,
  filterLabels,
  approveLabel,
  emptyNoTransfers,
  emptyNoMatch,
  canApprove,
}: TransferTableProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = transfers.filter((t) => {
    if (typeFilter && t.type !== typeFilter) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    if (
      search &&
      !t.transferId.toLowerCase().includes(search.toLowerCase()) &&
      !t.source.toLowerCase().includes(search.toLowerCase()) &&
      !t.destination.toLowerCase().includes(search.toLowerCase())
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
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter((e.target as HTMLSelectElement).value)}
          class='border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface'
        >
          <option value=''>{filterLabels.allTypes}</option>
          {filterLabels.types.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
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

      {/* Transfer table */}
      <div class='rounded-lg border border-border bg-surface-card overflow-hidden'>
        <table class='w-full text-sm'>
          <thead class='bg-surface-elevated border-b border-border'>
            <tr class='text-left text-on-surface-secondary'>
              <th class='px-4 py-3 font-medium'>
                {columnHeaders.transferId}
              </th>
              <th class='px-4 py-3 font-medium'>{columnHeaders.type}</th>
              <th class='px-4 py-3 font-medium'>
                {columnHeaders.source} / {columnHeaders.destination}
              </th>
              <th class='px-4 py-3 font-medium'>
                {columnHeaders.sampleCount}
              </th>
              <th class='px-4 py-3 font-medium'>{columnHeaders.status}</th>
              <th class='px-4 py-3 font-medium'>
                {columnHeaders.slaDeadline}
              </th>
              <th class='px-4 py-3 font-medium'>
                {columnHeaders.lastAction}
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
                    {totalCount === 0 ? emptyNoTransfers : emptyNoMatch}
                  </td>
                </tr>
              )
              : filtered.map((tr) => (
                <tr key={tr.transferId} class='hover:bg-surface-elevated'>
                  <td class='px-4 py-3 font-mono text-xs font-medium text-on-surface'>
                    {tr.transferId}
                  </td>
                  <td class='px-4 py-3'>
                    <span
                      class={`px-2 py-1 rounded text-xs font-medium ${
                        TYPE_CLASSES[tr.type] ??
                          'bg-surface-inset text-on-surface-muted'
                      }`}
                    >
                      {tr.typeLabel}
                    </span>
                  </td>
                  <td class='px-4 py-3 text-on-surface-secondary'>
                    <span>{tr.source}</span>
                    <span class='mx-1 text-on-surface-muted'>&rarr;</span>
                    <span>{tr.destination}</span>
                  </td>
                  <td class='px-4 py-3 text-on-surface'>
                    {tr.sampleCount}
                  </td>
                  <td class='px-4 py-3'>
                    <span
                      class={`px-2 py-1 rounded text-xs font-semibold ${
                        STATUS_CLASSES[tr.status] ??
                          'bg-surface-inset text-on-surface-muted'
                      }`}
                      title={tr.statusReason}
                    >
                      {tr.statusLabel}
                    </span>
                  </td>
                  <td
                    class={`px-4 py-3 font-mono text-xs ${
                      isOverdue(tr.slaDeadline)
                        ? 'text-status-problem-text font-semibold'
                        : 'text-on-surface-muted'
                    }`}
                  >
                    {tr.slaDeadline}
                  </td>
                  <td class='px-4 py-3 text-xs text-on-surface-muted'>
                    {tr.lastAction}
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
