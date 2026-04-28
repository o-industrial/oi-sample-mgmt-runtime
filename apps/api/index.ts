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
        transfers:
          'GET /api/transfers, POST /api/transfers (create/update-status)',
        returns: 'GET /api/returns, POST /api/returns (create/update-status)',
        reconciliations:
          'GET /api/reconciliations, POST /api/reconciliations (create/resolve)',
        dispositions: 'GET /api/dispositions',
        reviews: 'GET /api/reviews, POST /api/reviews (decide)',
        custody: 'GET /api/custody?sampleId=X (composite timeline)',
        notifications:
          'GET /api/notifications?userId=X, POST /api/notifications (mark-read)',
        approvals:
          'GET /api/approvals?status=X&type=X, POST /api/approvals (initiate/decide)',
        studyRoleMappings: 'GET /api/study-role-mappings?studyId=X',
      },
    });
  },
} as EaCRuntimeHandlers<OISampleMgmtWebState>;
