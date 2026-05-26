import { _ as __nuxt_component_0 } from './nuxt-link-BdXAT07U.mjs';
import { defineComponent, ref, withCtx, createTextVNode, unref, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { a as useAuthStore, u as useApi } from './auth-BAJuOaTf.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const api = useApi();
    const isLoading = ref(true);
    const errorMessage = ref("");
    const articlesCount = ref(0);
    const summary = ref({ newsletters: 14, comments: 32, media: 8 });
    const fetchSummary = async () => {
      isLoading.value = true;
      errorMessage.value = "";
      try {
        const response = await api("/articles");
        articlesCount.value = Array.isArray(response.data) ? response.data.length : 0;
      } catch (error) {
        errorMessage.value = "Impossible de charger les statistiques. Assurez-vous que le backend est démarré.";
      } finally {
        isLoading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(DashboardLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="grid gap-6 xl:grid-cols-2"${_scopeId}><div class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20"${_scopeId}><p class="text-sm uppercase tracking-[0.25em] text-slate-400"${_scopeId}>Résumé rapide</p><h2 class="mt-4 text-3xl font-bold text-white"${_scopeId}>Vue d’ensemble</h2><p class="mt-3 text-sm leading-6 text-slate-300"${_scopeId}>Tous vos contenus et activités sont accessibles depuis l’espace de gestion.</p><div class="mt-8 grid gap-4 sm:grid-cols-2"${_scopeId}><div class="rounded-3xl border border-white/5 bg-slate-950/80 p-5"${_scopeId}><p class="text-sm uppercase tracking-[0.25em] text-slate-400"${_scopeId}>Articles publiés</p><p class="mt-4 text-4xl font-extrabold text-white"${_scopeId}>${ssrInterpolate(articlesCount.value)}</p></div><div class="rounded-3xl border border-white/5 bg-slate-950/80 p-5"${_scopeId}><p class="text-sm uppercase tracking-[0.25em] text-slate-400"${_scopeId}>Newsletters</p><p class="mt-4 text-4xl font-extrabold text-white"${_scopeId}>${ssrInterpolate(summary.value.newsletters)}</p></div><div class="rounded-3xl border border-white/5 bg-slate-950/80 p-5"${_scopeId}><p class="text-sm uppercase tracking-[0.25em] text-slate-400"${_scopeId}>Commentaires</p><p class="mt-4 text-4xl font-extrabold text-white"${_scopeId}>${ssrInterpolate(summary.value.comments)}</p></div><div class="rounded-3xl border border-white/5 bg-slate-950/80 p-5"${_scopeId}><p class="text-sm uppercase tracking-[0.25em] text-slate-400"${_scopeId}>Médias</p><p class="mt-4 text-4xl font-extrabold text-white"${_scopeId}>${ssrInterpolate(summary.value.media)}</p></div></div></div><div class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20"${_scopeId}><p class="text-sm uppercase tracking-[0.25em] text-slate-400"${_scopeId}>Actions rapides</p><h2 class="mt-4 text-3xl font-bold text-white"${_scopeId}>Créer et gérer</h2><p class="mt-3 text-sm leading-6 text-slate-300"${_scopeId}>Publiez un nouvel article, gérez les newsletters et suivez les commentaires depuis un seul endroit.</p><div class="mt-8 grid gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/dashboard/articles",
              class: "rounded-2xl bg-blue-500/10 px-5 py-4 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Voir les articles`);
                } else {
                  return [
                    createTextVNode("Voir les articles")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/dashboard/articles/create",
              class: "rounded-2xl bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
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
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/dashboard/newsletters",
              class: "rounded-2xl bg-violet-500/10 px-5 py-4 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Gérer la newsletter`);
                } else {
                  return [
                    createTextVNode("Gérer la newsletter")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/dashboard/comments",
              class: "rounded-2xl bg-sky-500/10 px-5 py-4 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Modérer les commentaires`);
                } else {
                  return [
                    createTextVNode("Modérer les commentaires")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></section><section class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20"${_scopeId}><div class="flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><h3 class="text-2xl font-bold text-white"${_scopeId}>Dernières informations</h3><p class="mt-2 text-sm text-slate-400"${_scopeId}>La gestion du contenu est centralisée ici, avec des actions rapides et des statistiques immédiates.</p></div><button class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-blue-300/40 hover:text-white"${_scopeId}>Actualiser</button></div><div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"${_scopeId}><div class="rounded-3xl border border-white/5 bg-slate-950/80 p-6"${_scopeId}><p class="text-sm uppercase tracking-[0.25em] text-slate-400"${_scopeId}>Connexion</p><p class="mt-4 text-lg text-white"${_scopeId}>${ssrInterpolate(isLoading.value ? "Chargement..." : "Backend prêt")}</p></div><div class="rounded-3xl border border-white/5 bg-slate-950/80 p-6"${_scopeId}><p class="text-sm uppercase tracking-[0.25em] text-slate-400"${_scopeId}>Espace</p><p class="mt-4 text-lg text-white"${_scopeId}>Administration éditoriale</p></div><div class="rounded-3xl border border-white/5 bg-slate-950/80 p-6"${_scopeId}><p class="text-sm uppercase tracking-[0.25em] text-slate-400"${_scopeId}>Utilisateur</p><p class="mt-4 text-lg text-white"${_scopeId}>${ssrInterpolate(unref(authStore).user?.name)}</p></div><div class="rounded-3xl border border-white/5 bg-slate-950/80 p-6"${_scopeId}><p class="text-sm uppercase tracking-[0.25em] text-slate-400"${_scopeId}>Retour</p><p class="mt-4 text-lg text-white"${_scopeId}>Commencez par publier un article.</p></div></div></section>`);
            if (errorMessage.value) {
              _push2(`<div class="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200"${_scopeId}>${ssrInterpolate(errorMessage.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("section", { class: "grid gap-6 xl:grid-cols-2" }, [
                createVNode("div", { class: "rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20" }, [
                  createVNode("p", { class: "text-sm uppercase tracking-[0.25em] text-slate-400" }, "Résumé rapide"),
                  createVNode("h2", { class: "mt-4 text-3xl font-bold text-white" }, "Vue d’ensemble"),
                  createVNode("p", { class: "mt-3 text-sm leading-6 text-slate-300" }, "Tous vos contenus et activités sont accessibles depuis l’espace de gestion."),
                  createVNode("div", { class: "mt-8 grid gap-4 sm:grid-cols-2" }, [
                    createVNode("div", { class: "rounded-3xl border border-white/5 bg-slate-950/80 p-5" }, [
                      createVNode("p", { class: "text-sm uppercase tracking-[0.25em] text-slate-400" }, "Articles publiés"),
                      createVNode("p", { class: "mt-4 text-4xl font-extrabold text-white" }, toDisplayString(articlesCount.value), 1)
                    ]),
                    createVNode("div", { class: "rounded-3xl border border-white/5 bg-slate-950/80 p-5" }, [
                      createVNode("p", { class: "text-sm uppercase tracking-[0.25em] text-slate-400" }, "Newsletters"),
                      createVNode("p", { class: "mt-4 text-4xl font-extrabold text-white" }, toDisplayString(summary.value.newsletters), 1)
                    ]),
                    createVNode("div", { class: "rounded-3xl border border-white/5 bg-slate-950/80 p-5" }, [
                      createVNode("p", { class: "text-sm uppercase tracking-[0.25em] text-slate-400" }, "Commentaires"),
                      createVNode("p", { class: "mt-4 text-4xl font-extrabold text-white" }, toDisplayString(summary.value.comments), 1)
                    ]),
                    createVNode("div", { class: "rounded-3xl border border-white/5 bg-slate-950/80 p-5" }, [
                      createVNode("p", { class: "text-sm uppercase tracking-[0.25em] text-slate-400" }, "Médias"),
                      createVNode("p", { class: "mt-4 text-4xl font-extrabold text-white" }, toDisplayString(summary.value.media), 1)
                    ])
                  ])
                ]),
                createVNode("div", { class: "rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20" }, [
                  createVNode("p", { class: "text-sm uppercase tracking-[0.25em] text-slate-400" }, "Actions rapides"),
                  createVNode("h2", { class: "mt-4 text-3xl font-bold text-white" }, "Créer et gérer"),
                  createVNode("p", { class: "mt-3 text-sm leading-6 text-slate-300" }, "Publiez un nouvel article, gérez les newsletters et suivez les commentaires depuis un seul endroit."),
                  createVNode("div", { class: "mt-8 grid gap-4" }, [
                    createVNode(_component_NuxtLink, {
                      to: "/dashboard/articles",
                      class: "rounded-2xl bg-blue-500/10 px-5 py-4 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Voir les articles")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_NuxtLink, {
                      to: "/dashboard/articles/create",
                      class: "rounded-2xl bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Publier un article")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_NuxtLink, {
                      to: "/dashboard/newsletters",
                      class: "rounded-2xl bg-violet-500/10 px-5 py-4 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Gérer la newsletter")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_NuxtLink, {
                      to: "/dashboard/comments",
                      class: "rounded-2xl bg-sky-500/10 px-5 py-4 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Modérer les commentaires")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              createVNode("section", { class: "rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20" }, [
                createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                  createVNode("div", null, [
                    createVNode("h3", { class: "text-2xl font-bold text-white" }, "Dernières informations"),
                    createVNode("p", { class: "mt-2 text-sm text-slate-400" }, "La gestion du contenu est centralisée ici, avec des actions rapides et des statistiques immédiates.")
                  ]),
                  createVNode("button", {
                    onClick: fetchSummary,
                    class: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-blue-300/40 hover:text-white"
                  }, "Actualiser")
                ]),
                createVNode("div", { class: "mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" }, [
                  createVNode("div", { class: "rounded-3xl border border-white/5 bg-slate-950/80 p-6" }, [
                    createVNode("p", { class: "text-sm uppercase tracking-[0.25em] text-slate-400" }, "Connexion"),
                    createVNode("p", { class: "mt-4 text-lg text-white" }, toDisplayString(isLoading.value ? "Chargement..." : "Backend prêt"), 1)
                  ]),
                  createVNode("div", { class: "rounded-3xl border border-white/5 bg-slate-950/80 p-6" }, [
                    createVNode("p", { class: "text-sm uppercase tracking-[0.25em] text-slate-400" }, "Espace"),
                    createVNode("p", { class: "mt-4 text-lg text-white" }, "Administration éditoriale")
                  ]),
                  createVNode("div", { class: "rounded-3xl border border-white/5 bg-slate-950/80 p-6" }, [
                    createVNode("p", { class: "text-sm uppercase tracking-[0.25em] text-slate-400" }, "Utilisateur"),
                    createVNode("p", { class: "mt-4 text-lg text-white" }, toDisplayString(unref(authStore).user?.name), 1)
                  ]),
                  createVNode("div", { class: "rounded-3xl border border-white/5 bg-slate-950/80 p-6" }, [
                    createVNode("p", { class: "text-sm uppercase tracking-[0.25em] text-slate-400" }, "Retour"),
                    createVNode("p", { class: "mt-4 text-lg text-white" }, "Commencez par publier un article.")
                  ])
                ])
              ]),
              errorMessage.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200"
              }, toDisplayString(errorMessage.value), 1)) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C8O-q5Td.mjs.map
