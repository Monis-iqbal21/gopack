"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types";
import { calculateItemTotal, getApplicableTier } from "@/lib/pricing";
import { useCartStore } from "@/store/cartStore";
import { useTradeStore } from "@/store/tradeStore";

type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const isTradeMode = useTradeStore((state) => state.isTradeMode);

  const tier = getApplicableTier(item.product.pricingTiers, item.quantity);
  const unitPrice = isTradeMode ? tier.tradePricePerPack : tier.pricePerPack;
  const lineTotal = calculateItemTotal(tier, item.quantity, isTradeMode);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-5xl">
          {item.product.emoji}
        </div>

        <div className="flex-1">
          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-orange-500">
                {item.product.category}
              </p>

              <h3 className="mt-1 text-lg font-black text-slate-950">
                {item.product.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Variant:{" "}
                <span className="font-bold text-slate-700">
                  {item.selectedVariant.name}
                </span>
              </p>

              <p className="mt-2 w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                Volume discount applied: {tier.minQty}
                {tier.maxQty ? `-${tier.maxQty}` : "+"}
              </p>
            </div>

            <button
              onClick={() =>
                removeItem(item.product.id, item.selectedVariant.value)
              }
              className="h-fit rounded-full bg-red-50 p-2 text-red-600 hover:bg-red-100"
              aria-label="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="flex w-fit items-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
              <button
                onClick={() =>
                  updateQuantity(
                    item.product.id,
                    item.selectedVariant.value,
                    item.quantity - 1
                  )
                }
                className="flex h-10 w-10 items-center justify-center text-slate-700 hover:bg-slate-100"
              >
                <Minus size={16} />
              </button>

              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(
                    item.product.id,
                    item.selectedVariant.value,
                    Math.max(1, Number(e.target.value))
                  )
                }
                className="h-10 w-20 border-x border-slate-200 bg-white text-center text-sm font-black text-slate-950 outline-none"
              />

              <button
                onClick={() =>
                  updateQuantity(
                    item.product.id,
                    item.selectedVariant.value,
                    item.quantity + 1
                  )
                }
                className="flex h-10 w-10 items-center justify-center text-slate-700 hover:bg-slate-100"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm text-slate-500">
                £{unitPrice.toFixed(2)} {tier.unitLabel}
              </p>

              <p className="text-2xl font-black text-slate-950">
                £{lineTotal.toFixed(2)}
              </p>

              {isTradeMode && (
                <p className="text-xs font-bold text-emerald-700">
                  Trade price active
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}