import { EaCRuntimeHandlerSet } from "@fathym/eac/runtime/pipelines";

export const handler: EaCRuntimeHandlerSet = {
  GET: () => {
    return new Response(null, {
      status: 302,
      headers: { Location: "/pilot/one-pager" },
    });
  },
};

export default function PilotIndex() {
  return null;
}
