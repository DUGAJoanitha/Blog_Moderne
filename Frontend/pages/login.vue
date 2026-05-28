<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: 'guest-only' })

const email        = ref('')
const password     = ref('')
const isLoading    = ref(false)
const errorMessage = ref('')
const authStore    = useAuthStore()

const handleLogin = async () => {
  errorMessage.value = ''
  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs.'
    return
  }
  isLoading.value = true
  try {
    await authStore.login({ email: email.value, password: password.value })
    navigateTo('/dashboard')
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Identifiants invalides ou connexion impossible au serveur.'
  } finally {
    isLoading.value = false
  }
}

const handleGoogleSignIn = () => {
  alert("La connexion via Google n'est pas configurée dans cette version de démonstration.")
}
</script>

<template>
  <div class="min-h-screen w-full bg-[#0a0f1d] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">

    <!-- ── Floating particles ── -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden">

      <!-- Ambient blobs -->
      <div class="absolute -top-32 -left-32 h-[700px] w-[700px] rounded-full bg-[#2582FF]/10 blur-[140px] animate-blob-1"></div>
      <div class="absolute -bottom-40 -right-20 h-[600px] w-[600px] rounded-full bg-indigo-600/8 blur-[120px] animate-blob-2"></div>
      <div class="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/5 blur-[100px] animate-blob-3"></div>

      <!-- Floating orbs -->
      <div class="absolute top-[12%] left-[8%]  h-3 w-3 rounded-full bg-[#2582FF]/60 shadow-[0_0_12px_3px_rgba(37,130,255,0.4)] animate-float-1"></div>
      <div class="absolute top-[25%] left-[18%] h-2 w-2 rounded-full bg-white/30 animate-float-2"></div>
      <div class="absolute top-[60%] left-[5%]  h-4 w-4 rounded-full bg-indigo-400/40 shadow-[0_0_16px_4px_rgba(99,102,241,0.3)] animate-float-3"></div>
      <div class="absolute top-[80%] left-[22%] h-2 w-2 rounded-full bg-[#2582FF]/50 animate-float-4"></div>
      <div class="absolute top-[10%] right-[10%] h-3 w-3 rounded-full bg-sky-400/50 shadow-[0_0_10px_3px_rgba(56,189,248,0.3)] animate-float-2"></div>
      <div class="absolute top-[40%] right-[6%]  h-2 w-2 rounded-full bg-white/20 animate-float-5"></div>
      <div class="absolute top-[70%] right-[15%] h-4 w-4 rounded-full bg-[#2582FF]/35 shadow-[0_0_14px_4px_rgba(37,130,255,0.25)] animate-float-1"></div>
      <div class="absolute top-[88%] right-[30%] h-2 w-2 rounded-full bg-indigo-300/40 animate-float-3"></div>
      <div class="absolute top-[50%] left-[45%] h-1.5 w-1.5 rounded-full bg-white/25 animate-float-6"></div>
      <div class="absolute top-[35%] left-[55%] h-2.5 w-2.5 rounded-full bg-[#2582FF]/30 animate-float-4"></div>

      <!-- Floating rings -->
      <div class="absolute top-[20%] left-[30%] h-16 w-16 rounded-full border border-[#2582FF]/15 animate-ring-1"></div>
      <div class="absolute top-[65%] right-[25%] h-24 w-24 rounded-full border border-white/8 animate-ring-2"></div>
      <div class="absolute top-[45%] left-[12%] h-10 w-10 rounded-full border border-indigo-400/20 animate-ring-3"></div>

      <!-- Floating stars / crosses -->
      <div class="absolute top-[15%] right-[35%] text-[#2582FF]/40 text-lg animate-float-2 select-none">✦</div>
      <div class="absolute top-[75%] left-[40%] text-white/20 text-sm animate-float-5 select-none">✦</div>
      <div class="absolute top-[55%] right-[40%] text-indigo-400/30 text-xs animate-float-3 select-none">✦</div>
    </div>

    <!-- ── Main card ── -->
    <div class="relative z-10 w-full max-w-6xl min-h-screen md:min-h-[700px] md:rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] border border-white/8 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center animate-card-in">

      <div class="absolute inset-0 bg-slate-950/30 pointer-events-none"></div>

      <!-- Left column -->
      <div class="relative z-10 w-full md:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 text-white bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/20 md:bg-none">

        <!-- Logo -->
        <div class="flex items-center gap-3 animate-fade-up" style="animation-delay:0.1s">
          <div class="relative flex items-center justify-center">
            <svg class="w-10 h-10 text-white drop-shadow-[0_0_8px_rgba(37,130,255,0.6)]" viewBox="0 0 100 100" fill="none">
              <path d="M20 70 C20 40, 40 20, 70 30" stroke="white" stroke-width="2" stroke-dasharray="4 4" stroke-linecap="round"/>
              <path d="M72 26 L80 30 L74 38 L72 32 L64 32 Z" fill="white"/>
            </svg>
            <span class="text-2xl font-extrabold tracking-[0.2em] uppercase -ml-2">Travel</span>
          </div>
        </div>

        <!-- Slogans -->
        <div class="my-auto pt-16 pb-8 md:py-0">
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-none text-white select-none animate-fade-up" style="animation-delay:0.2s">
            Explore<br/>
            <span class="tracking-wide font-black bg-gradient-to-r from-white via-[#2582FF]/80 to-white bg-clip-text text-transparent">Horizons</span>
          </h1>
          <div class="mt-8 space-y-4 max-w-md animate-fade-up" style="animation-delay:0.35s">
            <p class="text-lg font-semibold text-white/95 leading-snug">
              Where Your Dream Destinations Become Reality.
            </p>
            <p class="text-sm text-white/75 leading-relaxed font-light">
              Embark on a journey where every corner of the world is within your reach.
            </p>
          </div>

          <!-- Floating badge -->
          <div class="mt-10 inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-4 py-2.5 backdrop-blur-sm animate-fade-up animate-float-badge" style="animation-delay:0.5s">
            <div class="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.5)] animate-pulse"></div>
            <span class="text-xs font-medium text-white/80">Secure · Fast · Reliable</span>
          </div>
        </div>

        <div class="text-xs text-white/40 hidden md:block animate-fade-up" style="animation-delay:0.6s">
          © 2026 Travel Inc. All rights reserved.
        </div>
      </div>

      <!-- Right column -->
      <div class="relative z-10 w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div class="w-full max-w-[430px] rounded-[2.5rem] border border-white/20 bg-white/10 p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl animate-fade-up" style="animation-delay:0.25s">

          <!-- Error -->
          <Transition name="fade">
            <div v-if="errorMessage" class="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-100 text-sm flex items-center gap-3">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          </Transition>

          <form @submit.prevent="handleLogin" class="space-y-6">
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

            <div class="flex justify-end text-sm px-1">
              <NuxtLink to="/auth/forgot-password" class="text-white/80 hover:text-white transition-colors duration-150 underline underline-offset-4 decoration-white/20 hover:decoration-white">
                Forgot password?
              </NuxtLink>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="relative w-full rounded-2xl bg-[#2582FF] py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-[#1A73E8] hover:shadow-[0_8px_28px_-4px_rgba(37,130,255,0.55)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 overflow-hidden group"
            >
              <!-- Shimmer on hover -->
              <span class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span>
              <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span v-else>Sign In</span>
            </button>

            <div class="relative flex py-2 items-center justify-center">
              <div class="flex-grow border-t border-white/10"></div>
              <span class="flex-shrink mx-4 text-xs font-normal text-white/60 uppercase tracking-widest">or</span>
              <div class="flex-grow border-t border-white/10"></div>
            </div>

            <button
              type="button"
              @click="handleGoogleSignIn"
              class="w-full py-4 px-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg font-medium text-sm active:scale-[0.98]"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </form>

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
/* ── Entry animations ── */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-up {
  animation: fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes card-in {
  from { opacity: 0; transform: scale(0.97) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-card-in {
  animation: card-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ── Ambient blobs ── */
@keyframes blob-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(40px, -30px) scale(1.08); }
  66%       { transform: translate(-20px, 20px) scale(0.95); }
}
@keyframes blob-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  40%       { transform: translate(-50px, 30px) scale(1.1); }
  70%       { transform: translate(30px, -20px) scale(0.92); }
}
@keyframes blob-3 {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50%       { transform: translate(-50%, -50%) scale(1.15); }
}
.animate-blob-1 { animation: blob-1 18s ease-in-out infinite; }
.animate-blob-2 { animation: blob-2 22s ease-in-out infinite; }
.animate-blob-3 { animation: blob-3 14s ease-in-out infinite; }

/* ── Floating orbs ── */
@keyframes float-1 {
  0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.7; }
  25%       { transform: translateY(-18px) translateX(8px); opacity: 1; }
  75%       { transform: translateY(10px) translateX(-6px); opacity: 0.5; }
}
@keyframes float-2 {
  0%, 100% { transform: translateY(0px); opacity: 0.5; }
  50%       { transform: translateY(-22px); opacity: 0.9; }
}
@keyframes float-3 {
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.6; }
  33%       { transform: translateY(-14px) translateX(10px) rotate(120deg); opacity: 1; }
  66%       { transform: translateY(8px) translateX(-8px) rotate(240deg); opacity: 0.4; }
}
@keyframes float-4 {
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
  50%       { transform: translateY(-16px) scale(1.3); opacity: 1; }
}
@keyframes float-5 {
  0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
  40%       { transform: translateY(-20px) translateX(12px); opacity: 0.8; }
  80%       { transform: translateY(6px) translateX(-4px); opacity: 0.5; }
}
@keyframes float-6 {
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
  30%       { transform: translateY(-12px) scale(1.5); opacity: 0.9; }
  70%       { transform: translateY(8px) scale(0.8); opacity: 0.3; }
}
.animate-float-1 { animation: float-1 6s ease-in-out infinite; }
.animate-float-2 { animation: float-2 8s ease-in-out infinite; }
.animate-float-3 { animation: float-3 10s ease-in-out infinite; }
.animate-float-4 { animation: float-4 7s ease-in-out infinite; }
.animate-float-5 { animation: float-5 9s ease-in-out infinite; }
.animate-float-6 { animation: float-6 5s ease-in-out infinite; }

/* ── Floating rings ── */
@keyframes ring-1 {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.4; }
  50%       { transform: scale(1.2) rotate(180deg); opacity: 0.15; }
}
@keyframes ring-2 {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.2; }
  50%       { transform: scale(0.85) rotate(-120deg); opacity: 0.5; }
}
@keyframes ring-3 {
  0%, 100% { transform: scale(1) translateY(0); opacity: 0.3; }
  50%       { transform: scale(1.3) translateY(-10px); opacity: 0.6; }
}
.animate-ring-1 { animation: ring-1 12s ease-in-out infinite; }
.animate-ring-2 { animation: ring-2 16s ease-in-out infinite; }
.animate-ring-3 { animation: ring-3 9s ease-in-out infinite; }

/* ── Floating badge ── */
@keyframes float-badge {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
}
.animate-float-badge { animation: float-badge 4s ease-in-out infinite; }

/* ── Vue fade transition ── */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
