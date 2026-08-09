import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { ensureAccessToken, getAccessToken } from "@/lib/auth/token";
import type { Vendor, VendorCategory } from "@/types/wedding";

export type VendorCategoryInfo = {
  key: VendorCategory;
  label: string;
  budgetShare: number;
  pricingUnit: "package" | "per_plate";
};

export type NegotiationJob = {
  job_id: string;
  status: "queued" | "running" | "succeeded" | "failed";
  vendor_id: string;
  perk_text?: string | null;
  estimated_savings?: number | null;
  counter_offer_amount?: number | null;
  rfp_summary?: string | null;
  error_message?: string | null;
};

export type ShortlistItem = {
  id: string;
  user_id: string;
  vendor_id: string;
  negotiation_job_id?: string | null;
  notes?: string | null;
  status: string;
  vendor?: Vendor | null;
};

/** API vendor payload already mirrors the classic Vendor shape (camelCase). */
type ApiVendor = Vendor & {
  pricingUnit?: string;
  isVerified?: boolean;
};

function toVendor(v: ApiVendor): Vendor {
  return {
    id: String(v.id),
    name: v.name,
    category: v.category,
    location: v.location,
    priceRange: v.priceRange,
    rating: v.rating,
    reviewsCount: v.reviewsCount,
    imageUrl: v.imageUrl,
    tags: v.tags,
    negotiatedDeal: v.negotiatedDeal,
  };
}

export async function fetchVendorCategories(): Promise<VendorCategoryInfo[]> {
  return apiGet<VendorCategoryInfo[]>("/api/v1/vendors/categories");
}

export async function matchVendors(params: {
  budget: number;
  category: VendorCategory;
  guests?: number;
}): Promise<Vendor[]> {
  const query = new URLSearchParams({
    budget: String(params.budget),
    category: params.category,
    guests: String(params.guests ?? 300),
  });
  const rows = await apiGet<ApiVendor[]>(`/api/v1/vendors/match?${query}`);
  return rows.map(toVendor);
}

export async function startNegotiation(params: {
  vendorId: string;
  budgetTotal: number;
  guestCount?: number;
}): Promise<NegotiationJob> {
  const token = getAccessToken();
  return apiPost<NegotiationJob>(
    "/api/v1/vendors/negotiations",
    {
      vendor_id: params.vendorId,
      budget_total: params.budgetTotal,
      guest_count: params.guestCount ?? 300,
    },
    { token },
  );
}

export async function getNegotiation(jobId: string): Promise<NegotiationJob> {
  return apiGet<NegotiationJob>(`/api/v1/vendors/negotiations/${jobId}`);
}

export async function pollNegotiation(
  jobId: string,
  options?: { intervalMs?: number; timeoutMs?: number },
): Promise<NegotiationJob> {
  const intervalMs = options?.intervalMs ?? 500;
  const timeoutMs = options?.timeoutMs ?? 30000;
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const job = await getNegotiation(jobId);
    if (job.status === "succeeded" || job.status === "failed") {
      return job;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error("Negotiation timed out");
}

export async function addToShortlist(params: {
  vendorId: string;
  negotiationJobId?: string | null;
}): Promise<ShortlistItem> {
  const token = await ensureAccessToken();
  return apiPost<ShortlistItem>(
    "/api/v1/vendors/shortlist",
    {
      vendor_id: params.vendorId,
      negotiation_job_id: params.negotiationJobId ?? null,
    },
    { token },
  );
}

export async function listShortlist(): Promise<ShortlistItem[]> {
  const token = await ensureAccessToken();
  return apiGet<ShortlistItem[]>("/api/v1/vendors/shortlist", { token });
}

export async function removeFromShortlist(vendorId: string): Promise<void> {
  const token = await ensureAccessToken();
  await apiDelete(`/api/v1/vendors/shortlist/${vendorId}`, { token });
}
