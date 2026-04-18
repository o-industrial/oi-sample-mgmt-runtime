import { CapabilityRunner } from '@fathym/steward/capabilities';
import { OIWarmQueryCapability, type OIWarmQueryHooks } from './OIWarmQueryCapability.ts';
import { SampleMgmtCapability, type SampleMgmtHooks } from './SampleMgmtCapability.ts';

let oiHooks: OIWarmQueryHooks | null = null;
let workflowHooks: SampleMgmtHooks | null = null;

export async function getOIHooks(): Promise<OIWarmQueryHooks> {
  if (!oiHooks) {
    oiHooks = await CapabilityRunner(OIWarmQueryCapability()).Execute(undefined);
  }
  return oiHooks;
}

export async function getWorkflowHooks(): Promise<SampleMgmtHooks> {
  if (!workflowHooks) {
    workflowHooks = await CapabilityRunner(SampleMgmtCapability()).Execute(undefined);
  }
  return workflowHooks;
}
