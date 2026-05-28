<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const api = useApi()
const config = useRuntimeConfig()

interface ArticleImage {
  id: number
  path: string
  url?: string
  original_name: string
}

interface Article {
  id: number
  title: string
  content: string
  slug: string
  status: string
  published_at: string
  created_at: string
  user?: { name: string; email: string }
  images?: ArticleImage[]
  comments?: { id: number; content: string; user?: { name: string }; created_at: string }[]
}

const article = ref<Article | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')
const lightboxImg = ref<ArticleImage | null>(null)
const deletingImgId = ref<number | null>(null)

const fetchArticle = async () => {
  isLoading.value = true
  try {
    const data = await api<Article>(`/admin/articles/${route.params.id}`)
    article.value = data
  } catch {
    errorMessage.value = 'Article introuvable.'
  } finally {
    isLoading.value = false
  }
}

const deleteImage = async (img: ArticleImage) => {
  if (!confirm('Supprimer cette image ?')) return
  deletingImgId.value = img.id
  try {
    await api(`/images/${img.id}`, { method: 'DELETE' })
    if (article.value) {
      article.value.images = article.value.images?.filter(i => i.id !== img.id)
    }
    if (lightboxImg.value?.id === img.id) lightboxImg.value = null
  } catch {
    errorMessage.value = "Impossible de supprimer l'image."
  } finally {
    deletingImgId.value = null
  }
}

const imgUrl = (img: ArticleImage) =>
  img.url || `${config.public.apiBase.replace('/api', '')}/storage/${img.path}`

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'

onMounted(fetchArticle)
</script>

<template>
  <DashboardLayout>
    <div class="space-y-6">

      <div class="flex items-center gap-3">
        <NuxtLink
          to="/dashboard/articles"
          class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </NuxtLink>
        <p class="text-sm text-slate-400">Articles</p>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <p class="text-sm text-white truncate max-w-xs">{{ article?.title || 'Chargement...' }}</p>
      </div>

      <div v-if="isLoading" class="space-y-4">
        <div class="h-64 animate-pulse rounded-[2rem] bg-white/5"></div>
        <div class="h-40 animate-pulse rounded-[2rem] bg-white/5"></div>
      </div>

      <div v-else-if="errorMessage" class="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">{{ errorMessage }}</div>

      <template v-else-if="article">

        <section class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3">
                <span
                  class="rounded-xl px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                  :class="article.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'"
                >
                  {{ article.status === 'published' ? 'Publié' : 'Brouillon' }}
                </span>
                <span class="text-xs text-slate-500">{{ formatDate(article.published_at || article.created_at) }}</span>
              </div>
              <h1 class="mt-4 text-3xl font-bold text-white leading-tight">{{ article.title }}</h1>
              <p class="mt-2 text-sm text-slate-400">Par {{ article.user?.name || 'Auteur inconnu' }}</p>
            </div>
            <NuxtLink
              :to="`/dashboard/articles/${article.id}/edit`"
              class="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier
            </NuxtLink>
          </div>

          <div class="mt-8 rounded-3xl border border-white/5 bg-slate-950/60 p-6">
            <p class="whitespace-pre-wrap text-sm leading-7 text-slate-300">{{ article.content }}</p>
          </div>
        </section>

        <section v-if="article.images && article.images.length > 0" class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Images</p>
              <h2 class="mt-2 text-xl font-bold text-white">{{ article.images.length }} image{{ article.images.length > 1 ? 's' : '' }}</h2>
            </div>
            <NuxtLink
              to="/dashboard/media"
              class="text-xs text-blue-400 hover:text-blue-300 transition"
            >
              Gérer les médias →
            </NuxtLink>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <div
              v-for="img in article.images"
              :key="img.id"
              class="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 cursor-pointer"
              @click="lightboxImg = img"
            >
              <img :src="imgUrl(img)" :alt="img.original_name" class="h-full w-full object-cover transition group-hover:scale-105" />
              <div class="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 p-3">
                <p class="truncate text-[10px] text-white">{{ img.original_name }}</p>
                <button
                  @click.stop="deleteImage(img)"
                  :disabled="deletingImgId === img.id"
                  class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/80 text-white hover:bg-red-500 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section v-if="article.comments && article.comments.length > 0" class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20">
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Commentaires</p>
          <h2 class="mt-2 text-xl font-bold text-white">{{ article.comments.length }} commentaire{{ article.comments.length > 1 ? 's' : '' }}</h2>
          <div class="mt-6 space-y-3">
            <div
              v-for="comment in article.comments"
              :key="comment.id"
              class="rounded-2xl border border-white/5 bg-slate-950/60 p-4"
            >
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm font-semibold text-white">{{ comment.user?.name || 'Anonyme' }}</p>
                <p class="text-xs text-slate-500">{{ formatDate(comment.created_at) }}</p>
              </div>
              <p class="mt-2 text-sm text-slate-300">{{ comment.content }}</p>
            </div>
          </div>
        </section>

      </template>
    </div>

    <Teleport to="body">
      <div
        v-if="lightboxImg"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        @click.self="lightboxImg = null"
      >
        <div class="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#070a13]">
          <img :src="imgUrl(lightboxImg)" :alt="lightboxImg.original_name" class="max-h-[70vh] w-full object-contain" />
          <div class="flex items-center justify-between gap-4 border-t border-white/10 px-6 py-4">
            <p class="truncate text-sm text-slate-300">{{ lightboxImg.original_name }}</p>
            <div class="flex gap-2 shrink-0">
              <button
                @click="deleteImage(lightboxImg!)"
                class="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20"
              >
                Supprimer
              </button>
              <button
                @click="lightboxImg = null"
                class="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </DashboardLayout>
</template>
