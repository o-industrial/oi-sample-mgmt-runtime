import { EaCApplicationsLoggingProvider } from "@fathym/eac-applications/runtime/logging";

export class RuntimeLoggingProvider extends EaCApplicationsLoggingProvider {
  constructor() {
    super([
      "@fathym/common",
      "@fathym/ioc",
      "@fathym/msal",
      "@fathym/steward",
      "@o-industrial/common",
      "@o-industrial/sample-management-runtime",
    ]);

    // EaCLoggingProvider passes its own import.meta (a JSR https:// URL)
    // to LoggingProvider, but resolvePackageRoot needs a file:// URL to
    // walk the filesystem and find deno.jsonc for the package name.
    // Override with the local import.meta so Package logger resolves correctly.
    this.importMeta = import.meta;
  }
}
