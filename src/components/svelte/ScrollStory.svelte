<script lang="ts">
  import { onMount } from 'svelte';
  import { scroll, animate } from 'motion';
  import type { Locale } from '@/i18n/types';

  type Img = { src: string; srcset: string };
  type Screen = {
    fig: string;
    title: string;
    body: string;
    w: number;
    h: number;
    light: Img;
    dark: Img;
  };
  type Props = { screens: Screen[]; lang: Locale };
  const { screens }: Props = $props();

  const N = screens.length;
  let active = $state(false);
  let idx = $state(0);
  let trackEl = $state<HTMLElement>();
  let textEl = $state<HTMLElement>();
  let slideEls = $state<HTMLElement[]>([]);

  const cur = $derived(screens[idx] ?? screens[0]);

  onMount(() => {
    if (N < 2) return;
    const desktop = window.matchMedia('(min-width: 880px)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (desktop && !reduce) active = true;
  });

  // Progress from the track's own offset, so every screen gets an equal 1/N
  // band — including the first and last. floor(p × N) keeps one active at a time.
  $effect(() => {
    if (!active || !trackEl) return;
    const el = trackEl;
    const section = el.closest('section');
    section?.classList.add('has-scroll');
    const cancel = scroll(
      () => {
        const pinned = el.offsetHeight - window.innerHeight;
        if (pinned <= 0) return;
        const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / pinned));
        const ni = Math.min(N - 1, Math.floor(p * N));
        if (ni !== idx) idx = ni;
      },
      { target: el },
    );
    return () => {
      cancel();
      section?.classList.remove('has-scroll');
    };
  });

  $effect(() => {
    const i = idx;
    const els = slideEls;
    for (let j = 0; j < els.length; j++) {
      const el = els[j];
      if (!el) continue;
      animate(el, { opacity: j === i ? 1 : 0 }, { duration: j === i ? 0.4 : 0.25, ease: 'easeOut' });
    }
    if (textEl) {
      animate(
        textEl,
        { opacity: [0, 1], transform: ['translateY(10px)', 'translateY(0px)'] },
        { duration: 0.35, ease: 'easeOut' },
      );
    }
  });

  const jump = (i: number) => {
    if (!trackEl) return;
    const top = window.scrollY + trackEl.getBoundingClientRect().top;
    const dist = trackEl.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (dist * i) / (N - 1), behavior: 'smooth' });
  };
</script>

{#if active}
  <div class="story" bind:this={trackEl} style={`--n:${N}`}>
    <div class="stage">
      <div class="stage-inner shell">
        <div class="phone-col">
          {#each screens as s, i (s.fig)}
            <div class="slide" bind:this={slideEls[i]} style={`opacity:${i === 0 ? 1 : 0}`}>
              <img
                class="phone-img phone-img--light"
                src={s.light.src}
                srcset={s.light.srcset}
                sizes="340px"
                width={s.w}
                height={s.h}
                alt={s.title}
                loading="lazy"
                decoding="async"
              />
              <img
                class="phone-img phone-img--dark"
                src={s.dark.src}
                srcset={s.dark.srcset}
                sizes="340px"
                width={s.w}
                height={s.h}
                alt={s.title}
                loading="lazy"
                decoding="async"
              />
            </div>
          {/each}
        </div>

        <div class="text-col">
          <div class="text" bind:this={textEl}>
            <span class="marginalia fig">{cur.fig}</span>
            <h3 class="cap-title">{cur.title}</h3>
            <p class="cap-body">{cur.body}</p>
          </div>
          <div class="dots" role="tablist" aria-label="Screens">
            {#each screens as s, i (s.fig)}
              <button
                type="button"
                class="dot"
                class:on={i === idx}
                onclick={() => jump(i)}
                aria-label={s.title}
                aria-selected={i === idx}
                role="tab"
              ></button>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .story {
    position: relative;
    height: calc(100vh + var(--n) * 70vh);
  }
  .stage {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
  }
  .stage-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    align-items: center;
    width: 100%;
  }
  .phone-col {
    position: relative;
    height: 74vh;
  }
  .slide {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    will-change: opacity;
  }
  .phone-img {
    height: 100%;
    width: auto;
    max-height: 74vh;
    object-fit: contain;
  }
  :global(html[data-theme='dark']) .phone-img--light {
    display: none;
  }
  :global(html:not([data-theme='dark'])) .phone-img--dark {
    display: none;
  }
  .text-col {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  .fig {
    display: block;
    margin-bottom: 12px;
  }
  .cap-title {
    font-family: var(--f-sans);
    font-weight: 600;
    font-size: clamp(28px, 3vw, 40px);
    letter-spacing: -0.02em;
    line-height: 1.1;
    color: var(--type);
    margin: 0;
  }
  .cap-body {
    font-size: 18px;
    line-height: 1.6;
    color: var(--type-2);
    margin: 12px 0 0;
    max-width: 42ch;
    text-wrap: pretty;
  }
  .dots {
    display: flex;
    gap: 10px;
  }
  .dot {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    border: 1px solid var(--outline-strong);
    background: transparent;
    padding: 0;
    cursor: pointer;
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      transform 0.2s ease;
  }
  .dot:hover {
    border-color: var(--accent);
  }
  .dot.on {
    background: var(--accent);
    border-color: var(--accent);
    transform: scale(1.15);
  }
</style>
