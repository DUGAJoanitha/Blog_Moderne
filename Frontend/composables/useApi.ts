import { useAuthStore } from '~/stores/auth'

export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const headers = (options.headers || {}) as Record<string, string>
      headers['Accept'] = 'application/json'

      if (authStore.token) {
        headers['Authorization'] = `Bearer ${authStore.token}`
      }

      options.headers = headers
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        // Clean up store state if token is expired/unauthorized
        authStore.token = null
        authStore.user = null
        navigateTo('/login')
      }
    }
  })

  return apiFetch
}
