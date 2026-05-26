<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({ middleware: 'auth' })

const api = useApi()
const title = ref('')
const content = ref('')
const status = ref('draft')
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!title.value.trim() || !content.value.trim()) {
    errorMessage.value = 'Le titre et le contenu sont obligatoires.'
    return
  }

  isSubmitting.value = true

  try {
    await api('/articles', {
      method: 'POST',
      body: {
        title: title.value,
        content: content.value,
        status: status.value,
      }
    })

    successMessage.value = 'Article créé avec succès !'
    title.value = ''
    content.value = ''
    status.value = 'draft'
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error?.data?.message || 'Impossible de publier l’article.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <DashboardLayout>
    <section class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Nouvel article</p>
          <h2 class="mt-3 text-3xl font-bold text-white">Publiez un article</h2>
        </div>
        <NuxtLink to="/dashboard/articles" class="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10">Retour aux articles</NuxtLink>
      </div>

      <div class="mt-8 space-y-6">
        <div v-if="successMessage" class="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm text-emerald-100">{{ successMessage }}</div>
        <div v-if="errorMessage" class="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-100">{{ errorMessage }}</div>

        <div class="grid gap-6">
          <label class="space-y-3">
            <span class="text-sm font-semibold text-white">Titre</span>
            <input v-model="title" type="text" placeholder="Titre de l’article" class="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10" />
          </label>

          <label class="space-y-3">
            <span class="text-sm font-semibold text-white">Contenu</span>
            <textarea v-model="content" rows="8" placeholder="Rédigez votre article ici..." class="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"></textarea>
          </label>

          <label class="space-y-3">
            <span class="text-sm font-semibold text-white">Statut</span>
            <select v-model="status" class="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10">
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </label>

          <button @click.prevent="handleSubmit" :disabled="isSubmitting" class="inline-flex items-center justify-center rounded-3xl bg-blue-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50">
            <span v-if="isSubmitting">Publication...</span>
            <span v-else>Publier l’article</span>
          </button>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>
