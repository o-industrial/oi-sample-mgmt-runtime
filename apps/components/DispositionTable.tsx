import { useState } from 'preact/hooks';

export const IsIsland = true;

// --- Prop types (camelCase for island props — C6/C7) ---

type TurboTaxStatus = 'ready' | 'attention' | 'volume-hold' | 'problem';

type DispositionRow = {
  dispositionId: string;
  sampleId: string;
  decision: string;
  decisionLabel: string;
  status: TurboTaxStatus;
  statusLabel: string;
  dispositionDeadline: string;
  treatment: string;
  treatmentLabel: string;
  evidenceCount: number;
  lastAction: string;
};

type DispositionTableProps = {
  dispositions: DispositionRow[];
  totalCount: number;
  searchPlaceholder: string;
  columnHeaders: {
    dispositionId: string;
    sampleId: string;
    decision: string;
    status: string;
    deadline: string;
    treatmentStatus: string;
    evidence: string;
    actions: string;
  };
  filterLabels: {
    allDecisions: string;
    allStatuses: string;
    decisions: Array<{ value: string; label: string }>;
    statuses: Array<{ value: string; label: string }>;
  };
  approveLabel: string;
  emptyNoDispositions: string;
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

const DECISION_CLASSES: Record<string, string> = {
  destroy: 'bg-status-problem-bg text-status-problem-text',
  retain: 'bg-status-ready-bg text-status-ready-text',
  deplete: 'bg-surface-inset text-on-surface-muted',
  pending: 'bg-status-attention-bg text-status-attention-text',
};

const TREATMENT_CLASSES: Record<string, string> = {
  blinded: 'bg-status-attention-bg text-status-attention-text',
  unblinded: 'bg-status-ready-bg text-status-ready-text',
};

// --- Component ---

export default function DispositionTable({
  dispositions,
  totalCount,
  searchPlaceholder,
  columnHeaders,
  filterLabels,
  approveLabel,
  emptyNoDispositions,
  emptyNoMatch,
  canApprove,
}: DispositionTableProps) {
  const [search, setSearch] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = dispositions.filter((d) => {
    if (decisionFilter && d.decision !== decisionFilter) return false;
    if (statusFilter && d.status !== statusFilter) return false;
    if (
      search &&
      !d.dispositionId.toLowerCase().includes(search.toLowerCase()) &&
      !d.sampleId.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const deadlineState = (deadline: string): 'overdue' | 'approaching' | 'ok' => {
    try {
      const dl = new Date(deadline);
      const now = new Date();
      if (dl < now) return 'overdue';
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      if (dl.getTime() - now.getTime() < thirtyDays) return 'approaching';
      return 'ok';
    } catch {
      return 'ok';
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
          value={decisionFilter}
          onChange={(e) =>
            setDecisionFilter((e.target as HTMLSelectElement).value)}
          class='border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface'
        >
          <option value=''>{filterLabels.allDecisions}</option>
          {filterLabels.decisions.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
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

      {/* Disposition table */}
      <div class='rounded-lg border border-border bg-surface-card overflow-hidden'>
        <table class='w-full text-sm'>
          <thead class='bg-surface-elevated border-b border-border'>
            <tr class='text-left text-on-surface-secondary'>
              <th class='px-4 py-3 font-medium'>
                {columnHeaders.dispositionId}
              </th>
              <th class='px-4 py-3 font-medium'>
                {columnHeaders.sampleId}
              </th>
              <th class='px-4 py-3 font-medium'>
                {columnHeaders.decision}
              </th>
              <th class='px-4 py-3 font-medium'>{columnHeaders.status}</th>
              <th class='px-4 py-3 font-medium'>
                {columnHeaders.deadline}
              </th>
              <th class='px-4 py-3 font-medium'>
                {columnHeaders.treatmentStatus}
              </th>
              <th class='px-4 py-3 font-medium text-right'>
                {columnHeaders.evidence}
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
                    {totalCount === 0
                      ? emptyNoDispositions
                      : emptyNoMatch}
                  </td>
                </tr>
              )
              : filtered.map((d) => {
                  const dlState = deadlineState(d.dispositionDeadline);
                  return (
                    <tr
                      key={d.dispositionId}
                      class='hover:bg-surface-elevated'
                    >
                      <td class='px-4 py-3 font-mono text-xs font-medium text-on-surface'>
                        {d.dispositionId}
                      </td>
                      <td class='px-4 py-3 font-mono text-xs text-on-surface-secondary'>
                        {d.sampleId}
                      </td>
                      <td class='px-4 py-3'>
                        <span
                          class={`px-2 py-1 rounded text-xs font-medium ${
                            DECISION_CLASSES[d.decision] ??
                              'bg-surface-inset text-on-surface-muted'
                          }`}
                        >
                          {d.decisionLabel}
                        </span>
                      </td>
                      <td class='px-4 py-3'>
                        <span
                          class={`px-2 py-1 rounded text-xs font-semibold ${
                            STATUS_CLASSES[d.status] ??
                              'bg-surface-inset text-on-surface-muted'
                          }`}
                          title={d.lastAction}
                        >
                          {d.statusLabel}
                        </span>
                      </td>
                      <td
                        class={`px-4 py-3 font-mono text-xs ${
                          dlState === 'overdue'
                            ? 'text-status-problem-text font-semibold'
                            : dlState === 'approaching'
                            ? 'text-status-attention-text font-medium'
                            : 'text-on-surface-muted'
                        }`}
                      >
                        {d.dispositionDeadline}
                      </td>
                      <td class='px-4 py-3'>
                        {d.treatment
                          ? (
                            <span
                              class={`px-2 py-1 rounded text-xs font-medium ${
                                TREATMENT_CLASSES[d.treatment] ??
                                  'bg-surface-inset text-on-surface-muted'
                              }`}
                            >
                              {d.treatmentLabel}
                            </span>
                          )
                          : (
                            <span class='text-on-surface-muted'>
                              {'\u2014'}
                            </span>
                          )}
                      </td>
                      <td class='px-4 py-3 text-right text-on-surface tabular-nums'>
                        {d.evidenceCount}
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
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
