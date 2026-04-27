import { EaCRuntimeHandlers } from "@fathym/eac/runtime/pipelines";
import { OISampleMgmtWebState } from "../../../src/state/OISampleMgmtWebState.ts";
import { getOIHooks, getWorkflowHooks } from "../../../src/data/hooks.ts";

export default {
  async POST(_req, _ctx) {
    const oiHooks = await getOIHooks();
    const workflowHooks = await getWorkflowHooks();

    const oiResult = await oiHooks.Seed();
    const workflowResult = await workflowHooks.Seed();

    return Response.json({
      Seeded: oiResult.Seeded + workflowResult.Seeded,
      OI: oiResult.Seeded,
      Workflow: workflowResult.Seeded,
    });
  },
} as EaCRuntimeHandlers<OISampleMgmtWebState>;
