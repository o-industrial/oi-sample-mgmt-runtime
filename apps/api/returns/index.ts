import { EaCRuntimeHandlers } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../src/state/OISampleMgmtWebState.ts';
import { getWorkflowHooks } from '../../../src/data/hooks.ts';

export default {
  async GET(_req, _ctx) {
    const hooks = await getWorkflowHooks();
    const returns = await hooks.ListReturns();

    return Response.json(returns);
  },
} as EaCRuntimeHandlers<OISampleMgmtWebState>;
