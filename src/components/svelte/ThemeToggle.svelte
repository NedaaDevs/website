<script lang="ts">
  type Theme = 'light' | 'dark';

  const initial = (): Theme =>
    typeof document === 'undefined'
      ? 'light'
      : ((document.documentElement.dataset.theme as Theme | undefined) ?? 'light');

  let theme = $state<Theme>(initial());

  const toggle = () => {
    theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('nedaa.theme', theme);
  };
</script>

<button class="btn btn-ghost" type="button" aria-label="Toggle theme" onclick={toggle}>
  {theme === 'light' ? 'Dark' : 'Light'}
</button>
