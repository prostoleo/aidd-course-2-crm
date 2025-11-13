<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const isDark = ref(false);

// Initialize dark mode on mount
onMounted(() => {
  // Check localStorage for saved preference
  const saved = localStorage.getItem('dark-mode');
  
  if (saved !== null) {
    isDark.value = saved === 'true';
  } else {
    // Check system preference
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  applyDarkMode(isDark.value);
});

// Watch for changes
watch(isDark, (newValue) => {
  applyDarkMode(newValue);
  localStorage.setItem('dark-mode', String(newValue));
});

const applyDarkMode = (isDark: boolean) => {
  const html = document.documentElement;
  if (isDark) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
};

// Expose isDark globally for toggle component
provide('isDark', readonly(isDark));
provide('toggleDarkMode', () => {
  isDark.value = !isDark.value;
});
</script>
