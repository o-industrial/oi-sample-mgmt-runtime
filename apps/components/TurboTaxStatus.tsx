type TurboTaxStatusProps = {
  status: 'ready' | 'attention' | 'volume-hold' | 'problem';
  label: string;
  count?: number;
};

const STATUS_CLASSES: Record<string, string> = {
  ready: 'bg-status-ready-bg border-status-ready text-status-ready-text',
  attention:
    'bg-status-attention-bg border-status-attention text-status-attention-text',
  'volume-hold': 'bg-status-hold-bg border-status-hold text-status-hold-text',
  problem: 'bg-status-problem-bg border-status-problem text-status-problem-text',
};

export default function TurboTaxStatus({
  status,
  label,
  count,
}: TurboTaxStatusProps) {
  return (
    <span
      class={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${STATUS_CLASSES[status]}`}
    >
      {count !== undefined && <span class="font-bold">{count}</span>}
      {label}
    </span>
  );
}
