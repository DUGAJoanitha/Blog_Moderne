<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()

const api = useApi()
const isLoading = ref(true)
const errorMessage = ref('')
const articlesCount = ref(0)
const summary = ref({ newsletters: 14, comments: 32, media: 8 })

const fetchSummary = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await api<{ data: unknown[] }>('/articles')
    articlesCount.value = Array.isArray(response.data) ? response.data.length : 0
  } catch (error: any) {
    errorMessage.value = 'Impossible de charger les statistiques. Assurez-vous que le backend est démarré.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchSummary)
</script>

<template>
  <DashboardLayout>
    <section class="grid gap-6 xl:grid-cols-2">
      <div class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20">
        <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Résumé rapide</p>
        <h2 class="mt-4 text-3xl font-bold text-white">Vue d’ensemble</h2>
        <p class="mt-3 text-sm leading-6 text-slate-300">Tous vos contenus et activités sont accessibles depuis l’espace de gestion.</p>

        <div class="mt-8 grid gap-4 sm:grid-cols-2">
          <div class="rounded-3xl border border-white/5 bg-slate-950/80 p-5">
            <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Articles publiés</p>
            <p class="mt-4 text-4xl font-extrabold text-white">{{ articlesCount }}</p>
          </div>
          <div class="rounded-3xl border border-white/5 bg-slate-950/80 p-5">
            <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Newsletters</p>
            <p class="mt-4 text-4xl font-extrabold text-white">{{ summary.newsletters }}</p>
          </div>
          <div class="rounded-3xl border border-white/5 bg-slate-950/80 p-5">
            <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Commentaires</p>
            <p class="mt-4 text-4xl font-extrabold text-white">{{ summary.comments }}</p>
          </div>
          <div class="rounded-3xl border border-white/5 bg-slate-950/80 p-5">
            <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Médias</p>
            <p class="mt-4 text-4xl font-extrabold text-white">{{ summary.media }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20">
        <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Actions rapides</p>
        <h2 class="mt-4 text-3xl font-bold text-white">Créer et gérer</h2>
        <p class="mt-3 text-sm leading-6 text-slate-300">Publiez un nouvel article, gérez les newsletters et suivez les commentaires depuis un seul endroit.</p>

        <div class="mt-8 grid gap-4">
          <NuxtLink to="/dashboard/articles" class="rounded-2xl bg-blue-500/10 px-5 py-4 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20">Voir les articles</NuxtLink>
          <NuxtLink to="/dashboard/articles/create" class="rounded-2xl bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20">Publier un article</NuxtLink>
          <NuxtLink to="/dashboard/newsletters" class="rounded-2xl bg-violet-500/10 px-5 py-4 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20">Gérer la newsletter</NuxtLink>
          <NuxtLink to="/dashboard/comments" class="rounded-2xl bg-sky-500/10 px-5 py-4 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20">Modérer les commentaires</NuxtLink>
        </div>
      </div>
    </section>

    <section class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h3 class="text-2xl font-bold text-white">Dernières informations</h3>
          <p class="mt-2 text-sm text-slate-400">La gestion du contenu est centralisée ici, avec des actions rapides et des statistiques immédiates.</p>
        </div>
        <button @click="fetchSummary" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-blue-300/40 hover:text-white">Actualiser</button>
      </div>

      <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-3xl border border-white/5 bg-slate-950/80 p-6">
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Connexion</p>
          <p class="mt-4 text-lg text-white">{{ isLoading ? 'Chargement...' : 'Backend prêt' }}</p>
        </div>
        <div class="rounded-3xl border border-white/5 bg-slate-950/80 p-6">
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Espace</p>
          <p class="mt-4 text-lg text-white">Administration éditoriale</p>
        </div>
        <div class="rounded-3xl border border-white/5 bg-slate-950/80 p-6">
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Utilisateur</p>
          <p class="mt-4 text-lg text-white">{{ authStore.user?.name }}</p>
        </div>
        <div class="rounded-3xl border border-white/5 bg-slate-950/80 p-6">
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Retour</p>
          <p class="mt-4 text-lg text-white">Commencez par publier un article.</p>
        </div>
      </div>
    </section>

    <div v-if="errorMessage" class="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">{{ errorMessage }}</div>
  </DashboardLayout>
</template>
