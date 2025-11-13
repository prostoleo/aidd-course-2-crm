export const useAuth = () => {
  const user = useState('auth.user', () => null)
  const loading = useState('auth.loading', () => false)

  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const data = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      user.value = data.user
      await navigateTo('/admin')
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/auth/login')
  }

  const fetchUser = async () => {
    loading.value = true
    try {
      user.value = await $fetch('/api/auth/me')
    } catch (error) {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    login,
    logout,
    fetchUser
  }
}