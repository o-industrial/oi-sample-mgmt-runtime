export type PaneId =
  | 'incoming'
  | 'transfers'
  | 'returns'
  | 'reconciliations'
  | 'dispositions';

export function getTemporalPriority(): PaneId | null {
  const hour = new Date().getHours();

  // Morning: transfers are the primary activity before deliveries arrive
  if (hour < 10) return 'transfers';

  // 10AM and 3PM: delivery windows — incoming shipments take priority
  if (hour === 10 || hour === 15) return 'incoming';

  // All other hours: no emphasis — all panes equal weight
  return null;
}
