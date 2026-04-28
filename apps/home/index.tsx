import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../src/state/OISampleMgmtWebState.ts';

export const handler: EaCRuntimeHandlerSet<OISampleMgmtWebState> = {
  GET: (_req, ctx) => {
    const rights = ctx.State.AccessRights;

    const redirect = (path: string) =>
      new Response(null, { status: 302, headers: { Location: path } });

    // scientist → /return
    if (
      rights.includes('scientist:request') &&
      !rights.includes('admin:access')
    ) {
      return redirect('/return');
    }

    // hbsm_custodian → /disposition
    if (
      rights.includes('custody:approve') &&
      !rights.includes('admin:access') &&
      !rights.includes('samples:receive')
    ) {
      return redirect('/disposition');
    }

    // sample_manager → /receive
    if (
      rights.includes('samples:receive') &&
      !rights.includes('admin:access') &&
      !rights.includes('compliance:export')
    ) {
      return redirect('/receive');
    }

    // qa_auditor → /report/audit-trail
    if (
      rights.includes('compliance:export') &&
      !rights.includes('samples:receive')
    ) {
      return redirect('/report/audit-trail');
    }

    // study_coordinator, study_lead → /track/samples
    if (
      rights.includes('study:view') &&
      !rights.includes('admin:access') &&
      !rights.includes('samples:receive')
    ) {
      return redirect('/track/samples');
    }

    // Fallthrough: lab_manager, csv_group_head, read_only → dashboard
    return redirect('/dashboard');
  },
};
