import { _ as __nuxt_component_0 } from './nuxt-link-BdXAT07U.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, openBlock, createBlock, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { a as useAuthStore, u as useApi } from './auth-BAJuOaTf.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@vue/shared';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    useApi();
    const articles = ref([]);
    const isLoading = ref(true);
    const fetchError = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#070a13] text-slate-100 font-sans selection:bg-[#2582FF]/30 selection:text-white" }, _attrs))}><header class="sticky top-0 z-40 w-full border-b border-white/5 bg-[#070a13]/80 backdrop-blur-md"><div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12"><div class="flex items-center gap-3"><svg class="w-8 h-8 text-blue-500" viewBox="0 0 100 100" fill="none"><path d="M20 70 C20 40, 40 20, 70 30" stroke="currentColor" stroke-width="3" stroke-dasharray="4 4" stroke-linecap="round"></path><path d="M72 26 L80 30 L74 38 L72 32 L64 32 Z" fill="currentColor"></path></svg><span class="text-xl font-bold tracking-[0.25em] uppercase">Travel</span></div><div class="flex items-center gap-4 sm:gap-6"><div class="hidden sm:flex flex-col text-right"><span class="text-sm font-semibold text-white">${ssrInterpolate(unref(authStore).user?.name)}</span><span class="text-xs text-slate-400">${ssrInterpolate(unref(authStore).user?.email)}</span></div><div class="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg ring-2 ring-white/10">${ssrInterpolate(unref(authStore).user?.name?.charAt(0).toUpperCase() || "U")}</div><button class="px-4 py-2 rounded-xl border border-white/10 hover:border-red-500/20 bg-white/5 hover:bg-red-500/10 text-sm font-medium text-slate-300 hover:text-red-400 transition-all duration-200"> Sign Out </button></div></div></header><main class="mx-auto max-w-7xl px-6 py-10 lg:py-16 lg:px-12"><section class="relative mb-12 rounded-[2.5rem] overflow-hidden border border-white/5 bg-[url(&#39;https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&amp;fit=crop&amp;w=1600&amp;q=80&#39;)] bg-cover bg-center"><div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div><div class="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl space-y-6"><span class="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400"> ✈ Explorer Dashboard </span><h2 class="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white"> Welcome back, <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">${ssrInterpolate(unref(authStore).user?.name)}</span>! </h2><p class="text-base sm:text-lg text-slate-300 font-light"> Plan your next journey, browse recent travel insights, and publish new articles for the modern nomad community. </p></div></section><section class="space-y-8"><div class="flex items-center justify-between"><div><h3 class="text-2xl font-bold tracking-tight text-white">Latest Travel Insights</h3><p class="text-sm text-slate-400 mt-1">Read articles published by our global guides.</p></div><button class="p-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-slate-400 hover:text-white transition" title="Refresh articles"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.228 10H18.228"></path></svg></button></div>`);
      if (isLoading.value) {
        _push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(3, (n) => {
          _push(`<div class="animate-pulse rounded-3xl border border-white/5 bg-white/5 p-6 space-y-4"><div class="h-6 w-3/4 rounded bg-white/10"></div><div class="space-y-2"><div class="h-4 w-full rounded bg-white/10"></div><div class="h-4 w-5/6 rounded bg-white/10"></div></div><div class="h-8 w-1/3 rounded bg-white/10 pt-4"></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (fetchError.value) {
        _push(`<div class="rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-8 text-center max-w-xl mx-auto space-y-4"><svg class="mx-auto w-12 h-12 text-yellow-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg><h4 class="text-lg font-bold text-white">Connexion backend indisponible</h4><p class="text-sm text-slate-400">${ssrInterpolate(fetchError.value)}</p><div class="pt-2"><button class="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-all shadow-md active:scale-95"> Réessayer </button></div></div>`);
      } else if (articles.value.length === 0) {
        _push(`<div class="rounded-[2rem] border border-white/5 bg-white/5 p-12 text-center max-w-md mx-auto space-y-4"><span class="text-4xl">🏝️</span><h4 class="text-lg font-bold text-white">Aucun article publié</h4><p class="text-sm text-slate-400">Aucun article n&#39;a été publié pour le moment. Vous pouvez démarrer le backend et en rajouter via l&#39;API.</p></div>`);
      } else {
        _push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(articles.value, (article) => {
          _push(`<article class="group relative rounded-3xl border border-white/5 bg-white/5 hover:bg-white/10 p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"><div class="space-y-4"><div class="flex items-center justify-between text-xs text-slate-400"><span>By ${ssrInterpolate(article.user?.name || "Auteur")}</span><span>${ssrInterpolate(new Date(article.published_at || Date.now()).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }))}</span></div><h4 class="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">${ssrInterpolate(article.title)}</h4><p class="text-sm leading-relaxed text-slate-300 font-light line-clamp-4">${ssrInterpolate(article.content)}</p></div><div class="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs"><span class="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-widest font-semibold font-mono">${ssrInterpolate(article.status)}</span>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/articles/${article.slug}`,
            class: "text-blue-400 hover:text-blue-300 font-bold transition flex items-center gap-1"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Read More <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"${_scopeId}></path></svg>`);
              } else {
                return [
                  createTextVNode(" Read More "),
                  (openBlock(), createBlock("svg", {
                    class: "w-3.5 h-3.5 transition-transform group-hover:translate-x-1",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    "stroke-width": "2"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M14 5l7 7m0 0l-7 7m7-7H3"
                    })
                  ]))
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></article>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</section></main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BKziQmG-.mjs.map
