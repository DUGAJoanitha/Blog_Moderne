<script setup lang="ts">
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({ middleware: 'auth' })
</script>

<template>
  <DashboardLayout>
    <section class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Médias</p>
          <h2 class="mt-3 text-3xl font-bold text-white">Bibliothèque multimédia</h2>
          <p class="mt-2 text-sm leading-6 text-slate-400">Gérez vos images et contenus visuels pour vos articles.</p>
        </div>
        <NuxtLink to="/dashboard" class="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10">Retour au tableau de bord</NuxtLink>
      </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-2">
        <div class="rounded-[2rem] border border-white/5 bg-slate-950/80 p-8">
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Gestion des médias</p>
          <p class="mt-3 text-sm leading-6 text-slate-300">Cette page vous permettra bientôt d’ajouter des visuels pour vos articles et de gérer la bibliothèque multimédia.</p>

          <div class="mt-8 rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-400">
            <p class="text-xl font-semibold text-white">Zone d’upload</p>
            <p class="mt-3 text-sm">Importez des images et associez-les à vos publications.</p>
            <button disabled class="mt-6 rounded-3xl bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 opacity-50">Fonctionnalité à venir</button>
          </div>
        </div>

        <div class="rounded-[2rem] border border-white/5 bg-white/5 p-8">
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Organisation</p>
          <h3 class="mt-4 text-xl font-semibold text-white">Médias du projet</h3>
          <ul class="mt-6 space-y-3 text-sm text-slate-300">
            <li class="rounded-3xl border border-white/5 bg-slate-950/80 p-4">Images d’articles</li>
            <li class="rounded-3xl border border-white/5 bg-slate-950/80 p-4">Galeries</li>
            <li class="rounded-3xl border border-white/5 bg-slate-950/80 p-4">Fichiers téléchargeables</li>
          </ul>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>
