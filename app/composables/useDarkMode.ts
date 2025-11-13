export const useDarkMode = () => {
  const isDark = inject<Ref<boolean>>('isDark', ref(false));
  const toggleDarkMode = inject<() => void>('toggleDarkMode', () => {});

  // Check system preference
  const prefersDark = computed(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggle = () => {
    toggleDarkMode();
  };

  return {
    isDark: readonly(isDark),
    prefersDark,
    toggle
  };
};
