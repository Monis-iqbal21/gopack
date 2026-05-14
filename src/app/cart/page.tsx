"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
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

  if (items.length === 0) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-500">
            <ShoppingCart size={38} />
          </div>

          <h1 className="text-3xl font-black text-slate-950">
            Your cart is empty
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Browse our packaging products and add cardboard boxes, mailing bags,
            bubble wrap or warehouse supplies to your cart.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-full bg-orange-500 px-6 py-4 text-sm font-black text-white hover:bg-orange-600"
          >
            Shop Now
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-orange-500">
              Shopping Cart
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-5xl">
              Review your order
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              You have {items.length} item type{items.length > 1 ? "s" : ""} in
              your basket.
            </p>
          </div>

          <Link
            href="/shop"
            className="w-fit rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <DeliveryProgressBar
              subtotal={totals.subtotal}
              amountForFreeDelivery={totals.amountForFreeDelivery}
              qualifiesForFreeDelivery={totals.qualifiesForFreeDelivery}
            />

            {items.map((item) => (
              <CartItem
                key={`${item.product.id}-${item.selectedVariant.value}`}
                item={item}
              />
            ))}
          </div>

          <CartSummary />
        </div>
      </div>
    </section>
  );
}