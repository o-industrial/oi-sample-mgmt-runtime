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
    theShift,
    stakes,
    theGap,
    solution,
    theLoop,
    webApp,
    alternatives,
    pilot,
    derisk,
    cta,
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
            <div class='flex flex-col items-center justify-center h-full text-center px-8'>
              <span class='block mb-6 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-white/60'>
                {title.badge}
              </span>
              <h1 class='text-5xl font-semibold tracking-tight mb-8'>
                <span class='bg-gradient-to-r from-neon-purple-400 to-neon-cyan-400 bg-clip-text text-transparent'>
                  {title.headline}
                </span>
              </h1>
              <p class='text-lg text-white/70 mb-4'>{title.subheadline}</p>
              <p class='text-sm text-white/40'>{title.tagline}</p>
            </div>
          </section>

          {/* SLIDE 2: The Shift */}
          <section data-transition={theShift.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-10'>
                {theShift.headline}
              </h2>
              <div class='grid grid-cols-2 gap-8'>
                <div class='rounded-xl border border-red-500/30 bg-red-500/10 p-6'>
                  <h3 class='text-sm font-bold uppercase tracking-wider text-red-400 mb-3'>
                    Before
                  </h3>
                  <p class='text-white/70'>{theShift.before}</p>
                </div>
                <div class='rounded-xl border border-neon-cyan-500/30 bg-neon-cyan-500/10 p-6'>
                  <h3 class='text-sm font-bold uppercase tracking-wider text-neon-cyan-400 mb-3'>
                    After
                  </h3>
                  <p class='text-white/70'>{theShift.after}</p>
                </div>
              </div>
            </div>
          </section>

          {/* SLIDE 3: Stakes */}
          <section data-transition={stakes.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-8'>
                {stakes.headline}
              </h2>
              <div class='grid grid-cols-4 gap-4 mb-8'>
                {stakes.stats.map((stat) => (
                  <div
                    key={stat.label}
                    class='rounded-xl border border-white/10 bg-white/5 p-4 text-center'
                  >
                    <div class='text-2xl font-bold text-neon-purple-400 mb-1'>
                      {stat.value}
                    </div>
                    <div class='text-xs text-white/50'>{stat.label}</div>
                  </div>
                ))}
              </div>
              <div class='space-y-2'>
                {stakes.risks.map((risk) => (
                  <div key={risk} class='flex items-center gap-3'>
                    <span class='text-red-400'>⚠</span>
                    <span class='text-white/70 text-sm'>{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SLIDE 4: The Gap */}
          <section data-transition={theGap.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-6'>
                {theGap.headline}
              </h2>
              <p class='text-lg text-white/60 mb-8'>{theGap.description}</p>
              <div class='space-y-3'>
                {theGap.alcoa.map((item) => (
                  <div
                    key={item.principle}
                    class='flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5'
                  >
                    <span class='font-semibold text-neon-purple-400'>
                      {item.principle}
                    </span>
                    <span
                      class={`px-2 py-1 rounded text-xs font-bold ${
                        item.status === 'VIOLATED'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span class='text-sm text-white/50 max-w-md'>
                      {item.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SLIDE 5: Solution */}
          <section data-transition={solution.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-4'>
                {solution.headline}
              </h2>
              <p class='text-lg text-white/50 mb-8'>{solution.tagline}</p>
              <div class='grid grid-cols-2 gap-4'>
                {solution.points.map((point) => (
                  <div
                    key={point.label}
                    class='rounded-xl border border-white/10 bg-white/5 p-4'
                  >
                    <h3 class='font-semibold text-neon-cyan-400 mb-1 text-sm'>
                      {point.label}
                    </h3>
                    <p class='text-white/60 text-sm'>{point.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SLIDE 6: The Loop */}
          <section data-transition={theLoop.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-10'>
                {theLoop.headline}
              </h2>
              <div class='space-y-4'>
                {theLoop.stages.map((stage) => (
                  <div key={stage.step} class='flex items-center gap-4'>
                    <span class='h-8 w-8 rounded-full bg-gradient-to-br from-neon-purple-500 to-neon-cyan-500 flex items-center justify-center text-white font-bold text-sm'>
                      {stage.step}
                    </span>
                    <div>
                      <span class='font-semibold text-white'>
                        {stage.label}
                      </span>
                      <span class='text-white/50 ml-2 text-sm'>
                        — {stage.detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SLIDE 7: Web App */}
          <section data-transition={webApp.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-6'>
                {webApp.headline}
              </h2>
              <p class='text-white/60 mb-8'>{webApp.description}</p>
              <div class='grid grid-cols-3 gap-4 mb-8'>
                {webApp.screens.map((screen) => (
                  <div
                    key={screen.name}
                    class='rounded-xl border border-white/10 bg-white/5 p-4 text-center'
                  >
                    <h3 class='text-sm font-bold uppercase tracking-wider text-neon-purple-400 mb-2'>
                      {screen.name}
                    </h3>
                    <p class='text-sm text-white/60'>{screen.detail}</p>
                  </div>
                ))}
              </div>
              <div class='rounded-xl border border-neon-cyan-500/30 bg-neon-cyan-500/10 p-6 text-center'>
                <p class='text-lg text-neon-cyan-300 italic'>
                  {webApp.pivotMoment}
                </p>
              </div>
            </div>
          </section>

          {/* SLIDE 8: Alternatives */}
          <section data-transition={alternatives.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-6'>
                {alternatives.headline}
              </h2>
              <div class='space-y-3'>
                {alternatives.options.map((option) => (
                  <div
                    key={option.name}
                    class={`flex items-center justify-between p-4 rounded-lg border ${
                      option.highlight
                        ? 'border-neon-cyan-500/50 bg-neon-cyan-500/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <span
                      class={`font-semibold ${
                        option.highlight ? 'text-neon-cyan-400' : 'text-white'
                      }`}
                    >
                      {option.name}
                    </span>
                    <div class='flex gap-8 text-sm'>
                      <span class='text-white/50'>{option.cost}</span>
                      <span class='text-white/50'>{option.time}</span>
                      <span
                        class={option.flaw === '—'
                          ? 'text-neon-cyan-400'
                          : 'text-red-400'}
                      >
                        {option.flaw}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SLIDE 9: Pilot */}
          <section data-transition={pilot.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-6'>
                {pilot.headline}
              </h2>
              <p class='text-white/60 mb-6'>{pilot.scope}</p>
              <div class='space-y-2 mb-8'>
                {pilot.deliverables.map((d) => (
                  <div key={d} class='flex items-center gap-3'>
                    <span class='text-neon-cyan-400'>✓</span>
                    <span class='text-white/80 text-sm'>{d}</span>
                  </div>
                ))}
              </div>
              <div class='rounded-xl border border-neon-purple-500/30 bg-neon-purple-500/10 p-6 text-center'>
                <p class='text-lg text-white/70 italic'>{pilot.guarantee}</p>
              </div>
            </div>
          </section>

          {/* SLIDE 10: De-Risk */}
          <section data-transition={derisk.transition}>
            <div class='px-8'>
              <h2 class='text-4xl font-semibold text-white mb-10'>
                {derisk.headline}
              </h2>
              <div class='grid grid-cols-2 gap-6'>
                {derisk.statements.map((s) => (
                  <div
                    key={s.claim}
                    class='rounded-xl border border-white/10 bg-white/5 p-6'
                  >
                    <h3 class='font-semibold text-neon-purple-400 mb-2'>
                      {s.claim}
                    </h3>
                    <p class='text-white/60 text-sm'>{s.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SLIDE 11: CTA */}
          <section data-transition={cta.transition}>
            <div class='px-8 text-center'>
              <h2 class='text-5xl font-semibold mb-8'>
                <span class='bg-gradient-to-r from-neon-purple-400 to-neon-cyan-400 bg-clip-text text-transparent'>
                  {cta.headline}
                </span>
              </h2>
              <div class='flex justify-center gap-4 mb-8'>
                <span class='px-6 py-3 rounded-full bg-gradient-to-r from-neon-purple-500 to-neon-cyan-500 text-white font-semibold'>
                  {cta.primary}
                </span>
                <span class='px-6 py-3 rounded-full border border-white/20 text-white/70'>
                  {cta.secondary}
                </span>
              </div>
              <p class='text-xl text-white/60 italic mb-6'>
                {cta.tagline}
              </p>
              <div class='inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-purple-500/20 to-neon-cyan-500/20 px-6 py-3 text-lg font-semibold text-neon-purple-400'>
                {cta.contact}
              </div>
              <p class='text-sm text-white/40 mt-4'>{cta.compliance}</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
