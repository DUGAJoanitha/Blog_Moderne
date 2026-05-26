import { _ as __nuxt_component_0 } from './nuxt-link-BdXAT07U.mjs';
import { defineComponent, ref, withCtx, createTextVNode, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, withDirectives, vModelText, vModelSelect, withModifiers, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const api = useApi();
    const title = ref("");
    const content = ref("");
    const status = ref("draft");
    const isSubmitting = ref(false);
    const successMessage = ref("");
    const errorMessage = ref("");
    const handleSubmit = async () => {
      errorMessage.value = "";
      successMessage.value = "";
      if (!title.value.trim() || !content.value.trim()) {
        errorMessage.value = "Le titre et le contenu sont obligatoires.";
        return;
      }
      isSubmitting.value = true;
      try {
        await api("/articles", {
          method: "POST",
          body: {
            title: title.value,
            content: content.value,
            status: status.value
          }
        });
        successMessage.value = "Article créé avec succès !";
        title.value = "";
        content.value = "";
        status.value = "draft";
      } catch (error) {
        console.error(error);
        errorMessage.value = error?.data?.message || "Impossible de publier l’article.";
      } finally {
        isSubmitting.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(DashboardLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20"${_scopeId}><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"${_scopeId}><div${_scopeId}><p class="text-sm uppercase tracking-[0.25em] text-slate-400"${_scopeId}>Nouvel article</p><h2 class="mt-3 text-3xl font-bold text-white"${_scopeId}>Publiez un article</h2></div>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/dashboard/articles",
              class: "rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Retour aux articles`);
                } else {
                  return [
                    createTextVNode("Retour aux articles")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="mt-8 space-y-6"${_scopeId}>`);
            if (successMessage.value) {
              _push2(`<div class="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm text-emerald-100"${_scopeId}>${ssrInterpolate(successMessage.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (errorMessage.value) {
              _push2(`<div class="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-100"${_scopeId}>${ssrInterpolate(errorMessage.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="grid gap-6"${_scopeId}><label class="space-y-3"${_scopeId}><span class="text-sm font-semibold text-white"${_scopeId}>Titre</span><input${ssrRenderAttr("value", title.value)} type="text" placeholder="Titre de l’article" class="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"${_scopeId}></label><label class="space-y-3"${_scopeId}><span class="text-sm font-semibold text-white"${_scopeId}>Contenu</span><textarea rows="8" placeholder="Rédigez votre article ici..." class="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"${_scopeId}>${ssrInterpolate(content.value)}</textarea></label><label class="space-y-3"${_scopeId}><span class="text-sm font-semibold text-white"${_scopeId}>Statut</span><select class="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"${_scopeId}><option value="draft"${ssrIncludeBooleanAttr(Array.isArray(status.value) ? ssrLooseContain(status.value, "draft") : ssrLooseEqual(status.value, "draft")) ? " selected" : ""}${_scopeId}>Brouillon</option><option value="published"${ssrIncludeBooleanAttr(Array.isArray(status.value) ? ssrLooseContain(status.value, "published") : ssrLooseEqual(status.value, "published")) ? " selected" : ""}${_scopeId}>Publié</option></select></label><button${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} class="inline-flex items-center justify-center rounded-3xl bg-blue-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"${_scopeId}>`);
            if (isSubmitting.value) {
              _push2(`<span${_scopeId}>Publication...</span>`);
            } else {
              _push2(`<span${_scopeId}>Publier l’article</span>`);
            }
            _push2(`</button></div></div></section>`);
          } else {
            return [
              createVNode("section", { class: "rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-xl shadow-slate-950/20" }, [
                createVNode("div", { class: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm uppercase tracking-[0.25em] text-slate-400" }, "Nouvel article"),
                    createVNode("h2", { class: "mt-3 text-3xl font-bold text-white" }, "Publiez un article")
                  ]),
                  createVNode(_component_NuxtLink, {
                    to: "/dashboard/articles",
                    class: "rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Retour aux articles")
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "mt-8 space-y-6" }, [
                  successMessage.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm text-emerald-100"
                  }, toDisplayString(successMessage.value), 1)) : createCommentVNode("", true),
                  errorMessage.value ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-100"
                  }, toDisplayString(errorMessage.value), 1)) : createCommentVNode("", true),
                  createVNode("div", { class: "grid gap-6" }, [
                    createVNode("label", { class: "space-y-3" }, [
                      createVNode("span", { class: "text-sm font-semibold text-white" }, "Titre"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => title.value = $event,
                        type: "text",
                        placeholder: "Titre de l’article",
                        class: "w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, title.value]
                      ])
                    ]),
                    createVNode("label", { class: "space-y-3" }, [
                      createVNode("span", { class: "text-sm font-semibold text-white" }, "Contenu"),
                      withDirectives(createVNode("textarea", {
                        "onUpdate:modelValue": ($event) => content.value = $event,
                        rows: "8",
                        placeholder: "Rédigez votre article ici...",
                        class: "w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, content.value]
                      ])
                    ]),
                    createVNode("label", { class: "space-y-3" }, [
                      createVNode("span", { class: "text-sm font-semibold text-white" }, "Statut"),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => status.value = $event,
                        class: "w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                      }, [
                        createVNode("option", { value: "draft" }, "Brouillon"),
                        createVNode("option", { value: "published" }, "Publié")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, status.value]
                      ])
                    ]),
                    createVNode("button", {
                      onClick: withModifiers(handleSubmit, ["prevent"]),
                      disabled: isSubmitting.value,
                      class: "inline-flex items-center justify-center rounded-3xl bg-blue-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
                    }, [
                      isSubmitting.value ? (openBlock(), createBlock("span", { key: 0 }, "Publication...")) : (openBlock(), createBlock("span", { key: 1 }, "Publier l’article"))
                    ], 8, ["disabled"])
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/articles/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-5Iv_30B0.mjs.map
