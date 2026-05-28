<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({ middleware: 'auth' })

const api = useApi()
const isLoading = ref(true)
const errorMessage = ref('')

const stats = ref({ articles: 0, published: 0, drafts: 0, comments: 0, newsletters: 0, media: 0 })

const statCards = [
  { key: 'published',   label: 'Articles publiés',    color: 'from-[#2582FF]/20 to-[#2582FF]/5',  dot: 'bg-[#2582FF]',   icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { key: 'drafts',      label: 'Brouillons',           color: 'from-amber-500/20 to-amber-500/5',   dot: 'bg-amber-400',   icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { key: 'comments',    label: 'Commentaires',         color: 'from-sky-500/20 to-sky-500/5',       dot: 'bg-sky-400',     icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { key: 'newsletters', label: 'Abonnés newsletter',   color: 'from-violet-500/20 to-violet-500/5', dot: 'bg-violet-400',  icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { key: 'media',       label: 'Médias importés',      color: 'from-orange-500/20 to-orange-500/5', dot: 'bg-orange-400',  icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
]

const quickLinks = [
  { label: 'Voir les articles',     to: '/dashboard/articles',        color: 'hover:border-[#2582FF]/30 hover:bg-[#2582FF]/8',  text: 'text-[#2582FF]',   icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'Publier un article',    to: '/dashboard/articles/create', color: 'hover:border-emerald-500/30 hover:bg-emerald-500/8', text: 'text-emerald-400', icon: 'M12 4v16m8-8H4' },
  { label: 'Gérer la newsletter',   to: '/dashboard/newsletters',     color: 'hover:border-violet-500/30 hover:bg-violet-500/8',  text: 'text-violet-400',  icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { label: 'Modérer les commentaires', to: '/dashboard/comments',     color: 'hover:border-sky-500/30 hover:bg-sky-500/8',        text: 'text-sky-400',     icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { label: 'Gérer les médias',      to: '/dashboard/media',           color: 'hover:border-orange-500/30 hover:bg-orange-500/8',  text: 'text-orange-400',  icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
]

const fetchStats = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    stats.value = await api<typeof stats.value>('/stats')
  } catch {
    errorMessage.value = 'Impossible de charger les statistiques.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchStats)
</script>

<template>
  <DashboardLayout>
    <div class="space-y-6">

      <!-- Header -->
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Vue d'ensemble</p>
          <h1 class="mt-1 text-2xl font-bold text-white">Tableau de bord</h1>
        </div>
        <button
          @click="fetchStats"
          :disabled="isLoading"
          class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-400 transition-all duration-200 hover:border-[#2582FF]/30 hover:bg-[#2582FF]/8 hover:text-[#2582FF] disabled:opacity-40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" :class="isLoading ? 'animate-spin' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
      </div>

      <Transition name="slide-down">
        <div v-if="errorMessage" class="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {{ errorMessage }}
        </div>
      </Transition>

      <!-- Stats grid -->
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <TransitionGroup name="list" appear>
          <div
            v-for="(card, i) in statCards"
            :key="card.key"
            :style="{ transitionDelay: `${i * 60}ms` }"
            class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-lg"
          >
            <div class="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" :class="card.color"></div>
            <div class="relative">
              <div class="flex items-center gap-2">
                <div class="h-1.5 w-1.5 rounded-full" :class="card.dot"></div>
                <p class="text-[10px] uppercase tracking-[0.2em] text-slate-500">{{ card.label }}</p>
              </div>
              <p class="mt-3 text-3xl font-extrabold text-white">
                <span v-if="isLoading" class="inline-block h-8 w-10 animate-pulse rounded-lg bg-white/10"></span>
                <span v-else>{{ stats[card.key as keyof typeof stats] }}</span>
              </p>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Quick links -->
      <div class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <p class="mb-4 text-xs uppercase tracking-[0.3em] text-slate-500">Actions rapides</p>
        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-3 text-sm font-medium text-slate-400 transition-all duration-200 hover:text-white"
            :class="link.color"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 transition-colors duration-200" :class="link.text" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" :d="link.icon" />
            </svg>
            {{ link.label }}
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-auto h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>
