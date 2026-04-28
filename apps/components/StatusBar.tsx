type StatusBarProps = {
  ready: number;
  attention: number;
  volumeHold: number;
  problem: number;
  total: number;
};

export default function StatusBar(
  { ready, attention, volumeHold, problem, total }: StatusBarProps,
) {
  if (total === 0) {
    return <div class='h-2 rounded-full bg-surface-inset' />;
  }

  const pct = (n: number) => `${(n / total) * 100}%`;

  return (
    <div class='flex h-2 rounded-full overflow-hidden bg-surface-inset'>
      {ready > 0 && (
        <div class='bg-status-ready' style={{ width: pct(ready) }} />
      )}
      {attention > 0 && (
        <div class='bg-status-attention' style={{ width: pct(attention) }} />
      )}
      {volumeHold > 0 && (
        <div class='bg-status-hold' style={{ width: pct(volumeHold) }} />
      )}
      {problem > 0 && (
        <div class='bg-status-problem' style={{ width: pct(problem) }} />
      )}
    </div>
  );
}
