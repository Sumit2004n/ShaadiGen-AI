import { apiGet, getApiBaseUrl } from "@/lib/api";

export type TryOnJobStatus = {
  job_id: string;
  status: string;
  result_image_url?: string | null;
  message?: string;
};

/**
 * Client stub for AI Studio virtual try-on.
 * Backend Celery/AI pipeline lands in a later milestone; health proves connectivity today.
 */
export async function checkBackendReady(): Promise<boolean> {
  try {
    const health = await apiGet<{ status: string }>("/api/v1/health");
    return health.status === "ok";
  } catch {
    return false;
  }
}

export function tryOnEndpoint(): string {
  return `${getApiBaseUrl()}/api/v1/ai/try-on`;
}
