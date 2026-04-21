import { PageProps } from '@fathym/eac-applications/preact';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../src/state/OISampleMgmtWebState.ts';
import { useTranslation } from '../../src/utils/useTranslation.ts';
import { getTemporalPriority } from '../../src/utils/getTemporalPriority.ts';
import ActivityPanes from '../components/ActivityPanes.tsx';
import ManagementOverlay from '../components/ManagementOverlay.tsx';
import ReviewQueue from '../components/ReviewQueue.tsx';
import { createClientFromRequest } from '../../src/client/createClientFromRequest.ts';
import type { ManagementOverlayData } from '../../src/data/types/ManagementOverlayData.ts';
import type { PaneViewData } from '../../src/data/types/PaneViewData.ts';

// --- View types (extend data types with display-layer fields) ---

type DashboardPane = PaneViewData & { Name: string; Route: string };

type DashboardReview = {
  ReviewId: string;
  TypeLabel: string;
  EntityId: string;
  SubmittedBy: string;
  SubmittedAt: string;
  ValidationResult: string;
  ValidationLabel: string;
  ExceptionFlags: string[];
  Overdue: boolean;
};

type DashboardData = {
  Heading: string;
  UserName: string;
  UserRole: string;
  Panes: DashboardPane[];
  TemporalPriority: string | null;
  SystemStatus: Array<{
    ComponentId: string;
    Label: string;
    Status: 'online' | 'connecting' | 'offline';
    Note?: string;
  }>;
  SystemHeading: string;
  OnlineLabel: string;
  ConnectingLabel: string;
  ComplianceStatus: Array<{
    StandardId: string;
    Label: string;
    Compliant: boolean;
  }>;
  ComplianceHeading: string;
  ComplianceLabel: string;
  ManagementOverlay: ManagementOverlayData | null;
  StatusLabels: {
    Ready: string;
    Attention: string;
    VolumeHold: string;
    Problem: string;
  };
  ManagementLabels: {
    Toggle: string;
    Show: string;
    Hide: string;
    Effort: string;
    Capacity: string;
  } | null;
  ViewAllLabel: string;
  Reviews: DashboardReview[];
  ShowReviewQueue: boolean;
  ReviewLabels: {
    Heading: string;
    Subtitle: string;
    ColumnHeaders: {
      Type: string;
      EntityId: string;
      SubmittedBy: string;
      SubmittedAt: string;
      Validation: string;
      Exceptions: string;
      Actions: string;
    };
    ActionLabels: {
      Approve: string;
      Reject: string;
      Escalate: string;
    };
    EmptyLabel: string;
    OverdueLabel: string;
  } | null;
};

// --- Handler ---

export const handler: EaCRuntimeHandlerSet<
  OISampleMgmtWebState,
  DashboardData
> = {
  GET: async (req, ctx) => {
    const rights = ctx.State.AccessRights;

    // --- Role-aware routing (REVISED 9-role table) ---

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

    // Remaining: lab_manager, csv_group_head, read_only, dev_default → dashboard

    const { t } = useTranslation(ctx.State.Strings);

    // Management overlay gating
    const showFullOverlay = rights.includes('admin:access') ||
      rights.includes('config:admin');
    const showEffortOnly = rights.includes('study:view') && !showFullOverlay;
    const showOverlay = showFullOverlay || showEffortOnly;
    const showReviewQueue = rights.includes('review:approve');

    const client = await createClientFromRequest(req);
    const dashboardData = await client.Dashboard.Load();

    const paneRoutes: Record<string, string> = {
      incoming: '/receive',
      transfers: '/transfer',
      returns: '/return',
      reconciliations: '/reconciliation',
      dispositions: '/disposition',
    };

    const panes: DashboardPane[] = dashboardData.Panes.map((p) => ({
      ...p,
      Name: t(`dashboard.pane.${p.Id}`),
      Route: paneRoutes[p.Id] ?? '/',
    }));

    let reviews: DashboardReview[] = [];
    if (showReviewQueue) {
      const pendingReviews = await client.Reviews.List({ Status: 'pending' });
      const now = Date.now();
      reviews = pendingReviews.map((r) => ({
        ReviewId: r.ReviewId,
        TypeLabel: t(`review.type.${r.Type}`),
        EntityId: r.EntityId,
        SubmittedBy: r.SubmittedBy,
        SubmittedAt: r.SubmittedAt,
        ValidationResult: r.ValidationResult,
        ValidationLabel: t(`review.validation.${r.ValidationResult}`),
        ExceptionFlags: r.ExceptionFlags,
        Overdue: (now - new Date(r.SubmittedAt).getTime()) >
          24 * 60 * 60 * 1000,
      }));
    }

    const PERSONA_DISPLAY: Record<string, { name: string; role: string }> = {
      'liora.vasquez': { name: 'Dr. Liora Vasquez', role: 'Sample Manager' },
      'dr.priya.lindqvist': { name: 'Dr. Priya Lindqvist', role: 'Lab Manager' },
      'dr.tobias.nakamura': { name: 'Dr. Tobias Nakamura', role: 'Scientist' },
      'declan.okafor': { name: 'Declan Okafor', role: 'HBSM Custodian' },
      'annika.desrosiers': { name: 'Annika Desrosiers', role: 'QA Auditor' },
      'renata.solberg': { name: 'Renata Solberg', role: 'Study Coordinator' },
      'dr.emile.kowalczyk': {
        name: 'Dr. Emile Kowalczyk',
        role: 'CSV Group Head',
      },
    };
    const personaInfo: { name: string; role: string } =
      (ctx.State.Username ? PERSONA_DISPLAY[ctx.State.Username] : undefined) ??
        { name: 'Dr. Liora Vasquez', role: 'Sample Manager' };

    return ctx.Render({
      ...ctx.Data,
      Heading: t('dashboard.heading'),
      UserName: personaInfo.name,
      UserRole: personaInfo.role,
      Panes: panes,
      TemporalPriority: getTemporalPriority(),
      SystemStatus: [
        {
          ComponentId: 'temp-monitoring',
          Label: t('dashboard.system.tempMonitoring'),
          Status: 'online' as const,
        },
        {
          ComponentId: 'barcode-tracking',
          Label: t('dashboard.system.barcodeTracking'),
          Status: 'online' as const,
        },
        {
          ComponentId: 'lims-integration',
          Label: t('dashboard.system.limsIntegration'),
          Status: 'connecting' as const,
        },
        {
          ComponentId: 'backup-status',
          Label: t('dashboard.system.backupStatus'),
          Status: 'offline' as const,
          Note: t('dashboard.system.backupNote'),
        },
      ],
      SystemHeading: t('dashboard.system.heading'),
      OnlineLabel: t('dashboard.system.online'),
      ConnectingLabel: t('dashboard.system.connecting'),
      ComplianceStatus: [
        {
          StandardId: '21-cfr-11',
          Label: t('dashboard.compliance.cfr'),
          Compliant: true,
        },
        {
          StandardId: 'gxp',
          Label: t('dashboard.compliance.gxp'),
          Compliant: true,
        },
        {
          StandardId: 'ich-gcp',
          Label: t('dashboard.compliance.ichgcp'),
          Compliant: true,
        },
      ],
      ComplianceHeading: t('dashboard.compliance.heading'),
      ComplianceLabel: t('dashboard.compliance.compliant'),
      ManagementOverlay: showOverlay ? dashboardData.ManagementOverlay : null,
      StatusLabels: {
        Ready: t('dashboard.status.ready'),
        Attention: t('dashboard.status.attention'),
        VolumeHold: t('dashboard.status.volumeHold'),
        Problem: t('dashboard.status.problem'),
      },
      ManagementLabels: showOverlay
        ? {
          Toggle: t('dashboard.management.toggle'),
          Show: t('dashboard.management.show'),
          Hide: t('dashboard.management.hide'),
          Effort: t('dashboard.management.effort'),
          Capacity: t('dashboard.management.capacity'),
        }
        : null,
      ViewAllLabel: t('dashboard.pane.viewAll'),
      Reviews: reviews,
      ShowReviewQueue: showReviewQueue,
      ReviewLabels: showReviewQueue
        ? {
          Heading: t('review.queue.heading'),
          Subtitle: t('review.queue.subtitle'),
          ColumnHeaders: {
            Type: t('review.col.type'),
            EntityId: t('review.col.entityId'),
            SubmittedBy: t('review.col.submittedBy'),
            SubmittedAt: t('review.col.submittedAt'),
            Validation: t('review.col.validation'),
            Exceptions: t('review.col.exceptions'),
            Actions: t('review.col.actions'),
          },
          ActionLabels: {
            Approve: t('review.action.approve'),
            Reject: t('review.action.reject'),
            Escalate: t('review.action.escalate'),
          },
          EmptyLabel: t('review.empty'),
          OverdueLabel: t('review.overdue'),
        }
        : null,
    });
  },
};

// --- Component ---

function StatusDot(
  { status }: { status: 'online' | 'connecting' | 'offline' },
) {
  if (status === 'online') {
    return <span class='text-status-ready'>●</span>;
  }
  if (status === 'connecting') {
    return <span class='text-status-attention'>◌</span>;
  }
  return <span class='text-on-surface-muted'>●</span>;
}

function StatusLabel({ status, onlineLabel, connectingLabel }: {
  status: 'online' | 'connecting' | 'offline';
  onlineLabel: string;
  connectingLabel: string;
}) {
  if (status === 'online') return <>{onlineLabel}</>;
  if (status === 'connecting') return <>{connectingLabel}</>;
  return null;
}

export default function Dashboard({ Data }: PageProps<DashboardData>) {
  const d = Data!;

  return (
    <div class='space-y-6'>
      {/* Header */}
      <div>
        <h1 class='text-xl font-bold text-primary'>{d.Heading}</h1>
        <p class='text-sm text-on-surface-secondary'>
          {d.UserName} — {d.UserRole}
        </p>
      </div>

      {/* Review Queue (role-gated) */}
      {d.ShowReviewQueue && d.ReviewLabels && (
        <ReviewQueue
          reviews={d.Reviews.map((r) => ({
            reviewId: r.ReviewId,
            typeLabel: r.TypeLabel,
            entityId: r.EntityId,
            submittedBy: r.SubmittedBy,
            submittedAt: r.SubmittedAt,
            validationResult: r.ValidationResult,
            validationLabel: r.ValidationLabel,
            exceptionFlags: r.ExceptionFlags,
            overdue: r.Overdue,
          }))}
          heading={d.ReviewLabels.Heading}
          subtitle={d.ReviewLabels.Subtitle}
          columnHeaders={{
            type: d.ReviewLabels.ColumnHeaders.Type,
            entityId: d.ReviewLabels.ColumnHeaders.EntityId,
            submittedBy: d.ReviewLabels.ColumnHeaders.SubmittedBy,
            submittedAt: d.ReviewLabels.ColumnHeaders.SubmittedAt,
            validation: d.ReviewLabels.ColumnHeaders.Validation,
            exceptions: d.ReviewLabels.ColumnHeaders.Exceptions,
            actions: d.ReviewLabels.ColumnHeaders.Actions,
          }}
          actionLabels={{
            approve: d.ReviewLabels.ActionLabels.Approve,
            reject: d.ReviewLabels.ActionLabels.Reject,
            escalate: d.ReviewLabels.ActionLabels.Escalate,
          }}
          emptyLabel={d.ReviewLabels.EmptyLabel}
          overdueLabel={d.ReviewLabels.OverdueLabel}
          apiBase=''
        />
      )}

      {/* 5 Activity Panes */}
      <ActivityPanes
        panes={d.Panes.map((p) => ({
          id: p.Id,
          name: p.Name,
          total: p.Total,
          ready: p.Ready,
          attention: p.Attention,
          volumeHold: p.VolumeHold,
          problem: p.Problem,
          route: p.Route,
          readyLabel: d.StatusLabels.Ready,
          attentionLabel: d.StatusLabels.Attention,
          volumeHoldLabel: d.StatusLabels.VolumeHold,
          problemLabel: d.StatusLabels.Problem,
          viewAllLabel: d.ViewAllLabel,
        }))}
        temporalPriority={d.TemporalPriority}
      />

      {/* Management Overlay (role-gated) */}
      {d.ManagementOverlay && d.ManagementLabels && (
        <ManagementOverlay
          toggleLabel={d.ManagementLabels.Toggle}
          showLabel={d.ManagementLabels.Show}
          hideLabel={d.ManagementLabels.Hide}
          effortLabel={d.ManagementLabels.Effort}
          capacityLabel={d.ManagementLabels.Capacity}
          effortData={d.ManagementOverlay.EffortData.map((e) => ({
            manager: e.Manager,
            count: e.Count,
          }))}
          capacityData={{
            current: d.ManagementOverlay.CapacityData.Current,
            projected: d.ManagementOverlay.CapacityData.Projected,
            breakpoint: d.ManagementOverlay.CapacityData.Breakpoint,
          }}
        />
      )}

      {/* Bottom panels */}
      <div class='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* System Status */}
        <div class='rounded-lg border border-border bg-surface-card p-4'>
          <h3 class='text-sm font-semibold text-on-surface mb-3'>
            {d.SystemHeading}
          </h3>
          <div class='space-y-2 text-sm'>
            {d.SystemStatus.map((item) => (
              <div key={item.Label} class='flex justify-between items-center'>
                <span class='text-on-surface-secondary'>{item.Label}</span>
                <span class='flex items-center gap-1'>
                  <StatusDot status={item.Status} />
                  {item.Note
                    ? (
                      <span class='text-on-surface-muted text-xs'>
                        {item.Note}
                      </span>
                    )
                    : (
                      <StatusLabel
                        status={item.Status}
                        onlineLabel={d.OnlineLabel}
                        connectingLabel={d.ConnectingLabel}
                      />
                    )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Status */}
        <div class='rounded-lg border border-border bg-surface-card p-4'>
          <h3 class='text-sm font-semibold text-on-surface mb-3'>
            {d.ComplianceHeading}
          </h3>
          <div class='space-y-2 text-sm'>
            {d.ComplianceStatus.map((item) => (
              <div key={item.Label} class='flex justify-between items-center'>
                <span class='text-on-surface-secondary'>{item.Label}</span>
                <span
                  class={`font-medium ${
                    item.Compliant
                      ? 'text-status-ready-text'
                      : 'text-status-problem-text'
                  }`}
                >
                  {d.ComplianceLabel} {item.Compliant ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
