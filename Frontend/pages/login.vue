<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'guest-only'
})

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const authStore = useAuthStore()

const handleLogin = async () => {
  errorMessage.value = ''
  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs.'
    return
  }

  isLoading.value = true
  try {
    await authStore.login({
      email: email.value,
      password: password.value
    })
    navigateTo('/dashboard')
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error.data?.message || 'Identifiants invalides ou connexion impossible au serveur.'
  } finally {
    isLoading.value = false
  }
}

const handleGoogleSignIn = () => {
  // Optionnel: Message informatif premium
  alert("La connexion via Google n'est pas configurée dans cette version de démonstration. Veuillez vous connecter avec l'email 'test@example.com' et le mot de passe 'password'.")
}
</script>

<template>
  <div class="min-h-screen w-full bg-[#0a0f1d] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-x-hidden">
    <!-- App Outer Container (simulating the rounded screen aspect from mock) -->
    <div class="relative w-full max-w-6xl min-h-screen md:min-h-[700px] md:rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-white/5 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center">
      
      <!-- Ambient dark glass overlay over the entire background -->
      <div class="absolute inset-0 bg-slate-950/25 pointer-events-none"></div>

      <!-- Left Column: Branding / Marketing -->
      <div class="relative z-10 w-full md:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 text-white bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 md:bg-none">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="relative flex items-center justify-center">
            <!-- Dotted/dashed orbit and airplane icon logo -->
            <svg class="w-10 h-10 text-white" viewBox="0 0 100 100" fill="none">
              <path d="M20 70 C20 40, 40 20, 70 30" stroke="white" stroke-width="2" stroke-dasharray="4 4" stroke-linecap="round"/>
              <path d="M72 26 L80 30 L74 38 L72 32 L64 32 Z" fill="white"/>
            </svg>
            <span class="text-2xl font-extrabold tracking-[0.2em] uppercase -ml-2">Travel</span>
          </div>
        </div>

        <!-- Big Slogans -->
        <div class="my-auto pt-16 pb-8 md:py-0">
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-none text-white select-none">
            Explore<br/>
            <span class="tracking-wide font-black">Horizons</span>
          </h1>
          
          <div class="mt-8 space-y-4 max-w-md">
            <p class="text-lg font-semibold text-white/95 leading-snug">
              Where Your Dream Destinations Become Reality.
            </p>
            <p class="text-sm text-white/80 leading-relaxed font-light">
              Embark on a journey where every corner of the world is within your reach.
            </p>
          </div>
        </div>

        <!-- Footer / Subtle Hint -->
        <div class="text-xs text-white/50 hidden md:block">
          © 2026 Travel Inc. All rights reserved.
        </div>
      </div>

      <!-- Right Column: Glassmorphic Auth Card -->
      <div class="relative z-10 w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <!-- Glass card -->
        <div class="w-full max-w-[430px] rounded-[2.5rem] border border-white/20 bg-white/10 p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          
          <!-- Interactive Error Alert -->
          <Transition name="fade">
            <div v-if="errorMessage" class="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-100 text-sm flex items-center gap-3">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          </Transition>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email -->
            <div class="space-y-2">
              <label for="email" class="block text-sm font-medium text-white/90 px-1">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="Enter your email"
                required
                class="w-full rounded-2xl border border-transparent bg-white px-5 py-4 text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-[#2582FF] focus:ring-4 focus:ring-[#2582FF]/20"
              />
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-white/90 px-1">Password</label>
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="••••••••••••"
                required
                class="w-full rounded-2xl border border-transparent bg-white px-5 py-4 text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-[#2582FF] focus:ring-4 focus:ring-[#2582FF]/20"
              />
            </div>

            <!-- Forgot Password -->
            <div class="flex justify-end text-sm px-1">
              <NuxtLink to="/auth/forgot-password" class="text-white/80 hover:text-white transition-colors duration-150 underline underline-offset-4 decoration-white/20 hover:decoration-white">
                Forgot password?
              </NuxtLink>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="relative w-full rounded-2xl bg-[#2582FF] py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-[#1A73E8] hover:shadow-[0_8px_20px_-4px_rgba(37,130,255,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span v-else>Sign In</span>
            </button>

            <!-- Separator -->
            <div class="relative flex py-2 items-center justify-center">
              <div class="flex-grow border-t border-white/10"></div>
              <span class="flex-shrink mx-4 text-xs font-normal text-white/60 uppercase tracking-widest">or</span>
              <div class="flex-grow border-t border-white/10"></div>
            </div>

            <!-- Google Button -->
            <button
              type="button"
              @click="handleGoogleSignIn"
              class="w-full py-4 px-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg font-medium text-sm active:scale-[0.98]"
            >
              <!-- Google color SVG icon -->
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </form>

          <!-- Register Link -->
          <p class="mt-8 text-center text-sm font-light text-white/70">
            Are you new?
            <NuxtLink to="/auth/register" class="ml-1 font-bold text-white hover:text-[#2582FF] hover:underline underline-offset-4 decoration-white/20 transition-all duration-150">
              Create an Account
            </NuxtLink>
          </p>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
