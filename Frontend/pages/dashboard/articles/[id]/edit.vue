<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const api = useApi()
const config = useRuntimeConfig()

const title = ref('')
const content = ref('')
const status = ref<'draft' | 'published'>('draft')
const articleId = ref<number | null>(null)

const images = ref<{ id: number; path: string; url?: string; original_name: string }[]>([])
const imageFile = ref<File | null>(null)
const imagePreviewUrl = ref<string | null>(null)
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const isLoading = ref(true)
const isSubmitting = ref(false)
const isUploadingImg = ref(false)
const deletingImgId = ref<number | null>(null)
const successMessage = ref('')
const errorMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})

const titleLength = computed(() => title.value.length)

const imgUrl = (img: { path: string; url?: string }) =>
  img.url || `${config.public.apiBase.replace('/api', '')}/storage/${img.path}`

const fetchArticle = async () => {
  isLoading.value = true
  try {
    const data = await api<any>(`/admin/articles/${route.params.id}`)
    articleId.value = data.id
    title.value = data.title || ''
    content.value = data.content || ''
    status.value = data.status || 'draft'
    images.value = data.images || []
  } catch {
    errorMessage.value = 'Article introuvable.'
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  fieldErrors.value = {}

  const errors: Record<string, string> = {}
  if (!title.value.trim()) errors.title = 'Le titre est obligatoire.'
  else if (title.value.length > 255) errors.title = 'Maximum 255 caractères.'
  if (!content.value.trim()) errors.content = 'Le contenu est obligatoire.'
  if (Object.keys(errors).length) { fieldErrors.value = errors; return }

  isSubmitting.value = true
  try {
    await api(`/articles/${articleId.value}`, {
      method: 'PUT',
      body: { title: title.value.trim(), content: content.value.trim(), status: status.value },
    })
    successMessage.value = 'Article mis à jour avec succès.'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (error: any) {
    if (error?.data?.errors) {
      const e: Record<string, string[]> = error.data.errors
      for (const [f, m] of Object.entries(e)) fieldErrors.value[f] = m[0]
      errorMessage.value = 'Corrigez les erreurs ci-dessous.'
    } else {
      errorMessage.value = error?.data?.message || 'Impossible de mettre à jour.'
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleImageSelect = (file: File) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowed.includes(file.type)) { fieldErrors.value.image = 'Format non supporté (JPEG, PNG, GIF).'; return }
  if (file.size > 5 * 1024 * 1024) { fieldErrors.value.image = 'Max 5 MB.'; return }
  delete fieldErrors.value.image
  imageFile.value = file
  imagePreviewUrl.value = URL.createObjectURL(file)
}

const onFileChange = (e: Event) => {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) handleImageSelect(f)
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) handleImageSelect(f)
}

const uploadImage = async () => {
  if (!imageFile.value || !articleId.value) return
  isUploadingImg.value = true
  try {
    const fd = new FormData()
    fd.append('image', imageFile.value)
    const img = await api<any>(`/articles/${articleId.value}/images`, { method: 'POST', body: fd })
    images.value.push(img)
    imageFile.value = null
    if (imagePreviewUrl.value) { URL.revokeObjectURL(imagePreviewUrl.value); imagePreviewUrl.value = null }
    if (fileInputRef.value) fileInputRef.value.value = ''
  } catch (e: any) {
    fieldErrors.value.image = e?.data?.message || "Erreur lors de l'upload."
  } finally {
    isUploadingImg.value = false
  }
}

const removePreview = () => {
  imageFile.value = null
  if (imagePreviewUrl.value) { URL.revokeObjectURL(imagePreviewUrl.value); imagePreviewUrl.value = null }
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const deleteImage = async (img: { id: number }) => {
  if (!confirm('Supprimer cette image ?')) return
  deletingImgId.value = img.id
  try {
    await api(`/images/${img.id}`, { method: 'DELETE' })
    images.value = images.value.filter(i => i.id !== img.id)
  } catch {
    errorMessage.value = "Impossible de supprimer l'image."
  } finally {
    deletingImgId.value = null
  }
}

onMounted(fetchArticle)
</script>

<template>
  <DashboardLayout>
    <div class="space-y-6">

      <div class="flex items-center gap-3">
        <NuxtLink
          :to="`/dashboard/articles/${route.params.id}`"
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
        <p class="text-sm text-white">Modifier</p>
      </div>

      <div v-if="isLoading" class="space-y-4">
        <div class="h-64 animate-pulse rounded-[2rem] bg-white/5"></div>
      </div>

      <template v-else>

        <section class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20">
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Modifier l'article</p>
          <h2 class="mt-3 text-2xl font-bold text-white">Édition</h2>

          <div class="mt-4 space-y-3">
            <div v-if="successMessage" class="flex items-center gap-3 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">{{ errorMessage }}</div>
          </div>

          <form class="mt-6 space-y-5" @submit.prevent="handleSubmit">

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-sm font-semibold text-white">Titre <span class="text-red-400">*</span></label>
                <span class="text-xs" :class="titleLength > 255 ? 'text-red-400' : 'text-slate-500'">{{ titleLength }} / 255</span>
              </div>
              <input
                v-model="title"
                type="text"
                @input="delete fieldErrors.title"
                class="w-full rounded-3xl border bg-slate-950/80 px-5 py-4 text-white placeholder-slate-500 outline-none transition focus:ring-4"
                :class="fieldErrors.title ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/10' : 'border-white/10 focus:border-blue-400 focus:ring-blue-500/10'"
              />
              <p v-if="fieldErrors.title" class="pl-2 text-xs text-red-400">{{ fieldErrors.title }}</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-white">Contenu <span class="text-red-400">*</span></label>
              <textarea
                v-model="content"
                rows="12"
                @input="delete fieldErrors.content"
                class="w-full rounded-3xl border bg-slate-950/80 px-5 py-4 text-white placeholder-slate-500 outline-none transition focus:ring-4 leading-relaxed"
                :class="fieldErrors.content ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/10' : 'border-white/10 focus:border-blue-400 focus:ring-blue-500/10'"
              ></textarea>
              <p v-if="fieldErrors.content" class="pl-2 text-xs text-red-400">{{ fieldErrors.content }}</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-white">Statut</label>
              <div class="flex gap-3">
                <button type="button" @click="status = 'draft'"
                  class="flex flex-1 items-center gap-3 rounded-2xl border p-4 transition"
                  :class="status === 'draft' ? 'border-amber-500/40 bg-amber-500/10' : 'border-white/10 bg-slate-950/80 hover:border-white/20'"
                >
                  <div class="h-2 w-2 rounded-full" :class="status === 'draft' ? 'bg-amber-400' : 'bg-slate-600'"></div>
                  <span class="text-sm font-semibold" :class="status === 'draft' ? 'text-amber-300' : 'text-white'">Brouillon</span>
                </button>
                <button type="button" @click="status = 'published'"
                  class="flex flex-1 items-center gap-3 rounded-2xl border p-4 transition"
                  :class="status === 'published' ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-white/10 bg-slate-950/80 hover:border-white/20'"
                >
                  <div class="h-2 w-2 rounded-full" :class="status === 'published' ? 'bg-emerald-400' : 'bg-slate-600'"></div>
                  <span class="text-sm font-semibold" :class="status === 'published' ? 'text-emerald-300' : 'text-white'">Publié</span>
                </button>
              </div>
            </div>

            <div class="flex justify-end gap-3 border-t border-white/5 pt-5">
              <NuxtLink
                :to="`/dashboard/articles/${route.params.id}`"
                class="inline-flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10"
              >
                Annuler
              </NuxtLink>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="inline-flex items-center gap-2 rounded-3xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
              >
                <svg v-if="isSubmitting" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </section>

        <section class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20">
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Images</p>
          <h2 class="mt-2 text-xl font-bold text-white">Gérer les images</h2>

          <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" v-if="images.length > 0">
            <div
              v-for="img in images"
              :key="img.id"
              class="group relative aspect-square overflow-hidden rounded-2xl border border-white/10"
            >
              <img :src="imgUrl(img)" :alt="img.original_name" class="h-full w-full object-cover transition group-hover:scale-105" />
              <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                <button
                  @click="deleteImage(img)"
                  :disabled="deletingImgId === img.id"
                  class="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/80 text-white hover:bg-red-500 disabled:opacity-50"
                >
                  <svg v-if="deletingImgId === img.id" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          <p v-else class="mt-4 text-sm text-slate-500">Aucune image associée à cet article.</p>

          <div class="mt-6 space-y-3">
            <p class="text-sm font-semibold text-white">Ajouter une image</p>

            <div v-if="!imagePreviewUrl"
              class="relative flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-8 text-center cursor-pointer transition"
              :class="isDragging ? 'border-blue-400 bg-blue-500/10' : 'border-white/10 bg-slate-950/40 hover:border-white/20'"
              @click="fileInputRef?.click()"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onDrop"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-sm text-slate-400">Glissez ou cliquez — JPEG, PNG, GIF · 5 MB max</p>
              <input ref="fileInputRef" type="file" accept="image/jpeg,image/png,image/gif" class="absolute inset-0 opacity-0 cursor-pointer" @change="onFileChange" @click.stop />
            </div>

            <div v-else class="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80">
              <img :src="imagePreviewUrl" alt="Aperçu" class="h-48 w-full object-cover" />
              <div class="flex items-center justify-between gap-3 px-5 py-4">
                <p class="truncate text-sm text-white">{{ imageFile?.name }}</p>
                <div class="flex gap-2 shrink-0">
                  <button @click="removePreview" class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 hover:bg-white/10">Annuler</button>
                  <button
                    @click="uploadImage"
                    :disabled="isUploadingImg"
                    class="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-400 disabled:opacity-50"
                  >
                    <svg v-if="isUploadingImg" class="h-3 w-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Uploader
                  </button>
                </div>
              </div>
            </div>

            <p v-if="fieldErrors.image" class="pl-2 text-xs text-red-400">{{ fieldErrors.image }}</p>
          </div>
        </section>

      </template>
    </div>
  </DashboardLayout>
</template>
