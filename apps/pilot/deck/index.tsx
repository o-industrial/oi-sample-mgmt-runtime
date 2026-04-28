import { useEffect, useRef } from 'preact/hooks';
import type { JSX } from 'preact';
import { PageProps } from '@fathym/eac-applications/preact';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { sampleMgmtDeck } from '../../../src/marketing/sample-mgmt-deck.ts';

export const IsIsland = true;

type DeckPageData = Record<string, never>;

export const handler: EaCRuntimeHandlerSet<
  Record<string, never>,
  DeckPageData
> = {
  GET: (_req, ctx) => ctx.Render({}),
};

export default function SampleMgmtDeckPage(
  {}: PageProps<DeckPageData>,
): JSX.Element {
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initReveal = async () => {
      // @ts-ignore: Reveal is loaded via CDN script tag
      if (typeof Reveal !== 'undefined' && deckRef.current) {
        // @ts-ignore: Reveal constructor from CDN
        const deck = new Reveal(deckRef.current, {
          hash: false,
          hashOneBasedIndex: false,
          slideNumber: true,
          progress: true,
          controls: true,
          keyboard: true,
          overview: true,
          center: true,
          touch: true,
          transition: 'slide',
          embedded: false,
          width: '100%',
          height: '100%',
        });
        await deck.initialize();
      }
    };

    const checkReveal = setInterval(() => {
      // @ts-ignore: Reveal is loaded via CDN script tag
      if (typeof Reveal !== 'undefined') {
        clearInterval(checkReveal);
        initReveal();
      }
    }, 100);

    return () => clearInterval(checkReveal);
  }, []);

  const {
    title,
    personas,
    absentNotBlocked,
    sampleManagerWorkflow,
    receiveScreen,
    reconciliationScreen,
    labManagerWorkflow,
    dashboardScreen,
    transferScreen,
    scientistWorkflow,
    returnScreen,
    custodianWorkflow,
    dispositionScreen,
    qaAuditorWorkflow,
    auditTrailScreen,
    studyCoordinatorWorkflow,
    trackSamplesScreen,
    csvGroupHeadWorkflow,
    adminDashboardScreen,
    builtVsNext,
    discussion,
  } = sampleMgmtDeck;

  return (
    <>
      {/* Reveal.js CDN */}
      <link
        rel='stylesheet'
        href='https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.css'
      />
      <link
        rel='stylesheet'
        href='/assets/deck.css'
        data-eac-bypass-base='true'
      />
      <script src='https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.js' />

      <div ref={deckRef} class='reveal'>
        <div class='slides'>
          {/* SLIDE 1: Title */}
          <section data-transition={title.transition}>
            <div class='px-8'>
              <span class='inline-block px-4 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-neon-purple-500/20 text-neon-purple-300 mb-6'>
                {title.badge}
              </span>
              <h1 class='text-5xl font-bold text-white mb-4'>
                {title.headline}
              </h1>
              <p class='text-2xl bg-gradient-to-r from-neon-purple-400 to-neon-cyan-400 bg-clip-text text-transparent mb-4'>
                {title.subheadline}
              </p>
              <p class='text-lg text-white/60'>{title.tagline}</p>
            </div>
          </section>

          {/* SLIDE 2: Personas */}
          <section data-transition={personas.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-4'>
                {personas.headline}
              </h2>
              <p class='text-white/60 mb-8'>{personas.intro}</p>
              <table class='w-full text-left text-sm'>
                <thead>
                  <tr class='border-b border-white/20'>
                    <th class='py-2 text-neon-purple-300 font-semibold'>
                      Name
                    </th>
                    <th class='py-2 text-neon-purple-300 font-semibold'>
                      Role
                    </th>
                    <th class='py-2 text-neon-purple-300 font-semibold'>
                      Focus
                    </th>
                    <th class='py-2 text-neon-purple-300 font-semibold'>
                      Landing
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {personas.roles.map((p) => (
                    <tr class='border-b border-white/10'>
                      <td class='py-2 text-white font-medium'>{p.name}</td>
                      <td class='py-2 text-white/70'>{p.role}</td>
                      <td class='py-2 text-white/60 text-xs'>{p.focus}</td>
                      <td class='py-2 font-mono text-neon-cyan-400 text-xs'>
                        {p.landing}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* SLIDE 3: Absent, Not Blocked */}
          <section data-transition={absentNotBlocked.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-4'>
                {absentNotBlocked.headline}
              </h2>
              <p class='text-white/70 mb-8 max-w-3xl mx-auto'>
                {absentNotBlocked.description}
              </p>
              <div class='grid grid-cols-2 gap-4 max-w-3xl mx-auto'>
                {absentNotBlocked.examples.map((ex) => (
                  <div class='bg-white/5 rounded-lg p-4 text-left'>
                    <p class='text-neon-purple-300 font-semibold text-sm mb-2'>
                      {ex.role}
                    </p>
                    <p class='text-white/70 text-xs mb-1'>
                      <span class='text-neon-cyan-400'>Sees:</span> {ex.sees}
                    </p>
                    <p class='text-white/40 text-xs'>
                      <span class='text-red-400/70'>Hidden:</span>{' '}
                      {ex.doesNotSee}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SLIDE 4: Sample Manager — Workflow */}
          <section data-transition={sampleManagerWorkflow.transition}>
            <div class='px-8'>
              <span class='persona-divider'>
                {sampleManagerWorkflow.persona} · {sampleManagerWorkflow.role}
              </span>
              <h2 class='text-4xl font-semibold text-white mb-4'>
                {sampleManagerWorkflow.headline}
              </h2>
              <p class='text-lg text-neon-cyan-400 mb-6'>
                {sampleManagerWorkflow.why}
              </p>
              <ol class='text-left space-y-3 max-w-3xl mx-auto'>
                {sampleManagerWorkflow.steps.map((step, i) => (
                  <li class='flex gap-3'>
                    <span class='flex-shrink-0 w-7 h-7 rounded-full bg-neon-purple-500/30 text-neon-purple-300 flex items-center justify-center text-sm font-semibold'>
                      {i + 1}
                    </span>
                    <span class='text-white/80 text-sm'>{step}</span>
                  </li>
                ))}
              </ol>
              {sampleManagerWorkflow.scottQuote && (
                <p class='mt-8 text-white/50 italic text-sm'>
                  {sampleManagerWorkflow.scottQuote}
                </p>
              )}
            </div>
          </section>

          {/* SLIDE 5: Sample Reception — Screen */}
          <section data-transition={receiveScreen.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-2'>
                {receiveScreen.headline}
              </h2>
              <p class='font-mono text-neon-cyan-400 text-sm mb-4'>
                {receiveScreen.path}
              </p>
              <p class='text-white/70 mb-6 max-w-3xl mx-auto'>
                {receiveScreen.description}
              </p>
              <ul class='text-left space-y-2 max-w-2xl mx-auto mb-8'>
                {receiveScreen.highlights.map((h) => (
                  <li class='flex gap-2'>
                    <span class='text-neon-cyan-400'>→</span>
                    <span class='text-white/70 text-sm'>{h}</span>
                  </li>
                ))}
              </ul>
              <a
                href={receiveScreen.link.href}
                target='_blank'
                class='deck-page-link'
              >
                {receiveScreen.link.label} →
              </a>
            </div>
          </section>

          {/* SLIDE 6: Reconciliation — Screen */}
          <section data-transition={reconciliationScreen.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-2'>
                {reconciliationScreen.headline}
              </h2>
              <p class='font-mono text-neon-cyan-400 text-sm mb-4'>
                {reconciliationScreen.path}
              </p>
              <p class='text-white/70 mb-6 max-w-3xl mx-auto'>
                {reconciliationScreen.description}
              </p>
              <ul class='text-left space-y-2 max-w-2xl mx-auto mb-8'>
                {reconciliationScreen.highlights.map((h) => (
                  <li class='flex gap-2'>
                    <span class='text-neon-cyan-400'>→</span>
                    <span class='text-white/70 text-sm'>{h}</span>
                  </li>
                ))}
              </ul>
              <a
                href={reconciliationScreen.link.href}
                target='_blank'
                class='deck-page-link'
              >
                {reconciliationScreen.link.label} →
              </a>
            </div>
          </section>

          {/* SLIDE 7: Lab Manager — Workflow */}
          <section data-transition={labManagerWorkflow.transition}>
            <div class='px-8'>
              <span class='persona-divider'>
                {labManagerWorkflow.persona} · {labManagerWorkflow.role}
              </span>
              <h2 class='text-4xl font-semibold text-white mb-4'>
                {labManagerWorkflow.headline}
              </h2>
              <p class='text-lg text-neon-cyan-400 mb-6'>
                {labManagerWorkflow.why}
              </p>
              <ol class='text-left space-y-3 max-w-3xl mx-auto'>
                {labManagerWorkflow.steps.map((step, i) => (
                  <li class='flex gap-3'>
                    <span class='flex-shrink-0 w-7 h-7 rounded-full bg-neon-purple-500/30 text-neon-purple-300 flex items-center justify-center text-sm font-semibold'>
                      {i + 1}
                    </span>
                    <span class='text-white/80 text-sm'>{step}</span>
                  </li>
                ))}
              </ol>
              {labManagerWorkflow.scottQuote && (
                <p class='mt-8 text-white/50 italic text-sm'>
                  {labManagerWorkflow.scottQuote}
                </p>
              )}
            </div>
          </section>

          {/* SLIDE 8: Dashboard — Screen */}
          <section data-transition={dashboardScreen.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-2'>
                {dashboardScreen.headline}
              </h2>
              <p class='font-mono text-neon-cyan-400 text-sm mb-4'>
                {dashboardScreen.path}
              </p>
              <p class='text-white/70 mb-6 max-w-3xl mx-auto'>
                {dashboardScreen.description}
              </p>
              <ul class='text-left space-y-2 max-w-2xl mx-auto mb-8'>
                {dashboardScreen.highlights.map((h) => (
                  <li class='flex gap-2'>
                    <span class='text-neon-cyan-400'>→</span>
                    <span class='text-white/70 text-sm'>{h}</span>
                  </li>
                ))}
              </ul>
              <a
                href={dashboardScreen.link.href}
                target='_blank'
                class='deck-page-link'
              >
                {dashboardScreen.link.label} →
              </a>
            </div>
          </section>

          {/* SLIDE 9: Transfer Management — Screen */}
          <section data-transition={transferScreen.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-2'>
                {transferScreen.headline}
              </h2>
              <p class='font-mono text-neon-cyan-400 text-sm mb-4'>
                {transferScreen.path}
              </p>
              <p class='text-white/70 mb-6 max-w-3xl mx-auto'>
                {transferScreen.description}
              </p>
              <ul class='text-left space-y-2 max-w-2xl mx-auto mb-8'>
                {transferScreen.highlights.map((h) => (
                  <li class='flex gap-2'>
                    <span class='text-neon-cyan-400'>→</span>
                    <span class='text-white/70 text-sm'>{h}</span>
                  </li>
                ))}
              </ul>
              <a
                href={transferScreen.link.href}
                target='_blank'
                class='deck-page-link'
              >
                {transferScreen.link.label} →
              </a>
            </div>
          </section>

          {/* SLIDE 10: Scientist — Workflow */}
          <section data-transition={scientistWorkflow.transition}>
            <div class='px-8'>
              <span class='persona-divider'>
                {scientistWorkflow.persona} · {scientistWorkflow.role}
              </span>
              <h2 class='text-4xl font-semibold text-white mb-4'>
                {scientistWorkflow.headline}
              </h2>
              <p class='text-lg text-neon-cyan-400 mb-6'>
                {scientistWorkflow.why}
              </p>
              <ol class='text-left space-y-3 max-w-3xl mx-auto'>
                {scientistWorkflow.steps.map((step, i) => (
                  <li class='flex gap-3'>
                    <span class='flex-shrink-0 w-7 h-7 rounded-full bg-neon-purple-500/30 text-neon-purple-300 flex items-center justify-center text-sm font-semibold'>
                      {i + 1}
                    </span>
                    <span class='text-white/80 text-sm'>{step}</span>
                  </li>
                ))}
              </ol>
              {scientistWorkflow.scottQuote && (
                <p class='mt-8 text-white/50 italic text-sm'>
                  {scientistWorkflow.scottQuote}
                </p>
              )}
            </div>
          </section>

          {/* SLIDE 11: Return Requests — Screen */}
          <section data-transition={returnScreen.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-2'>
                {returnScreen.headline}
              </h2>
              <p class='font-mono text-neon-cyan-400 text-sm mb-4'>
                {returnScreen.path}
              </p>
              <p class='text-white/70 mb-6 max-w-3xl mx-auto'>
                {returnScreen.description}
              </p>
              <ul class='text-left space-y-2 max-w-2xl mx-auto mb-8'>
                {returnScreen.highlights.map((h) => (
                  <li class='flex gap-2'>
                    <span class='text-neon-cyan-400'>→</span>
                    <span class='text-white/70 text-sm'>{h}</span>
                  </li>
                ))}
              </ul>
              <a
                href={returnScreen.link.href}
                target='_blank'
                class='deck-page-link'
              >
                {returnScreen.link.label} →
              </a>
            </div>
          </section>

          {/* SLIDE 12: Custodian — Workflow */}
          <section data-transition={custodianWorkflow.transition}>
            <div class='px-8'>
              <span class='persona-divider'>
                {custodianWorkflow.persona} · {custodianWorkflow.role}
              </span>
              <h2 class='text-4xl font-semibold text-white mb-4'>
                {custodianWorkflow.headline}
              </h2>
              <p class='text-lg text-neon-cyan-400 mb-6'>
                {custodianWorkflow.why}
              </p>
              <ol class='text-left space-y-3 max-w-3xl mx-auto'>
                {custodianWorkflow.steps.map((step, i) => (
                  <li class='flex gap-3'>
                    <span class='flex-shrink-0 w-7 h-7 rounded-full bg-neon-purple-500/30 text-neon-purple-300 flex items-center justify-center text-sm font-semibold'>
                      {i + 1}
                    </span>
                    <span class='text-white/80 text-sm'>{step}</span>
                  </li>
                ))}
              </ol>
              {custodianWorkflow.scottQuote && (
                <p class='mt-8 text-white/50 italic text-sm'>
                  {custodianWorkflow.scottQuote}
                </p>
              )}
            </div>
          </section>

          {/* SLIDE 13: Disposition Management — Screen */}
          <section data-transition={dispositionScreen.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-2'>
                {dispositionScreen.headline}
              </h2>
              <p class='font-mono text-neon-cyan-400 text-sm mb-4'>
                {dispositionScreen.path}
              </p>
              <p class='text-white/70 mb-6 max-w-3xl mx-auto'>
                {dispositionScreen.description}
              </p>
              <ul class='text-left space-y-2 max-w-2xl mx-auto mb-8'>
                {dispositionScreen.highlights.map((h) => (
                  <li class='flex gap-2'>
                    <span class='text-neon-cyan-400'>→</span>
                    <span class='text-white/70 text-sm'>{h}</span>
                  </li>
                ))}
              </ul>
              <a
                href={dispositionScreen.link.href}
                target='_blank'
                class='deck-page-link'
              >
                {dispositionScreen.link.label} →
              </a>
            </div>
          </section>

          {/* SLIDE 14: QA Auditor — Workflow */}
          <section data-transition={qaAuditorWorkflow.transition}>
            <div class='px-8'>
              <span class='persona-divider'>
                {qaAuditorWorkflow.persona} · {qaAuditorWorkflow.role}
              </span>
              <h2 class='text-4xl font-semibold text-white mb-4'>
                {qaAuditorWorkflow.headline}
              </h2>
              <p class='text-lg text-neon-cyan-400 mb-6'>
                {qaAuditorWorkflow.why}
              </p>
              <ol class='text-left space-y-3 max-w-3xl mx-auto'>
                {qaAuditorWorkflow.steps.map((step, i) => (
                  <li class='flex gap-3'>
                    <span class='flex-shrink-0 w-7 h-7 rounded-full bg-neon-purple-500/30 text-neon-purple-300 flex items-center justify-center text-sm font-semibold'>
                      {i + 1}
                    </span>
                    <span class='text-white/80 text-sm'>{step}</span>
                  </li>
                ))}
              </ol>
              {qaAuditorWorkflow.scottQuote && (
                <p class='mt-8 text-white/50 italic text-sm'>
                  {qaAuditorWorkflow.scottQuote}
                </p>
              )}
            </div>
          </section>

          {/* SLIDE 15: Audit Trail — Screen */}
          <section data-transition={auditTrailScreen.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-2'>
                {auditTrailScreen.headline}
              </h2>
              <p class='font-mono text-neon-cyan-400 text-sm mb-4'>
                {auditTrailScreen.path}
              </p>
              <p class='text-white/70 mb-6 max-w-3xl mx-auto'>
                {auditTrailScreen.description}
              </p>
              <ul class='text-left space-y-2 max-w-2xl mx-auto mb-8'>
                {auditTrailScreen.highlights.map((h) => (
                  <li class='flex gap-2'>
                    <span class='text-neon-cyan-400'>→</span>
                    <span class='text-white/70 text-sm'>{h}</span>
                  </li>
                ))}
              </ul>
              <a
                href={auditTrailScreen.link.href}
                target='_blank'
                class='deck-page-link'
              >
                {auditTrailScreen.link.label} →
              </a>
            </div>
          </section>

          {/* SLIDE 16: Study Coordinator — Workflow */}
          <section data-transition={studyCoordinatorWorkflow.transition}>
            <div class='px-8'>
              <span class='persona-divider'>
                {studyCoordinatorWorkflow.persona} ·{' '}
                {studyCoordinatorWorkflow.role}
              </span>
              <h2 class='text-4xl font-semibold text-white mb-4'>
                {studyCoordinatorWorkflow.headline}
              </h2>
              <p class='text-lg text-neon-cyan-400 mb-6'>
                {studyCoordinatorWorkflow.why}
              </p>
              <ol class='text-left space-y-3 max-w-3xl mx-auto'>
                {studyCoordinatorWorkflow.steps.map((step, i) => (
                  <li class='flex gap-3'>
                    <span class='flex-shrink-0 w-7 h-7 rounded-full bg-neon-purple-500/30 text-neon-purple-300 flex items-center justify-center text-sm font-semibold'>
                      {i + 1}
                    </span>
                    <span class='text-white/80 text-sm'>{step}</span>
                  </li>
                ))}
              </ol>
              {studyCoordinatorWorkflow.scottQuote && (
                <p class='mt-8 text-white/50 italic text-sm'>
                  {studyCoordinatorWorkflow.scottQuote}
                </p>
              )}
            </div>
          </section>

          {/* SLIDE 17: Sample Tracking — Screen */}
          <section data-transition={trackSamplesScreen.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-2'>
                {trackSamplesScreen.headline}
              </h2>
              <p class='font-mono text-neon-cyan-400 text-sm mb-4'>
                {trackSamplesScreen.path}
              </p>
              <p class='text-white/70 mb-6 max-w-3xl mx-auto'>
                {trackSamplesScreen.description}
              </p>
              <ul class='text-left space-y-2 max-w-2xl mx-auto mb-8'>
                {trackSamplesScreen.highlights.map((h) => (
                  <li class='flex gap-2'>
                    <span class='text-neon-cyan-400'>→</span>
                    <span class='text-white/70 text-sm'>{h}</span>
                  </li>
                ))}
              </ul>
              <a
                href={trackSamplesScreen.link.href}
                target='_blank'
                class='deck-page-link'
              >
                {trackSamplesScreen.link.label} →
              </a>
            </div>
          </section>

          {/* SLIDE 18: CSV Group Head — Workflow */}
          <section data-transition={csvGroupHeadWorkflow.transition}>
            <div class='px-8'>
              <span class='persona-divider'>
                {csvGroupHeadWorkflow.persona} · {csvGroupHeadWorkflow.role}
              </span>
              <h2 class='text-4xl font-semibold text-white mb-4'>
                {csvGroupHeadWorkflow.headline}
              </h2>
              <p class='text-lg text-neon-cyan-400 mb-6'>
                {csvGroupHeadWorkflow.why}
              </p>
              <ol class='text-left space-y-3 max-w-3xl mx-auto'>
                {csvGroupHeadWorkflow.steps.map((step, i) => (
                  <li class='flex gap-3'>
                    <span class='flex-shrink-0 w-7 h-7 rounded-full bg-neon-purple-500/30 text-neon-purple-300 flex items-center justify-center text-sm font-semibold'>
                      {i + 1}
                    </span>
                    <span class='text-white/80 text-sm'>{step}</span>
                  </li>
                ))}
              </ol>
              {csvGroupHeadWorkflow.scottQuote && (
                <p class='mt-8 text-white/50 italic text-sm'>
                  {csvGroupHeadWorkflow.scottQuote}
                </p>
              )}
            </div>
          </section>

          {/* SLIDE 19: Admin Dashboard — Screen */}
          <section data-transition={adminDashboardScreen.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-2'>
                {adminDashboardScreen.headline}
              </h2>
              <p class='font-mono text-neon-cyan-400 text-sm mb-4'>
                {adminDashboardScreen.path}
              </p>
              <p class='text-white/70 mb-6 max-w-3xl mx-auto'>
                {adminDashboardScreen.description}
              </p>
              <ul class='text-left space-y-2 max-w-2xl mx-auto mb-8'>
                {adminDashboardScreen.highlights.map((h) => (
                  <li class='flex gap-2'>
                    <span class='text-neon-cyan-400'>→</span>
                    <span class='text-white/70 text-sm'>{h}</span>
                  </li>
                ))}
              </ul>
              <a
                href={adminDashboardScreen.link.href}
                target='_blank'
                class='deck-page-link'
              >
                {adminDashboardScreen.link.label} →
              </a>
            </div>
          </section>

          {/* SLIDE 20: Built vs Next */}
          <section data-transition={builtVsNext.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-4'>
                {builtVsNext.headline}
              </h2>
              <p class='text-white/60 mb-6'>{builtVsNext.description}</p>
              <table class='w-full text-left text-sm'>
                <thead>
                  <tr class='border-b border-white/20'>
                    <th class='py-2 text-neon-purple-300 font-semibold'>
                      Screen
                    </th>
                    <th class='py-2 text-neon-purple-300 font-semibold'>
                      Status
                    </th>
                    <th class='py-2 text-neon-purple-300 font-semibold'>
                      Personas
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {builtVsNext.matrix.map((row) => (
                    <tr class='border-b border-white/10'>
                      <td class='py-1.5 text-white/80'>{row.screen}</td>
                      <td class='py-1.5'>
                        <span
                          class={`px-2 py-0.5 rounded text-xs font-medium ${
                            row.status === 'seeded'
                              ? 'bg-blue-500/20 text-blue-300'
                              : row.status === 'live'
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-white/10 text-white/50'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td class='py-1.5 text-white/60 text-xs'>
                        {row.personas}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* SLIDE 21: Discussion */}
          <section data-transition={discussion.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-8'>
                {discussion.headline}
              </h2>
              <ul class='space-y-4 max-w-2xl mx-auto mb-10'>
                {discussion.prompts.map((prompt) => (
                  <li class='text-xl text-white/80'>• {prompt}</li>
                ))}
              </ul>
              <p class='text-white/50 text-sm italic'>
                {discussion.closingNote}
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
