import { useAuthStore } from '~/stores/auth'

export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      // Construire les headers de façon compatible avec ofetch (Headers | Record)
      const existing = options.headers
      const headers: Record<string, string> = {}

      if (existing instanceof Headers) {
        existing.forEach((value, key) => { headers[key] = value })
      } else if (Array.isArray(existing)) {
        existing.forEach(([key, value]) => { headers[key] = value })
      } else if (existing) {
        Object.assign(headers, existing)
      }

      headers['Accept'] = 'application/json'

      if (authStore.token) {
        headers['Authorization'] = `Bearer ${authStore.token}`
      }

      options.headers = headers
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        authStore.token = null
        authStore.user = null
        navigateTo('/login')
      }
    },
  })

  return apiFetch
}
