"use client";

import { PricingTier } from "@/types";
import { getApplicableTier } from "@/lib/pricing";
import { useTradeStore } from "@/store/tradeStore";
import { CheckCircle2, TrendingDown } from "lucide-react";

type PricingTierTableProps = {
  tiers: PricingTier[];
  quantity: number;
};

export default function PricingTierTable({
  tiers,
  quantity,
}: PricingTierTableProps) {
  const isTradeMode = useTradeStore((state) => state.isTradeMode);
  const activeTier = getApplicableTier(tiers, quantity);
  const firstTier = tiers[0];

  const getQtyLabel = (tier: PricingTier) => {
    if (tier.maxQty === null) return `${tier.minQty}+`;
    return `${tier.minQty} - ${tier.maxQty}`;
  };

  const getPrice = (tier: PricingTier) => {
    return isTradeMode ? tier.tradePricePerPack : tier.pricePerPack;
  };

  const getSavingVsFirstTier = (tier: PricingTier) => {
    const basePrice = getPrice(firstTier);
    const currentPrice = getPrice(tier);

    if (basePrice <= currentPrice) return 0;

    return Math.round(((basePrice - currentPrice) / basePrice) * 100);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-black text-slate-950">
            Live pricing tiers
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Increase quantity to unlock cheaper prices.
          </p>
        </div>

        {isTradeMode && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            Trade prices active
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Price/Pack</th>
              <th className="hidden px-4 py-3 sm:table-cell">Per Unit</th>
              <th className="px-4 py-3">You Save</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {tiers.map((tier) => {
              const isActive =
                tier.minQty === activeTier.minQty &&
                tier.maxQty === activeTier.maxQty;

              const price = getPrice(tier);
              const saving = getSavingVsFirstTier(tier);

              return (
                <tr
                  key={`${tier.minQty}-${tier.maxQty}`}
                  className={`transition ${
                    isActive ? "bg-orange-50" : "bg-white hover:bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`font-black ${
                          isActive ? "text-orange-600" : "text-slate-900"
                        }`}
                      >
                        {getQtyLabel(tier)}
                      </span>

                      {tier.isPopular && (
                        <span className="w-fit rounded-full bg-slate-900 px-2 py-1 text-[10px] font-bold uppercase text-white">
                          Best Value
                        </span>
                      )}

                      {isActive && (
                        <span className="flex items-center gap-1 text-xs font-bold text-orange-600">
                          <CheckCircle2 size={13} />
                          Active
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-slate-950">
                        £{price.toFixed(2)}
                      </span>

                      {isTradeMode && (
                        <span className="text-xs text-slate-400 line-through">
                          £{tier.pricePerPack.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="hidden px-4 py-4 text-slate-500 sm:table-cell">
                    {tier.unitLabel}
                  </td>

                  <td className="px-4 py-4">
                    {saving > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        <TrendingDown size={13} />
                        {saving}% off
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Base price</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        The highlighted row updates automatically based on the selected
        quantity.
      </p>
    </div>
  );
}