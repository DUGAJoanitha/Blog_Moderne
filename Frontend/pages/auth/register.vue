<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'guest-only'
})

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const authStore = useAuthStore()

const handleRegister = async () => {
  errorMessage.value = ''

  if (!name.value || !email.value || !password.value || !passwordConfirmation.value) {
    errorMessage.value = 'Veuillez remplir tous les champs.'
    return
  }

  if (password.value.length < 8) {
    errorMessage.value = 'Le mot de passe doit contenir au moins 8 caractères.'
    return
  }

  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  isLoading.value = true
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })
    navigateTo('/')
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error.data?.message || 'Erreur lors de la création du compte. Vérifiez les informations saisies.'
  } finally {
    isLoading.value = false
  }
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
            Join The<br/>
            <span class="tracking-wide font-black text-blue-400">Adventure</span>
          </h1>
          
          <div class="mt-8 space-y-4 max-w-md">
            <p class="text-lg font-semibold text-white/95 leading-snug">
              Create your account in seconds.
            </p>
            <p class="text-sm text-white/80 leading-relaxed font-light">
              Start building your personalized travel lists, booking dreams and exploring the world.
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
          
          <div class="mb-6">
            <h2 class="text-2xl font-extrabold text-white">Create an Account</h2>
            <p class="text-sm text-white/60">Fill in the details below to register.</p>
          </div>

          <!-- Interactive Error Alert -->
          <Transition name="fade">
            <div v-if="errorMessage" class="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-100 text-sm flex items-center gap-3">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          </Transition>

          <form @submit.prevent="handleRegister" class="space-y-4">
            <!-- Full Name -->
            <div class="space-y-1">
              <label for="name" class="block text-xs font-medium text-white/90 px-1">Full Name</label>
              <input
                id="name"
                v-model="name"
                type="text"
                placeholder="John Doe"
                required
                class="w-full rounded-2xl border border-transparent bg-white px-5 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-[#2582FF] focus:ring-4 focus:ring-[#2582FF]/20"
              />
            </div>

            <!-- Email -->
            <div class="space-y-1">
              <label for="email" class="block text-xs font-medium text-white/90 px-1">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="you@example.com"
                required
                class="w-full rounded-2xl border border-transparent bg-white px-5 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-[#2582FF] focus:ring-4 focus:ring-[#2582FF]/20"
              />
            </div>

            <!-- Password -->
            <div class="space-y-1">
              <label for="password" class="block text-xs font-medium text-white/90 px-1">Password</label>
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="••••••••••••"
                required
                class="w-full rounded-2xl border border-transparent bg-white px-5 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-[#2582FF] focus:ring-4 focus:ring-[#2582FF]/20"
              />
            </div>

            <!-- Password Confirmation -->
            <div class="space-y-1">
              <label for="password_confirmation" class="block text-xs font-medium text-white/90 px-1">Confirm Password</label>
              <input
                id="password_confirmation"
                v-model="passwordConfirmation"
                type="password"
                placeholder="••••••••••••"
                required
                class="w-full rounded-2xl border border-transparent bg-white px-5 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-[#2582FF] focus:ring-4 focus:ring-[#2582FF]/20"
              />
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="relative w-full rounded-2xl bg-[#2582FF] py-4 mt-6 text-sm font-bold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-[#1A73E8] hover:shadow-[0_8px_20px_-4px_rgba(37,130,255,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span v-else>Sign Up</span>
            </button>
          </form>

          <!-- Login Link -->
          <p class="mt-6 text-center text-sm font-light text-white/70">
            Already have an account?
            <NuxtLink to="/login" class="ml-1 font-bold text-white hover:text-[#2582FF] hover:underline underline-offset-4 decoration-white/20 transition-all duration-150">
              Sign In
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
