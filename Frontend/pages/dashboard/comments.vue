<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({ middleware: 'auth' })

interface Comment {
  id: number
  content: string
  created_at: string
  user?: { id: number; name: string; email: string }
  article?: { id: number; title: string; slug: string }
}

interface Article {
  id: number
  title: string
  status: string
}

const api = useApi()

const allComments   = ref<Comment[]>([])
const articles      = ref<Article[]>([])
const selectedId    = ref<number | 'all'>('all')
const newContent    = ref('')
const editingId     = ref<number | null>(null)
const editContent   = ref('')
const deletingId    = ref<number | null>(null)
const isLoadingList = ref(true)
const isSubmitting  = ref(false)
const isSaving      = ref(false)
const toast         = ref<{ type: 'success' | 'error'; text: string } | null>(null)
const searchQuery   = ref('')

const showToast = (type: 'success' | 'error', text: string) => {
  toast.value = { type, text }
  setTimeout(() => { toast.value = null }, 3500)
}

const filteredComments = computed(() => {
  let list = allComments.value
  if (selectedId.value !== 'all') {
    list = list.filter(c => c.article?.id === selectedId.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c =>
      c.content.toLowerCase().includes(q) ||
      c.user?.name.toLowerCase().includes(q) ||
      c.article?.title.toLowerCase().includes(q)
    )
  }
  return list
})

const selectedArticle = computed(() =>
  selectedId.value !== 'all'
    ? articles.value.find(a => a.id === selectedId.value) ?? null
    : null
)

const fetchAll = async () => {
  isLoadingList.value = true
  try {
    const [comments, arts] = await Promise.all([
      api<Comment[]>('/admin/comments'),
      api<Article[]>('/admin/articles'),
    ])
    allComments.value = comments
    articles.value    = arts
  } catch {
    showToast('error', 'Impossible de charger les données.')
  } finally {
    isLoadingList.value = false
  }
}

const submitComment = async () => {
  if (!newContent.value.trim()) { showToast('error', 'Le commentaire ne peut pas être vide.'); return }
  if (selectedId.value === 'all') { showToast('error', 'Sélectionnez un article.'); return }

  isSubmitting.value = true
  try {
    const comment = await api<Comment>(`/articles/${selectedId.value}/comments`, {
      method: 'POST',
      body: { content: newContent.value.trim() },
    })
    comment.article = articles.value.find(a => a.id === selectedId.value) as any
    allComments.value.unshift(comment)
    newContent.value = ''
    showToast('success', 'Commentaire publié.')
  } catch (e: any) {
    showToast('error', e?.data?.message || 'Erreur lors de la publication.')
  } finally {
    isSubmitting.value = false
  }
}

const startEdit = (comment: Comment) => {
  editingId.value  = comment.id
  editContent.value = comment.content
}

const cancelEdit = () => {
  editingId.value  = null
  editContent.value = ''
}

const saveEdit = async (comment: Comment) => {
  if (!editContent.value.trim()) return
  isSaving.value = true
  try {
    await api(`/comments/${comment.id}`, {
      method: 'PUT',
      body: { content: editContent.value.trim() },
    })
    const idx = allComments.value.findIndex(c => c.id === comment.id)
    if (idx !== -1) allComments.value[idx].content = editContent.value.trim()
    cancelEdit()
    showToast('success', 'Commentaire modifié.')
  } catch (e: any) {
    showToast('error', e?.data?.message || 'Erreur lors de la modification.')
  } finally {
    isSaving.value = false
  }
}

const deleteComment = async (comment: Comment) => {
  if (!confirm('Supprimer ce commentaire ?')) return
  deletingId.value = comment.id
  try {
    await api(`/comments/${comment.id}`, { method: 'DELETE' })
    allComments.value = allComments.value.filter(c => c.id !== comment.id)
    showToast('success', 'Commentaire supprimé.')
  } catch {
    showToast('error', 'Impossible de supprimer.')
  } finally {
    deletingId.value = null
  }
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

onMounted(fetchAll)
</script>

<template>
  <DashboardLayout>
    <div class="space-y-6">

      <!-- Toast -->
      <Transition name="slide-down">
        <div
          v-if="toast"
          class="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-medium shadow-xl backdrop-blur-sm"
          :class="toast.type === 'success'
            ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
            : 'border-red-500/30 bg-red-500/15 text-red-300'"
        >
          <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ toast.text }}
        </div>
      </Transition>

      <!-- Header -->
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Modération</p>
        <h1 class="mt-1 text-2xl font-bold text-white">Commentaires</h1>
      </div>

      <div class="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">

        <!-- Sidebar gauche -->
        <aside class="space-y-4">

          <!-- Nouveau commentaire -->
          <div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Nouveau commentaire</p>

            <div class="mt-4 space-y-3">
              <div>
                <label class="text-xs font-medium text-slate-400">Article cible</label>
                <select
                  v-model="selectedId"
                  class="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0a0f1d] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#2582FF]/50 focus:ring-2 focus:ring-[#2582FF]/15"
                >
                  <option value="all">— Tous les articles —</option>
                  <option v-for="a in articles" :key="a.id" :value="a.id">{{ a.title }}</option>
                </select>
              </div>

              <div>
                <label class="text-xs font-medium text-slate-400">Contenu</label>
                <textarea
                  v-model="newContent"
                  rows="4"
                  placeholder="Rédigez votre commentaire..."
                  class="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-[#0a0f1d] px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-[#2582FF]/50 focus:ring-2 focus:ring-[#2582FF]/15"
                ></textarea>
              </div>

              <button
                @click="submitComment"
                :disabled="isSubmitting || selectedId === 'all' || !newContent.trim()"
                class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#2582FF] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1A73E8] disabled:opacity-40 disabled:cursor-not-allowed btn-glow"
              >
                <svg v-if="isSubmitting" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Publier
              </button>
            </div>
          </div>

          <!-- Filtre par article -->
          <div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Filtrer par article</p>
            <ul class="mt-3 space-y-1">
              <li>
                <button
                  @click="selectedId = 'all'"
                  class="w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm transition"
                  :class="selectedId === 'all' ? 'bg-[#2582FF]/15 text-[#2582FF]' : 'text-slate-400 hover:bg-white/5 hover:text-white'"
                >
                  <span>Tous</span>
                  <span class="rounded-lg bg-white/10 px-2 py-0.5 text-xs font-semibold text-slate-300">{{ allComments.length }}</span>
                </button>
              </li>
              <li v-for="article in articles" :key="article.id">
                <button
                  @click="selectedId = article.id"
                  class="w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition"
                  :class="selectedId === article.id ? 'bg-[#2582FF]/15 text-[#2582FF]' : 'text-slate-400 hover:bg-white/5 hover:text-white'"
                >
                  <span class="truncate text-left">{{ article.title }}</span>
                  <span class="shrink-0 rounded-lg bg-white/10 px-2 py-0.5 text-xs font-semibold text-slate-300">
                    {{ allComments.filter(c => c.article?.id === article.id).length }}
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Liste des commentaires -->
        <div class="space-y-4">

          <!-- Barre de recherche + compteur -->
          <div class="flex items-center gap-3">
            <div class="relative flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un commentaire..."
                class="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#2582FF]/50 focus:ring-2 focus:ring-[#2582FF]/15"
              />
            </div>
            <span class="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-slate-400">
              {{ filteredComments.length }} résultat{{ filteredComments.length !== 1 ? 's' : '' }}
            </span>
          </div>

          <!-- Skeleton -->
          <div v-if="isLoadingList" class="space-y-3">
            <div v-for="n in 5" :key="n" class="h-24 animate-pulse rounded-2xl bg-white/5"></div>
          </div>

          <!-- Vide -->
          <div v-else-if="filteredComments.length === 0" class="rounded-2xl border border-dashed border-white/10 p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="mt-3 text-sm font-semibold text-white">Aucun commentaire</p>
            <p class="mt-1 text-xs text-slate-500">{{ searchQuery ? 'Aucun résultat pour cette recherche.' : 'Publiez le premier commentaire via le formulaire.' }}</p>
          </div>

          <!-- Liste -->
          <TransitionGroup v-else name="list" tag="div" class="space-y-3">
            <div
              v-for="comment in filteredComments"
              :key="comment.id"
              class="group rounded-2xl border border-white/8 bg-white/5 p-5 backdrop-blur-sm transition-all duration-200 hover:border-white/15"
            >
              <!-- Mode édition -->
              <div v-if="editingId === comment.id" class="space-y-3">
                <textarea
                  v-model="editContent"
                  rows="3"
                  class="w-full resize-none rounded-xl border border-[#2582FF]/30 bg-[#0a0f1d] px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#2582FF]/20"
                ></textarea>
                <div class="flex gap-2">
                  <button
                    @click="saveEdit(comment)"
                    :disabled="isSaving"
                    class="inline-flex items-center gap-1.5 rounded-xl bg-[#2582FF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1A73E8] disabled:opacity-50"
                  >
                    <svg v-if="isSaving" class="h-3 w-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Enregistrer
                  </button>
                  <button @click="cancelEdit" class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10">
                    Annuler
                  </button>
                </div>
              </div>

              <!-- Mode lecture -->
              <div v-else>
                <div class="flex items-start justify-between gap-4">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2582FF]/40 to-indigo-500/40 text-xs font-bold text-white">
                      {{ comment.user?.name?.charAt(0).toUpperCase() || '?' }}
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-white">{{ comment.user?.name || 'Anonyme' }}</p>
                      <p class="text-xs text-slate-500">{{ formatDate(comment.created_at) }}</p>
                    </div>
                  </div>

                  <div class="flex shrink-0 items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      @click="startEdit(comment)"
                      class="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2582FF]/20 bg-[#2582FF]/10 text-[#2582FF] transition hover:bg-[#2582FF]/20"
                      title="Modifier"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="deleteComment(comment)"
                      :disabled="deletingId === comment.id"
                      class="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                      title="Supprimer"
                    >
                      <svg v-if="deletingId === comment.id" class="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <p class="mt-3 text-sm leading-relaxed text-slate-300">{{ comment.content }}</p>

                <div v-if="comment.article" class="mt-3 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="text-xs text-slate-500">{{ comment.article.title }}</span>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
