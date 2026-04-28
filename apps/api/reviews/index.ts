import { EaCRuntimeHandlers } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../src/state/OISampleMgmtWebState.ts';
import { getWorkflowHooks } from '../../../src/data/hooks.ts';

export default {
  async GET(req, _ctx) {
    const url = new URL(req.url);
    const status = url.searchParams.get('status') || undefined;

    const hooks = await getWorkflowHooks();
    const reviews = await hooks.ListReviews(
      status ? { Status: status } : undefined,
    );

    return Response.json(reviews);
  },

  async POST(req, _ctx) {
    const body = await req.json();
    const { ReviewId, Decision, UserId, Reason } = body;

    if (!ReviewId || !Decision || !UserId) {
      return Response.json(
        { error: 'ReviewId, Decision, and UserId are required' },
        { status: 400 },
      );
    }

    const hooks = await getWorkflowHooks();
    const updated = await hooks.DecideReview(
      ReviewId,
      Decision,
      UserId,
      Reason,
    );

    return Response.json(updated);
  },
} as EaCRuntimeHandlers<OISampleMgmtWebState>;
