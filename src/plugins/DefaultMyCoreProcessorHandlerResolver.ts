import { IoCContainer } from "@fathym/ioc";
import { DefaultAtomicIconsProcessorHandlerResolver } from "@fathym/atomic-icons/plugin";
import {
  DefaultProcessorHandlerResolver,
  ProcessorHandlerResolver,
} from "@fathym/eac-applications/runtime/processors";
import { EaCApplicationProcessorConfig } from "@fathym/eac-applications/processors";
import { EverythingAsCode } from "@fathym/eac";
import { DefaultMSALProcessorHandlerResolver } from "@fathym/msal";

export class DefaultMyCoreProcessorHandlerResolver
  implements ProcessorHandlerResolver {
  public async Resolve(
    ioc: IoCContainer,
    appProcCfg: EaCApplicationProcessorConfig,
    eac: EverythingAsCode,
  ) {
    const atomicIconResolver = new DefaultAtomicIconsProcessorHandlerResolver();

    let resolver = await atomicIconResolver.Resolve(ioc, appProcCfg, eac);

    if (!resolver) {
      const msalResolver = new DefaultMSALProcessorHandlerResolver();

      resolver = await msalResolver.Resolve(
        ioc,
        appProcCfg as unknown as Parameters<typeof msalResolver.Resolve>[1],
        eac,
      ) as typeof resolver;
    }

    if (!resolver) {
      const defaultResolver = new DefaultProcessorHandlerResolver();

      resolver = await defaultResolver.Resolve(ioc, appProcCfg, eac);
    }

    return resolver;
  }
}
