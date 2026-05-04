import { EaCRuntimeHandlers } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../src/state/OISampleMgmtWebState.ts';
import { getOIHooks } from '../../../src/data/hooks.ts';

export default {
  async GET(_req, _ctx) {
    const hooks = await getOIHooks();
    const samples = await hooks.AllBarcodes();
    return Response.json(samples);
  },

  async POST(req, _ctx) {
    const hooks = await getOIHooks();
    const body = await req.json();

    if (body.action === 'update-status') {
      try {
        const result = await hooks.UpdateSampleStatus(
          body.SampleId,
          body.Status,
          body.Note
            ? `Status → ${body.Status}: ${body.Note}`
            : `Status → ${body.Status}`,
          body.StorageLocation,
        );
        return Response.json(result);
      } catch (err) {
        return Response.json(
          { error: (err as Error).message },
          { status: 400 },
        );
      }
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  },
} as EaCRuntimeHandlers<OISampleMgmtWebState>;
