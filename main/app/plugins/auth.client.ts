export default defineNuxtPlugin(async () => {
  const { fetchUser } = useAuth()

  // Try to fetch the current user on app initialization
  // This will check if there's a valid auth-token cookie
  await fetchUser()
})