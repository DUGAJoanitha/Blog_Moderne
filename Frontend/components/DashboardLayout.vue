<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const navItems = [
  { label: 'Tableau de bord', path: '/dashboard' },
  { label: 'Articles', path: '/dashboard/articles' },
  { label: 'Newsletter', path: '/dashboard/newsletters' },
  { label: 'Médias', path: '/dashboard/media' },
  { label: 'Commentaires', path: '/dashboard/comments' },
]
const activePath = computed(() => route.path)
</script>

<template>
  <div class="min-h-screen bg-[#070a13] text-slate-100 font-sans">
    <div class="mx-auto max-w-7xl px-4 py-6 lg:px-8">
      <div class="mb-8 flex flex-col gap-6 xl:gap-0 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.35em] text-slate-400">Espace administrateur</p>
          <h1 class="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Tableau de bord</h1>
          <p class="mt-4 max-w-2xl text-sm leading-6 text-slate-400">Gérez vos contenus, publiez des articles et suivez les newsletters, commentaires et médias.</p>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-4 flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white text-lg font-bold">
            {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-white leading-none">{{ authStore.user?.name }}</p>
            <p class="truncate text-xs text-slate-400">{{ authStore.user?.email }}</p>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside class="rounded-[2rem] border border-white/5 bg-white/5 p-6 shadow-xl shadow-slate-950/20">
          <div class="mb-8">
            <p class="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Navigation</p>
          </div>
          <nav class="space-y-2">
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="block rounded-2xl px-4 py-3 text-sm transition"
              :class="activePath === item.path ? 'bg-blue-500/10 text-blue-300 font-bold' : 'text-slate-300 hover:bg-white/5 hover:text-white'"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
        </aside>

        <main class="space-y-8">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
