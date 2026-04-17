import { useState } from 'preact/hooks';

export const IsIsland = true;

// --- Prop types (camelCase for island props — C6/C7) ---

type SampleStatus =
  | 'received'
  | 'processing'
  | 'in-storage'
  | 'transferred'
  | 'disposed'
  | 'depleted';

type SampleRow = {
  sampleId: string;
  studyId: string;
  originSite: string;
  receivedAt: string;
  status: SampleStatus;
  statusLabel: string;
  storageLocation: string;
  lastAction: string;
};

type SampleTrackingTableProps = {
  samples: SampleRow[];
  totalCount: number;
  searchPlaceholder: string;
  columnHeaders: {
    sampleId: string;
    study: string;
    originSite: string;
    received: string;
    status: string;
    storage: string;
    lastAction: string;
    actions: string;
  };
  updateLabel: string;
  emptyNoSamples: string;
  emptyNoMatch: string;
  canReceive: boolean;
};

// --- Status badge semantic token map (C5) ---

const STATUS_CLASSES: Record<string, string> = {
  received: 'bg-status-ready-bg text-status-ready-text',
  processing: 'bg-status-hold-bg text-status-hold-text',
  'in-storage': 'bg-surface-inset text-on-surface-muted',
  transferred: 'bg-status-attention-bg text-status-attention-text',
  disposed: 'bg-status-problem-bg text-status-problem-text',
  depleted: 'bg-secondary text-on-primary',
};

// --- Component ---

export default function SampleTrackingTable({
  samples,
  totalCount,
  searchPlaceholder,
  columnHeaders,
  updateLabel,
  emptyNoSamples,
  emptyNoMatch,
  canReceive,
}: SampleTrackingTableProps) {
  const [search, setSearch] = useState('');

  const filtered = samples.filter(
    (s) =>
      !search ||
      s.sampleId.toLowerCase().includes(search.toLowerCase()) ||
      s.studyId.toLowerCase().includes(search.toLowerCase()) ||
      s.statusLabel.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div class='space-y-4'>
      {/* Search */}
      <div class='rounded-lg border border-border bg-surface-card p-4'>
        <input
          type='text'
          placeholder={searchPlaceholder}
          value={search}
          onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
          class='w-full border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-focus'
        />
      </div>

      {/* Sample table */}
      <div class='rounded-lg border border-border bg-surface-card overflow-hidden'>
        <table class='w-full text-sm'>
          <thead class='bg-surface-elevated border-b border-border'>
            <tr class='text-left text-on-surface-secondary'>
              <th class='px-4 py-3 font-medium'>{columnHeaders.sampleId}</th>
              <th class='px-4 py-3 font-medium'>{columnHeaders.study}</th>
              <th class='px-4 py-3 font-medium'>{columnHeaders.originSite}</th>
              <th class='px-4 py-3 font-medium'>{columnHeaders.received}</th>
              <th class='px-4 py-3 font-medium'>{columnHeaders.status}</th>
              <th class='px-4 py-3 font-medium'>{columnHeaders.storage}</th>
              <th class='px-4 py-3 font-medium'>{columnHeaders.lastAction}</th>
              {canReceive && (
                <th class='px-4 py-3 font-medium'>{columnHeaders.actions}</th>
              )}
            </tr>
          </thead>
          <tbody class='divide-y divide-border-subtle'>
            {filtered.length === 0
              ? (
                <tr>
                  <td
                    colSpan={canReceive ? 8 : 7}
                    class='px-4 py-8 text-center text-on-surface-muted'
                  >
                    {totalCount === 0 ? emptyNoSamples : emptyNoMatch}
                  </td>
                </tr>
              )
              : filtered.map((s) => (
                <tr key={s.sampleId} class='hover:bg-surface-elevated'>
                  <td class='px-4 py-3 font-mono text-xs font-medium text-on-surface'>
                    {s.sampleId}
                  </td>
                  <td class='px-4 py-3 text-on-surface-secondary'>
                    {s.studyId}
                  </td>
                  <td class='px-4 py-3 text-on-surface-secondary'>
                    {s.originSite}
                  </td>
                  <td class='px-4 py-3 font-mono text-xs text-on-surface-muted'>
                    {s.receivedAt}
                  </td>
                  <td class='px-4 py-3'>
                    <span
                      class={`px-2 py-1 rounded text-xs font-medium ${
                        STATUS_CLASSES[s.status] ??
                          'bg-surface-inset text-on-surface-muted'
                      }`}
                    >
                      {s.statusLabel}
                    </span>
                  </td>
                  <td class='px-4 py-3 text-on-surface-secondary'>
                    {s.storageLocation || '\u2014'}
                  </td>
                  <td class='px-4 py-3 text-xs text-on-surface-muted'>
                    {s.lastAction}
                  </td>
                  {canReceive && (
                    <td class='px-4 py-3'>
                      <button
                        type='button'
                        class='px-3 py-1 border border-border rounded text-xs text-on-surface hover:bg-surface-elevated transition-colors'
                      >
                        {updateLabel}
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
