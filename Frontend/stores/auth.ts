import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useApi } from '~/composables/useApi'

export const useAuthStore = defineStore('auth', () => {
  const api = useApi()
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/'
  })

  const user = useCookie<any | null>('auth_user', {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/'
  })

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials: any) {
    try {
      const data = await api('/login', {
        method: 'POST',
        body: credentials
      })

      token.value = data.token
      user.value = data.user
      return data
    } catch (error) {
      throw error
    }
  }

  async function register(formData: any) {
    try {
      const data = await api('/register', {
        method: 'POST',
        body: formData
      })

      token.value = data.token
      user.value = data.user
      return data
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    if (token.value) {
      try {
        await api('/logout', {
          method: 'POST'
        })
      } catch (e) {
        console.error('Logout request failed', e)
      }
    }

    // Reset local auth state
    token.value = null
    user.value = null

    // Navigate to login
    return navigateTo('/login')
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout
  }
})
