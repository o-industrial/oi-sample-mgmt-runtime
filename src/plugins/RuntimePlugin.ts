import { EaCAtomicIconsProcessor } from '@fathym/atomic-icons';
import { FathymAtomicIconsPlugin } from '@fathym/atomic-icons/plugin';
import { IoCContainer } from '@fathym/ioc';
import {
  EaCRuntimeConfig,
  EaCRuntimePluginConfig,
} from '@fathym/eac/runtime/config';
import { EaCRuntimePlugin } from '@fathym/eac/runtime/plugins';
import { EverythingAsCode } from '@fathym/eac';
import { EverythingAsCodeApplications } from '@fathym/eac-applications';
import {
  EaCAPIProcessor,
  EaCDFSProcessor,
  EaCPreactAppProcessor,
  EaCTailwindProcessor,
} from '@fathym/eac-applications/processors';
import {
  EaCJSRDistributedFileSystemDetails,
  EaCLocalDistributedFileSystemDetails,
} from '@fathym/eac/dfs';
import { EaCDenoKVDetails, EverythingAsCodeDenoKV } from '@fathym/eac-deno-kv';
import { EaCOAuthProcessor } from '@fathym/eac-identity/processors';
import {
  EaCJWTValidationModifierDetails,
  EaCOAuthModifierDetails,
} from '@fathym/eac-identity/modifiers';
import {
  EaCAzureADB2CProviderDetails,
  EaCAzureADProviderDetails,
} from '@fathym/eac-identity';
import { EaCMSALProcessor } from '@fathym/msal';
import {
  OpenIndustrialLicensingPlugin,
  OpenIndustrialMSALPlugin,
} from '@o-industrial/common/runtimes';
import { DefaultMyCoreProcessorHandlerResolver } from './DefaultMyCoreProcessorHandlerResolver.ts';

export default class RuntimePlugin implements EaCRuntimePlugin {
  constructor() {}

  public Setup(config: EaCRuntimeConfig) {
    const port = config.Servers?.[0]?.port || 5418;
    const pluginConfig: EaCRuntimePluginConfig<
      EverythingAsCode & EverythingAsCodeApplications & EverythingAsCodeDenoKV
    > = {
      Name: RuntimePlugin.name,
      Plugins: [
        new FathymAtomicIconsPlugin(),
        new OpenIndustrialLicensingPlugin(),
        new OpenIndustrialMSALPlugin(),
      ] as unknown as typeof pluginConfig.Plugins,
      IoC: new IoCContainer(),
      EaC: {
        Projects: {
          core: {
            Details: {
              Name: 'OI Sample Management',
              Description: 'GSK Human Biological Sample Management',
              Priority: 100,
            },
            ResolverConfigs: {
              localhost: {
                Hostname: 'localhost',
                Port: port,
              },
              '127.0.0.1': {
                Hostname: '127.0.0.1',
                Port: port,
              },
              'host.docker.internal': {
                Hostname: 'host.docker.internal',
                Port: port,
              },
              'oi-sample-mgmt-runtime.azurewebsites.net': {
                Hostname: 'oi-sample-mgmt-runtime.azurewebsites.net',
              },
              'sm-demo.openindustrial.co': {
                Hostname: 'sm-demo.openindustrial.co',
              },
            },
            ModifierResolvers: {
              baseHref: {
                Priority: 10000,
              },
              keepAlive: {
                Priority: 5000,
              },
              oauth: {
                Priority: 10000,
              },
            },
            ApplicationResolvers: {
              api: { PathPattern: '/api*', Priority: 500 },
              msal: { PathPattern: '/azure/oauth/*', Priority: 600 },
              oauth: { PathPattern: '/oauth/*', Priority: 500 },
              home: {
                PathPattern: '*',
                Priority: 100,
                IsPrivate: true,
                IsTriggerSignIn: true,
              },
              pilot: {
                PathPattern: '/pilot*',
                Priority: 200,
              },
              assets: { PathPattern: '/assets*', Priority: 500 },
              icons: { PathPattern: '/icons*', Priority: 500 },
              tailwind: { PathPattern: '/tailwind*', Priority: 500 },
            },
          },
        },
        Applications: {
          api: {
            Details: {
              Name: 'Local API',
              Description: 'Sample management API endpoints.',
            },
            ModifierResolvers: {
              jwtValidate: {
                Priority: 10000,
              },
            },
            Processor: {
              Type: 'API',
              DFSLookup: 'local:apps/api',
            } as EaCAPIProcessor,
          },
          msal: {
            Details: {
              Name: 'Azure MSAL',
              Description: 'Azure Active Directory sign-in callbacks.',
            },
            Processor: {
              Type: 'MSAL',
              Config: {
                MSALSignInOptions: {
                  Scopes: ['https://management.azure.com/user_impersonation'],
                  RedirectURI: '/azure/oauth/callback',
                  SuccessRedirect: '/',
                },
                MSALSignOutOptions: {
                  ClearSession: false,
                  PostLogoutRedirectUri: '/',
                },
              },
              ProviderLookup: 'azure',
            } as EaCMSALProcessor,
          },
          oauth: {
            Details: {
              Name: 'OAuth Site',
              Description: 'ADB2C sign-in and callback endpoints.',
            },
            Processor: {
              Type: 'OAuth',
              ProviderLookup: 'adb2c',
            } as EaCOAuthProcessor,
          },
          home: {
            Details: {
              Name: 'Home',
              Description: 'GSK Sample Management',
            },
            ModifierResolvers: {
              baseHref: { Priority: 10000 },
            },
            Processor: {
              Type: 'PreactApp',
              AppDFSLookup: 'local:apps/home',
              ComponentDFSLookups: [
                ['local:apps/components', ['tsx']],
                ['local:apps/home', ['tsx']],
                ['jsr:@o-industrial/atomic', ['tsx']],
              ],
            } as EaCPreactAppProcessor,
          },
          pilot: {
            Details: {
              Name: 'Pilot',
              Description: 'GSK pilot one-pager and deck',
            },
            ModifierResolvers: {
              baseHref: { Priority: 10000 },
            },
            Processor: {
              Type: 'PreactApp',
              AppDFSLookup: 'local:apps/pilot',
              ComponentDFSLookups: [
                ['local:apps/pilot', ['tsx']],
              ],
            } as EaCPreactAppProcessor,
          },
          assets: {
            Details: { Name: 'Assets' },
            ModifierResolvers: {},
            Processor: {
              Type: 'DFS',
              DFSLookup: 'local:apps/assets',
              CacheControl: {
                'text\\/html': `private, max-age=${60 * 5}`,
                'image\\/': `public, max-age=${60 * 60 * 24 * 365}, immutable`,
                'application\\/javascript': `public, max-age=${
                  60 * 60 * 24 * 365
                }, immutable`,
                'text\\/css': `public, max-age=${
                  60 * 60 * 24 * 365
                }, immutable`,
              },
            } as EaCDFSProcessor,
          },
          icons: {
            Details: { Name: 'Icons' },
            ModifierResolvers: {},
            Processor: {
              Type: 'AtomicIcons',
              Config: './configs/atomic-icons.config.json',
            } as EaCAtomicIconsProcessor,
          },
          tailwind: {
            Details: { Name: 'Tailwind' },
            Processor: {
              Type: 'Tailwind',
              DFSLookups: [
                'local:apps/components',
                'local:apps/home',
                'local:apps/pilot',
                'jsr:@o-industrial/atomic',
              ],
              ConfigPath: './tailwind.config.ts',
              StylesTemplatePath: './apps/tailwind/styles.css',
              CacheControl: {
                'text\\/css': `public, max-age=${
                  60 * 60 * 24 * 365
                }, immutable`,
              },
            } as EaCTailwindProcessor,
          },
        },
        DFSs: {
          'local:apps/api': {
            Details: {
              Type: 'Local',
              FileRoot: './apps/api/',
              DefaultFile: 'index.ts',
              Extensions: ['ts'],
            } as EaCLocalDistributedFileSystemDetails,
          },
          'local:apps/home': {
            Details: {
              Type: 'Local',
              FileRoot: './apps/home/',
              DefaultFile: 'index.tsx',
              Extensions: ['tsx'],
            } as EaCLocalDistributedFileSystemDetails,
          },
          'local:apps/pilot': {
            Details: {
              Type: 'Local',
              FileRoot: './apps/pilot/',
              DefaultFile: 'index.tsx',
              Extensions: ['tsx'],
            } as EaCLocalDistributedFileSystemDetails,
          },
          'local:apps/components': {
            Details: {
              Type: 'Local',
              FileRoot: './apps/components/',
              Extensions: ['tsx'],
            } as EaCLocalDistributedFileSystemDetails,
          },
          'local:apps/assets': {
            Details: {
              Type: 'Local',
              FileRoot: './apps/assets/',
            } as EaCLocalDistributedFileSystemDetails,
          },
          'jsr:@o-industrial/atomic': {
            Details: {
              Type: 'JSR',
              Package: '@o-industrial/atomic',
              Version: '',
              Extensions: ['tsx'],
            } as unknown as EaCJSRDistributedFileSystemDetails,
          },
        },
        DenoKVs: {
          oauth: {
            Details: {
              Type: 'DenoKV',
              Name: 'OAuth Session Store',
              Description: 'Deno KV backing MSAL and ADB2C session state.',
              DenoKVPath: Deno.env.get('OAUTH_DENO_KV_PATH') || undefined,
            } as EaCDenoKVDetails,
          },
          data: {
            Details: {
              Type: 'DenoKV',
              Name: 'Sample Management Data',
              Description: 'Deno KV backing sample management domain data.',
              DenoKVPath: Deno.env.get('DATA_DENO_KV_PATH') || undefined,
            } as EaCDenoKVDetails,
          },
        },
        Modifiers: {
          baseHref: {
            Details: {
              Type: 'BaseHREF',
              Name: 'Base HREF',
              Description:
                'Adjusts the base HREF of a response based on configuration.',
            },
          },
          jwtValidate: {
            Details: {
              Type: 'JWTValidation',
              Name: 'Validate JWT',
              Description: 'Validate incoming JWTs to restrict access.',
            } as EaCJWTValidationModifierDetails,
          },
          keepAlive: {
            Details: {
              Type: 'KeepAlive',
              Name: 'Keep Alive',
              Description: 'Lightweight keep-alive cache.',
              KeepAlivePath: '/_eac/alive',
            },
          },
          oauth: {
            Details: {
              Type: 'OAuth',
              Name: 'OAuth',
              Description: 'Restricts user access for secured applications.',
              ProviderLookup: 'adb2c',
              SignInPath: '/oauth/signin',
            } as EaCOAuthModifierDetails,
          },
        },
        Providers: {
          adb2c: {
            DatabaseLookup: 'oauth',
            Details: {
              Name: 'Azure ADB2C OAuth Provider',
              Description: 'Connects to the Azure ADB2C identity provider.',
              ClientID: Deno.env.get('AZURE_ADB2C_CLIENT_ID')!,
              ClientSecret: Deno.env.get('AZURE_ADB2C_CLIENT_SECRET')!,
              Scopes: ['openid', Deno.env.get('AZURE_ADB2C_CLIENT_ID')!],
              Domain: Deno.env.get('AZURE_ADB2C_DOMAIN')!,
              PolicyName: Deno.env.get('AZURE_ADB2C_POLICY')!,
              TenantID: Deno.env.get('AZURE_ADB2C_TENANT_ID')!,
              IsPrimary: true,
            } as EaCAzureADB2CProviderDetails,
          },
          azure: {
            DatabaseLookup: 'oauth',
            Details: {
              Name: 'Azure OAuth Provider',
              Description: 'Connects the runtime to Azure Active Directory.',
              ClientID: Deno.env.get('AZURE_AD_CLIENT_ID')!,
              ClientSecret: Deno.env.get('AZURE_AD_CLIENT_SECRET')!,
              Scopes: ['openid'],
              TenantID: Deno.env.get('AZURE_AD_TENANT_ID')!,
            } as EaCAzureADProviderDetails,
          },
        },
        $GlobalOptions: {
          DFSs: {
            PreventWorkers: true,
          },
        },
      } as EverythingAsCode & EverythingAsCodeApplications,
    };

    pluginConfig.IoC!.Register(DefaultMyCoreProcessorHandlerResolver, {
      Type: pluginConfig.IoC!.Symbol('ProcessorHandlerResolver'),
    });

    return Promise.resolve(pluginConfig);
  }
}
