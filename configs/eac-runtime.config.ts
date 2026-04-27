import { EaCRuntime } from "@fathym/eac/runtime";
import { defineEaCApplicationsConfig } from "@fathym/eac-applications/runtime";
import { EaCRuntimeHandlerRouteGroup } from "@fathym/eac/runtime/pipelines";
import RuntimePlugin from "../src/plugins/RuntimePlugin.ts";
import { RuntimeLoggingProvider } from "../src/logging/RuntimeLoggingProvider.ts";

// deno-lint-ignore no-explicit-any
type AnyPlugin = any;

export const config = defineEaCApplicationsConfig(
  { Plugins: [new RuntimePlugin() as AnyPlugin] },
  new RuntimeLoggingProvider(),
);

export function configure(
  _rt: EaCRuntime,
): Promise<EaCRuntimeHandlerRouteGroup[] | undefined> {
  return Promise.resolve([]);
}
