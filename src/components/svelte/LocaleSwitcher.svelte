<script lang="ts">
  type Props = { current: 'en' | 'ar' };
  const { current }: Props = $props();

  const swap = () => {
    const next = current === 'en' ? 'ar' : 'en';
    // Records an explicit choice so the home-page detector won't override it.
    document.cookie = `nedaa_locale=${next}; path=/; max-age=31536000; samesite=lax`;
    const path = window.location.pathname;
    const stripped = path.replace(/^\/(en|ar|ms|ur)(\/|$)/, '/');
    const target = next === 'en' ? stripped : `/ar${stripped}`;
    window.location.assign(target.replace(/\/{2,}/g, '/'));
  };

  const label = $derived(current === 'en' ? 'العربية' : 'English');
</script>

<button class="btn btn-ghost" type="button" onclick={swap}>
  {label}
</button>
