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
  viewReportLabel: string;
  emptyNoSamples: string;
  emptyNoMatch: string;
  canReceive: boolean;
  apiBase: string;
  statusTransitionLabels: {
    statusLabel: string;
    statuses: Array<{ value: string; label: string }>;
    noteLabel: string;
    storageLabel: string;
    submitLabel: string;
    cancelLabel: string;
  };
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

const VALID_TRANSITIONS: Record<string, string[]> = {
  received: ['processing'],
  processing: ['in-storage'],
  'in-storage': ['transferred', 'disposed', 'depleted'],
};

export default function SampleTrackingTable({
  samples: initialSamples,
  totalCount,
  searchPlaceholder,
  columnHeaders,
  updateLabel,
  viewReportLabel,
  emptyNoSamples,
  emptyNoMatch,
  canReceive,
  apiBase,
  statusTransitionLabels,
}: SampleTrackingTableProps) {
  const [samples, setSamples] = useState(initialSamples);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [storageLocation, setStorageLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  function togglePanel(sampleId: string) {
    if (expandedRow === sampleId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(sampleId);
      setNewStatus('');
      setNote('');
      setStorageLocation('');
      setError('');
    }
  }

  function validNextStatuses(currentStatus: string) {
    return (VALID_TRANSITIONS[currentStatus] ?? []).map((s) => ({
      value: s,
      label: statusTransitionLabels.statuses.find(
        (vs) => vs.value === s,
      )?.label ?? s,
    }));
  }

  async function handleSubmitStatus(sampleId: string) {
    if (!newStatus) return;
    if (newStatus === 'in-storage' && !storageLocation.trim()) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${apiBase}/api/samples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-status',
          SampleId: sampleId,
          Status: newStatus,
          Note: note,
          StorageLocation: newStatus === 'in-storage'
            ? storageLocation
            : undefined,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSamples((prev) =>
          prev.map((s) =>
            s.sampleId === sampleId
              ? {
                ...s,
                status: updated.Status,
                statusLabel: statusTransitionLabels.statuses.find(
                  (st) => st.value === updated.Status,
                )?.label ?? updated.Status,
                storageLocation: updated.StorageLocation,
                lastAction: updated.LastAction,
              }
              : s
          )
        );
        setExpandedRow(null);
      } else {
        const err = await res.json();
        setError(err.error ?? 'Update failed');
      }
    } finally {
      setSubmitting(false);
    }
  }

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
              <th class='px-4 py-3 font-medium'>{columnHeaders.actions}</th>
            </tr>
          </thead>
          <tbody class='divide-y divide-border-subtle'>
            {filtered.length === 0
              ? (
                <tr>
                  <td
                    colSpan={8}
                    class='px-4 py-8 text-center text-on-surface-muted'
                  >
                    {totalCount === 0 ? emptyNoSamples : emptyNoMatch}
                  </td>
                </tr>
              )
              : filtered.map((s) => {
                const nextStatuses = validNextStatuses(s.status);
                return (
                  <>
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
                      <td class='px-4 py-3'>
                        <div class='flex gap-1'>
                          {canReceive && nextStatuses.length > 0 && (
                            <button
                              type='button'
                              disabled={submitting &&
                                expandedRow === s.sampleId}
                              onClick={() => togglePanel(s.sampleId)}
                              class='px-3 py-1 border border-border rounded text-xs text-on-surface hover:bg-surface-elevated transition-colors disabled:opacity-50'
                            >
                              {expandedRow === s.sampleId
                                ? statusTransitionLabels.cancelLabel
                                : updateLabel}
                            </button>
                          )}
                          <a
                            href={`/report/custody?sampleId=${
                              encodeURIComponent(s.sampleId)
                            }`}
                            data-eac-bypass-base
                            class='px-3 py-1 border border-border rounded text-xs text-link hover:bg-surface-elevated transition-colors'
                          >
                            {viewReportLabel}
                          </a>
                        </div>
                      </td>
                    </tr>
                    {expandedRow === s.sampleId && canReceive && (
                      <tr key={`${s.sampleId}-panel`}>
                        <td
                          colSpan={8}
                          class='px-4 py-4 bg-surface-elevated border-t border-border'
                        >
                          <div class='space-y-3 max-w-xl'>
                            <div>
                              <label class='block text-xs font-medium text-on-surface-secondary mb-1'>
                                {statusTransitionLabels.statusLabel}
                              </label>
                              <select
                                value={newStatus}
                                onChange={(e) =>
                                  setNewStatus(
                                    (e.target as HTMLSelectElement).value,
                                  )}
                                class='w-full border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-focus'
                              >
                                <option value=''>{'\u2014'}</option>
                                {nextStatuses.map((ns) => (
                                  <option key={ns.value} value={ns.value}>
                                    {ns.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {newStatus === 'in-storage' && (
                              <div>
                                <label class='block text-xs font-medium text-on-surface-secondary mb-1'>
                                  {statusTransitionLabels.storageLabel}
                                </label>
                                <input
                                  type='text'
                                  value={storageLocation}
                                  onInput={(e) =>
                                    setStorageLocation(
                                      (e.target as HTMLInputElement).value,
                                    )}
                                  placeholder='Freezer A / Shelf 2 / Rack 3 / Box 7 / Pos 12'
                                  class='w-full border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-focus'
                                />
                              </div>
                            )}
                            <div>
                              <label class='block text-xs font-medium text-on-surface-secondary mb-1'>
                                {statusTransitionLabels.noteLabel}
                              </label>
                              <textarea
                                value={note}
                                onInput={(e) =>
                                  setNote(
                                    (e.target as HTMLTextAreaElement).value,
                                  )}
                                class='w-full border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-focus'
                                rows={2}
                              />
                            </div>
                            {error && (
                              <p class='text-xs text-status-problem-text'>
                                {error}
                              </p>
                            )}
                            <div class='flex gap-3'>
                              <button
                                type='button'
                                disabled={submitting || !newStatus ||
                                  (newStatus === 'in-storage' &&
                                    !storageLocation.trim())}
                                onClick={() =>
                                  handleSubmitStatus(s.sampleId)}
                                class='px-4 py-2 rounded bg-primary text-on-primary text-sm font-medium hover:opacity-80 disabled:opacity-50'
                              >
                                {statusTransitionLabels.submitLabel}
                              </button>
                              <button
                                type='button'
                                onClick={() => setExpandedRow(null)}
                                class='px-4 py-2 rounded border border-border text-sm text-on-surface hover:bg-surface-elevated disabled:opacity-50'
                              >
                                {statusTransitionLabels.cancelLabel}
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
