<script lang="ts">
  import { hijriDate } from '@/lib/format';
  import type { Locale } from '@/i18n/types';

  type Props = { lang: Locale; fallback: string };
  const { lang, fallback }: Props = $props();

  let text = $state(fallback);

  $effect(() => {
    text = hijriDate(lang);
  });
</script>

<span>{text}</span>
