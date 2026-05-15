<script lang="ts">
  import { relativeDays } from '@/lib/format';
  import type { Locale } from '@/i18n/types';

  type Props = { lang: Locale; iso: string; fallback: string };
  const { lang, iso, fallback }: Props = $props();

  let text = $state(fallback);

  $effect(() => {
    text = relativeDays(lang, iso);
  });
</script>

<span>{text}</span>
