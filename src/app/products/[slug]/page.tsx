"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShoppingCart, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { products } from "@/data/products";
import { calculateItemTotal, getApplicableTier } from "@/lib/pricing";
import { useCartStore } from "@/store/cartStore";
import { useTradeStore } from "@/store/tradeStore";
import ProductImage from "@/components/shop/ProductImage";
import PricingTierTable from "@/components/product/PricingTierTable";
import VariantSelector from "@/components/product/VariantSelector";
import QuantitySelector from "@/components/product/QuantitySelector";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();

  const product = products.find((item) => item.slug === params.slug);

  if (!product) {
    notFound();
  }

  const isTradeMode = useTradeStore((state) => state.isTradeMode);
  const addItem = useCartStore((state) => state.addItem);

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);

  const activeTier = useMemo(() => {
    return getApplicableTier(product.pricingTiers, quantity);
  }, [product.pricingTiers, quantity]);

  const total = useMemo(() => {
    return calculateItemTotal(activeTier, quantity, isTradeMode);
  }, [activeTier, quantity, isTradeMode]);

  const nextTier = product.pricingTiers.find((tier) => tier.minQty > quantity);

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-orange-500">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-orange-500">
            Shop
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{product.name}</span>
        </div>

        <Link
          href="/shop"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-500"
        >
          <ArrowLeft size={17} />
          Back to shop
        </Link>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left Product Visual */}
          <div className="space-y-5">
            <ProductImage
              src={product.image}
              alt={product.name}
              emoji={product.emoji}
              className="h-[430px] w-full rounded-2xl border border-slate-200"
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <Truck className="mb-2 text-orange-500" size={22} />
                <p className="text-sm font-black text-slate-950">
                  Next-day delivery
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Available across the UK
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <CheckCircle2 className="mb-2 text-emerald-500" size={22} />
                <p className="text-sm font-black text-slate-950">
                  Quality checked
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Reliable packaging stock
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <ShoppingCart className="mb-2 text-orange-500" size={22} />
                <p className="text-sm font-black text-slate-950">
                  Bulk discounts
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Cheaper prices at volume
                </p>
              </div>
            </div>
          </div>

          {/* Right Product Info */}
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700"
                  >
                    {badge}
                  </span>
                ))}

                {isTradeMode && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    Trade price active
                  </span>
                )}
              </div>

              <p className="text-sm font-bold uppercase tracking-wider text-orange-500">
                {product.category}
              </p>

              <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-5xl">
                {product.name}
              </h1>

              <p className="mt-3 text-sm font-semibold text-slate-400">
                SKU: {product.sku}
              </p>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                {product.description}
              </p>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Current price
                </p>

                <div className="mt-2 flex flex-wrap items-end gap-3">
                  <p className="text-4xl font-black text-slate-950">
                    £
                    {(isTradeMode
                      ? activeTier.tradePricePerPack
                      : activeTier.pricePerPack
                    ).toFixed(2)}
                  </p>

                  <p className="mb-1 text-sm font-semibold text-slate-500">
                    {activeTier.unitLabel}
                  </p>

                  {isTradeMode && (
                    <p className="mb-1 text-sm text-slate-400 line-through">
                      £{activeTier.pricePerPack.toFixed(2)}
                    </p>
                  )}
                </div>

                {nextTier && (
                  <p className="mt-3 text-sm font-semibold text-emerald-700">
                    Add {nextTier.minQty - quantity} more to unlock £
                    {(isTradeMode
                      ? nextTier.tradePricePerPack
                      : nextTier.pricePerPack
                    ).toFixed(2)}{" "}
                    pricing.
                  </p>
                )}
              </div>
            </div>

            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onChange={setSelectedVariant}
            />

            <PricingTierTable
              tiers={product.pricingTiers}
              quantity={quantity}
            />

            <QuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
              total={total}
              unitLabel={activeTier.unitLabel}
            />

            <button
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-4 text-base font-black text-white transition hover:bg-orange-600"
            >
              <ShoppingCart size={20} />
              Add to Cart — £{total.toFixed(2)}
            </button>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="mb-5 text-2xl font-black text-slate-950">
            Product specifications
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  {key}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
