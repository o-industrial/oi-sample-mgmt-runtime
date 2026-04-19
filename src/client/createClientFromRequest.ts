import { loadJwtConfig } from '@fathym/common/jwt';
import { SampleMgmtAPIClient } from './SampleMgmtAPIClient.ts';

export async function createClientFromRequest(
  req: Request,
  username?: string,
): Promise<SampleMgmtAPIClient> {
  const jwt = await loadJwtConfig().Create({
    Username: username ?? 'system',
  });

  return new SampleMgmtAPIClient({
    baseUrl: new URL(req.url).origin,
    apiToken: jwt,
  });
}
