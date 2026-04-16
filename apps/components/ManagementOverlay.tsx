import { useState } from 'preact/hooks';

export const IsIsland = true;

type EffortItem = {
  manager: string;
  count: number;
};

type CapacityData = {
  current: number;
  projected: number;
  breakpoint: number;
};

type ManagementOverlayProps = {
  toggleLabel: string;
  showLabel: string;
  hideLabel: string;
  effortLabel: string;
  capacityLabel: string;
  effortData: EffortItem[];
  capacityData: CapacityData;
};

export default function ManagementOverlay({
  toggleLabel,
  showLabel,
  hideLabel,
  effortLabel,
  capacityLabel,
  effortData,
  capacityData,
}: ManagementOverlayProps) {
  const [visible, setVisible] = useState(false);

  const maxCount = Math.max(...effortData.map((d) => d.count), 1);
  const capacityPct = Math.round(
    (capacityData.current / capacityData.breakpoint) * 100,
  );
  const isOverCapacity = capacityData.projected > capacityData.breakpoint;

  return (
    <div class="rounded-lg border border-border bg-surface-card">
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-elevated transition-colors rounded-lg"
      >
        <span>{toggleLabel}</span>
        <span class="text-xs text-on-surface-secondary">
          {visible ? hideLabel : showLabel}
        </span>
      </button>

      {visible && (
        <div class="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Effort Tracking */}
          <div>
            <h4 class="text-sm font-semibold text-on-surface mb-3">
              {effortLabel}
            </h4>
            <div class="space-y-2">
              {effortData.map((item) => (
                <div key={item.manager} class="flex items-center gap-2">
                  <span class="text-xs text-on-surface-secondary w-28 truncate">
                    {item.manager}
                  </span>
                  <div class="flex-1 bg-surface-inset rounded-full h-3">
                    <div
                      class="bg-primary rounded-full h-3 transition-all"
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span class="text-xs font-medium text-on-surface w-8 text-right">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Capacity Forecast */}
          <div>
            <h4 class="text-sm font-semibold text-on-surface mb-3">
              {capacityLabel}
            </h4>
            <div class="space-y-2">
              <div class="flex justify-between text-xs text-on-surface-secondary">
                <span>Current: {capacityData.current}%</span>
                <span>Breakpoint: {capacityData.breakpoint}%</span>
              </div>
              <div class="bg-surface-inset rounded-full h-4">
                <div
                  class={`rounded-full h-4 transition-all ${
                    isOverCapacity ? 'bg-status-problem' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(capacityPct, 100)}%` }}
                />
              </div>
              <div
                class={`text-xs font-medium ${
                  isOverCapacity
                    ? 'text-status-problem-text'
                    : 'text-on-surface-secondary'
                }`}
              >
                Projected: {capacityData.projected}%
                {isOverCapacity && ' ⚠'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
