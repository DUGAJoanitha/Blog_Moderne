<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from '#imports'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const mobileNavOpen = ref(false)

const navItems = [
  { label: 'Tableau de bord', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'Articles',        path: '/dashboard/articles',    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'Newsletter',      path: '/dashboard/newsletters', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { label: 'Médias',          path: '/dashboard/media',       icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'Commentaires',    path: '/dashboard/comments',    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
]

const isActive = (path: string) =>
  route.path === path || route.path.startsWith(path + '/')
</script>

<template>
  <div class="min-h-screen bg-[#0a0f1d] text-slate-100 font-sans">

    <!-- Ambient background blobs -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#2582FF]/8 blur-[120px]"></div>
      <div class="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-indigo-600/6 blur-[100px]"></div>
    </div>

    <div class="relative mx-auto max-w-7xl px-4 py-6 lg:px-8">

      <!-- Top bar -->
      <header class="mb-8 flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2582FF] shadow-lg shadow-[#2582FF]/30">
              <svg class="h-5 w-5 text-white" viewBox="0 0 100 100" fill="none">
                <path d="M20 70 C20 40, 40 20, 70 30" stroke="white" stroke-width="3" stroke-dasharray="4 4" stroke-linecap="round"/>
                <path d="M72 26 L80 30 L74 38 L72 32 L64 32 Z" fill="white"/>
              </svg>
            </div>
            <span class="hidden text-sm font-bold uppercase tracking-[0.2em] text-white sm:block">Travel</span>
          </div>
          <div class="hidden h-5 w-px bg-white/10 sm:block"></div>
          <p class="hidden text-xs uppercase tracking-[0.3em] text-slate-500 sm:block">Admin</p>
        </div>

        <div class="flex items-center gap-3">
          <!-- User card -->
          <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2582FF] to-indigo-500 text-sm font-bold text-white shadow-md shadow-[#2582FF]/30">
              {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div class="hidden min-w-0 sm:block">
              <p class="text-sm font-semibold leading-none text-white">{{ authStore.user?.name }}</p>
              <p class="mt-0.5 truncate text-xs text-slate-400">{{ authStore.user?.email }}</p>
            </div>
          </div>

          <!-- Sign out -->
          <button
            @click="authStore.logout()"
            class="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-400 backdrop-blur-sm transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
            title="Se déconnecter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="hidden sm:inline">Sign out</span>
          </button>

          <!-- Mobile nav toggle -->
          <button
            @click="mobileNavOpen = !mobileNavOpen"
            class="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 lg:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path v-if="!mobileNavOpen" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Mobile nav -->
      <Transition name="slide-down">
        <nav v-if="mobileNavOpen" class="mb-6 flex flex-wrap gap-2 lg:hidden">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="mobileNavOpen = false"
            class="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200"
            :class="isActive(item.path)
              ? 'bg-[#2582FF]/15 text-[#2582FF] border border-[#2582FF]/25'
              : 'border border-white/8 bg-white/5 text-slate-400 hover:bg-white/8 hover:text-white'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
            </svg>
            {{ item.label }}
          </NuxtLink>
        </nav>
      </Transition>

      <!-- Main grid -->
      <div class="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">

        <!-- Sidebar -->
        <aside class="hidden lg:block">
          <div class="sticky top-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p class="mb-5 px-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Navigation</p>
            <nav class="space-y-1">
              <NuxtLink
                v-for="item in navItems"
                :key="item.path"
                :to="item.path"
                class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                :class="isActive(item.path)
                  ? 'bg-[#2582FF]/15 text-[#2582FF]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'"
              >
                <div
                  class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200"
                  :class="isActive(item.path) ? 'bg-[#2582FF]/20' : 'bg-white/5 group-hover:bg-white/10'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
                  </svg>
                </div>
                {{ item.label }}
                <div v-if="isActive(item.path)" class="ml-auto h-1.5 w-1.5 rounded-full bg-[#2582FF]"></div>
              </NuxtLink>
            </nav>
          </div>
        </aside>

        <!-- Content -->
        <main class="min-w-0 space-y-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
