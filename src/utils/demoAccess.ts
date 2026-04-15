export const DEMO_ROLE_RIGHTS: Record<string, string[]> = {
  sample_manager: ['samples:receive', 'samples:view', 'compliance:view'],
  qa_auditor: ['samples:view', 'compliance:view', 'compliance:export'],
  lab_manager: [
    'samples:receive',
    'samples:view',
    'compliance:view',
    'compliance:export',
    'admin:access',
    'custody:approve',
    'study:view',
    'config:admin',
    'scientist:request',
  ],
  study_coordinator: ['samples:view', 'compliance:view', 'study:view'],
  read_only: ['samples:view'],
  hbsm_custodian: ['custody:approve', 'samples:view', 'compliance:view'],
  study_lead: ['study:view', 'samples:view'],
  csv_group_head: ['config:admin', 'samples:view', 'compliance:view'],
  scientist: ['scientist:request', 'samples:view'],
};

export const DEV_DEFAULT_RIGHTS = [
  'samples:receive',
  'samples:view',
  'compliance:view',
  'compliance:export',
];

export function resolveAccessRights(
  req: Request,
  runtimeRights: string[] | undefined,
): string[] {
  if (runtimeRights && runtimeRights.length > 0) return runtimeRights;

  const url = new URL(req.url);
  const demoRole = url.searchParams.get('demo_role');
  if (demoRole && demoRole in DEMO_ROLE_RIGHTS) {
    return DEMO_ROLE_RIGHTS[demoRole as keyof typeof DEMO_ROLE_RIGHTS];
  }

  return DEV_DEFAULT_RIGHTS;
}
