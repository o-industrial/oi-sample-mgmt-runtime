import { EaCRuntimeHandlers } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../src/state/OISampleMgmtWebState.ts';

export default {
  GET(_req, _ctx) {
    return Response.json({
      name: 'OI Sample Management API',
      version: '0.0.1',
      dataLayer: 'active',
      endpoints: {
        seed: 'POST /api/seed',
        dashboard: 'GET /api/dashboard',
        samples: 'GET /api/samples',
        manifests: 'GET /api/manifests',
        studies: 'GET /api/studies',
        auditEvents: 'GET /api/audit-events',
        ethicsApprovals: 'GET /api/ethics-approvals',
        transfers: 'GET /api/transfers',
        returns: 'GET /api/returns',
        reconciliations: 'GET /api/reconciliations',
        dispositions: 'GET /api/dispositions',
        reviews: 'GET /api/reviews, POST /api/reviews (decide)',
        custody: 'GET /api/custody?sampleId=X (composite timeline)',
        notifications:
          'GET /api/notifications?userId=X, POST /api/notifications (mark-read)',
      },
    });
  },
} as EaCRuntimeHandlers<OISampleMgmtWebState>;
