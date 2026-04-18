import { loadJwtConfig } from '@fathym/common/jwt';
import { createSampleMgmtClient } from './mod.ts';
import type { SampleMgmtAPIClient } from './SampleMgmtAPIClient.ts';

export async function createClientFromRequest(
  req: Request,
  username?: string,
): Promise<SampleMgmtAPIClient> {
  const jwt = await loadJwtConfig().Create({
    Username: username ?? 'system',
  });

  return createSampleMgmtClient({
    baseUrl: new URL(req.url).origin,
    apiToken: jwt,
  });
}
