<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({ middleware: 'auth' })

interface Article {
  id: number
  title: string
  content: string
  slug: string
  status: string
  published_at: string
  user?: { name: string }
  images?: { id: number; path: string; url?: string }[]
}

const api = useApi()
const config = useRuntimeConfig()
const articles = ref<Article[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const deletingId = ref<number | null>(null)

const fetchArticles = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await api<{ data: Article[] }>('/admin/articles')
    articles.value = Array.isArray(response) ? response : (response.data || [])
  } catch {
    errorMessage.value = 'Impossible de charger les articles.'
  } finally {
    isLoading.value = false
  }
}

const deleteArticle = async (article: Article) => {
  if (!confirm(`Supprimer "${article.title}" ?`)) return
  deletingId.value = article.id
  try {
    await api(`/articles/${article.id}`, { method: 'DELETE' })
    articles.value = articles.value.filter(a => a.id !== article.id)
  } catch {
    errorMessage.value = 'Impossible de supprimer cet article.'
  } finally {
    deletingId.value = null
  }
}

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

onMounted(fetchArticles)
</script>

<template>
  <DashboardLayout>
    <section class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Articles</p>
          <h2 class="mt-3 text-3xl font-bold text-white">Gestion des articles</h2>
          <p class="mt-2 text-sm text-slate-400">Consultez, modifiez et publiez vos contenus.</p>
        </div>
        <NuxtLink
          to="/dashboard/articles/create"
          class="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nouvel article
        </NuxtLink>
      </div>

      <div v-if="errorMessage" class="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{{ errorMessage }}</div>

      <div class="mt-8">
        <div v-if="isLoading" class="space-y-4">
          <div v-for="n in 4" :key="n" class="h-24 animate-pulse rounded-2xl bg-white/5"></div>
        </div>

        <div v-else-if="articles.length === 0" class="rounded-[2rem] border border-dashed border-white/10 p-12 text-center">
          <p class="text-lg font-semibold text-white">Aucun article pour le moment.</p>
          <p class="mt-2 text-sm text-slate-400">Créez votre premier article.</p>
          <NuxtLink to="/dashboard/articles/create" class="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-400">
            Créer un article
          </NuxtLink>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="article in articles"
            :key="article.id"
            class="flex items-center gap-4 rounded-2xl border border-white/5 bg-slate-950/80 p-4 transition hover:border-white/10"
          >
            <div class="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/5">
              <img
                v-if="article.images?.[0]"
                :src="article.images[0].url || `${config.public.apiBase.replace('/api', '')}/storage/${article.images[0].path}`"
                :alt="article.title"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full w-full items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span
                  class="rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  :class="article.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'"
                >
                  {{ article.status === 'published' ? 'Publié' : 'Brouillon' }}
                </span>
                <span class="text-xs text-slate-500">{{ formatDate(article.published_at) }}</span>
              </div>
              <p class="mt-1 truncate text-sm font-semibold text-white">{{ article.title }}</p>
            </div>

            <div class="flex shrink-0 items-center gap-2">
              <NuxtLink
                :to="`/dashboard/articles/${article.id}`"
                class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                title="Visualiser"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </NuxtLink>
              <NuxtLink
                :to="`/dashboard/articles/${article.id}/edit`"
                class="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 transition hover:bg-blue-500/20"
                title="Modifier"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </NuxtLink>
              <button
                @click="deleteArticle(article)"
                :disabled="deletingId === article.id"
                class="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500/20 disabled:opacity-40"
                title="Supprimer"
              >
                <svg v-if="deletingId === article.id" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>
