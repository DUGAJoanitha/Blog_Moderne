<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({ middleware: 'auth' })

interface Article {
  id: number
  title: string
}

const api = useApi()
const articles = ref<Article[]>([])
const selectedArticleId = ref<number | null>(null)
const content = ref('')
const message = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const fetchArticles = async () => {
  try {
    const response = await api<{ data: Article[] }>('/articles')
    articles.value = response.data || []
    if (!selectedArticleId.value && articles.value.length > 0) {
      selectedArticleId.value = articles.value[0].id
    }
  } catch (error: any) {
    errorMessage.value = 'Impossible de charger les articles. Vérifiez le backend.'
  }
}

const submitComment = async () => {
  errorMessage.value = ''
  message.value = ''

  if (!selectedArticleId.value) {
    errorMessage.value = 'Sélectionnez d’abord un article.'
    return
  }

  if (!content.value.trim()) {
    errorMessage.value = 'Le commentaire ne peut pas être vide.'
    return
  }

  isSubmitting.value = true

  try {
    const response = await api(`/articles/${selectedArticleId.value}/comments`, {
      method: 'POST',
      body: { content: content.value }
    })
    message.value = 'Commentaire ajouté avec succès.'
    content.value = ''
    console.log(response)
  } catch (error: any) {
    errorMessage.value = error?.data?.message || 'Impossible d’ajouter le commentaire.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchArticles)
</script>

<template>
  <DashboardLayout>
    <section class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Commentaires</p>
          <h2 class="mt-3 text-3xl font-bold text-white">Modération des commentaires</h2>
          <p class="mt-2 text-sm leading-6 text-slate-400">Ajoutez un commentaire sur un article existant directement depuis l’interface.</p>
        </div>
        <NuxtLink to="/dashboard" class="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10">Retour au tableau de bord</NuxtLink>
      </div>

      <div class="mt-8 grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div class="rounded-[2rem] border border-white/5 bg-slate-950/80 p-8">
          <label class="block text-sm font-semibold text-slate-300">Article</label>
          <select v-model="selectedArticleId" class="mt-4 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10">
            <option v-for="article in articles" :key="article.id" :value="article.id">{{ article.title }}</option>
          </select>

          <p class="mt-6 text-sm leading-6 text-slate-400">Les commentaires sont créés via l’API Laravel et associés à l’article sélectionné.</p>
        </div>

        <div class="rounded-[2rem] border border-white/5 bg-white/5 p-8">
          <label class="block text-sm font-semibold text-slate-300">Nouveau commentaire</label>
          <textarea v-model="content" rows="7" placeholder="Rédigez votre commentaire..." class="mt-4 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"></textarea>
          <button @click.prevent="submitComment" :disabled="isSubmitting" class="mt-6 inline-flex items-center justify-center rounded-3xl bg-blue-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50">Publier le commentaire</button>

          <div class="mt-5 space-y-3">
            <p v-if="message" class="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">{{ message }}</p>
            <p v-if="errorMessage" class="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>
