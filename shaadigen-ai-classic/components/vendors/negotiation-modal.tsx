"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/toast";
import { ApiError } from "@/lib/api";
import { formatINR } from "@/lib/utils";
import {
  addToShortlist,
  pollNegotiation,
  startNegotiation,
  type NegotiationJob,
} from "@/lib/vendors/api";
import type { Vendor } from "@/types/wedding";

type NegotiationModalProps = {
  vendor: Vendor | null;
  budgetTotal: number;
  onClose: () => void;
};

export function NegotiationModal({
  vendor,
  budgetTotal,
  onClose,
}: NegotiationModalProps) {
  const toast = useToast();
  const [job, setJob] = useState<NegotiationJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!vendor) {
      setJob(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setJob(null);
    setError(null);

    (async () => {
      try {
        const started = await startNegotiation({
          vendorId: vendor.id,
          budgetTotal,
          guestCount: 300,
        });
        const finished = await pollNegotiation(started.job_id);
        if (cancelled) return;
        setJob(finished);
        if (finished.status === "succeeded") {
          toast(`AI RFP sent to ${vendor.name} — deal locked in!`, "ai");
        } else {
          setError(finished.error_message ?? "Negotiation failed");
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Negotiation failed");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [vendor, budgetTotal, toast]);

  const done = job?.status === "succeeded";
  const perk = job?.perk_text ?? vendor?.negotiatedDeal ?? "";
  const savings =
    job?.estimated_savings ??
    (vendor ? Math.round(vendor.priceRange.min * 0.12) : 0);

  async function handleShortlist() {
    if (!vendor || !job) return;
    setSaving(true);
    try {
      await addToShortlist({
        vendorId: vendor.id,
        negotiationJobId: job.job_id,
      });
      toast(`${vendor.name} added to your shortlist`, "success");
      onClose();
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 401
          ? "Sign in required to save shortlist"
          : err instanceof Error
            ? err.message
            : "Could not save shortlist";
      toast(message, "info");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={Boolean(vendor)}
      onClose={onClose}
      title={done ? "✅ Deal Secured!" : error ? "Negotiation issue" : "🤖 AI Negotiating…"}
    >
      {vendor && !done && !error ? (
        <div className="mt-5 flex flex-col items-center gap-4 py-6">
          <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
          <p className="text-center text-sm text-stone-600">
            Sending AI-crafted RFP to <strong>{vendor.name}</strong>,
            benchmarking against 42 similar quotes in{" "}
            {vendor.location.split(",")[1]?.trim() ?? "your city"}…
          </p>
        </div>
      ) : null}

      {vendor && error ? (
        <div className="mt-5 space-y-4">
          <p className="text-sm text-rose-700">{error}</p>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-bold text-amber-50 transition-all hover:bg-stone-700"
          >
            Close
          </button>
        </div>
      ) : null}

      {vendor && done ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-900">
              {vendor.name} accepted your AI counter-offer:
            </p>
            <p className="mt-1 text-sm text-emerald-800">🎁 {perk}</p>
            <p className="mt-2 text-xs text-emerald-700">
              Estimated savings vs. walk-in quote:{" "}
              <strong>{formatINR(savings)}</strong>
            </p>
            {job?.rfp_summary ? (
              <p className="mt-2 text-xs text-emerald-700/80">{job.rfp_summary}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleShortlist}
            disabled={saving}
            className="w-full rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-bold text-amber-50 transition-all hover:bg-stone-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add to My Shortlist"}
          </button>
        </div>
      ) : null}
    </Modal>
  );
}
