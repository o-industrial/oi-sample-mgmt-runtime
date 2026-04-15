import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../src/state/OISampleMgmtWebState.ts';

export const handler: EaCRuntimeHandlerSet<OISampleMgmtWebState> = {
  GET: (_req, ctx) => {
    return ctx.Render({ theme: ctx.State.Theme ?? 'oi' });
  },
};

export default function Home() {
  return (
    <div>
      <h1 class="text-2xl font-bold text-primary mb-4">
        GSK Sample Management
      </h1>
      <p class="text-on-surface-secondary">
        Welcome. Select a section from the sidebar to get started.
      </p>
    </div>
  );
}
