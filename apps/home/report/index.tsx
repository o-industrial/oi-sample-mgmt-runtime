import { EaCRuntimeHandlerSet } from "@fathym/eac/runtime/pipelines";
import { OISampleMgmtWebState } from "../../../src/state/OISampleMgmtWebState.ts";

export const handler: EaCRuntimeHandlerSet<OISampleMgmtWebState> = {
  GET: (_req, ctx) => {
    if (!ctx.State.AccessRights.includes("compliance:view")) {
      return new Response("Forbidden", { status: 403 });
    }

    return new Response(null, {
      status: 302,
      headers: { Location: "/report/audit-trail" },
    });
  },
};

export default function ReportIndex() {
  return null;
}
