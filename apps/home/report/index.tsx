import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../src/state/OISampleMgmtWebState.ts';

export const handler: EaCRuntimeHandlerSet<OISampleMgmtWebState> = {
  GET: (_req, ctx) => {
    return ctx.Render({ theme: ctx.State.Theme ?? 'oi' });
  },
};

export default function Report() {
  return (
    <div>
      <h1 class="text-xl font-bold text-primary mb-2">Report</h1>
      <p class="text-on-surface-secondary">ALCOA+ audit trail and ethics approval — coming soon.</p>
    </div>
  );
}
