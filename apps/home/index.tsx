import { PageProps } from '@fathym/eac-applications/preact';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../src/state/OISampleMgmtWebState.ts';
import { useTranslation } from '../../src/utils/useTranslation.ts';

type HomeData = {
  Heading: string;
  Welcome: string;
};

export const handler: EaCRuntimeHandlerSet<OISampleMgmtWebState, HomeData> = {
  GET: (_req, ctx) => {
    const { t } = useTranslation(ctx.State.Strings);
    return ctx.Render({
      ...ctx.Data,
      Heading: t('home.heading'),
      Welcome: t('home.welcome'),
    });
  },
};

export default function Home({ Data }: PageProps<HomeData>) {
  return (
    <div>
      <h1 class="text-2xl font-bold text-primary mb-4">
        {Data!.Heading}
      </h1>
      <p class="text-on-surface-secondary">
        {Data!.Welcome}
      </p>
    </div>
  );
}
