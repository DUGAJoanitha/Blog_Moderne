import { a as useAuthStore } from './auth-BAJuOaTf.mjs';
import { d as defineNuxtRouteMiddleware, n as navigateTo } from './server.mjs';
import 'pinia';
import 'vue';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@vue/shared';

const guestOnly = defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    return navigateTo("/");
  }
});

export { guestOnly as default };
//# sourceMappingURL=guest-only-CuPBkYZ0.mjs.map
