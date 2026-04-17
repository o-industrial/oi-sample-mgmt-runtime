import type { JSX } from 'preact';
import { PageProps } from '@fathym/eac-applications/preact';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { sampleMgmtOnePagerContent } from '../../../src/marketing/sample-mgmt-one-pager.ts';

export const IsIsland = true;

type OnePagerPageData = Record<string, never>;

export const handler: EaCRuntimeHandlerSet<
  Record<string, never>,
  OnePagerPageData
> = {
  GET: (_req, ctx) => ctx.Render({}),
};

export default function SampleMgmtOnePagerPage(
  {}: PageProps<OnePagerPageData>,
): JSX.Element {
  const {
    eyebrow,
    headline,
    theProblem,
    theSolution,
    howItWorks,
    pilot,
    whyUs,
    theCategory,
    nextStep,
    closingQuote,
  } = sampleMgmtOnePagerContent;

  return (
    <div class='min-h-screen bg-white text-neutral-900 print:bg-white'>
      <div class='mx-auto max-w-4xl px-8 py-12 print:px-0 print:py-0'>
        {/* Header */}
        <div class='mb-8 border-b border-neutral-200 pb-6'>
          <div class='text-xs uppercase tracking-widest text-neutral-500'>
            {eyebrow}
          </div>
        </div>

        {/* Headline */}
        <div class='mb-8'>
          <h1 class='text-3xl font-bold text-neutral-900'>{headline}</h1>
          <p class='text-sm text-neutral-500 mt-2'>
            21 CFR Part 11 · GxP · ICH GCP
          </p>
        </div>

        {/* Main Content */}
        <div class='grid gap-8 md:grid-cols-2'>
          {/* Left Column */}
          <div class='space-y-6'>
            {/* The Problem */}
            <div class='space-y-3'>
              <h2 class='text-sm font-semibold uppercase tracking-wider text-red-600'>
                The Problem
              </h2>
              {theProblem.map((item) => (
                <div key={item.title} class='flex items-start gap-3'>
                  <span class='mt-1 h-2 w-2 rounded-full bg-red-500' />
                  <div>
                    <div class='font-semibold text-neutral-900'>
                      {item.title}
                    </div>
                    <div class='text-sm text-neutral-600'>
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* The Solution */}
            <div class='space-y-3'>
              <h2 class='text-sm font-semibold uppercase tracking-wider text-purple-600'>
                The Solution
              </h2>
              {theSolution.map((item) => (
                <div key={item.title} class='flex items-start gap-3'>
                  <span class='mt-1 h-2 w-2 rounded-full bg-purple-500' />
                  <div>
                    <div class='font-semibold text-neutral-900'>
                      {item.title}
                    </div>
                    <div class='text-sm text-neutral-600'>
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* How It Works */}
            <div class='rounded-lg border border-neutral-200 p-4'>
              <h2 class='text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-3'>
                How It Works
              </h2>
              <div class='space-y-2 text-sm'>
                {[
                  howItWorks.step1,
                  howItWorks.step2,
                  howItWorks.step3,
                  howItWorks.step4,
                ].map((step, i) => (
                  <div key={i} class='flex items-center gap-2'>
                    <span class='h-5 w-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold'>
                      {i + 1}
                    </span>
                    <span class='text-neutral-600'>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div class='space-y-6'>
            {/* The Pilot */}
            <div class='rounded-lg bg-gradient-to-br from-purple-50 to-cyan-50 p-4'>
              <h2 class='text-sm font-semibold uppercase tracking-wider text-purple-800 mb-3'>
                The Pilot
              </h2>
              <div class='grid grid-cols-2 gap-4 text-sm mb-3'>
                <div>
                  <div class='text-2xl font-bold text-purple-600'>
                    {pilot.investment}
                  </div>
                  <div class='text-neutral-600'>Fixed investment</div>
                </div>
                <div>
                  <div class='text-2xl font-bold text-purple-600'>
                    {pilot.duration}
                  </div>
                  <div class='text-neutral-600'>To working system</div>
                </div>
              </div>
              <div class='space-y-1 text-sm text-neutral-600'>
                <div>
                  <span class='font-medium'>Environment:</span>{' '}
                  {pilot.environment}
                </div>
                <div>
                  <span class='font-medium'>Scope:</span> {pilot.scope}
                </div>
                <div>
                  <span class='font-medium'>Outcome:</span> {pilot.outcome}
                </div>
              </div>
            </div>

            {/* Why Us */}
            <div class='rounded-lg border border-neutral-200 p-4'>
              <h2 class='text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-3'>
                Why Open Industrial?
              </h2>
              <div class='grid grid-cols-2 gap-3'>
                {whyUs.map((item) => (
                  <div key={item.title} class='text-sm'>
                    <div class='font-semibold text-neutral-900'>
                      {item.title}
                    </div>
                    <div class='text-neutral-500 text-xs'>
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* The Category */}
            <div class='rounded-lg border-2 border-purple-200 bg-purple-50 p-4'>
              <h2 class='text-sm font-semibold uppercase tracking-wider text-purple-700 mb-2'>
                The Category
              </h2>
              <p class='font-semibold text-neutral-900 mb-2'>
                {theCategory.statement}
              </p>
              <p class='text-sm text-neutral-600'>{theCategory.contrast}</p>
            </div>

            {/* Next Step */}
            <div class='rounded-lg border border-neutral-200 p-4'>
              <h2 class='text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-3'>
                Next Step
              </h2>
              <div class='text-sm'>
                <span class='font-semibold text-purple-600'>
                  {nextStep.headline}
                </span>{' '}
                <span class='text-neutral-600'>{nextStep.description}</span>
              </div>
            </div>

            {/* Contact */}
            <div class='rounded-lg border border-neutral-200 p-4'>
              <h2 class='text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-3'>
                Get Started
              </h2>
              <div class='space-y-2 text-sm'>
                <div>
                  <span class='text-neutral-500'>Web:</span>
                  <span class='font-medium text-purple-600'>
                    openindustrial.co/sample-management
                  </span>
                </div>
                <div>
                  <span class='text-neutral-500'>Email:</span>
                  <span class='font-medium text-purple-600'>
                    hello@openindustrial.co
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Quote */}
        <div class='mt-8 p-4 bg-neutral-50 rounded-lg text-center'>
          <p class='text-lg italic text-neutral-700'>{closingQuote}</p>
        </div>

        {/* Footer */}
        <div class='mt-8 border-t border-neutral-200 pt-4 text-center text-xs text-neutral-400'>
          &copy; {new Date().getFullYear()}{' '}
          Open Industrial. Built on MCP. Azure-native. Open architecture.
        </div>
      </div>

      {/* Print button (hidden when printing) */}
      <div class='fixed bottom-8 right-8 print:hidden'>
        <button
          type='button'
          onClick={() => globalThis.print()}
          class='rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:from-purple-700 hover:to-cyan-700'
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
