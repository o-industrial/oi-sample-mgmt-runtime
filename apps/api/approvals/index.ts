import { EaCRuntimeHandlers } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../src/state/OISampleMgmtWebState.ts';
import { getWorkflowHooks } from '../../../src/data/hooks.ts';

export default {
  async GET(req, _ctx) {
    const url = new URL(req.url);
    const status = url.searchParams.get('status') || undefined;
    const type = url.searchParams.get('type') || undefined;

    const hooks = await getWorkflowHooks();
    const filter = (status || type)
      ? { Status: status, Type: type }
      : undefined;
    const approvals = await hooks.ListApprovals(filter);

    return Response.json(approvals);
  },

  async POST(req, _ctx) {
    const body = await req.json();
    const { action } = body;

    const hooks = await getWorkflowHooks();

    if (action === 'initiate') {
      const { Type, RecordId, StudyRef, InitiatedBy, Context } = body;
      if (!Type || !RecordId || !StudyRef || !InitiatedBy) {
        return Response.json(
          { error: 'Type, RecordId, StudyRef, and InitiatedBy are required' },
          { status: 400 },
        );
      }
      const approval = await hooks.InitiateApproval({
        Type,
        RecordId,
        StudyRef,
        InitiatedBy,
        Context: Context ?? {},
      });
      return Response.json(approval, { status: 201 });
    }

    if (action === 'decide') {
      const { ApprovalId, Decision, UserId, Reason } = body;
      if (!ApprovalId || !Decision || !UserId) {
        return Response.json(
          { error: 'ApprovalId, Decision, and UserId are required' },
          { status: 400 },
        );
      }
      const updated = await hooks.RecordApprovalDecision(
        ApprovalId,
        Decision,
        UserId,
        Reason,
      );
      return Response.json(updated);
    }

    return Response.json(
      {
        error:
          'Invalid action. Use { action: "initiate", ... } or { action: "decide", ... }',
      },
      { status: 400 },
    );
  },
} as EaCRuntimeHandlers<OISampleMgmtWebState>;
