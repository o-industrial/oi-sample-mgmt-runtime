export interface PersonaSummary {
  name: string;
  role: string;
  responsibility: string;
  landingPage: string;
}

export interface WorkflowSummary {
  persona: string;
  workflow: string;
  pages: string[];
  status: "live" | "seeded" | "planned";
}

export interface BuiltFromScott {
  quote: string;
  source: string;
  feature: string;
}

export interface OpenQuestion {
  question: string;
  context: string;
}

export interface DiscoverySummaryContent {
  eyebrow: string;
  headline: string;
  personas: PersonaSummary[];
  workflows: WorkflowSummary[];
  builtFromScott: BuiltFromScott[];
  openQuestions: OpenQuestion[];
  closingNote: string;
}

export const sampleMgmtDiscoverySummary: DiscoverySummaryContent = {
  eyebrow: "OI SAMPLE MANAGEMENT — DISCOVERY",
  headline: "GSK Human Biological Sample Management — Discovery Summary",

  personas: [
    {
      name: "Dr. Liora Vasquez",
      role: "Sample Manager",
      responsibility:
        "Receives shipments, scans barcodes, validates manifests, resolves discrepancies",
      landingPage: "/receive",
    },
    {
      name: "Dr. Priya Lindqvist",
      role: "Lab Manager",
      responsibility:
        'Monitors team capacity, tracks exceptions, reviews compliance, answers "when do I need another FTE?"',
      landingPage: "/ (dashboard)",
    },
    {
      name: "Dr. Tobias Nakamura",
      role: "Scientist",
      responsibility:
        "Requests returns, submits work lists — does NOT see operational surfaces",
      landingPage: "/return",
    },
    {
      name: "Declan Okafor",
      role: "HBSM Custodian",
      responsibility:
        "Per-study chain-of-custody owner — approves dispositions, transfers, authorizes returns",
      landingPage: "/disposition",
    },
    {
      name: "Annika Desrosiers",
      role: "QA Auditor",
      responsibility:
        'Audit trail inspection, reconstruction verification — "show me what happened to sample X"',
      landingPage: "/report/audit-trail",
    },
    {
      name: "Renata Solberg",
      role: "Study Coordinator",
      responsibility:
        'Monitors sample locations and status for specific studies — "where is my sample?"',
      landingPage: "/track/samples",
    },
    {
      name: "Dr. Emile Kowalczyk",
      role: "CSV Group Head",
      responsibility:
        'Receives escalated reviews, manages system configuration — Scott\'s "any idea I have I throw by him"',
      landingPage: "/ (dashboard, admin)",
    },
  ],

  workflows: [
    {
      persona: "Dr. Liora Vasquez",
      workflow: "Morning at the Bench",
      pages: ["/receive", "/reconciliation"],
      status: "live",
    },
    {
      persona: "Dr. Priya Lindqvist",
      workflow: "Manager's Morning Briefing",
      pages: ["/ (dashboard)", "/transfer"],
      status: "live",
    },
    {
      persona: "Dr. Tobias Nakamura",
      workflow: "Scientist Needs Samples Back",
      pages: ["/return"],
      status: "live",
    },
    {
      persona: "Declan Okafor",
      workflow: "Custody Governance",
      pages: ["/disposition", "/report/custody"],
      status: "seeded",
    },
    {
      persona: "Annika Desrosiers",
      workflow: "Compliance Deep Dive",
      pages: [
        "/report/audit-trail",
        "/report/ethics-approval",
        "/report/custody",
      ],
      status: "seeded",
    },
    {
      persona: "Renata Solberg",
      workflow: "Tracking My Studies",
      pages: ["/track/samples", "/report/custody"],
      status: "seeded",
    },
    {
      persona: "Dr. Emile Kowalczyk",
      workflow: "System Architect Reviews",
      pages: ["/ (dashboard)", "/reconciliation"],
      status: "seeded",
    },
  ],

  builtFromScott: [
    {
      quote: "Receptions are the most labor intensive thing we do",
      source: "L141",
      feature:
        "4-tab reception page with manifest upload, barcode scanning, temp logs, parcel reception",
    },
    {
      quote: "Where's the breaking point that I need another sample manager",
      source: "L134",
      feature:
        "Management overlay with effort tracking and capacity forecast (breakpoint bar)",
    },
    {
      quote: "I'd want to see tiles or panes",
      source: "L112",
      feature:
        "5 activity panes: Incoming, Transfers, Returns, Reconciliations, Dispositions",
    },
    {
      quote:
        "TurboTax. Go back this, go look, you look at this, this one still needs attention",
      source: "L116",
      feature:
        "4-state triage on every item: Ready (green), Attention (amber), Volume Hold (blue), Problem (red)",
    },
    {
      quote: "I need a signed off form from the custodian",
      source: "L101",
      feature:
        "HBSM Custodian role with custody:approve right — digital, timestamped, exportable signoff",
    },
    {
      quote: "You can't have duplications. You can't have duplicate barcodes",
      source: "L181",
      feature:
        "Reconciliation page with barcode-conflict discrepancy type and duplicate detection",
    },
    {
      quote: "Any idea I have I throw by him and he starts to make it true",
      source: "L171",
      feature:
        "CSV Group Head escalation chain: submitted → escalated → approved, zero email",
    },
  ],

  openQuestions: [
    {
      question: "Are these the right 7 roles for your team?",
      context:
        "We designed from your testimony — are there roles we missed or combined incorrectly?",
    },
    {
      question: "Which workflows matter most for day one?",
      context:
        "All 7 are designed but we want to prioritize the demo flows you care about most.",
    },
    {
      question: "What does the disposition workflow look like in practice?",
      context:
        "We have destroy/retain/deplete — are there other decision types?",
    },
    {
      question: "How should the escalation chain work?",
      context:
        "Currently: Sample Manager → Lab Manager → CSV Group Head. Is this right?",
    },
  ],

  closingNote:
    "This summary maps what you told us to what we built. The deck walks through each role and screen. Your feedback shapes what we finalize.",
};
