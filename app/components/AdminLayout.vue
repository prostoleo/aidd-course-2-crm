<template>
  <div class="page">
    <nav class="nav">
      <div class="container nav-container">
        <NuxtLink to="/admin" class="nav-brand">CRM Admin</NuxtLink>
        <ul class="nav-menu">
          <li>
            <NuxtLink
              to="/admin"
              class="nav-link"
              :class="{ active: route.path === '/admin' }"
            >
              Dashboard
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/admin/organizations"
              class="nav-link"
              :class="{ active: route.path.startsWith('/admin/organizations') }"
            >
              Organizations
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/admin/contacts"
              class="nav-link"
              :class="{ active: route.path.startsWith('/admin/contacts') }"
            >
              Contacts
            </NuxtLink>
          </li>
          <li>
            <button @click="handleLogout" class="nav-link">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { logout } = useAuth()

const handleLogout = async () => {
  await logout()
}
</script>

<style scoped>
button.nav-link {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}
</style>