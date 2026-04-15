import { EaCRuntimeHandlers } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../src/state/OISampleMgmtWebState.ts';

export default {
  GET(_req, _ctx) {
    return Response.json({ name: 'OI Sample Management API', version: '0.0.1' });
  },
} as EaCRuntimeHandlers<OISampleMgmtWebState>;
