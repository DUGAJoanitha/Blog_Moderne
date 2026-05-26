import { defineStore } from 'pinia';
import { computed, ref, customRef } from 'vue';
import { v as klona, l as getRequestHeader, r as isEqual, z as setCookie, j as getCookie, e as deleteCookie } from '../_/nitro.mjs';
import { n as navigateTo, g as useRuntimeConfig, u as useNuxtApp, b as useRequestEvent } from './server.mjs';

function endIndex(str, min, len) {
	const index = str.indexOf(";", min);
	return index === -1 ? len : index;
}
function eqIndex(str, min, max) {
	const index = str.indexOf("=", min);
	return index < max ? index : -1;
}
function valueSlice(str, min, max) {
	if (min === max) return "";
	let start = min;
	let end = max;
	do {
		const code = str.charCodeAt(start);
		if (code !== 32 && code !== 9) break;
	} while (++start < end);
	while (end > start) {
		const code = str.charCodeAt(end - 1);
		if (code !== 32 && code !== 9) break;
		end--;
	}
	return str.slice(start, end);
}
const NullObject = /* @__PURE__ */ (() => {
	const C = function() {};
	C.prototype = Object.create(null);
	return C;
})();
function parse(str, options) {
	const obj = new NullObject();
	const len = str.length;
	if (len < 2) return obj;
	const dec = options?.decode || decode;
	const allowMultiple = options?.allowMultiple || false;
	let index = 0;
	do {
		const eqIdx = eqIndex(str, index, len);
		if (eqIdx === -1) break;
		const endIdx = endIndex(str, index, len);
		if (eqIdx > endIdx) {
			index = str.lastIndexOf(";", eqIdx - 1) + 1;
			continue;
		}
		const key = valueSlice(str, index, eqIdx);
		if (options?.filter && !options.filter(key)) {
			index = endIdx + 1;
			continue;
		}
		const val = dec(valueSlice(str, eqIdx + 1, endIdx));
		if (allowMultiple) {
			const existing = obj[key];
			if (existing === void 0) obj[key] = val;
			else if (Array.isArray(existing)) existing.push(val);
			else obj[key] = [existing, val];
		} else if (obj[key] === void 0) obj[key] = val;
		index = endIdx + 1;
	} while (index < len);
	return obj;
}
function decode(str) {
	if (!str.includes("%")) return str;
	try {
		return decodeURIComponent(str);
	} catch {
		return str;
	}
}

function parseCookieValue(value) {
  if (value === "undefined") {
    return void 0;
  }
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "number" && String(parsed) !== value) {
      return value;
    }
    return parsed;
  } catch {
    return value;
  }
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => val ? parseCookieValue(decodeURIComponent(val)) : val,
  encode: (val) => {
    if (typeof val !== "string" || val === "undefined") {
      return encodeURIComponent(JSON.stringify(val));
    }
    try {
      if (typeof JSON.parse(val) !== "string") {
        return encodeURIComponent(JSON.stringify(val));
      }
    } catch {
    }
    return encodeURIComponent(val);
  },
  refresh: false
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = cookieServerRef(name, cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      const valueIsSame = isEqual(cookie.value, cookies[name]);
      if (opts.readonly || valueIsSame && !opts.refresh) {
        return;
      }
      nuxtApp._cookiesChanged ||= {};
      if (valueIsSame && opts.refresh && !nuxtApp._cookiesChanged[name]) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      const encoded = cookie.value === null || cookie.value === void 0 ? void 0 : opts.encode(cookie.value);
      writeServerCookie(useRequestEvent(nuxtApp), name, encoded, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
const identityEncode = (val) => val;
function toSerializeOptions(opts) {
  const { encode: _encode, decode: _decode, ...rest } = opts;
  return { ...rest, encode: identityEncode };
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    const serializeOpts = toSerializeOptions(opts);
    if (value !== void 0) {
      return setCookie(event, name, value, serializeOpts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, serializeOpts);
    }
  }
}
function cookieServerRef(name, value) {
  const internalRef = ref(value);
  const nuxtApp = useNuxtApp();
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return internalRef.value;
      },
      set(newValue) {
        nuxtApp._cookiesChanged ||= {};
        nuxtApp._cookiesChanged[name] = true;
        internalRef.value = newValue;
        trigger();
      }
    };
  });
}
const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const headers = options.headers || {};
      headers["Accept"] = "application/json";
      if (authStore.token) {
        headers["Authorization"] = `Bearer ${authStore.token}`;
      }
      options.headers = headers;
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        authStore.token = null;
        authStore.user = null;
        navigateTo("/login");
      }
    }
  });
  return apiFetch;
};
const useAuthStore = defineStore("auth", () => {
  const api = useApi();
  const token = useCookie("auth_token", {
    maxAge: 60 * 60 * 24 * 7,
    // 1 week
    path: "/"
  });
  const user = useCookie("auth_user", {
    maxAge: 60 * 60 * 24 * 7,
    // 1 week
    path: "/"
  });
  const isAuthenticated = computed(() => !!token.value);
  async function login(credentials) {
    try {
      const data = await api("/login", {
        method: "POST",
        body: credentials
      });
      token.value = data.token;
      user.value = data.user;
      return data;
    } catch (error) {
      throw error;
    }
  }
  async function register(formData) {
    try {
      const data = await api("/register", {
        method: "POST",
        body: formData
      });
      token.value = data.token;
      user.value = data.user;
      return data;
    } catch (error) {
      throw error;
    }
  }
  async function logout() {
    if (token.value) {
      try {
        await api("/logout", {
          method: "POST"
        });
      } catch (e) {
        console.error("Logout request failed", e);
      }
    }
    token.value = null;
    user.value = null;
    return navigateTo("/login");
  }
  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout
  };
});

export { useAuthStore as a, useApi as u };
//# sourceMappingURL=auth-BAJuOaTf.mjs.map
