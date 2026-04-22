const SM_DEMO_BASE = 'https://sm-demo.openindustrial.co';

export const sampleMgmtDeck = {
  title: {
    badge: 'OI Sample Management',
    headline: 'Human Biological Sample Management',
    subheadline: 'Discovery Walkthrough',
    tagline: '7 personas · 7 workflows · your feedback shapes what we build',
    transition: 'zoom',
  },

  personas: {
    headline: 'The 7 Roles We Designed For',
    intro: 'These are the people we designed for based on what you told us.',
    roles: [
      {
        name: 'Dr. Liora Vasquez',
        role: 'Sample Manager',
        focus:
          'Receives shipments, scans barcodes, validates manifests, resolves discrepancies',
        landing: '/receive',
      },
      {
        name: 'Dr. Priya Lindqvist',
        role: 'Lab Manager',
        focus:
          'Monitors team, tracks exceptions, reviews compliance, capacity planning',
        landing: '/',
      },
      {
        name: 'Dr. Tobias Nakamura',
        role: 'Scientist',
        focus:
          'Requests returns, submits work lists — sees only return surface',
        landing: '/return',
      },
      {
        name: 'Declan Okafor',
        role: 'HBSM Custodian',
        focus:
          'Per-study chain-of-custody — approves dispositions, transfers, returns',
        landing: '/disposition',
      },
      {
        name: 'Annika Desrosiers',
        role: 'QA Auditor',
        focus:
          'Audit trail, ethics renewal, custody reconstruction for inspectors',
        landing: '/report/audit-trail',
      },
      {
        name: 'Renata Solberg',
        role: 'Study Coordinator',
        focus: 'Sample tracking by study — "where is my sample?"',
        landing: '/track/samples',
      },
      {
        name: 'Dr. Emile Kowalczyk',
        role: 'CSV Group Head',
        focus: 'Escalation queue, system config, compliance authority',
        landing: '/',
      },
    ],
    transition: 'slide',
  },

  absentNotBlocked: {
    headline: 'Absent, Not Blocked',
    description:
      'Each role sees only their surfaces. Users who don\'t have access to a feature simply don\'t see it — no disabled buttons, no "access denied." The UI reshapes itself around the role.',
    examples: [
      {
        role: 'Scientist',
        sees: 'Return requests only',
        doesNotSee: 'Dashboard, management overlay, approve buttons',
      },
      {
        role: 'QA Auditor',
        sees: 'Audit trail, ethics, custody reports',
        doesNotSee: 'Operational panes, reception tabs',
      },
      {
        role: 'Study Coordinator',
        sees: 'Sample tracking with study filter',
        doesNotSee: 'Dashboard, management overlay, review queue',
      },
      {
        role: 'HBSM Custodian',
        sees: 'Dispositions + approve buttons',
        doesNotSee: 'Management overlay, capacity forecast',
      },
    ],
    transition: 'fade',
  },

  // ── Sample Manager (Liora) ──────────────────────────────────

  sampleManagerWorkflow: {
    persona: 'Dr. Liora Vasquez',
    role: 'Sample Manager',
    headline: 'Morning at the Bench',
    why: '"Receptions are the most labor intensive thing we do." — Scott',
    steps: [
      'Check notification bell — 3 unread alerts (ethics expiry, temperature excursion, pending approval)',
      'Manifest Upload — 9-field acceptance gate: Study, ExpectedSamples, OriginSite, DestinationSite, WaybillNumber, Carrier, Period',
      'Temperature Logs — cold chain monitoring with date-range filter and ALCOA+ Contemporaneous badges',
      'Parcel Reception — 4-item checklist (condition, seal, temp indicator, courier) with two-person auth',
      'Barcode Scanning — rapid scan with timestamp + operator captured at moment of scan (Contemporaneous)',
      'Reconciliation — navigate to resolve discrepancies: count mismatch, metadata gap, barcode conflict',
    ],
    scottQuote: '"It just looks like they were shucking clams all day long."',
    transition: 'slide',
  },

  receiveScreen: {
    headline: 'Sample Reception',
    path: '/receive',
    description:
      '4-tab interface: Manifest Upload, Parcel Reception, Temperature Logs, Barcode Scanning. TurboTax status badges on every manifest (Ready green, Attention amber, Volume Hold blue, Problem red).',
    highlights: [
      '9-field manifest form with study dropdown pre-loaded from API',
      'Recent Manifests list with real-time status',
      'Barcode scanner input with batch mode',
      'Two-person authentication on parcel reception',
    ],
    link: { label: 'Open Sample Reception', href: `${SM_DEMO_BASE}/receive` },
    transition: 'fade',
  },

  reconciliationScreen: {
    headline: 'Reconciliation',
    path: '/reconciliation',
    description:
      'Discrepancy resolution for manifest intake. 4 discrepancy types: count mismatch, metadata gap, barcode conflict, format error. TurboTax triage drives resolution priority.',
    highlights: [
      'Expected vs. Actual counts at a glance',
      'Missing fields flagged by name',
      'SLA deadline tracking with overdue highlighting',
      'Barcode conflict detection — "You can\'t have duplicate barcodes"',
    ],
    link: {
      label: 'Open Reconciliation',
      href: `${SM_DEMO_BASE}/reconciliation`,
    },
    transition: 'fade',
  },

  // ── Lab Manager (Priya) ─────────────────────────────────────

  labManagerWorkflow: {
    persona: 'Dr. Priya Lindqvist',
    role: 'Lab Manager',
    headline: "Manager's Morning Briefing",
    why:
      '"Where\'s the breaking point that I need another sample manager?" — Scott',
    steps: [
      '5-pane dashboard overview: Incoming, Transfers, Returns, Reconciliations, Dispositions — each with TurboTax status bars',
      'Review queue: approve or escalate pending items (reception, reconciliation, transfers)',
      'Management overlay: Effort Tracking (4 sample managers with bar charts) + Capacity Forecast (current %, projected %, breakpoint 100%)',
      'Transfer page: inter-freezer, inter-site, inter-study with SLA deadline tracking',
      'Escalation handoff: escalated item arrives in CSV Group Head notification — full chain visible',
    ],
    scottQuote: '"I\'d want to see tiles or panes."',
    transition: 'slide',
  },

  dashboardScreen: {
    headline: 'Dashboard',
    path: '/',
    description:
      '5 activity panes with TurboTax status bars. Management overlay toggle reveals Effort Tracking + Capacity Forecast. Review queue for pending approvals. System Status + Compliance Status panels.',
    highlights: [
      '5 activity panes: Incoming, Transfers, Returns, Reconciliations, Dispositions',
      'Management overlay with capacity breakpoint bar (turns red at 100%)',
      'Review queue with approve/escalate actions',
      'System health: temp monitoring, barcode tracking, LIMS integration, backup status',
      'Compliance status: 21 CFR Part 11, GxP, ICH-GCP',
    ],
    link: { label: 'Open Dashboard', href: `${SM_DEMO_BASE}/` },
    transition: 'fade',
  },

  transferScreen: {
    headline: 'Transfer Management',
    path: '/transfer',
    description:
      'Inter-location sample transfers with 3 types: inter-freezer, inter-site, inter-study. Approval workflow for custody:approve role. SLA deadline tracking with overdue highlighting.',
    highlights: [
      '5 status cards: Total, Ready, Attention, VolumeHold, Problem',
      'Filter by transfer type and status',
      'SLA deadline column with overdue items in red',
      'Approve button visible for custody:approve role',
    ],
    link: { label: 'Open Transfers', href: `${SM_DEMO_BASE}/transfer` },
    transition: 'fade',
  },

  // ── Scientist (Tobias) ──────────────────────────────────────

  scientistWorkflow: {
    persona: 'Dr. Tobias Nakamura',
    role: 'Scientist',
    headline: 'Needs Samples Back',
    why:
      "Scientists are end consumers, not operators. They shouldn't see operational noise — only the surface they need.",
    steps: [
      'Navigate to dashboard → immediate redirect to /return (scientist never sees dashboard)',
      'View return requests with status summary cards',
      'Request a return: destination, packaging instructions, reason',
      'NO Approve button visible — scientist lacks custody:approve',
      'Can navigate to /track/samples for limited sample visibility',
      'Notification bell available — but only scientist-relevant alerts',
    ],
    scottQuote: null,
    transition: 'slide',
  },

  returnScreen: {
    headline: 'Return Requests',
    path: '/return',
    description:
      'Constrained view — the only operational page scientists see. Return request form with packaging instructions and outcome tracking. No dashboard, no management overlay, no approve buttons.',
    highlights: [
      '5 status cards: Total, Ready, Attention, VolumeHold, Problem',
      'Return table: ReturnId, Destination, SampleCount, RequestedBy, Status, Packaging',
      'Approve button absent (not disabled — absent)',
      'Demonstrates "Absent, Not Blocked" principle',
    ],
    link: { label: 'Open Returns', href: `${SM_DEMO_BASE}/return` },
    transition: 'fade',
  },

  // ── Custodian (Declan) ──────────────────────────────────────

  custodianWorkflow: {
    persona: 'Declan Okafor',
    role: 'HBSM Custodian',
    headline: 'Custody Governance',
    why:
      'Per-study chain-of-custody authority, separate from sample managers. "I need a signed off form from the custodian." — Scott',
    steps: [
      'Navigate to dashboard → redirect to /disposition (custodian landing)',
      'Review dispositions: destroy, retain, deplete decisions with evidence documents',
      'Approve disposition — two-person auth, digital signoff, timestamped',
      'Navigate to /return — Approve button IS visible here (contrast with Scientist)',
      'Custody report drill-through: search by sample ID, timeline view, PDF export',
      'Notification triage: approval requests arrive via ActionUrl — one click to context',
    ],
    scottQuote: '"I need a signed off form from the custodian."',
    transition: 'slide',
  },

  dispositionScreen: {
    headline: 'Disposition Management',
    path: '/disposition',
    description:
      '3 disposition types: Destroy (formal disposal with custodian approval), Retain (biobank routing), Depleted (scientist consumed sample). Evidence document tracking. Custody approval workflow.',
    highlights: [
      '5 status cards: Total, Ready, Attention, VolumeHold, Problem',
      'Filter by decision type (destroy, retain, deplete, pending) and status',
      'Evidence document count per disposition',
      'Approve button visible — custodian has custody:approve',
      'Destruction deadline tracking — overdue items flagged',
    ],
    link: {
      label: 'Open Dispositions',
      href: `${SM_DEMO_BASE}/disposition`,
    },
    transition: 'fade',
  },

  // ── QA Auditor (Annika) ─────────────────────────────────────

  qaAuditorWorkflow: {
    persona: 'Annika Desrosiers',
    role: 'QA Auditor',
    headline: 'Compliance Deep Dive',
    why:
      '"Show me what happened to sample X." — the auditor\'s single question that the system must answer in one click.',
    steps: [
      'Navigate to dashboard → redirect to /report/audit-trail (auditor landing)',
      'ALCOA+ principle badges on every event: Contemporaneous, Original, Attributable, Accurate, Legible, Enduring, Available',
      'Filter by action type (Scan, Create, Update, Approve) and date range',
      'Failed events captured contemporaneously — not just successes (Governance by Construction)',
      'Export CSV — FDA-ready audit export, one click',
      'Ethics approval tab: expiry tracking, one-click renewal action',
      'Custody report: sample timeline reconstruction for inspector queries',
    ],
    scottQuote: null,
    transition: 'slide',
  },

  auditTrailScreen: {
    headline: 'Audit Trail',
    path: '/report/audit-trail',
    description:
      'ALCOA+ compliant event log with principle badges on every row. Sub-navigation to Ethics Approval and Custody reports. Date-range filtering, user/action filtering, CSV export for inspectors.',
    highlights: [
      'ALCOA+ principle badge per event (Contemporaneous, Attributable, etc.)',
      'Action type filter: Scan, Create, Update, Approve',
      'Failed events shown with red status — system captures failures too',
      'Export CSV button for FDA-ready compliance reports',
      'Sub-nav: Audit Trail | Ethics Approval | Custody',
    ],
    link: {
      label: 'Open Audit Trail',
      href: `${SM_DEMO_BASE}/report/audit-trail`,
    },
    transition: 'fade',
  },

  // ── Study Coordinator (Renata) ──────────────────────────────

  studyCoordinatorWorkflow: {
    persona: 'Renata Solberg',
    role: 'Study Coordinator',
    headline: 'Tracking My Studies',
    why:
      '"Where is my sample?" — the question study coordinators ask 10 times a day, currently answered by phone + email to the sample manager.',
    steps: [
      'Navigate to dashboard → redirect to /track/samples (coordinator landing)',
      'Status summary cards: Total Received, In Processing, In Storage, Transferred',
      'Type study name (e.g., "BEACON-3") → instantly filtered to 3 matching samples',
      'Click "View Report" → drill through to /report/custody with full sample timeline',
      'Navigate to /report/ethics-approval — verify study ethics status (active/expiring/expired)',
      'No dashboard access — redirect back to /track/samples (absent-not-blocked)',
    ],
    scottQuote: '"Some study leads will want to know their sample location."',
    transition: 'slide',
  },

  trackSamplesScreen: {
    headline: 'Sample Tracking',
    path: '/track/samples',
    description:
      'Searchable sample table with study filter. Status cards show lifecycle distribution. Drill-through to custody reports. Self-service access eliminates phone + email chains to sample managers.',
    highlights: [
      '4 status cards: Total Received, In Processing, In Storage, Transferred',
      'Search by study name — instant filtering',
      'Columns: SampleId, Study, OriginSite, Received, Status, Storage, LastAction',
      'View Report link → custody timeline with ALCOA+ badges',
      'No operational actions — read-only tracking',
    ],
    link: {
      label: 'Open Sample Tracking',
      href: `${SM_DEMO_BASE}/track/samples`,
    },
    transition: 'fade',
  },

  // ── CSV Group Head (Emile) ──────────────────────────────────

  csvGroupHeadWorkflow: {
    persona: 'Dr. Emile Kowalczyk',
    role: 'CSV Group Head',
    headline: 'System Architect Reviews',
    why:
      '"Any idea I have I throw by him and he starts to make it true." — Scott',
    steps: [
      'Navigate to dashboard → stays on / (config:admin stays, no redirect)',
      'Full 5-pane view + complete management overlay (both Effort Tracking and Capacity Forecast)',
      'Review queue: escalated items show full chain — SubmittedBy → EscalatedBy → approver action',
      'System Status panel: temp monitoring, barcode tracking, LIMS integration, backup — all at a glance',
      'Compliance Status: 21 CFR Part 11, GxP, ICH-GCP — configuration authority dashboard',
      'Notification triage: escalation alert with ActionUrl → one click to /reconciliation context',
    ],
    scottQuote:
      '"Any idea I have I throw by him and he starts to make it true."',
    transition: 'slide',
  },

  adminDashboardScreen: {
    headline: 'Admin Dashboard',
    path: '/',
    description:
      'Same dashboard as Lab Manager PLUS full configuration authority. Complete management overlay (effort + capacity). Review queue with escalated items showing full approval chain metadata. System + Compliance panels.',
    highlights: [
      'Full 5-pane view with TurboTax status bars',
      'Complete management overlay: Effort Tracking + Capacity Forecast',
      'Review queue with escalation chain: SubmittedBy → EscalatedBy visible',
      'System Status: 4 integrations with online/connecting/offline badges',
      'Compliance Status: 3 standards with compliant/non-compliant indicators',
      'Escalation → approve completes the chain: Liora → Priya → Emile',
    ],
    link: { label: 'Open Admin Dashboard', href: `${SM_DEMO_BASE}/` },
    transition: 'fade',
  },

  // ── Wrap ────────────────────────────────────────────────────

  builtVsNext: {
    headline: "What's Built vs. What's Next",
    description:
      'Honest status — which screens are live with seed data, which are planned.',
    matrix: [
      {
        screen: 'Dashboard (5-pane + overlay)',
        status: 'seeded',
        personas: 'Lab Manager, CSV Group Head',
      },
      {
        screen: 'Sample Reception (4 tabs)',
        status: 'seeded',
        personas: 'Sample Manager',
      },
      {
        screen: 'Transfer Management',
        status: 'seeded',
        personas: 'Lab Manager, Custodian',
      },
      {
        screen: 'Return Requests',
        status: 'seeded',
        personas: 'Scientist, Custodian',
      },
      {
        screen: 'Disposition Management',
        status: 'seeded',
        personas: 'Custodian',
      },
      {
        screen: 'Reconciliation',
        status: 'seeded',
        personas: 'Sample Manager',
      },
      {
        screen: 'Audit Trail + ALCOA+ badges',
        status: 'seeded',
        personas: 'QA Auditor',
      },
      {
        screen: 'Ethics Approval',
        status: 'seeded',
        personas: 'QA Auditor, Study Coordinator',
      },
      {
        screen: 'Custody Reports',
        status: 'seeded',
        personas: 'Custodian, QA Auditor, Study Coordinator',
      },
      {
        screen: 'Sample Tracking',
        status: 'seeded',
        personas: 'Study Coordinator',
      },
      {
        screen: 'Email Watcher (auto-notification)',
        status: 'planned',
        personas: 'Sample Manager',
      },
      {
        screen: 'OI Workspace Graph Canvas',
        status: 'planned',
        personas: '(infrastructure — not persona-facing)',
      },
    ],
    transition: 'slide',
  },

  discussion: {
    headline: 'Your Feedback Shapes What We Build',
    prompts: [
      'Are these the right 7 roles for your team?',
      'Which workflows matter most for day one?',
      'What did we get right? What did we get wrong?',
      "What's missing that you expected to see?",
    ],
    closingNote:
      'Every screen you saw today was designed from what you told us. This conversation shapes what we finalize.',
    transition: 'zoom',
  },
};
