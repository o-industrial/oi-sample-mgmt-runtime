import TurboTaxStatus from './TurboTaxStatus.tsx';

export const IsIsland = true;

type PaneViewData = {
  id: string;
  name: string;
  total: number;
  ready: number;
  attention: number;
  volumeHold: number;
  problem: number;
  route: string;
  readyLabel: string;
  attentionLabel: string;
  volumeHoldLabel: string;
  problemLabel: string;
  viewAllLabel: string;
};

type ActivityPanesProps = {
  panes: PaneViewData[];
  temporalPriority: string | null;
};

export default function ActivityPanes({
  panes,
  temporalPriority,
}: ActivityPanesProps) {
  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {panes.map((pane) => {
        const isEmphasized = pane.id === temporalPriority;

        return (
          <a
            key={pane.id}
            href={pane.route}
            data-eac-bypass-base
            class={`block rounded-lg border p-4 transition-all hover:border-primary ${
              isEmphasized
                ? 'border-primary bg-surface-elevated shadow-lg scale-[1.02]'
                : 'border-border bg-surface-card'
            }`}
          >
            <div class="flex items-center justify-between mb-3">
              <h3
                class={`text-sm font-semibold ${
                  isEmphasized ? 'text-primary' : 'text-on-surface'
                }`}
              >
                {pane.name}
              </h3>
              <span class="text-2xl font-bold text-on-surface">
                {pane.total}
              </span>
            </div>

            <div class="flex flex-wrap gap-1 mb-3">
              {pane.ready > 0 && (
                <TurboTaxStatus
                  status="ready"
                  label={pane.readyLabel}
                  count={pane.ready}
                />
              )}
              {pane.attention > 0 && (
                <TurboTaxStatus
                  status="attention"
                  label={pane.attentionLabel}
                  count={pane.attention}
                />
              )}
              {pane.volumeHold > 0 && (
                <TurboTaxStatus
                  status="volume-hold"
                  label={pane.volumeHoldLabel}
                  count={pane.volumeHold}
                />
              )}
              {pane.problem > 0 && (
                <TurboTaxStatus
                  status="problem"
                  label={pane.problemLabel}
                  count={pane.problem}
                />
              )}
            </div>

            <span class="text-xs text-link hover:underline">
              {pane.viewAllLabel} →
            </span>
          </a>
        );
      })}
    </div>
  );
}
