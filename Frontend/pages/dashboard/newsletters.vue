<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({ middleware: 'auth' })

const api = useApi()
const email = ref('')
const message = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const subscribe = async () => {
  errorMessage.value = ''
  message.value = ''

  if (!email.value.trim()) {
    errorMessage.value = 'L’email est requis.'
    return
  }

  isSubmitting.value = true
  try {
    const response = await api<{ message: string }>('/newsletter/subscribe', {
      method: 'POST',
      body: { email: email.value }
    })
    message.value = response.message || 'Inscription réussie.'
    email.value = ''
  } catch (error: any) {
    errorMessage.value = error?.data?.message || 'Impossible de s’inscrire pour le moment.'
  } finally {
    isSubmitting.value = false
  }
}

const unsubscribe = async () => {
  errorMessage.value = ''
  message.value = ''

  if (!email.value.trim()) {
    errorMessage.value = 'L’email est requis.'
    return
  }

  isSubmitting.value = true
  try {
    const response = await api<{ message: string }>('/newsletter/unsubscribe', {
      method: 'POST',
      body: { email: email.value }
    })
    message.value = response.message || 'Désinscription réussie.'
    email.value = ''
  } catch (error: any) {
    errorMessage.value = error?.data?.message || 'Impossible de se désinscrire pour le moment.'
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
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Newsletter</p>
          <h2 class="mt-3 text-3xl font-bold text-white">Gestion des abonnés</h2>
          <p class="mt-2 text-sm leading-6 text-slate-400">Ajoutez ou retirez une adresse de la liste de newsletter.</p>
        </div>
        <NuxtLink to="/dashboard" class="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10">Retour au tableau de bord</NuxtLink>
      </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div class="rounded-[2rem] border border-white/5 bg-slate-950/80 p-8">
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Abonnement</p>
          <p class="mt-3 text-sm leading-6 text-slate-300">Envoyez un email pour inscrire une nouvelle adresse.</p>

          <label class="mt-8 block space-y-3">
            <span class="text-sm font-semibold text-white">Email</span>
            <input v-model="email" type="email" placeholder="email@exemple.com" class="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10" />
          </label>

          <div class="mt-6 flex flex-col gap-3 sm:flex-row">
            <button @click.prevent="subscribe" :disabled="isSubmitting" class="rounded-3xl bg-emerald-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50">S’inscrire</button>
            <button @click.prevent="unsubscribe" :disabled="isSubmitting" class="rounded-3xl bg-red-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-red-400 disabled:opacity-50">Se désinscrire</button>
          </div>

          <div class="mt-6 space-y-3">
            <p v-if="message" class="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">{{ message }}</p>
            <p v-if="errorMessage" class="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">{{ errorMessage }}</p>
          </div>
        </div>

        <div class="rounded-[2rem] border border-white/5 bg-slate-950/80 p-8">
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Astuce</p>
          <h3 class="mt-4 text-xl font-semibold text-white">Liste de diffusion</h3>
          <p class="mt-3 text-sm leading-6 text-slate-300">Le backend gère l’ajout et la suppression d’adresses. Ces pages sont utiles pour préparer vos campagnes marketing.</p>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>
