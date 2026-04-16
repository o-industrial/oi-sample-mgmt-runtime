import { PageProps } from '@fathym/eac-applications/preact';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../src/state/OISampleMgmtWebState.ts';
import { useTranslation } from '../../../src/utils/useTranslation.ts';

type ReceiveData = {
  Heading: string;
  Placeholder: string;
};

export const handler: EaCRuntimeHandlerSet<
  OISampleMgmtWebState,
  ReceiveData
> = {
  GET: (_req, ctx) => {
    const { t } = useTranslation(ctx.State.Strings);
    return ctx.Render({
      ...ctx.Data,
      Heading: t('receive.heading'),
      Placeholder: t('receive.placeholder'),
    });
  },
};

export default function Receive({ Data }: PageProps<ReceiveData>) {
  return (
    <div>
      <h1 class="text-xl font-bold text-primary mb-2">{Data!.Heading}</h1>
      <p class="text-on-surface-secondary">{Data!.Placeholder}</p>
    </div>
  );
}
