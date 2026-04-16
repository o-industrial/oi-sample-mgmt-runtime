import StatusBar from './StatusBar.tsx';

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

function StatusSlot(
  { count, label, colorClass }: {
    count: number;
    label: string;
    colorClass: string;
  },
) {
  const isZero = count === 0;

  return (
    <div
      class={`flex items-center gap-1.5 text-xs ${
        isZero ? 'text-on-surface-muted' : ''
      }`}
    >
      <span
        class={`inline-block w-2 h-2 rounded-full ${
          isZero ? 'bg-surface-inset' : colorClass
        }`}
      />
      <span class={isZero ? '' : 'font-medium'}>{count}</span>
      <span class={isZero ? '' : 'text-on-surface-secondary'}>{label}</span>
    </div>
  );
}

export default function ActivityPanes(
  { panes, temporalPriority }: ActivityPanesProps,
) {
  return (
    <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
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
            {/* Header: name + total */}
            <div class='flex items-center justify-between mb-3'>
              <h3
                class={`text-sm font-semibold ${
                  isEmphasized ? 'text-primary' : 'text-on-surface'
                }`}
              >
                {pane.name}
              </h3>
              <span class='text-2xl font-bold text-on-surface'>
                {pane.total}
              </span>
            </div>

            {/* Stacked status bar */}
            <div class='mb-3'>
              <StatusBar
                ready={pane.ready}
                attention={pane.attention}
                volumeHold={pane.volumeHold}
                problem={pane.problem}
                total={pane.total}
              />
            </div>

            {/* Fixed 2x2 status grid */}
            <div class='grid grid-cols-2 gap-x-2 gap-y-1 mb-3'>
              <StatusSlot
                count={pane.ready}
                label={pane.readyLabel}
                colorClass='bg-status-ready'
              />
              <StatusSlot
                count={pane.attention}
                label={pane.attentionLabel}
                colorClass='bg-status-attention'
              />
              <StatusSlot
                count={pane.volumeHold}
                label={pane.volumeHoldLabel}
                colorClass='bg-status-hold'
              />
              <StatusSlot
                count={pane.problem}
                label={pane.problemLabel}
                colorClass='bg-status-problem'
              />
            </div>

            <span class='text-xs text-link hover:underline'>
              {pane.viewAllLabel} →
            </span>
          </a>
        );
      })}
    </div>
  );
}
