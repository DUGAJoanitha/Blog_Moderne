import { _ as __nuxt_component_0 } from './nuxt-link-BdXAT07U.mjs';
import { defineComponent, ref, withCtx, createTextVNode, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useApi } from './auth-BAJuOaTf.mjs';
import { D as DashboardLayout } from './DashboardLayout-cNXRxOuK.mjs';
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
  __name: "articles",
  __ssrInlineRender: true,
  setup(__props) {
    useApi();
    const articles = ref([]);
    const isLoading = ref(true);
    const errorMessage = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(DashboardLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20"${_scopeId}><div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"${_scopeId}><div${_scopeId}><p class="text-sm uppercase tracking-[0.25em] text-slate-400"${_scopeId}>Articles</p><h2 class="mt-3 text-3xl font-bold text-white"${_scopeId}>Gestion des articles</h2><p class="mt-2 text-sm leading-6 text-slate-400"${_scopeId}>Consultez, publiez et mettez à jour vos contenus depuis cette page.</p></div>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/dashboard/articles/create",
              class: "inline-flex items-center justify-center rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Publier un article`);
                } else {
                  return [
                    createTextVNode("Publier un article")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="mt-8 space-y-6"${_scopeId}>`);
            if (isLoading.value) {
              _push2(`<div class="grid gap-6 lg:grid-cols-2"${_scopeId}><!--[-->`);
              ssrRenderList(3, (n) => {
                _push2(`<div class="h-56 animate-pulse rounded-[2rem] bg-white/5"${_scopeId}></div>`);
              });
              _push2(`<!--]--></div>`);
            } else if (errorMessage.value) {
              _push2(`<div class="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200"${_scopeId}>${ssrInterpolate(errorMessage.value)}</div>`);
            } else if (articles.value.length === 0) {
              _push2(`<div class="rounded-[2rem] border border-white/5 bg-slate-950/80 p-8 text-center text-slate-300"${_scopeId}><p class="text-lg font-semibold text-white"${_scopeId}>Aucun article publié pour le moment.</p><p class="mt-2 text-sm"${_scopeId}>Créez votre premier article pour qu’il apparaisse sur la page d’accueil.</p></div>`);
            } else {
              _push2(`<div class="grid gap-6 lg:grid-cols-2"${_scopeId}><!--[-->`);
              ssrRenderList(articles.value, (article) => {
                _push2(`<article class="rounded-[2rem] border border-white/5 bg-slate-950/80 p-6 transition hover:border-blue-500/20 hover:bg-slate-950/90"${_scopeId}><div class="flex items-center justify-between gap-4"${_scopeId}><p class="text-xs uppercase tracking-[0.28em] text-slate-400"${_scopeId}>${ssrInterpolate(article.status)}</p><span class="text-xs text-slate-500"${_scopeId}>${ssrInterpolate(new Date(article.published_at || Date.now()).toLocaleDateString("fr-FR"))}</span></div><h3 class="mt-4 text-xl font-semibold text-white"${_scopeId}>${ssrInterpolate(article.title)}</h3><p class="mt-3 text-sm leading-6 text-slate-400 line-clamp-4"${_scopeId}>${ssrInterpolate(article.content)}</p><div class="mt-6 flex items-center justify-between text-xs text-slate-400"${_scopeId}><span${_scopeId}>Par ${ssrInterpolate(article.user?.name || "Auteur")}</span>`);
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  to: `/articles/${article.slug}`,
                  class: "text-blue-300 hover:text-blue-200"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Voir l’article`);
                    } else {
                      return [
                        createTextVNode("Voir l’article")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></article>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div></section>`);
          } else {
            return [
              createVNode("section", { class: "rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20" }, [
                createVNode("div", { class: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm uppercase tracking-[0.25em] text-slate-400" }, "Articles"),
                    createVNode("h2", { class: "mt-3 text-3xl font-bold text-white" }, "Gestion des articles"),
                    createVNode("p", { class: "mt-2 text-sm leading-6 text-slate-400" }, "Consultez, publiez et mettez à jour vos contenus depuis cette page.")
                  ]),
                  createVNode(_component_NuxtLink, {
                    to: "/dashboard/articles/create",
                    class: "inline-flex items-center justify-center rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Publier un article")
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "mt-8 space-y-6" }, [
                  isLoading.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "grid gap-6 lg:grid-cols-2"
                  }, [
                    (openBlock(), createBlock(Fragment, null, renderList(3, (n) => {
                      return createVNode("div", {
                        key: n,
                        class: "h-56 animate-pulse rounded-[2rem] bg-white/5"
                      });
                    }), 64))
                  ])) : errorMessage.value ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200"
                  }, toDisplayString(errorMessage.value), 1)) : articles.value.length === 0 ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "rounded-[2rem] border border-white/5 bg-slate-950/80 p-8 text-center text-slate-300"
                  }, [
                    createVNode("p", { class: "text-lg font-semibold text-white" }, "Aucun article publié pour le moment."),
                    createVNode("p", { class: "mt-2 text-sm" }, "Créez votre premier article pour qu’il apparaisse sur la page d’accueil.")
                  ])) : (openBlock(), createBlock("div", {
                    key: 3,
                    class: "grid gap-6 lg:grid-cols-2"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(articles.value, (article) => {
                      return openBlock(), createBlock("article", {
                        key: article.id,
                        class: "rounded-[2rem] border border-white/5 bg-slate-950/80 p-6 transition hover:border-blue-500/20 hover:bg-slate-950/90"
                      }, [
                        createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                          createVNode("p", { class: "text-xs uppercase tracking-[0.28em] text-slate-400" }, toDisplayString(article.status), 1),
                          createVNode("span", { class: "text-xs text-slate-500" }, toDisplayString(new Date(article.published_at || Date.now()).toLocaleDateString("fr-FR")), 1)
                        ]),
                        createVNode("h3", { class: "mt-4 text-xl font-semibold text-white" }, toDisplayString(article.title), 1),
                        createVNode("p", { class: "mt-3 text-sm leading-6 text-slate-400 line-clamp-4" }, toDisplayString(article.content), 1),
                        createVNode("div", { class: "mt-6 flex items-center justify-between text-xs text-slate-400" }, [
                          createVNode("span", null, "Par " + toDisplayString(article.user?.name || "Auteur"), 1),
                          createVNode(_component_NuxtLink, {
                            to: `/articles/${article.slug}`,
                            class: "text-blue-300 hover:text-blue-200"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Voir l’article")
                            ]),
                            _: 1
                          }, 8, ["to"])
                        ])
                      ]);
                    }), 128))
                  ]))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/articles.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=articles--cKx6BBd.mjs.map
