"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, RotateCcw, Truck } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useTradeStore } from "@/store/tradeStore";
import { calculateCartTotals } from "@/lib/pricing";

export default function CartSummary() {
  const [couponInput, setCouponInput] = useState("");

  const { items, couponCode, discount, applyCoupon } = useCartStore();
  const isTradeMode = useTradeStore((state) => state.isTradeMode);

  const totalsBeforeCoupon = calculateCartTotals(items, isTradeMode, 0);
  const totals = calculateCartTotals(items, isTradeMode, discount);

  const handleApplyCoupon = () => {
    applyCoupon(couponInput, totalsBeforeCoupon.subtotal);
    setCouponInput("");
  };

  return (
    <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-5 text-xl font-black text-slate-950">
        Order summary
      </h2>

      {isTradeMode && (
        <div className="mb-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          Trade pricing is active. Minimum checkout basket is £500 ex VAT.
        </div>
      )}

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal ex VAT</span>
          <span className="font-bold text-slate-900">
            £{totals.subtotal.toFixed(2)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>Discount {couponCode && `(${couponCode})`}</span>
            <span className="font-bold">-£{discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600">
          <span>VAT 20%</span>
          <span className="font-bold text-slate-900">
            £{totals.vat.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Delivery</span>
          <span className="font-bold text-slate-900">
            {totals.delivery === 0 ? "FREE" : `£${totals.delivery.toFixed(2)}`}
          </span>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <div className="flex justify-between">
            <span className="text-base font-black text-slate-950">
              Total inc VAT
            </span>
            <span className="text-2xl font-black text-orange-500">
              £{totals.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Coupon code
        </label>

        <div className="flex gap-2">
          <input
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="PACK10"
            className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
          />

          <button
            onClick={handleApplyCoupon}
            className="rounded-full bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            Apply
          </button>
        </div>
      </div>

      <Link
        href="/checkout"
        className="mt-5 flex w-full items-center justify-center rounded-full bg-orange-500 px-5 py-4 text-sm font-black text-white transition hover:bg-orange-600"
      >
        Proceed to Checkout
      </Link>

      <div className="mt-5 grid gap-3 text-xs font-bold text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500" />
          Secure checkout
        </div>

        <div className="flex items-center gap-2">
          <RotateCcw size={16} className="text-emerald-500" />
          Free returns
        </div>

        <div className="flex items-center gap-2">
          <Truck size={16} className="text-emerald-500" />
          Next-day delivery available
        </div>
      </div>
    </div>
  );
}