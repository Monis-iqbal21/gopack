"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types";
import {
  calculateBulkItemTotal,
  calculateBulkTotalUnits,
  calculateItemTotal,
  getActivePriceBreak,
  getApplicableTier,
  getBulkUnitPrice,
} from "@/lib/pricing";
import { useCartStore } from "@/store/cartStore";
import { useTradeStore } from "@/store/tradeStore";
import ProductImage from "@/components/shop/ProductImage";

type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const updateBulkQuantity = useCartStore((state) => state.updateBulkQuantity);
  const removeBulkItem = useCartStore((state) => state.removeBulkItem);

  const isTradeMode = useTradeStore((state) => state.isTradeMode);

  if (item.type === "bulk") {
    const unitPrice = getBulkUnitPrice(
      item.row,
      item.quantity,
      isTradeMode,
      item.priceBreaks,
    );

    const lineTotal = calculateBulkItemTotal(
      item.row,
      item.quantity,
      isTradeMode,
      item.priceBreaks,
    );

    const totalUnits = calculateBulkTotalUnits(item.row, item.quantity);

    const activePriceBreak = getActivePriceBreak(
      item.priceBreaks,
      item.quantity,
    );

    const activePriceLabel = isTradeMode
      ? "Trade"
      : (activePriceBreak?.label ?? "Base");

    const rowValues = item.row.values ?? {};

    const sizeText = String(
      rowValues.sizeInches ??
        rowValues.size ??
        // fallback for old saved cart items
        (item.row as any).sizeInches ??
        "-",
    );

    const gaugeText = String(
      rowValues.gauge ??
        // fallback for old saved cart items
        (item.row as any).gauge ??
        "",
    );

    return (
      <div className="group relative flex flex-col gap-4 rounded-2xl border border-green-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-md sm:flex-row sm:items-center">
        <ProductImage
          src={item.row.image}
          alt={item.row.name}
          emoji={item.row.emoji}
          className="h-20 w-20 shrink-0 rounded-xl border border-green-100 bg-green-50"
        />

        <div className="flex flex-1 flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700">
                Bulk Table Item
              </p>

              <h3 className="line-clamp-1 text-base font-bold leading-tight text-slate-900">
                {item.row.name}
              </h3>

              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-medium text-slate-500">
                  SKU:{" "}
                  <span className="font-bold text-slate-700">
                    {item.row.sku}
                  </span>
                </span>

                <span className="text-[11px] font-medium text-slate-500">
                  Size:{" "}
                  <span className="font-bold text-slate-700">{sizeText}</span>
                </span>

                <span className="rounded-md bg-green-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-green-700">
                  Price break: {activePriceLabel}
                </span>

                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                  {totalUnits.toLocaleString()} bags
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold text-slate-500">
                <span>Pack Qty: {item.row.packQty.toLocaleString()}</span>
                <span>Box Qty: {item.row.boxQty.toLocaleString()}</span>
                {gaugeText && <span>{gaugeText}</span>}
              </div>
            </div>

            <button
              onClick={() => removeBulkItem(item.row.id)}
              className="shrink-0 rounded-full p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label="Remove bulk item"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex h-9 w-fit items-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 shadow-inner">
              <button
                onClick={() =>
                  updateBulkQuantity(item.row.id, item.quantity - 1)
                }
                className="flex h-full w-9 items-center justify-center text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
              >
                <Minus size={14} strokeWidth={2.5} />
              </button>

              <div className="flex h-full w-12 items-center justify-center bg-white text-xs font-black text-slate-900">
                {item.quantity}
              </div>

              <button
                onClick={() =>
                  updateBulkQuantity(item.row.id, item.quantity + 1)
                }
                className="flex h-full w-9 items-center justify-center text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
            </div>

            <div className="text-right">
              <p className="text-[11px] font-medium text-slate-500">
                £{unitPrice.toFixed(2)} / {item.row.unitLabel}
              </p>

              <div className="flex items-center justify-end gap-2">
                {isTradeMode && (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700">
                    Trade
                  </span>
                )}

                <p className="text-lg font-black text-slate-900">
                  £{lineTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tier = getApplicableTier(item.product.pricingTiers, item.quantity);
  const unitPrice = isTradeMode ? tier.tradePricePerPack : tier.pricePerPack;
  const lineTotal = calculateItemTotal(tier, item.quantity, isTradeMode);

  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-green-100 hover:shadow-md sm:flex-row sm:items-center">
      <ProductImage
        src={item.product.image}
        alt={item.product.name}
        emoji={item.product.emoji}
        className="h-20 w-20 shrink-0 rounded-xl border border-slate-100 bg-slate-50"
      />

      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600">
              {item.product.category}
            </p>

            <h3 className="line-clamp-1 text-base font-bold leading-tight text-slate-900">
              {item.product.name}
            </h3>

            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-medium text-slate-500">
                Variant:{" "}
                <span className="font-bold text-slate-700">
                  {item.selectedVariant.name}
                </span>
              </p>

              <span className="rounded-md bg-green-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-green-700">
                Vol. Discount: {tier.minQty}
                {tier.maxQty ? `-${tier.maxQty}` : "+"}
              </span>
            </div>
          </div>

          <button
            onClick={() =>
              removeItem(item.product.id, item.selectedVariant.value)
            }
            className="shrink-0 rounded-full p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex h-9 w-fit items-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 shadow-inner">
            <button
              onClick={() =>
                updateQuantity(
                  item.product.id,
                  item.selectedVariant.value,
                  item.quantity - 1,
                )
              }
              className="flex h-full w-9 items-center justify-center text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
            >
              <Minus size={14} strokeWidth={2.5} />
            </button>

            <div className="flex h-full w-12 items-center justify-center bg-white text-xs font-black text-slate-900">
              {item.quantity}
            </div>

            <button
              onClick={() =>
                updateQuantity(
                  item.product.id,
                  item.selectedVariant.value,
                  item.quantity + 1,
                )
              }
              className="flex h-full w-9 items-center justify-center text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
            >
              <Plus size={14} strokeWidth={2.5} />
            </button>
          </div>

          <div className="text-right">
            <p className="text-[11px] font-medium text-slate-500">
              £{unitPrice.toFixed(2)} {tier.unitLabel}
            </p>

            <div className="flex items-center justify-end gap-2">
              {isTradeMode && (
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700">
                  Trade
                </span>
              )}

              <p className="text-lg font-black text-slate-900">
                £{lineTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
