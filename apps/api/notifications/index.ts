import { EaCRuntimeHandlers } from "@fathym/eac/runtime/pipelines";
import { OISampleMgmtWebState } from "../../../src/state/OISampleMgmtWebState.ts";
import { getWorkflowHooks } from "../../../src/data/hooks.ts";

export default {
  async GET(req, _ctx) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || undefined;

    if (!userId) {
      return Response.json(
        { error: "userId query parameter required" },
        { status: 400 },
      );
    }

    const hooks = await getWorkflowHooks();
    const notifications = await hooks.ListNotifications(userId);

    // Sort by CreatedAt descending (most recent first)
    notifications.sort(
      (a, b) =>
        new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime(),
    );

    return Response.json(notifications);
  },

  async POST(req, _ctx) {
    const body = await req.json();
    const { action, NotificationId } = body;

    if (action === "mark-read" && NotificationId) {
      const hooks = await getWorkflowHooks();
      const updated = await hooks.MarkNotificationAsRead(NotificationId);
      return Response.json(updated);
    }

    return Response.json(
      { error: 'Invalid action. Use { action: "mark-read", NotificationId }' },
      { status: 400 },
    );
  },
} as EaCRuntimeHandlers<OISampleMgmtWebState>;
