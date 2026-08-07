"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/toast";
import { formatINR } from "@/lib/utils";
import type { Vendor } from "@/types/wedding";

type NegotiationModalProps = {
  vendor: Vendor | null;
  onClose: () => void;
};

export function NegotiationModal({ vendor, onClose }: NegotiationModalProps) {
  const toast = useToast();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!vendor) {
      setDone(false);
      return;
    }
    setDone(false);
    const timer = setTimeout(() => {
      setDone(true);
      toast(`AI RFP sent to ${vendor.name} — deal locked in!`, "ai");
    }, 2200);
    return () => clearTimeout(timer);
  }, [vendor, toast]);

  return (
    <Modal
      open={Boolean(vendor)}
      onClose={onClose}
      title={done ? "✅ Deal Secured!" : "🤖 AI Negotiating…"}
    >
      {vendor && !done ? (
        <div className="mt-5 flex flex-col items-center gap-4 py-6">
          <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
          <p className="text-center text-sm text-stone-600">
            Sending AI-crafted RFP to <strong>{vendor.name}</strong>,
            benchmarking against 42 similar quotes in{" "}
            {vendor.location.split(",")[1]?.trim() ?? "your city"}…
          </p>
        </div>
      ) : null}

      {vendor && done ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-900">
              {vendor.name} accepted your AI counter-offer:
            </p>
            <p className="mt-1 text-sm text-emerald-800">
              🎁 {vendor.negotiatedDeal}
            </p>
            <p className="mt-2 text-xs text-emerald-700">
              Estimated savings vs. walk-in quote:{" "}
              <strong>
                {formatINR(Math.round(vendor.priceRange.min * 0.12))}
              </strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-bold text-amber-50 transition-all hover:bg-stone-700"
          >
            Add to My Shortlist
          </button>
        </div>
      ) : null}
    </Modal>
  );
}
