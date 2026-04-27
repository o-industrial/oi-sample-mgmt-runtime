import { EaCRuntimeHandlers } from "@fathym/eac/runtime/pipelines";
import { OISampleMgmtWebState } from "../../../src/state/OISampleMgmtWebState.ts";
import { getOIHooks } from "../../../src/data/hooks.ts";

export default {
  async GET(_req, _ctx) {
    const hooks = await getOIHooks();
    const studies = await hooks.ListStudies();
    return Response.json(studies);
  },
} as EaCRuntimeHandlers<OISampleMgmtWebState>;
