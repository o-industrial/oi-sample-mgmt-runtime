import { useState } from 'preact/hooks';

export const IsIsland = true;

type ComparisonField = {
  field: string;
  expected: string;
  actual: string;
  status: 'match' | 'mismatch' | 'missing';
};

type ManifestComparisonProps = {
  reconciliationId: string;
  manifestId: string;
  fields: ComparisonField[];
  labels: {
    heading: string;
    expectedCol: string;
    actualCol: string;
    fieldCol: string;
    statusCol: string;
    resolutionLabel: string;
    reasonLabel: string;
    submitLabel: string;
    matchLabel: string;
    mismatchLabel: string;
    missingLabel: string;
  };
  apiBase: string;
  canResolve: boolean;
};

const STATUS_ROW_CLASSES: Record<string, string> = {
  match: 'bg-status-ready-bg/30',
  mismatch: 'bg-status-attention-bg/30',
  missing: 'bg-status-problem-bg/30',
};

const STATUS_BADGE_CLASSES: Record<string, string> = {
  match: 'bg-status-ready-bg text-status-ready-text',
  mismatch: 'bg-status-attention-bg text-status-attention-text',
  missing: 'bg-status-problem-bg text-status-problem-text',
};

export default function ManifestComparison({
  reconciliationId,
  manifestId,
  fields,
  labels,
  apiBase,
  canResolve,
}: ManifestComparisonProps) {
  const [resolved, setResolved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resolution, setResolution] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');

  function statusLabel(status: string): string {
    if (status === 'match') return labels.matchLabel;
    if (status === 'mismatch') return labels.mismatchLabel;
    return labels.missingLabel;
  }

  async function handleSubmit() {
    if (!resolution.trim() || !correctionReason.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`${apiBase}/api/reconciliations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resolve',
          ReconciliationId: reconciliationId,
          Resolution: resolution,
          CorrectionReason: correctionReason,
          UserId: 'current-user',
        }),
      });
      if (res.ok) setResolved(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (resolved) {
    return (
      <div class='rounded-lg border border-border bg-surface-card p-4'>
        <p class='text-sm text-status-ready-text font-medium'>
          Reconciliation {reconciliationId} resolved.
        </p>
      </div>
    );
  }

  return (
    <div class='rounded-lg border border-border bg-surface-card p-4 space-y-4'>
      <div>
        <h3 class='text-sm font-semibold text-on-surface'>
          {labels.heading}
        </h3>
        <p class='text-xs text-on-surface-muted mt-1'>
          {manifestId} &mdash; {reconciliationId}
        </p>
      </div>

      <div class='overflow-x-auto'>
        <table class='w-full text-sm'>
          <thead>
            <tr class='border-b border-border text-left text-xs text-on-surface-secondary'>
              <th class='pb-2 pr-3'>{labels.fieldCol}</th>
              <th class='pb-2 pr-3'>{labels.expectedCol}</th>
              <th class='pb-2 pr-3'>{labels.actualCol}</th>
              <th class='pb-2'>{labels.statusCol}</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f) => (
              <tr
                key={f.field}
                class={`border-b border-border/50 ${
                  STATUS_ROW_CLASSES[f.status] ?? ''
                }`}
              >
                <td class='py-2 pr-3 font-medium text-on-surface'>
                  {f.field}
                </td>
                <td class='py-2 pr-3 font-mono text-xs text-on-surface-secondary'>
                  {f.expected}
                </td>
                <td class='py-2 pr-3 font-mono text-xs text-on-surface-secondary'>
                  {f.actual || '\u2014'}
                </td>
                <td class='py-2'>
                  <span
                    class={`px-2 py-1 rounded text-xs font-medium ${
                      STATUS_BADGE_CLASSES[f.status] ?? ''
                    }`}
                  >
                    {statusLabel(f.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {canResolve && (
        <div class='border-t border-border pt-4 space-y-3'>
          <div>
            <label class='block text-xs font-medium text-on-surface-secondary mb-1'>
              {labels.resolutionLabel}
            </label>
            <textarea
              value={resolution}
              onInput={(e) =>
                setResolution((e.target as HTMLTextAreaElement).value)}
              class='w-full border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-focus'
              rows={3}
            />
          </div>
          <div>
            <label class='block text-xs font-medium text-on-surface-secondary mb-1'>
              {labels.reasonLabel}
            </label>
            <input
              type='text'
              value={correctionReason}
              onInput={(e) =>
                setCorrectionReason((e.target as HTMLInputElement).value)}
              class='w-full border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-focus'
            />
          </div>
          <button
            type='button'
            disabled={submitting || !resolution.trim() ||
              !correctionReason.trim()}
            onClick={handleSubmit}
            class='px-4 py-2 rounded bg-primary text-on-primary text-sm font-medium hover:opacity-80 disabled:opacity-50'
          >
            {labels.submitLabel}
          </button>
        </div>
      )}
    </div>
  );
}
