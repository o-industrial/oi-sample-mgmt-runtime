export interface ProblemItem {
  title: string;
  description: string;
}
export interface SolutionItem {
  title: string;
  description: string;
}
export interface HowItWorksSteps {
  step1: string;
  step2: string;
  step3: string;
  step4: string;
}
export interface PilotDetails {
  investment: string;
  duration: string;
  environment: string;
  scope: string;
  outcome: string;
}
export interface WhyUsItem {
  title: string;
  description: string;
}
export interface CategoryStatement {
  statement: string;
  contrast: string;
}
export interface NextStep {
  headline: string;
  description: string;
}
export interface OnePagerContent {
  eyebrow: string;
  headline: string;
  theProblem: ProblemItem[];
  theSolution: SolutionItem[];
  howItWorks: HowItWorksSteps;
  pilot: PilotDetails;
  whyUs: WhyUsItem[];
  theCategory: CategoryStatement;
  nextStep: NextStep;
  closingQuote: string;
}

export const sampleMgmtOnePagerContent: OnePagerContent = {
  eyebrow: 'OI SAMPLE MANAGEMENT PILOT',
  headline: 'Manifest Intake Chain-of-Custody — ALCOA+ by Construction',

  theProblem: [
    {
      title: 'The Manifest Gap',
      description:
        'Receiving labs find out about incoming samples when the courier walks in. The chain-of-custody record is reconstructed after arrival — violating ALCOA Contemporaneous at the moment of receipt.',
    },
    {
      title: 'The 3x Tax',
      description:
        'Labs that upgraded to digital systems saw sample processing time triple. Faster data entry + no governance = more deviation reports, more QA time, not less.',
    },
    {
      title: 'The Validation Burden',
      description:
        '25–40% of LIMS implementation budgets go to validation, not development. Compliance-by-configuration requires re-validation every time the system changes.',
    },
  ],

  theSolution: [
    {
      title: 'Governance by Construction',
      description:
        'ALCOA+ is in the node architecture — not added at validation. The audit-log node captures attribution and timestamp at every execution. No backdating is architecturally possible.',
    },
    {
      title: 'Customer-Owned Compliance',
      description:
        'EaC configurations are YAML/JSON you own. Your QA team reads them. Your validation team reviews them. The system runs whether or not OI exists.',
    },
    {
      title: 'IoT-Native Receipt',
      description:
        'The barcode scanner fires an event at the moment of physical scan — not after documentation. Contemporaneous is structural, not procedural.',
    },
  ],

  howItWorks: {
    step1:
      'Manifest arrives digitally before shipment — lab is staged and ready',
    step2:
      'Courier arrives — barcode scanner fires IoT event at moment of receipt',
    step3:
      'ALCOA+ record created: timestamp, operator ID, sample IDs — captured, not reconstructed',
    step4:
      'QA team reviews EaC compliance pack — 9-principle ALCOA+ mapping from node architecture',
  },

  pilot: {
    investment: '$15,000',
    duration: '4 weeks',
    environment: 'One governed workflow',
    scope:
      'Manifest intake chain-of-custody — pre-arrival to barcode receipt scan',
    outcome:
      'ALCOA+ compliance pack + EaC configs you own + "fire us and keep running" runbook',
  },

  whyUs: [
    {
      title: 'Nobody else does governance this way',
      description:
        'Veeva, ServiceNow, and SAP add compliance as configuration. OI builds it into node architecture. The difference: you validate a design, not a configuration.',
    },
    {
      title: 'SAP knows what left — OI knows what arrived',
      description:
        'SAP manages lab consumables, not patient biospecimen samples. OI fills the chain-of-custody gap between SAP inventory and lab receipt — without a new SAP module.',
    },
    {
      title: 'One workflow in 4 weeks',
      description:
        'Not a platform migration. Not a full LIMS replacement. One governed workflow that proves the architecture — then you decide what comes next.',
    },
  ],

  theCategory: {
    statement: 'Governance-by-construction for regulated data',
    contrast:
      'Not a LIMS replacement — a different category. The validation argument is architectural, not documentary.',
  },

  nextStep: {
    headline: 'Start with the manifest workflow',
    description:
      '4 weeks. One workflow. ALCOA+ at every step. Your QA team reviews the design. You own the output.',
  },

  closingQuote: '"Fire us and keep running. That\'s the pilot-level promise."',
};
