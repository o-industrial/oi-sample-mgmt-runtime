export const sampleMgmtDeck = {
  title: {
    badge: 'OI Sample Management',
    headline: 'Manifest Intake Chain-of-Custody',
    subheadline:
      'ALCOA+ by construction — the $15K proof that changes what regulated data governance means',
    tagline: '21 CFR Part 11 · GxP · ICH GCP',
    transition: 'zoom',
  },

  theShift: {
    headline:
      "The sample management problem isn't complexity — it's governance timing",
    before:
      'Compliance added after build, during validation. 25–40% of budget. Re-validate on every change.',
    after:
      'Governance in node architecture. Demonstrated at design. Inherited by every workflow.',
    transition: 'slide',
  },

  stakes: {
    headline: '95% of biopharma professionals experienced sample-related pain',
    stats: [
      {
        value: '~90%',
        label: 'of research sites have misplaced patient samples',
      },
      {
        value: 'Only 38%',
        label: 'have real-time biospecimen visibility',
      },
      {
        value: '3×',
        label: "processing time increase after 'modern' digital upgrade",
      },
      {
        value: '25–40%',
        label: 'of LIMS budgets go to validation, not development',
      },
    ],
    risks: [
      'Contemporaneous violated at manifest receipt — record reconstructed after arrival',
      'Attributable at risk — who received, when, from whom, in what condition?',
      '21 CFR Part 11 audit trail is raw database deltas — QA translates in Excel',
    ],
    transition: 'fade',
  },

  theGap: {
    headline: 'The manifest moment is the undigitized ALCOA+ gap',
    description:
      'The receiving lab finds out about incoming samples when the courier walks in. The manifest arrives on paper, or as an email nobody checked. Chain-of-custody is reconstructed after arrival.',
    alcoa: [
      {
        principle: 'Contemporaneous',
        status: 'VIOLATED',
        detail:
          'Record reconstructed after arrival, not created at moment of action',
      },
      {
        principle: 'Attributable',
        status: 'AT RISK',
        detail:
          'Who received, at what exact time, from whom, in what condition?',
      },
      {
        principle: 'Original',
        status: 'AT RISK',
        detail: 'Paper manifest vs digital entry — which is the original?',
      },
    ],
    transition: 'slide',
  },

  solution: {
    headline: 'Governance by construction — not by configuration',
    tagline:
      'ALCOA+ in the node architecture. Demonstrated at design. No re-validation when the system changes.',
    points: [
      {
        label: 'Attributable',
        detail:
          'Audit-log node captures user_id + system_id at every execution',
      },
      {
        label: 'Contemporaneous',
        detail:
          'Timestamp is server-assigned at IoT event — not user-editable, not backdatable',
      },
      {
        label: 'Original',
        detail:
          'Immutable audit trail — originals preserved; amendments flagged with reason + approver',
      },
      {
        label: 'Complete',
        detail:
          'Failed scans and rejected manifests captured — not just successes',
      },
      {
        label: 'Enduring',
        detail: 'Cosmos DB — 15-year retention, WORM-protected, georeplication',
      },
      {
        label: 'Available',
        detail:
          'RegulatoryInspector role — read-only access + export at any time',
      },
    ],
    transition: 'fade',
  },

  theLoop: {
    headline: 'Manifest intake — governed at every step',
    stages: [
      {
        step: '1',
        label: 'Manifest Pre-Notification',
        detail:
          'Digital manifest arrives before shipment — lab staged and ready',
      },
      {
        step: '2',
        label: 'IoT Scan at Receipt',
        detail:
          'BarcodeScanner fires event at moment of physical scan — Contemporaneous',
      },
      {
        step: '3',
        label: 'ALCOA+ Record Created',
        detail:
          'Timestamp + operator ID + sample IDs — captured, not reconstructed',
      },
      {
        step: '4',
        label: 'Discrepancy Detection',
        detail:
          'Expected 12, received 11 — discrepancy event logged with ALCOA+ Complete',
      },
      {
        step: '5',
        label: 'QA Review',
        detail:
          'EaC compliance pack — 9-principle table, readable without OI platform access',
      },
      {
        step: '6',
        label: 'Customer Owns Output',
        detail: 'EaC configs in YAML/JSON — runs forever, no vendor dependency',
      },
    ],
    transition: 'slide',
  },

  webApp: {
    headline: 'The app is the surface — OI is the infrastructure',
    description:
      'Dr. Elena Martinez, Sample Manager, sees the GSK Human Biological Sample Management app. Behind it: the OI graph workspace with Azi, surfaces, connections, warm queries, and the ALCOA+ governance pack.',
    screens: [
      {
        name: 'Dashboard',
        detail: '4 KPIs · Priority alerts · 21 CFR Part 11/GxP/ICH GCP status',
      },
      {
        name: 'Sample Reception',
        detail:
          '4-tab manifest intake · 8-field form · Recent manifests from warm query',
      },
      {
        name: 'Audit Trail',
        detail:
          'ALCOA+-tagged events · Filter by user/action · Export CSV for inspectors',
      },
    ],
    pivotMoment:
      'Switch from web app → OI workspace mid-demo. Same data. Live Stream. "The compliance isn\'t in the app — it\'s in the node architecture."',
    transition: 'zoom',
  },

  alternatives: {
    headline: 'Three paths. All broken in a different way.',
    options: [
      {
        name: 'Enterprise LIMS',
        cost: '$100K–$500K+',
        time: '6–18 months',
        flaw: 'Scope/cost prohibitive. Validation adds 25–40% more.',
      },
      {
        name: 'Custom Build (2 FTE)',
        cost: '$130–250K+/year',
        time: '12–24 months',
        flaw:
          'Perpetual maintenance. No platform reuse. Still yours to validate.',
      },
      {
        name: 'Modern Cloud LIMS',
        cost: '$5K–$25K/year',
        time: '6–12 weeks',
        flaw: 'Governance bolted on. The 3× processing time story.',
      },
      {
        name: 'OI Pilot',
        cost: '$15K',
        time: '4 weeks',
        flaw: '—',
        highlight: true,
      },
    ],
    transition: 'slide',
  },

  pilot: {
    headline: '$15K · 4 weeks · yours to keep',
    scope:
      'One workflow: manifest intake chain-of-custody — from pre-arrival manifest to barcode receipt scan',
    deliverables: [
      'ALCOA+ compliance pack — 9-principle mapping your QA team reviews',
      'EaC workspace configuration — re-runnable YAML/JSON',
      'OQ/PQ validation evidence — single-workflow scope (2 days OQ, 3 days PQ)',
      '"Fire us and keep running" runbook — no vendor dependency',
    ],
    guarantee:
      'The configurations are yours. The compliance pack is yours. The system runs whether or not OI exists as a company next year.',
    transition: 'fade',
  },

  derisk: {
    headline:
      "The pilot is not where we prove we can build — it's where you prove the architecture",
    statements: [
      {
        claim: 'Your QA team reads the EaC configs',
        detail:
          'YAML/JSON — no OI platform access required to verify compliance',
      },
      {
        claim: 'Your validation team reviews the design',
        detail:
          '9-principle ALCOA+ table with node bindings — design review, not test review',
      },
      {
        claim: 'One workflow, not a platform commitment',
        detail:
          'Manifest intake only. You decide what comes next after 4 weeks.',
      },
      {
        claim: 'No SAP disruption',
        detail:
          'OI reads SAP inventory via MCP. Chain-of-custody gap filled without a new SAP module.',
      },
    ],
    transition: 'slide',
  },

  cta: {
    headline: 'Start with the manifest workflow',
    primary: 'Schedule the pilot kickoff',
    secondary: 'Request the ALCOA+ architecture review',
    contact: 'openindustrial.co/sample-management',
    tagline: '"Fire us and keep running. That\'s the pilot-level promise."',
    compliance: '21 CFR Part 11 · GxP · ICH GCP',
    transition: 'zoom',
  },
};
