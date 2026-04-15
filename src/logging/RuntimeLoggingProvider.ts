import { EaCApplicationsLoggingProvider } from '@fathym/eac-applications/runtime/logging';

export class RuntimeLoggingProvider extends EaCApplicationsLoggingProvider {
  constructor() {
    super([
      '@o-industrial/common',
      '@o-industrial/oi-sample-mgmt-runtime',
    ]);
  }
}
