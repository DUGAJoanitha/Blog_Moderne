<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'redirect-login'
})

const authStore = useAuthStore()
const api = useApi()

interface Article {

  id: number
  title: string
  content: string
  slug: string
  status: string
  published_at: string
  user?: {
    name: string
    email: string
  }
}

interface ArticlesResponse {
  data: Article[]
  total: number
  current_page: number
  last_page: number
}

const articles = ref<Article[]>([])
const isLoading = ref(true)
const fetchError = ref('')

const fetchArticles = async () => {
  isLoading.value = true
  fetchError.value = ''
  try {
    const response = await api<ArticlesResponse>('/articles')
    // Laravel paginator returns items inside 'data'
    articles.value = response.data || []
  } catch (error: any) {
    console.error('Error fetching articles:', error)
    fetchError.value = 'Impossible de charger les articles. Le serveur Laravel est-il en cours d\'exécution ?'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchArticles()
})

const handleLogout = async () => {
  await authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-[#070a13] text-slate-100 font-sans selection:bg-[#2582FF]/30 selection:text-white">
    <!-- Header/Navigation -->
    <header class="sticky top-0 z-40 w-full border-b border-white/5 bg-[#070a13]/80 backdrop-blur-md">
      <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <svg class="w-8 h-8 text-blue-500" viewBox="0 0 100 100" fill="none">
            <path d="M20 70 C20 40, 40 20, 70 30" stroke="currentColor" stroke-width="3" stroke-dasharray="4 4" stroke-linecap="round"/>
            <path d="M72 26 L80 30 L74 38 L72 32 L64 32 Z" fill="currentColor"/>
          </svg>
          <span class="text-xl font-bold tracking-[0.25em] uppercase">Travel</span>
        </div>

        <!-- Right Side: User Profile & Logout -->
        <div class="flex items-center gap-4 sm:gap-6">
          <div class="hidden sm:flex flex-col text-right">
            <span class="text-sm font-semibold text-white">{{ authStore.user?.name }}</span>
            <span class="text-xs text-slate-400">{{ authStore.user?.email }}</span>
          </div>
          
          <div class="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg ring-2 ring-white/10">
            {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
          </div>

          <button
            @click="handleLogout"
            class="px-4 py-2 rounded-xl border border-white/10 hover:border-red-500/20 bg-white/5 hover:bg-red-500/10 text-sm font-medium text-slate-300 hover:text-red-400 transition-all duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-6 py-10 lg:py-16 lg:px-12">
      <!-- Hero section -->
      <section class="relative mb-12 rounded-[2.5rem] overflow-hidden border border-white/5 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center">
        <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
        <div class="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl space-y-6">
          <span class="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
            ✈ Explorer Dashboard
          </span>
          <h2 class="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Welcome back, <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{{ authStore.user?.name }}</span>!
          </h2>
          <p class="text-base sm:text-lg text-slate-300 font-light">
            Plan your next journey, browse recent travel insights, and publish new articles for the modern nomad community.
          </p>
        </div>
      </section>

      <!-- Articles list section -->
      <section class="space-y-8">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold tracking-tight text-white">Latest Travel Insights</h3>
            <p class="text-sm text-slate-400 mt-1">Read articles published by our global guides.</p>
          </div>
          <button 
            @click="fetchArticles" 
            class="p-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-slate-400 hover:text-white transition"
            title="Refresh articles"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.228 10H18.228" />
            </svg>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="n in 3" :key="n" class="animate-pulse rounded-3xl border border-white/5 bg-white/5 p-6 space-y-4">
            <div class="h-6 w-3/4 rounded bg-white/10"></div>
            <div class="space-y-2">
              <div class="h-4 w-full rounded bg-white/10"></div>
              <div class="h-4 w-5/6 rounded bg-white/10"></div>
            </div>
            <div class="h-8 w-1/3 rounded bg-white/10 pt-4"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="fetchError" class="rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-8 text-center max-w-xl mx-auto space-y-4">
          <svg class="mx-auto w-12 h-12 text-yellow-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h4 class="text-lg font-bold text-white">Connexion backend indisponible</h4>
          <p class="text-sm text-slate-400">{{ fetchError }}</p>
          <div class="pt-2">
            <button 
              @click="fetchArticles"
              class="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-all shadow-md active:scale-95"
            >
              Réessayer
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="articles.length === 0" class="rounded-[2rem] border border-white/5 bg-white/5 p-12 text-center max-w-md mx-auto space-y-4">
          <span class="text-4xl">🏝️</span>
          <h4 class="text-lg font-bold text-white">Aucun article publié</h4>
          <p class="text-sm text-slate-400">Aucun article n'a été publié pour le moment. Vous pouvez démarrer le backend et en rajouter via l'API.</p>
        </div>

        <!-- Articles Grid -->
        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article 
            v-for="article in articles" 
            :key="article.id" 
            class="group relative rounded-3xl border border-white/5 bg-white/5 hover:bg-white/10 p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between text-xs text-slate-400">
                <span>By {{ article.user?.name || 'Auteur' }}</span>
                <span>{{ new Date(article.published_at || Date.now()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) }}</span>
              </div>
              <h4 class="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                {{ article.title }}
              </h4>
              <p class="text-sm leading-relaxed text-slate-300 font-light line-clamp-4">
                {{ article.content }}
              </p>
            </div>
            
            <div class="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-widest font-semibold font-mono">
                {{ article.status }}
              </span>
              <NuxtLink :to="`/articles/${article.slug}`" class="text-blue-400 hover:text-blue-300 font-bold transition flex items-center gap-1">
                Read More 
                <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </NuxtLink>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>
