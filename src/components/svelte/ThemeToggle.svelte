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

<button class="btn btn-ghost" type="button" onclick={toggle}>
  <span class="visually-hidden">Switch to&nbsp;</span>
  {theme === 'light' ? 'Dark' : 'Light'}
</button>

<style>
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }
</style>
