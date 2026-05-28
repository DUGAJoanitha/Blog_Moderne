<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({ middleware: 'auth' })

interface Subscriber {
  id: number
  email: string
  active: boolean
  created_at: string
}

const api = useApi()

const subscribers   = ref<Subscriber[]>([])
const isLoading     = ref(true)
const isSubmitting  = ref(false)
const togglingId    = ref<number | null>(null)
const deletingId    = ref<number | null>(null)
const toast         = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const email         = ref('')
const emailError    = ref('')
const filterStatus  = ref<'all' | 'active' | 'inactive'>('all')
const searchQuery   = ref('')

const showToast = (type: 'success' | 'error', text: string) => {
  toast.value = { type, text }
  setTimeout(() => { toast.value = null }, 3500)
}

const filteredSubscribers = computed(() => {
  let list = subscribers.value
  if (filterStatus.value === 'active')   list = list.filter(s => s.active)
  if (filterStatus.value === 'inactive') list = list.filter(s => !s.active)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(s => s.email.toLowerCase().includes(q))
  }
  return list
})

const activeCount   = computed(() => subscribers.value.filter(s => s.active).length)
const inactiveCount = computed(() => subscribers.value.filter(s => !s.active).length)

const fetchSubscribers = async () => {
  isLoading.value = true
  try {
    subscribers.value = await api<Subscriber[]>('/admin/newsletters')
  } catch {
    showToast('error', 'Impossible de charger les abonnés.')
  } finally {
    isLoading.value = false
  }
}

const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

const subscribe = async () => {
  emailError.value = ''
  if (!email.value.trim()) { emailError.value = "L'email est requis."; return }
  if (!validateEmail(email.value)) { emailError.value = 'Adresse email invalide.'; return }

  isSubmitting.value = true
  try {
    const res = await api<{ message: string; data: Subscriber }>('/newsletter/subscribe', {
      method: 'POST',
      body: { email: email.value.trim() },
    })
    subscribers.value.unshift(res.data)
    email.value = ''
    showToast('success', res.message || 'Inscription réussie.')
  } catch (e: any) {
    emailError.value = e?.data?.message || "Cet email est déjà inscrit ou une erreur s'est produite."
  } finally {
    isSubmitting.value = false
  }
}

const unsubscribeByEmail = async () => {
  emailError.value = ''
  if (!email.value.trim()) { emailError.value = "L'email est requis."; return }
  if (!validateEmail(email.value)) { emailError.value = 'Adresse email invalide.'; return }

  isSubmitting.value = true
  try {
    const res = await api<{ message: string }>('/newsletter/unsubscribe', {
      method: 'POST',
      body: { email: email.value.trim() },
    })
    const idx = subscribers.value.findIndex(s => s.email === email.value.trim())
    if (idx !== -1) subscribers.value[idx].active = false
    email.value = ''
    showToast('success', res.message || 'Désinscription réussie.')
  } catch (e: any) {
    emailError.value = e?.data?.message || 'Email introuvable dans la liste.'
  } finally {
    isSubmitting.value = false
  }
}

const toggleSubscriber = async (sub: Subscriber) => {
  togglingId.value = sub.id
  try {
    const res = await api<{ data: Subscriber }>(`/admin/newsletters/${sub.id}/toggle`, { method: 'PATCH' })
    const idx = subscribers.value.findIndex(s => s.id === sub.id)
    if (idx !== -1) subscribers.value[idx].active = res.data.active
    showToast('success', res.data.active ? 'Abonné réactivé.' : 'Abonné désactivé.')
  } catch {
    showToast('error', 'Impossible de modifier le statut.')
  } finally {
    togglingId.value = null
  }
}

const deleteSubscriber = async (sub: Subscriber) => {
  if (!confirm(`Supprimer définitivement ${sub.email} ?`)) return
  deletingId.value = sub.id
  try {
    await api(`/admin/newsletters/${sub.id}`, { method: 'DELETE' })
    subscribers.value = subscribers.value.filter(s => s.id !== sub.id)
    showToast('success', 'Abonné supprimé.')
  } catch {
    showToast('error', 'Impossible de supprimer.')
  } finally {
    deletingId.value = null
  }
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

onMounted(fetchSubscribers)
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
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Abonnés</p>
        <h1 class="mt-1 text-2xl font-bold text-white">Newsletter</h1>
      </div>

      <!-- Stats rapides -->
      <div class="grid grid-cols-3 gap-4">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <p class="text-xs text-slate-500">Total</p>
          <p class="mt-1 text-2xl font-extrabold text-white">{{ subscribers.length }}</p>
        </div>
        <div class="rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-4">
          <p class="text-xs text-emerald-500">Actifs</p>
          <p class="mt-1 text-2xl font-extrabold text-emerald-400">{{ activeCount }}</p>
        </div>
        <div class="rounded-2xl border border-slate-500/20 bg-white/3 p-4">
          <p class="text-xs text-slate-500">Inactifs</p>
          <p class="mt-1 text-2xl font-extrabold text-slate-400">{{ inactiveCount }}</p>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">

        <!-- Formulaire d'abonnement -->
        <aside class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Gérer un abonné</p>
          <p class="mt-2 text-xs text-slate-500">Inscrivez ou désinscrivez une adresse email.</p>

          <div class="mt-5 space-y-3">
            <div>
              <label class="text-xs font-medium text-slate-400">Adresse email</label>
              <input
                v-model="email"
                type="email"
                placeholder="email@exemple.com"
                @input="emailError = ''"
                class="mt-1.5 w-full rounded-xl border bg-[#0a0f1d] px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:ring-2"
                :class="emailError
                  ? 'border-red-500/40 focus:border-red-400 focus:ring-red-500/15'
                  : 'border-white/10 focus:border-[#2582FF]/50 focus:ring-[#2582FF]/15'"
              />
              <Transition name="slide-down">
                <p v-if="emailError" class="mt-1.5 pl-1 text-xs text-red-400">{{ emailError }}</p>
              </Transition>
            </div>

            <button
              @click="subscribe"
              :disabled="isSubmitting"
              class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#2582FF] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1A73E8] disabled:opacity-40 btn-glow"
            >
              <svg v-if="isSubmitting" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              S'inscrire
            </button>

            <button
              @click="unsubscribeByEmail"
              :disabled="isSubmitting"
              class="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/15 disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Se désinscrire
            </button>
          </div>
        </aside>

        <!-- Liste des abonnés -->
        <div class="space-y-4">

          <!-- Filtres + recherche -->
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div class="relative flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un email..."
                class="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#2582FF]/50 focus:ring-2 focus:ring-[#2582FF]/15"
              />
            </div>
            <div class="flex rounded-xl border border-white/10 bg-white/5 p-1">
              <button
                v-for="opt in [{ val: 'all', label: 'Tous' }, { val: 'active', label: 'Actifs' }, { val: 'inactive', label: 'Inactifs' }]"
                :key="opt.val"
                @click="filterStatus = opt.val as any"
                class="rounded-lg px-3 py-1.5 text-xs font-medium transition"
                :class="filterStatus === opt.val ? 'bg-[#2582FF]/20 text-[#2582FF]' : 'text-slate-400 hover:text-white'"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- Skeleton -->
          <div v-if="isLoading" class="space-y-2">
            <div v-for="n in 6" :key="n" class="h-14 animate-pulse rounded-xl bg-white/5"></div>
          </div>

          <!-- Vide -->
          <div v-else-if="filteredSubscribers.length === 0" class="rounded-2xl border border-dashed border-white/10 p-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p class="mt-3 text-sm font-semibold text-white">Aucun abonné</p>
            <p class="mt-1 text-xs text-slate-500">{{ searchQuery ? 'Aucun résultat.' : 'Inscrivez le premier abonné via le formulaire.' }}</p>
          </div>

          <!-- Tableau -->
          <div v-else class="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div class="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-white/8 px-5 py-3">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</p>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Statut</p>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Date</p>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</p>
            </div>

            <TransitionGroup name="list" tag="div">
              <div
                v-for="sub in filteredSubscribers"
                :key="sub.id"
                class="group grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-white/5 px-5 py-3.5 last:border-0 transition-colors hover:bg-white/3"
              >
                <p class="truncate text-sm text-white">{{ sub.email }}</p>

                <span
                  class="rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                  :class="sub.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-400'"
                >
                  {{ sub.active ? 'Actif' : 'Inactif' }}
                </span>

                <p class="text-xs text-slate-500">{{ formatDate(sub.created_at) }}</p>

                <div class="flex items-center gap-1.5">
                  <button
                    @click="toggleSubscriber(sub)"
                    :disabled="togglingId === sub.id"
                    class="flex h-7 w-7 items-center justify-center rounded-lg border transition disabled:opacity-50"
                    :class="sub.active
                      ? 'border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                      : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'"
                    :title="sub.active ? 'Désactiver' : 'Réactiver'"
                  >
                    <svg v-if="togglingId === sub.id" class="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <svg v-else-if="sub.active" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <button
                    @click="deleteSubscriber(sub)"
                    :disabled="deletingId === sub.id"
                    class="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                    title="Supprimer"
                  >
                    <svg v-if="deletingId === sub.id" class="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
