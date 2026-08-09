const TOKEN_KEY = "shaadigen_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

/**
 * Ensures a JWT exists for shortlist calls.
 * Registers a local demo couple once if no token is stored.
 */
export async function ensureAccessToken(): Promise<string> {
  const existing = getAccessToken();
  if (existing) return existing;

  const { apiPost } = await import("@/lib/api");
  const email = `couple+${Date.now()}@shaadigen.local`;
  const result = await apiPost<{ access_token: string }>("/api/v1/auth/register", {
    email,
    password: "weddingdemo1",
    full_name: "Demo Couple",
    role: "couple",
  });
  setAccessToken(result.access_token);
  return result.access_token;
}
