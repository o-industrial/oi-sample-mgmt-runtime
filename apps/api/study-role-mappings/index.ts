import { EaCRuntimeHandlers } from "@fathym/eac/runtime/pipelines";
import { OISampleMgmtWebState } from "../../../src/state/OISampleMgmtWebState.ts";
import { getWorkflowHooks } from "../../../src/data/hooks.ts";

export default {
  async GET(req, _ctx) {
    const url = new URL(req.url);
    const studyId = url.searchParams.get("studyId") || undefined;

    const hooks = await getWorkflowHooks();
    const mappings = await hooks.ListStudyRoleMappings(studyId);

    return Response.json(mappings);
  },
} as EaCRuntimeHandlers<OISampleMgmtWebState>;
