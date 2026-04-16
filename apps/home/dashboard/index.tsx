import { PageProps } from '@fathym/eac-applications/preact';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../src/state/OISampleMgmtWebState.ts';
import { useTranslation } from '../../../src/utils/useTranslation.ts';
import { getTemporalPriority } from '../../../src/utils/getTemporalPriority.ts';
import ActivityPanes from '../../components/ActivityPanes.tsx';
import ManagementOverlay from '../../components/ManagementOverlay.tsx';

// --- Types ---

type SystemStatusItem = {
  Label: string;
  Status: 'online' | 'connecting' | 'offline';
  Note?: string;
};

type ComplianceStatusItem = {
  Label: string;
  Compliant: boolean;
  ComplianceLabel: string;
};

type PaneViewData = {
  Id: string;
  Name: string;
  Total: number;
  Ready: number;
  Attention: number;
  VolumeHold: number;
  Problem: number;
  Route: string;
};

type ManagementOverlayData = {
  EffortData: Array<{ Manager: string; Count: number }>;
  CapacityData: { Current: number; Projected: number; Breakpoint: number };
};

type DashboardData = {
  Heading: string;
  UserName: string;
  UserRole: string;
  Panes: PaneViewData[];
  TemporalPriority: string | null;
  SystemStatus: SystemStatusItem[];
  SystemHeading: string;
  OnlineLabel: string;
  ConnectingLabel: string;
  ComplianceStatus: ComplianceStatusItem[];
  ComplianceHeading: string;
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
};

// --- Handler ---

export const handler: EaCRuntimeHandlerSet<
  OISampleMgmtWebState,
  DashboardData
> = {
  GET: (_req, ctx) => {
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

    // Remaining: lab_manager, csv_group_head, read_only, dev_default → /dashboard

    const { t } = useTranslation(ctx.State.Strings);

    // Management overlay gating
    const showFullOverlay =
      rights.includes('admin:access') || rights.includes('config:admin');
    const showEffortOnly =
      rights.includes('study:view') && !showFullOverlay;
    const showOverlay = showFullOverlay || showEffortOnly;

    const panes: PaneViewData[] = [
      {
        Id: 'incoming',
        Name: t('dashboard.pane.incoming'),
        Total: 3,
        Ready: 1,
        Attention: 1,
        VolumeHold: 0,
        Problem: 1,
        Route: '/receive',
      },
      {
        Id: 'transfers',
        Name: t('dashboard.pane.transfers'),
        Total: 5,
        Ready: 3,
        Attention: 1,
        VolumeHold: 1,
        Problem: 0,
        Route: '/transfer',
      },
      {
        Id: 'returns',
        Name: t('dashboard.pane.returns'),
        Total: 2,
        Ready: 1,
        Attention: 1,
        VolumeHold: 0,
        Problem: 0,
        Route: '/return',
      },
      {
        Id: 'reconciliations',
        Name: t('dashboard.pane.reconciliations'),
        Total: 1,
        Ready: 0,
        Attention: 1,
        VolumeHold: 0,
        Problem: 0,
        Route: '/reconciliation',
      },
      {
        Id: 'dispositions',
        Name: t('dashboard.pane.dispositions'),
        Total: 4,
        Ready: 2,
        Attention: 0,
        VolumeHold: 1,
        Problem: 1,
        Route: '/disposition',
      },
    ];

    return ctx.Render({
      ...ctx.Data,
      Heading: t('dashboard.heading'),
      UserName: 'Dr. Elena Martinez',
      UserRole: 'Sample Manager',
      Panes: panes,
      TemporalPriority: getTemporalPriority(),
      SystemStatus: [
        {
          Label: t('dashboard.system.tempMonitoring'),
          Status: 'online' as const,
        },
        {
          Label: t('dashboard.system.barcodeTracking'),
          Status: 'online' as const,
        },
        {
          Label: t('dashboard.system.limsIntegration'),
          Status: 'connecting' as const,
        },
        {
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
          Label: t('dashboard.compliance.cfr'),
          Compliant: true,
          ComplianceLabel: t('dashboard.compliance.compliant'),
        },
        {
          Label: t('dashboard.compliance.gxp'),
          Compliant: true,
          ComplianceLabel: t('dashboard.compliance.compliant'),
        },
        {
          Label: t('dashboard.compliance.ichgcp'),
          Compliant: true,
          ComplianceLabel: t('dashboard.compliance.compliant'),
        },
      ],
      ComplianceHeading: t('dashboard.compliance.heading'),
      ManagementOverlay: showOverlay
        ? {
          EffortData: [
            { Manager: 'Dr. Martinez', Count: 24 },
            { Manager: 'J. Thompson', Count: 18 },
            { Manager: 'R. Patel', Count: 31 },
            { Manager: 'S. Kim', Count: 12 },
          ],
          CapacityData: { Current: 85, Projected: 120, Breakpoint: 100 },
        }
        : null,
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
    });
  },
};

// --- Component ---

function StatusDot({ status }: { status: 'online' | 'connecting' | 'offline' }) {
  if (status === 'online') {
    return <span class="text-status-ready">●</span>;
  }
  if (status === 'connecting') {
    return <span class="text-status-attention">◌</span>;
  }
  return <span class="text-on-surface-muted">●</span>;
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
    <div class="space-y-6">
      {/* Header */}
      <div>
        <h1 class="text-xl font-bold text-primary">{d.Heading}</h1>
        <p class="text-sm text-on-surface-secondary">
          {d.UserName} — {d.UserRole}
        </p>
      </div>

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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Status */}
        <div class="rounded-lg border border-border bg-surface-card p-4">
          <h3 class="text-sm font-semibold text-on-surface mb-3">
            {d.SystemHeading}
          </h3>
          <div class="space-y-2 text-sm">
            {d.SystemStatus.map((item) => (
              <div key={item.Label} class="flex justify-between items-center">
                <span class="text-on-surface-secondary">{item.Label}</span>
                <span class="flex items-center gap-1">
                  <StatusDot status={item.Status} />
                  {item.Note
                    ? (
                      <span class="text-on-surface-muted text-xs">
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
        <div class="rounded-lg border border-border bg-surface-card p-4">
          <h3 class="text-sm font-semibold text-on-surface mb-3">
            {d.ComplianceHeading}
          </h3>
          <div class="space-y-2 text-sm">
            {d.ComplianceStatus.map((item) => (
              <div key={item.Label} class="flex justify-between items-center">
                <span class="text-on-surface-secondary">{item.Label}</span>
                <span
                  class={`font-medium ${
                    item.Compliant
                      ? 'text-status-ready-text'
                      : 'text-status-problem-text'
                  }`}
                >
                  {item.ComplianceLabel}{' '}
                  {item.Compliant ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
