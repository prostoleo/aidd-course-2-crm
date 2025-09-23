export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetchUser } = useAuth()

  // If no user in state, try to fetch from cookie
  if (!user.value && to.path.startsWith('/admin')) {
    await fetchUser()

    // If still no user after fetching, redirect to login
    if (!user.value) {
      return navigateTo('/auth/login')
    }
  }
})