import { useCookies } from "@vueuse/integrations/useCookies";
const cookie = useCookies();
const key = "admin-token";

export function getCookies() {
  return cookie.get(key);
};

export function setCookies(value) {
  return cookie.set(key, value);
};

export function removeCookies() {
  return cookie.remove(key);
};