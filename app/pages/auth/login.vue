<template>
  <div class="page">
    <div class="container" style="max-width: 400px; margin-top: 100px;">
      <div class="card">
        <div class="card-header">
          <h2>CRM Login</h2>
        </div>
        <div class="card-body">
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                class="form-input"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input
                id="password"
                v-model="password"
                type="password"
                class="form-input"
                required
              />
            </div>
            <div v-if="error" class="alert alert-danger">
              {{ error }}
            </div>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="loading"></span>
              <span v-else>Login</span>
            </button>
          </form>
        </div>
        <div class="card-footer">
          <p class="text-sm text-secondary">
            Default credentials: admin@crm.com / password123
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login, loading, user } = useAuth()
const email = ref('admin@crm.com')
const password = ref('password123')
const error = ref('')

// Redirect to admin if already logged in
onMounted(() => {
  if (user.value) {
    navigateTo('/admin')
  }
})

// Watch for user changes
watch(user, (newUser) => {
  if (newUser) {
    navigateTo('/admin')
  }
})

const handleLogin = async () => {
  error.value = ''
  try {
    await login(email.value, password.value)
  } catch (e: any) {
    error.value = e.data?.statusMessage || 'Login failed'
  }
}
</script>