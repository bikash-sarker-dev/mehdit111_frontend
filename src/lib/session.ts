// src/lib/session.ts
import Cookies from "js-cookie";

export const TOKEN_KEY = "token";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const USER_KEY = "user";

const baseOptions = {
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export function saveSession(
  accessToken: string,
  refreshToken: string,
  user: unknown,
) {
  console.log(accessToken);
  Cookies.set(TOKEN_KEY, accessToken, { ...baseOptions, expires: 1 });
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { ...baseOptions, expires: 7 });

  // Non-sensitive profile data only
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Could not save user to localStorage:", e);
  }
}

export function getAccessToken() {
  return Cookies.get(TOKEN_KEY);
}

export function getStoredUser<T = unknown>(): T | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  Cookies.remove(TOKEN_KEY, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}
