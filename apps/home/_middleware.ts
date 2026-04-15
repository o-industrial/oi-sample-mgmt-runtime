import { EaCRuntimeHandler } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../src/state/OISampleMgmtWebState.ts';
import { resolveAccessRights } from '../../src/utils/demoAccess.ts';
import { resolveTheme } from '../../src/utils/resolveTheme.ts';

export default [
  (req, ctx) => {
    ctx.State.AccessRights = resolveAccessRights(req, undefined);
    ctx.State.Theme = resolveTheme(req);
    return ctx.Next();
  },
] as EaCRuntimeHandler<OISampleMgmtWebState>[];
