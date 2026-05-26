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
}

interface ArticlesResponse {
  data: Article[]
  total: number
}

const api = useApi()
const articles = ref<Article[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

const fetchArticles = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await api<ArticlesResponse>('/articles')
    articles.value = response.data || []
  } catch (error: any) {
    console.error(error)
    errorMessage.value = 'Impossible de charger les articles. Assurez-vous que le backend est démarré.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchArticles)
</script>

<template>
  <DashboardLayout>
    <section class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Articles</p>
          <h2 class="mt-3 text-3xl font-bold text-white">Gestion des articles</h2>
          <p class="mt-2 text-sm leading-6 text-slate-400">Consultez, publiez et mettez à jour vos contenus depuis cette page.</p>
        </div>
        <NuxtLink to="/dashboard/articles/create" class="inline-flex items-center justify-center rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">Publier un article</NuxtLink>
      </div>

      <div class="mt-8 space-y-6">
        <div v-if="isLoading" class="grid gap-6 lg:grid-cols-2">
          <div v-for="n in 3" :key="n" class="h-56 animate-pulse rounded-[2rem] bg-white/5"></div>
        </div>

        <div v-else-if="errorMessage" class="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">{{ errorMessage }}</div>

        <div v-else-if="articles.length === 0" class="rounded-[2rem] border border-white/5 bg-slate-950/80 p-8 text-center text-slate-300">
          <p class="text-lg font-semibold text-white">Aucun article publié pour le moment.</p>
          <p class="mt-2 text-sm">Créez votre premier article pour qu’il apparaisse sur la page d’accueil.</p>
        </div>

        <div v-else class="grid gap-6 lg:grid-cols-2">
          <article v-for="article in articles" :key="article.id" class="rounded-[2rem] border border-white/5 bg-slate-950/80 p-6 transition hover:border-blue-500/20 hover:bg-slate-950/90">
            <div class="flex items-center justify-between gap-4">
              <p class="text-xs uppercase tracking-[0.28em] text-slate-400">{{ article.status }}</p>
              <span class="text-xs text-slate-500">{{ new Date(article.published_at || Date.now()).toLocaleDateString('fr-FR') }}</span>
            </div>
            <h3 class="mt-4 text-xl font-semibold text-white">{{ article.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-slate-400 line-clamp-4">{{ article.content }}</p>
            <div class="mt-6 flex items-center justify-between text-xs text-slate-400">
              <span>Par {{ article.user?.name || 'Auteur' }}</span>
              <NuxtLink :to="`/articles/${article.slug}`" class="text-blue-300 hover:text-blue-200">Voir l’article</NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>
