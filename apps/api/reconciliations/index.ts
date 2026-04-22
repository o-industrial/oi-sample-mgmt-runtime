import { EaCRuntimeHandlers } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../src/state/OISampleMgmtWebState.ts';
import { getWorkflowHooks } from '../../../src/data/hooks.ts';

export default {
  async GET(_req, _ctx) {
    const hooks = await getWorkflowHooks();
    const reconciliations = await hooks.ListReconciliations();

    return Response.json(reconciliations);
  },

  async POST(req, _ctx) {
    const body = await req.json();
    const { action } = body;

    const hooks = await getWorkflowHooks();

    if (action === 'create') {
      const {
        ManifestId,
        DiscrepancyType,
        ExpectedCount,
        ActualCount,
        MissingFields,
        SlaDeadline,
        UserId,
      } = body;
      if (
        !ManifestId || !DiscrepancyType || ExpectedCount == null ||
        ActualCount == null || !SlaDeadline || !UserId
      ) {
        return Response.json(
          {
            error:
              'ManifestId, DiscrepancyType, ExpectedCount, ActualCount, SlaDeadline, and UserId are required',
          },
          { status: 400 },
        );
      }
      const rec = await hooks.CreateReconciliation({
        ManifestId,
        DiscrepancyType,
        ExpectedCount,
        ActualCount,
        MissingFields: MissingFields ?? [],
        SlaDeadline,
        UserId,
      });
      return Response.json(rec, { status: 201 });
    }

    if (action === 'resolve') {
      const { ReconciliationId, Resolution, CorrectionReason, UserId } = body;
      if (!ReconciliationId || !Resolution || !CorrectionReason || !UserId) {
        return Response.json(
          {
            error:
              'ReconciliationId, Resolution, CorrectionReason, and UserId are required',
          },
          { status: 400 },
        );
      }
      const updated = await hooks.ResolveReconciliation(
        ReconciliationId,
        Resolution,
        CorrectionReason,
        UserId,
      );
      return Response.json(updated);
    }

    return Response.json(
      {
        error:
          'Invalid action. Use { action: "create", ... } or { action: "resolve", ... }',
      },
      { status: 400 },
    );
  },
} as EaCRuntimeHandlers<OISampleMgmtWebState>;
