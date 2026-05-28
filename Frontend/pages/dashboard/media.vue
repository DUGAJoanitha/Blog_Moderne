<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useApi } from '~/composables/useApi'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({ middleware: 'auth' })

const api = useApi()
const config = useRuntimeConfig()

interface ArticleImage {
  id: number
  article_id: number
  path: string
  original_name: string
  url: string
  created_at: string
  article?: { id: number; title: string; slug: string }
}

interface Article {
  id: number
  title: string
  slug: string
  status: string
}

const images = ref<ArticleImage[]>([])
const articles = ref<Article[]>([])
const isLoadingImages = ref(true)
const isLoadingArticles = ref(true)
const isUploading = ref(false)
const errorMessage = ref('')
const uploadError = ref('')
const successMessage = ref('')

const selectedArticleId = ref<number | null>(null)
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const pendingFiles = ref<File[]>([])
const previewUrls = ref<string[]>([])

const lightboxImage = ref<ArticleImage | null>(null)
const deletingId = ref<number | null>(null)

const searchQuery = ref('')
const filterArticleId = ref<number | 'all'>('all')

const filteredImages = computed(() => {
  return images.value.filter(img => {
    const matchSearch = !searchQuery.value
      || img.original_name.toLowerCase().includes(searchQuery.value.toLowerCase())
      || img.article?.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchArticle = filterArticleId.value === 'all' || img.article_id === filterArticleId.value
    return matchSearch && matchArticle
  })
})

const totalSize = computed(() => {
  return images.value.length
})

const fetchImages = async () => {
  isLoadingImages.value = true
  errorMessage.value = ''
  try {
    const data = await api<ArticleImage[]>('/images')
    images.value = data
  } catch (e: any) {
    errorMessage.value = e?.data?.message || 'Impossible de charger les images.'
  } finally {
    isLoadingImages.value = false
  }
}

const fetchArticles = async () => {
  isLoadingArticles.value = true
  try {
    const data = await api<Article[]>('/admin/articles')
    articles.value = data
  } catch {
    articles.value = []
  } finally {
    isLoadingArticles.value = false
  }
}

const validateFile = (file: File): string | null => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowed.includes(file.type)) return 'Format non supporté (JPEG, PNG, GIF uniquement).'
  if (file.size > 5 * 1024 * 1024) return 'Fichier trop lourd (max 5 MB).'
  return null
}

const addFiles = (files: FileList | File[]) => {
  uploadError.value = ''
  const arr = Array.from(files)
  for (const file of arr) {
    const err = validateFile(file)
    if (err) { uploadError.value = err; return }
    if (pendingFiles.value.length >= 10) { uploadError.value = 'Maximum 10 fichiers à la fois.'; return }
    pendingFiles.value.push(file)
    previewUrls.value.push(URL.createObjectURL(file))
  }
}

const onFileInputChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files) addFiles(input.files)
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files) addFiles(e.dataTransfer.files)
}

const removePending = (index: number) => {
  URL.revokeObjectURL(previewUrls.value[index])
  pendingFiles.value.splice(index, 1)
  previewUrls.value.splice(index, 1)
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const clearPending = () => {
  previewUrls.value.forEach(u => URL.revokeObjectURL(u))
  pendingFiles.value = []
  previewUrls.value = []
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const uploadFiles = async () => {
  if (!selectedArticleId.value) {
    uploadError.value = 'Sélectionnez un article avant d\'importer.'
    return
  }
  if (pendingFiles.value.length === 0) {
    uploadError.value = 'Ajoutez au moins une image.'
    return
  }

  uploadError.value = ''
  successMessage.value = ''
  isUploading.value = true

  let uploaded = 0
  const errors: string[] = []

  for (const file of pendingFiles.value) {
    const formData = new FormData()
    formData.append('image', file)
    try {
      const img = await api<ArticleImage>(`/articles/${selectedArticleId.value}/images`, {
        method: 'POST',
        body: formData,
      })
      images.value.unshift(img)
      uploaded++
    } catch (e: any) {
      errors.push(e?.data?.message || `Erreur pour ${file.name}`)
    }
  }

  isUploading.value = false

  if (errors.length > 0) {
    uploadError.value = errors.join(' — ')
  }
  if (uploaded > 0) {
    successMessage.value = `${uploaded} image${uploaded > 1 ? 's' : ''} importée${uploaded > 1 ? 's' : ''} avec succès.`
    clearPending()
    selectedArticleId.value = null
    setTimeout(() => { successMessage.value = '' }, 4000)
  }
}

const deleteImage = async (image: ArticleImage) => {
  deletingId.value = image.id
  try {
    await api(`/images/${image.id}`, { method: 'DELETE' })
    images.value = images.value.filter(i => i.id !== image.id)
    if (lightboxImage.value?.id === image.id) lightboxImage.value = null
  } catch (e: any) {
    errorMessage.value = e?.data?.message || 'Impossible de supprimer l\'image.'
  } finally {
    deletingId.value = null
  }
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') lightboxImage.value = null
}

onMounted(() => {
  fetchImages()
  fetchArticles()
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  previewUrls.value.forEach(u => URL.revokeObjectURL(u))
})
</script>

<template>
  <DashboardLayout>

    <section class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20">

      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Médias</p>
          <h2 class="mt-3 text-3xl font-bold text-white">Bibliothèque multimédia</h2>
          <p class="mt-2 text-sm text-slate-400">Importez des images et associez-les à vos articles.</p>
        </div>
        <div class="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/60 px-5 py-3">
          <div class="h-2 w-2 rounded-full bg-blue-400"></div>
          <span class="text-sm text-slate-300">{{ totalSize }} image{{ totalSize !== 1 ? 's' : '' }}</span>
        </div>
      </div>

      <div v-if="successMessage" class="mt-6 flex items-center gap-3 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="mt-6 flex items-center gap-3 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ errorMessage }}
      </div>

      <div class="mt-8 grid gap-6 xl:grid-cols-[1fr_380px]">

        <div class="space-y-6">

          <div class="rounded-[2rem] border border-white/5 bg-slate-950/60 p-6">
            <p class="text-sm font-semibold text-white">Importer des images</p>
            <p class="mt-1 text-xs text-slate-400">JPEG, PNG, GIF — 5 MB max par fichier</p>

            <div
              class="mt-4 relative flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-8 text-center transition cursor-pointer"
              :class="isDragging
                ? 'border-blue-400 bg-blue-500/10'
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'"
              @click="fileInputRef?.click()"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onDrop"
            >
              <div class="flex h-14 w-14 items-center justify-center rounded-2xl" :class="isDragging ? 'bg-blue-500/20' : 'bg-white/5'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" :class="isDragging ? 'text-blue-400' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-white">
                  {{ isDragging ? 'Déposez ici' : 'Glissez vos images ou cliquez pour parcourir' }}
                </p>
                <p class="mt-1 text-xs text-slate-500">Plusieurs fichiers acceptés</p>
              </div>
              <input
                ref="fileInputRef"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                multiple
                class="absolute inset-0 opacity-0 cursor-pointer"
                @change="onFileInputChange"
                @click.stop
              />
            </div>

            <div v-if="pendingFiles.length > 0" class="mt-4 space-y-3">
              <div class="flex items-center justify-between">
                <p class="text-xs font-semibold text-slate-300">{{ pendingFiles.length }} fichier{{ pendingFiles.length > 1 ? 's' : '' }} sélectionné{{ pendingFiles.length > 1 ? 's' : '' }}</p>
                <button @click="clearPending" class="text-xs text-slate-500 hover:text-red-400 transition">Tout effacer</button>
              </div>
              <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                <div
                  v-for="(url, i) in previewUrls"
                  :key="i"
                  class="group relative aspect-square overflow-hidden rounded-2xl border border-white/10"
                >
                  <img :src="url" :alt="pendingFiles[i].name" class="h-full w-full object-cover" />
                  <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                    <button
                      @click.stop="removePending(i)"
                      class="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/80 text-white hover:bg-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p class="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-2 py-1 text-[10px] text-white">{{ pendingFiles[i].name }}</p>
                </div>
              </div>
            </div>

            <div v-if="uploadError" class="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              {{ uploadError }}
            </div>

            <div class="mt-5 space-y-3">
              <div class="space-y-1">
                <label class="text-xs font-semibold text-slate-300">Associer à un article <span class="text-red-400">*</span></label>
                <select
                  v-model="selectedArticleId"
                  class="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                  :disabled="isLoadingArticles"
                >
                  <option :value="null" disabled>{{ isLoadingArticles ? 'Chargement...' : 'Choisir un article' }}</option>
                  <option v-for="article in articles" :key="article.id" :value="article.id">
                    {{ article.title }}
                    <template v-if="article.status === 'draft'"> (brouillon)</template>
                  </option>
                </select>
              </div>

              <button
                @click="uploadFiles"
                :disabled="isUploading || pendingFiles.length === 0 || !selectedArticleId"
                class="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg v-if="isUploading" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {{ isUploading ? 'Import en cours...' : `Importer ${pendingFiles.length > 0 ? pendingFiles.length + ' fichier' + (pendingFiles.length > 1 ? 's' : '') : ''}` }}
              </button>
            </div>
          </div>

          <div class="rounded-[2rem] border border-white/5 bg-slate-950/60 p-6">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-sm font-semibold text-white">Toutes les images</p>
              <div class="flex gap-3">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Rechercher..."
                  class="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
                />
                <select
                  v-model="filterArticleId"
                  class="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-2 text-sm text-white outline-none focus:border-blue-400"
                >
                  <option value="all">Tous les articles</option>
                  <option v-for="article in articles" :key="article.id" :value="article.id">{{ article.title }}</option>
                </select>
              </div>
            </div>

            <div v-if="isLoadingImages" class="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-5">
              <div v-for="n in 10" :key="n" class="aspect-square animate-pulse rounded-2xl bg-white/5"></div>
            </div>

            <div v-else-if="filteredImages.length === 0" class="mt-6 rounded-3xl border border-dashed border-white/10 p-10 text-center">
              <p class="text-sm font-semibold text-white">Aucune image trouvée</p>
              <p class="mt-1 text-xs text-slate-400">Importez des images via le panneau ci-dessus.</p>
            </div>

            <div v-else class="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-5">
              <div
                v-for="image in filteredImages"
                :key="image.id"
                class="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 cursor-pointer"
                @click="lightboxImage = image"
              >
                <img
                  :src="image.url || `${config.public.apiBase.replace('/api', '')}/storage/${image.path}`"
                  :alt="image.original_name"
                  class="h-full w-full object-cover transition group-hover:scale-105"
                />
                <div class="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 p-2">
                  <button
                    @click.stop="deleteImage(image)"
                    :disabled="deletingId === image.id"
                    class="ml-auto flex h-7 w-7 items-center justify-center rounded-xl bg-red-500/80 text-white hover:bg-red-500 disabled:opacity-50"
                  >
                    <svg v-if="deletingId === image.id" class="h-3 w-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <p class="truncate text-[10px] text-white">{{ image.original_name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside class="space-y-4">
          <div class="rounded-[2rem] border border-white/5 bg-slate-950/60 p-6">
            <p class="text-sm font-semibold text-white">Par article</p>
            <div v-if="isLoadingArticles" class="mt-4 space-y-3">
              <div v-for="n in 4" :key="n" class="h-12 animate-pulse rounded-2xl bg-white/5"></div>
            </div>
            <div v-else-if="articles.length === 0" class="mt-4 text-xs text-slate-400">Aucun article trouvé.</div>
            <ul v-else class="mt-4 space-y-2">
              <li
                v-for="article in articles"
                :key="article.id"
                class="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 cursor-pointer transition hover:border-blue-500/20 hover:bg-blue-500/5"
                :class="filterArticleId === article.id ? 'border-blue-500/30 bg-blue-500/10' : ''"
                @click="filterArticleId = filterArticleId === article.id ? 'all' : article.id"
              >
                <div class="min-w-0">
                  <p class="truncate text-xs font-semibold text-white">{{ article.title }}</p>
                  <p class="text-[10px]" :class="article.status === 'published' ? 'text-emerald-400' : 'text-amber-400'">
                    {{ article.status === 'published' ? 'Publié' : 'Brouillon' }}
                  </p>
                </div>
                <span class="shrink-0 rounded-xl bg-white/10 px-2 py-1 text-xs font-semibold text-slate-300">
                  {{ images.filter(i => i.article_id === article.id).length }}
                </span>
              </li>
            </ul>
          </div>

          <div class="rounded-[2rem] border border-white/5 bg-slate-950/60 p-6">
            <p class="text-sm font-semibold text-white">Formats acceptés</p>
            <ul class="mt-4 space-y-2 text-xs text-slate-400">
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-blue-400"></span> JPEG / JPG
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-blue-400"></span> PNG
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-blue-400"></span> GIF
              </li>
              <li class="flex items-center gap-2 mt-3 text-slate-500">
                <span class="h-1.5 w-1.5 rounded-full bg-slate-600"></span> Taille max : 5 MB
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="lightboxImage"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        @click.self="lightboxImage = null"
      >
        <div class="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#070a13] shadow-2xl">
          <img
            :src="lightboxImage.url || `${config.public.apiBase.replace('/api', '')}/storage/${lightboxImage.path}`"
            :alt="lightboxImage.original_name"
            class="max-h-[70vh] w-full object-contain"
          />
          <div class="flex items-center justify-between gap-4 border-t border-white/10 px-6 py-4">
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-white">{{ lightboxImage.original_name }}</p>
              <p class="text-xs text-slate-400">
                {{ lightboxImage.article?.title || 'Article inconnu' }} · {{ formatDate(lightboxImage.created_at) }}
              </p>
            </div>
            <div class="flex shrink-0 gap-2">
              <button
                @click="deleteImage(lightboxImage!)"
                :disabled="deletingId === lightboxImage.id"
                class="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
              <button
                @click="lightboxImage = null"
                class="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
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
