<template>
  <div class="page">
    <div class="container" style="margin-top: 100px; text-align: center;">
      <h1>CRM System</h1>
      <p class="text-secondary mb-4">Manage your customers and opportunities</p>
      <NuxtLink to="/auth/login" class="btn btn-primary">Login to CRM</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()

onMounted(() => {
  if (user.value) {
    navigateTo('/admin')
  }
})
</script>