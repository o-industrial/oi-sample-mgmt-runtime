import { EaCRuntimeHandlers } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../src/state/OISampleMgmtWebState.ts';
import { getWorkflowHooks } from '../../../src/data/hooks.ts';

export default {
  async GET(req, _ctx) {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || undefined;
    const status = url.searchParams.get('status') || undefined;

    const hooks = await getWorkflowHooks();
    const transfers = await hooks.ListTransfers(
      type || status ? { Type: type, Status: status } : undefined,
    );

    return Response.json(transfers);
  },
} as EaCRuntimeHandlers<OISampleMgmtWebState>;
