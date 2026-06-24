<script lang="ts">
  import { onMount } from 'svelte';
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

  const cur = $derived(screens[idx] ?? screens[0]);

  onMount(() => {
    if (N < 2) return;
    const desktop = window.matchMedia('(min-width: 880px)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (desktop && !reduce) active = true;
  });

  // Read native scroll (rAF-throttled) and map the track's progress to a screen.
  // floor(p × N) gives every screen, including the last, an equal hold.
  $effect(() => {
    if (!active || !trackEl) return;
    const el = trackEl;
    el.closest('section')?.classList.add('has-scroll');
    let ticking = false;
    const update = () => {
      ticking = false;
      const pinned = el.offsetHeight - window.innerHeight;
      if (pinned <= 0) return;
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / pinned));
      const ni = Math.min(N - 1, Math.floor(p * N));
      if (ni !== idx) idx = ni;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      el.closest('section')?.classList.remove('has-scroll');
    };
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
            <div class="slide" class:active={i === idx}>
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
          {#key idx}
            <div class="text">
              <span class="marginalia fig">{cur.fig}</span>
              <h3 class="cap-title">{cur.title}</h3>
              <p class="cap-body">{cur.body}</p>
            </div>
          {/key}
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
    opacity: 0;
    transition: opacity 0.4s ease;
    will-change: opacity;
  }
  .slide.active {
    opacity: 1;
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
  .text {
    animation: fade-rise 0.35s ease both;
  }
  @keyframes fade-rise {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: none;
    }
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
    gap: 6px;
  }
  /* 24px hit target (WCAG/target-size) with a smaller visual dot. */
  .dot {
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
  }
  .dot::before {
    content: '';
    width: 9px;
    height: 9px;
    border-radius: 999px;
    border: 1px solid var(--outline-strong);
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      transform 0.2s ease;
  }
  .dot:hover::before {
    border-color: var(--accent);
  }
  .dot.on::before {
    background: var(--accent);
    border-color: var(--accent);
    transform: scale(1.15);
  }
  @media (prefers-reduced-motion: reduce) {
    .slide {
      transition: none;
    }
    .text {
      animation: none;
    }
  }
</style>
