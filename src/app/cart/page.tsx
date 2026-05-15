"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useTradeStore } from "@/store/tradeStore";
import { calculateCartTotals } from "@/lib/pricing";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import DeliveryProgressBar from "@/components/cart/DeliveryProgressBar";

export default function CartPage() {
  const { items, discount } = useCartStore();
  const isTradeMode = useTradeStore((state) => state.isTradeMode);

  const totals = calculateCartTotals(items, isTradeMode, discount);

  const totalItemTypes = items.length;
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  // 1. EMPTY CART STATE
  if (items.length === 0) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-10 text-center shadow-xl shadow-slate-200/50 md:p-16">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-green-50 text-green-600 shadow-inner">
            <ShoppingCart size={40} strokeWidth={2} />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Your cart is empty
          </h1>

          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-500">
            Looks like you haven't added anything yet. Browse our packaging
            products and find exactly what you need.
          </p>

          <Link
            href="/shop"
            className="group mx-auto mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-8 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl hover:shadow-green-900/20"
          >
            Start Shopping
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    );
  }

  // 2. FILLED CART STATE
  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-green-700">
              <ShoppingCart size={14} />
              Shopping Cart
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              Review your order
            </h1>

            <p className="mt-3 text-sm font-medium text-slate-500">
              You have{" "}
              <span className="font-bold text-slate-700">
                {totalItemTypes} item type{totalItemTypes > 1 ? "s" : ""}
              </span>{" "}
              and{" "}
              <span className="font-bold text-slate-700">
                {totalQuantity} total pack{totalQuantity > 1 ? "s" : ""}
              </span>{" "}
              in your basket.
            </p>
          </div>

          <Link
            href="/shop"
            className="group flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-green-600 hover:text-green-600 hover:shadow-md"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Continue Shopping
          </Link>
        </div>

        {/* Cart Content Layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
          {/* Left Column */}
          <div className="space-y-6">
            <DeliveryProgressBar
              subtotal={totals.subtotal}
              amountForFreeDelivery={totals.amountForFreeDelivery}
              qualifiesForFreeDelivery={totals.qualifiesForFreeDelivery}
            />

            <div className="space-y-4 rounded-[2rem] border border-slate-100 bg-white p-2 shadow-sm sm:p-4 md:p-6">
              {items.map((item) => {
                const itemKey =
                  item.type === "bulk"
                    ? `bulk-${item.row.id}`
                    : `standard-${item.product.id}-${item.selectedVariant.value}`;

                return <CartItem key={itemKey} item={item} />;
              })}
            </div>
          </div>

          {/* Right Column */}
          <div className="relative">
            <div className="sticky top-28">
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}