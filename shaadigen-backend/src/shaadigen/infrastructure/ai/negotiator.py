"""Stub AI negotiator — mirrors classic FE fake deal math."""

import asyncio

from shaadigen.domain.entities.vendor import Vendor
from shaadigen.domain.ports.ai_negotiator import AINegotiatorPort, NegotiationDeal


class StubAINegotiator(AINegotiatorPort):
    async def negotiate(
        self,
        *,
        vendor: Vendor,
        budget_total: int,
        guest_count: int,
    ) -> NegotiationDeal:
        # Brief delay so the modal spinner still feels intentional under Celery.
        await asyncio.sleep(1.5)
        city = (
            vendor.location.split(",")[-1].strip()
            if "," in vendor.location
            else vendor.location
        )
        savings = round(vendor.price_min * 0.12)
        counter = max(vendor.price_min - savings, 0)
        return NegotiationDeal(
            perk_text=vendor.negotiated_deal,
            estimated_savings=savings,
            counter_offer_amount=counter,
            rfp_summary=(
                f"AI RFP for {vendor.name} within ₹{budget_total:,} budget "
                f"({guest_count} guests), benchmarked against similar quotes in {city}."
            ),
        )
