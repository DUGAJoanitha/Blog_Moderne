import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Modules Nuxt obligatoires
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  // Forcer le dossier racine comme source (évite ambiguïté avec app/)
  srcDir: '.',

  app: {
    head: {
      title: 'Travel - Explore Horizons',
      meta: [
        { name: 'description', content: 'Découvrez des destinations de rêve et organisez vos voyages avec Travel.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap' }
      ]
    }
  },

  // CSS global
  css: ['~/assets/css/main.css'],

  // TailwindCSS via Vite
  vite: {
    plugins: [tailwindcss()],
  },

  // URL de ton API Laravel
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/api'
    }
  }
})