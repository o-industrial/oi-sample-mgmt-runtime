import { EaCRuntimeHandlers } from "@fathym/eac/runtime/pipelines";
import { OISampleMgmtWebState } from "../../../src/state/OISampleMgmtWebState.ts";
import { getWorkflowHooks } from "../../../src/data/hooks.ts";

export default {
  async GET(req, _ctx) {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || undefined;
    const status = url.searchParams.get("status") || undefined;

    const hooks = await getWorkflowHooks();
    const transfers = await hooks.ListTransfers(
      type || status ? { Type: type, Status: status } : undefined,
    );

    return Response.json(transfers);
  },

  async POST(req, _ctx) {
    const body = await req.json();
    const { action } = body;

    const hooks = await getWorkflowHooks();

    if (action === "create") {
      const {
        Type,
        SampleIds,
        Source,
        Destination,
        RequestedBy,
        StudyRef,
        StatusReason,
        SlaDeadline,
      } = body;
      if (
        !Type || !SampleIds || !Source || !Destination || !RequestedBy ||
        !StudyRef || !SlaDeadline
      ) {
        return Response.json(
          {
            error:
              "Type, SampleIds, Source, Destination, RequestedBy, StudyRef, and SlaDeadline are required",
          },
          { status: 400 },
        );
      }
      const transfer = await hooks.CreateTransfer({
        Type,
        SampleIds,
        Source,
        Destination,
        RequestedBy,
        StudyRef,
        StatusReason: StatusReason ?? "",
        SlaDeadline,
      });
      return Response.json(transfer, { status: 201 });
    }

    if (action === "update-status") {
      const { TransferId, Status, StatusReason, UserId } = body;
      if (!TransferId || !Status || !UserId) {
        return Response.json(
          { error: "TransferId, Status, and UserId are required" },
          { status: 400 },
        );
      }
      const updated = await hooks.UpdateTransferStatus(
        TransferId,
        Status,
        StatusReason ?? "",
        UserId,
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
