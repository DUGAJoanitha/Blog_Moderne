import { _ as __nuxt_component_0 } from './nuxt-link-BdXAT07U.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { a as useAuthStore } from './auth-BAJuOaTf.mjs';
import { c as useRoute } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DashboardLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const route = useRoute();
    const navItems = [
      { label: "Tableau de bord", path: "/dashboard" },
      { label: "Articles", path: "/dashboard/articles" },
      { label: "Newsletter", path: "/dashboard/newsletters" },
      { label: "Médias", path: "/dashboard/media" },
      { label: "Commentaires", path: "/dashboard/comments" }
    ];
    const activePath = computed(() => route.path);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#070a13] text-slate-100 font-sans" }, _attrs))}><div class="mx-auto max-w-7xl px-4 py-6 lg:px-8"><div class="mb-8 flex flex-col gap-6 xl:gap-0 xl:flex-row xl:items-center xl:justify-between"><div><p class="text-sm uppercase tracking-[0.35em] text-slate-400">Espace administrateur</p><h1 class="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Tableau de bord</h1><p class="mt-4 max-w-2xl text-sm leading-6 text-slate-400">Gérez vos contenus, publiez des articles et suivez les newsletters, commentaires et médias.</p></div><div class="rounded-3xl border border-white/10 bg-white/5 p-4 flex items-center gap-4"><div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white text-lg font-bold">${ssrInterpolate(unref(authStore).user?.name?.charAt(0).toUpperCase() || "U")}</div><div class="min-w-0"><p class="text-sm font-semibold text-white leading-none">${ssrInterpolate(unref(authStore).user?.name)}</p><p class="truncate text-xs text-slate-400">${ssrInterpolate(unref(authStore).user?.email)}</p></div></div></div><div class="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]"><aside class="rounded-[2rem] border border-white/5 bg-white/5 p-6 shadow-xl shadow-slate-950/20"><div class="mb-8"><p class="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Navigation</p></div><nav class="space-y-2"><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.path,
          to: item.path,
          class: ["block rounded-2xl px-4 py-3 text-sm transition", activePath.value === item.path ? "bg-blue-500/10 text-blue-300 font-bold" : "text-slate-300 hover:bg-white/5 hover:text-white"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav></aside><main class="space-y-8">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DashboardLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DashboardLayout = Object.assign(_sfc_main, { __name: "DashboardLayout" });

export { DashboardLayout as D };
//# sourceMappingURL=DashboardLayout-cNXRxOuK.mjs.map
