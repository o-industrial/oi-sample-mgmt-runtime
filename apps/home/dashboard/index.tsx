import { PageProps } from '@fathym/eac-applications/preact';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../src/state/OISampleMgmtWebState.ts';
import { useTranslation } from '../../../src/utils/useTranslation.ts';

type DashboardData = {
  Heading: string;
  Placeholder: string;
};

export const handler: EaCRuntimeHandlerSet<
  OISampleMgmtWebState,
  DashboardData
> = {
  GET: (_req, ctx) => {
    const { t } = useTranslation(ctx.State.Strings);
    return ctx.Render({
      ...ctx.Data,
      Heading: t('dashboard.heading'),
      Placeholder: t('dashboard.placeholder'),
    });
  },
};

export default function Dashboard({ Data }: PageProps<DashboardData>) {
  return (
    <div>
      <h1 class="text-xl font-bold text-primary mb-2">{Data!.Heading}</h1>
      <p class="text-on-surface-secondary">{Data!.Placeholder}</p>
    </div>
  );
}
