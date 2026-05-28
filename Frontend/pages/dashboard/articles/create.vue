<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({ middleware: 'auth' })

const api = useApi()
const config = useRuntimeConfig()
const router = useRouter()

// Champs du formulaire
const title = ref('')
const content = ref('')
const excerpt = ref('')
const status = ref<'draft' | 'published'>('draft')

// Image
const imageFile = ref<File | null>(null)
const imagePreviewUrl = ref<string | null>(null)
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

// État
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})

// Compteurs
const titleLength = computed(() => title.value.length)
const contentLength = computed(() => content.value.length)
const excerptLength = computed(() => excerpt.value.length)

// Aperçu du slug
const slugPreview = computed(() =>
  title.value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
)

// Taille lisible de l'image
const imageSize = computed(() => {
  if (!imageFile.value) return ''
  const bytes = imageFile.value.size
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
})

const clearFieldError = (field: string) => {
  if (fieldErrors.value[field]) delete fieldErrors.value[field]
}

// Gestion de l'image sélectionnée
const handleImageSelect = (file: File) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowed.includes(file.type)) {
    fieldErrors.value.image = 'Format non supporté. Utilisez JPEG, PNG ou GIF.'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    fieldErrors.value.image = "L'image ne doit pas dépasser 5 MB."
    return
  }
  delete fieldErrors.value.image
  imageFile.value = file
  imagePreviewUrl.value = URL.createObjectURL(file)
}

const onFileInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) handleImageSelect(input.files[0])
}

const onDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) handleImageSelect(file)
}

const removeImage = () => {
  imageFile.value = null
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value)
    imagePreviewUrl.value = null
  }
  if (fileInputRef.value) fileInputRef.value.value = ''
}

// Soumission
const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  fieldErrors.value = {}

  // Validation client
  const errors: Record<string, string> = {}
  if (!title.value.trim()) errors.title = 'Le titre est obligatoire.'
  else if (title.value.length > 255) errors.title = 'Le titre ne peut pas dépasser 255 caractères.'
  if (!content.value.trim()) errors.content = 'Le contenu est obligatoire.'
  if (excerpt.value.length > 500) errors.excerpt = "L'extrait ne peut pas dépasser 500 caractères."

  if (Object.keys(errors).length > 0) {
    fieldErrors.value = errors
    return
  }

  isSubmitting.value = true

  try {
    // 1. Créer l'article
    const body: Record<string, string> = {
      title: title.value.trim(),
      content: content.value.trim(),
      status: status.value,
    }
    if (excerpt.value.trim()) body.excerpt = excerpt.value.trim()

    const article = await api<{ id: number }>('/articles', {
      method: 'POST',
      body,
    })

    // 2. Uploader l'image si présente
    if (imageFile.value && article?.id) {
      const formData = new FormData()
      formData.append('image', imageFile.value)

      await api(`/articles/${article.id}/images`, {
        method: 'POST',
        body: formData,
      })
    }

    successMessage.value = status.value === 'published'
      ? 'Article publié avec succès !'
      : 'Brouillon enregistré avec succès !'

    setTimeout(() => router.push('/dashboard/articles'), 1500)
  } catch (error: any) {
    console.error(error)
    if (error?.data?.errors) {
      const laravelErrors: Record<string, string[]> = error.data.errors
      for (const [field, messages] of Object.entries(laravelErrors)) {
        fieldErrors.value[field] = messages[0]
      }
      errorMessage.value = 'Veuillez corriger les erreurs ci-dessous.'
    } else {
      errorMessage.value = error?.data?.message || "Impossible de publier l'article. Vérifiez votre connexion."
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleSaveDraft = () => { status.value = 'draft'; handleSubmit() }
const handlePublish = () => { status.value = 'published'; handleSubmit() }
</script>

<template>
  <DashboardLayout>
    <section class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20">

      <!-- En-tête -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Nouvel article</p>
          <h2 class="mt-3 text-3xl font-bold text-white">Rédiger un article</h2>
          <p class="mt-2 text-sm text-slate-400">Remplissez les champs ci-dessous puis enregistrez en brouillon ou publiez directement.</p>
        </div>
        <NuxtLink
          to="/dashboard/articles"
          class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux articles
        </NuxtLink>
      </div>

      <!-- Messages globaux -->
      <div class="mt-6 space-y-3">
        <div v-if="successMessage" class="flex items-center gap-3 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm text-emerald-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {{ successMessage }}
          <span class="ml-auto text-xs text-emerald-300/70">Redirection en cours...</span>
        </div>
        <div v-if="errorMessage" class="flex items-center gap-3 rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ errorMessage }}
        </div>
      </div>

      <!-- Formulaire -->
      <form class="mt-8 space-y-6" @submit.prevent>

        <!-- Titre -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label for="title" class="text-sm font-semibold text-white">
              Titre <span class="text-red-400">*</span>
            </label>
            <span class="text-xs" :class="titleLength > 255 ? 'text-red-400' : 'text-slate-500'">
              {{ titleLength }} / 255
            </span>
          </div>
          <input
            id="title"
            v-model="title"
            type="text"
            placeholder="Donnez un titre accrocheur à votre article..."
            autocomplete="off"
            @input="clearFieldError('title')"
            class="w-full rounded-3xl border bg-slate-950/80 px-5 py-4 text-white placeholder-slate-500 outline-none transition focus:ring-4"
            :class="fieldErrors.title ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/10' : 'border-white/10 focus:border-blue-400 focus:ring-blue-500/10'"
          />
          <p v-if="fieldErrors.title" class="pl-2 text-xs text-red-400">{{ fieldErrors.title }}</p>
          <p v-else-if="slugPreview" class="pl-2 text-xs text-slate-500">
            Slug : <span class="text-slate-400">{{ slugPreview }}</span>
          </p>
        </div>

        <!-- Extrait -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label for="excerpt" class="text-sm font-semibold text-white">
              Extrait
              <span class="ml-1 text-xs font-normal text-slate-400">(optionnel)</span>
            </label>
            <span class="text-xs" :class="excerptLength > 500 ? 'text-red-400' : 'text-slate-500'">
              {{ excerptLength }} / 500
            </span>
          </div>
          <textarea
            id="excerpt"
            v-model="excerpt"
            rows="2"
            placeholder="Un court résumé affiché dans les listes d'articles..."
            @input="clearFieldError('excerpt')"
            class="w-full resize-none rounded-3xl border bg-slate-950/80 px-5 py-4 text-white placeholder-slate-500 outline-none transition focus:ring-4"
            :class="fieldErrors.excerpt ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/10' : 'border-white/10 focus:border-blue-400 focus:ring-blue-500/10'"
          ></textarea>
          <p v-if="fieldErrors.excerpt" class="pl-2 text-xs text-red-400">{{ fieldErrors.excerpt }}</p>
        </div>

        <!-- Contenu -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label for="content" class="text-sm font-semibold text-white">
              Contenu <span class="text-red-400">*</span>
            </label>
            <span class="text-xs text-slate-500">{{ contentLength }} caractères</span>
          </div>
          <textarea
            id="content"
            v-model="content"
            rows="14"
            placeholder="Rédigez votre article ici..."
            @input="clearFieldError('content')"
            class="w-full rounded-3xl border bg-slate-950/80 px-5 py-4 text-white placeholder-slate-500 outline-none transition focus:ring-4 leading-relaxed"
            :class="fieldErrors.content ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/10' : 'border-white/10 focus:border-blue-400 focus:ring-blue-500/10'"
          ></textarea>
          <p v-if="fieldErrors.content" class="pl-2 text-xs text-red-400">{{ fieldErrors.content }}</p>
        </div>

        <!-- Image de couverture -->
        <div class="space-y-3">
          <label class="text-sm font-semibold text-white">
            Image de couverture
            <span class="ml-1 text-xs font-normal text-slate-400">(optionnel — JPEG, PNG, GIF · max 5 MB)</span>
          </label>

          <!-- Zone de drop / aperçu -->
          <div
            v-if="!imagePreviewUrl"
            class="relative flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-10 text-center transition cursor-pointer"
            :class="isDragging
              ? 'border-blue-400 bg-blue-500/10'
              : fieldErrors.image
                ? 'border-red-500/40 bg-red-500/5 hover:border-red-400/60'
                : 'border-white/10 bg-slate-950/40 hover:border-white/20 hover:bg-slate-950/60'"
            @click="fileInputRef?.click()"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
          >
            <!-- Icône -->
            <div class="flex h-16 w-16 items-center justify-center rounded-2xl" :class="isDragging ? 'bg-blue-500/20' : 'bg-white/5'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" :class="isDragging ? 'text-blue-400' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <div>
              <p class="text-sm font-semibold text-white">
                {{ isDragging ? 'Déposez l\'image ici' : 'Glissez une image ou cliquez pour parcourir' }}
              </p>
              <p class="mt-1 text-xs text-slate-400">JPEG, PNG, GIF — 5 MB maximum</p>
            </div>

            <span class="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10">
              Choisir un fichier
            </span>

            <!-- Input caché -->
            <input
              ref="fileInputRef"
              type="file"
              accept="image/jpeg,image/png,image/gif"
              class="absolute inset-0 opacity-0 cursor-pointer"
              @change="onFileInputChange"
              @click.stop
            />
          </div>

          <!-- Aperçu de l'image sélectionnée -->
          <div v-else class="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80">
            <img
              :src="imagePreviewUrl"
              alt="Aperçu de l'image"
              class="h-56 w-full object-cover"
            />
            <!-- Overlay avec infos -->
            <div class="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4">
              <div class="flex items-center gap-3 min-w-0">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-white">{{ imageFile?.name }}</p>
                  <p class="text-xs text-slate-400">{{ imageSize }}</p>
                </div>
              </div>
              <button
                type="button"
                @click="removeImage"
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                title="Supprimer l'image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <p v-if="fieldErrors.image" class="pl-2 text-xs text-red-400">{{ fieldErrors.image }}</p>
        </div>

        <!-- Statut -->
        <div class="space-y-3">
          <label class="text-sm font-semibold text-white">Statut de publication</label>
          <div class="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              @click="status = 'draft'"
              class="flex flex-1 items-center gap-4 rounded-3xl border p-4 text-left transition"
              :class="status === 'draft' ? 'border-amber-500/40 bg-amber-500/10' : 'border-white/10 bg-slate-950/80 hover:border-white/20'"
            >
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" :class="status === 'draft' ? 'bg-amber-500/20' : 'bg-white/5'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="status === 'draft' ? 'text-amber-400' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold" :class="status === 'draft' ? 'text-amber-300' : 'text-white'">Brouillon</p>
                <p class="text-xs text-slate-400">Enregistré, non visible publiquement</p>
              </div>
              <div v-if="status === 'draft'" class="ml-auto h-2 w-2 rounded-full bg-amber-400"></div>
            </button>

            <button
              type="button"
              @click="status = 'published'"
              class="flex flex-1 items-center gap-4 rounded-3xl border p-4 text-left transition"
              :class="status === 'published' ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-white/10 bg-slate-950/80 hover:border-white/20'"
            >
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" :class="status === 'published' ? 'bg-emerald-500/20' : 'bg-white/5'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="status === 'published' ? 'text-emerald-400' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold" :class="status === 'published' ? 'text-emerald-300' : 'text-white'">Publié</p>
                <p class="text-xs text-slate-400">Visible immédiatement sur le blog</p>
              </div>
              <div v-if="status === 'published'" class="ml-auto h-2 w-2 rounded-full bg-emerald-400"></div>
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-3 border-t border-white/5 pt-6 sm:flex-row sm:justify-end">
          <NuxtLink
            to="/dashboard/articles"
            class="inline-flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Annuler
          </NuxtLink>
          <button
            type="button"
            @click="handleSaveDraft"
            :disabled="isSubmitting"
            class="inline-flex items-center justify-center gap-2 rounded-3xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-50"
          >
            <svg v-if="isSubmitting && status === 'draft'" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Enregistrer le brouillon
          </button>
          <button
            type="button"
            @click="handlePublish"
            :disabled="isSubmitting"
            class="inline-flex items-center justify-center gap-2 rounded-3xl bg-blue-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
          >
            <svg v-if="isSubmitting && status === 'published'" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Publier l'article
          </button>
        </div>

      </form>
    </section>
  </DashboardLayout>
</template>
