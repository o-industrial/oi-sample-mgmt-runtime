import { EaCRuntimeHandlers } from "@fathym/eac/runtime/pipelines";
import { OISampleMgmtWebState } from "../../../src/state/OISampleMgmtWebState.ts";
import { getWorkflowHooks } from "../../../src/data/hooks.ts";

export default {
  async GET(_req, _ctx) {
    const hooks = await getWorkflowHooks();
    const returns = await hooks.ListReturns();

    return Response.json(returns);
  },

  async POST(req, _ctx) {
    const body = await req.json();
    const { action } = body;

    const hooks = await getWorkflowHooks();

    if (action === "create") {
      const {
        SampleIds,
        Destination,
        Reason,
        RequestedBy,
        PackagingInstructions,
        StudyRef,
      } = body;
      if (
        !SampleIds || !Destination || !Reason || !RequestedBy ||
        !PackagingInstructions || !StudyRef
      ) {
        return Response.json(
          {
            error:
              "SampleIds, Destination, Reason, RequestedBy, PackagingInstructions, and StudyRef are required",
          },
          { status: 400 },
        );
      }
      const ret = await hooks.CreateReturn({
        SampleIds,
        Destination,
        Reason,
        RequestedBy,
        PackagingInstructions,
        StudyRef,
      });
      return Response.json(ret, { status: 201 });
    }

    if (action === "update-status") {
      const { ReturnId, Status, UserId, Outcome, DepletionContext } = body;
      if (!ReturnId || !Status || !UserId) {
        return Response.json(
          { error: "ReturnId, Status, and UserId are required" },
          { status: 400 },
        );
      }
      const updated = await hooks.UpdateReturnStatus(
        ReturnId,
        Status,
        UserId,
        Outcome,
        DepletionContext,
      );
      return Response.json(updated);
    }

    return Response.json(
      {
        error:
          'Invalid action. Use { action: "create", ... } or { action: "update-status", ... }',
      },
      { status: 400 },
    );
  },
} as EaCRuntimeHandlers<OISampleMgmtWebState>;
