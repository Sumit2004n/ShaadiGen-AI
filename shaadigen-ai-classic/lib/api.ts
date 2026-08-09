/** Base URL for the FastAPI backend (see .env.example). */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";
}

export class ApiError extends Error {
  status: number;
  body: string;

  constructor(status: number, body: string) {
    super(`API ${status}: ${body}`);
    this.status = status;
    this.body = body;
  }
}

type ApiOptions = RequestInit & {
  token?: string | null;
};

async function apiRequest<T>(path: string, init?: ApiOptions): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (init?.token) {
    headers.Authorization = `Bearer ${init.token}`;
  }
  if (init?.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new ApiError(res.status, await res.text());
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export async function apiGet<T>(path: string, init?: ApiOptions): Promise<T> {
  return apiRequest<T>(path, { ...init, method: "GET" });
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  init?: ApiOptions,
): Promise<T> {
  return apiRequest<T>(path, {
    ...init,
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function apiDelete<T = void>(
  path: string,
  init?: ApiOptions,
): Promise<T> {
  return apiRequest<T>(path, { ...init, method: "DELETE" });
}
