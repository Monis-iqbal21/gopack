"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ShoppingCart,
  Truck,
  ChevronRight,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { products } from "@/data/products";
import { getProductFamilyBySlug } from "@/data/productFamilies";
import { calculateItemTotal, getApplicableTier } from "@/lib/pricing";
import { useCartStore } from "@/store/cartStore";
import { useTradeStore } from "@/store/tradeStore";
import ProductImage from "@/components/shop/ProductImage";
import PricingTierTable from "@/components/product/PricingTierTable";
import VariantSelector from "@/components/product/VariantSelector";
import QuantitySelector from "@/components/product/QuantitySelector";
import BulkPricingTable from "@/components/product/BulkPricingTable";
import FloatingOrderSummary from "@/components/product/FloatingOrderSummary";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const productFamily = getProductFamilyBySlug(slug);
  const product = products.find((item) => item.slug === slug);

  if (!productFamily && !product) {
    notFound();
  }

  const { isTradeMode, toggleTradeMode } = useTradeStore();
  const addItem = useCartStore((state) => state.addItem);

  /*
    NEW CLIENT-STYLE BULK TABLE PAGE
    This runs only for Grey Polythene Mailing Bags for now.
  */
  if (productFamily) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-[1500px]">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500">
            <Link href="/" className="transition-colors hover:text-[var(--primary)]">
              Home
            </Link>
            <ChevronRight size={14} className="text-slate-300" />

            <Link href="/shop" className="transition-colors hover:text-[var(--primary)]">
              Shop
            </Link>
            <ChevronRight size={14} className="text-slate-300" />

            <span className="font-bold text-slate-900">
              {productFamily.name}
            </span>
          </nav>

          <Link
            href="/shop"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-[var(--primary)]"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to shop
          </Link>

          {/* Page Header */}
          <div className="mb-8 overflow-hidden border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[360px_1fr]">
              <div className="border-b border-slate-200 bg-slate-50 p-6 lg:border-b-0 lg:border-r">
                <ProductImage
                  src={productFamily.rows[0]?.image}
                  alt={productFamily.name}
                  emoji={productFamily.rows[0]?.emoji ?? "✉️"}
                  className="h-[280px] w-full bg-white"
                />
              </div>

              <div className="p-6 md:p-8">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-md bg-slate-900 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                    {productFamily.category}
                  </span>

                  <span className="rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-green-700">
                    Bulk Order Table
                  </span>

                  {isTradeMode && (
                    <span className="rounded-md border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-800">
                      Trade Mode Active
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                  {productFamily.name}
                </h1>

                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                  {productFamily.description}
                </p>

                {/* Standard / Trade Toggle */}
                <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black text-slate-950">
                      Pricing Mode
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Switch between standard quantity breaks and trade pricing.
                    </p>
                  </div>

                  <div className="flex w-fit items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2">
                    <span
                      className={`text-xs font-black ${
                        !isTradeMode ? "text-slate-950" : "text-slate-400"
                      }`}
                    >
                      Standard
                    </span>

                    <button
                      onClick={toggleTradeMode}
                      className={`relative h-6 w-11 rounded-full transition ${
                        isTradeMode ? "bg-[var(--primary)]" : "bg-slate-300"
                      }`}
                      aria-label="Toggle trade pricing"
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                          isTradeMode ? "left-6" : "left-1"
                        }`}
                      />
                    </button>

                    <span
                      className={`text-xs font-black ${
                        isTradeMode
                          ? "text-[var(--primary)]"
                          : "text-slate-400"
                      }`}
                    >
                      Trade
                    </span>
                  </div>
                </div>

                {/* Specs */}
                {productFamily.specifications && (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(productFamily.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            {key}
                          </p>
                          <p className="mt-1 text-sm font-black text-slate-900">
                            {value}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table Intro */}
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                Select size and quantity
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Increase quantity in any row. The matching price column will
                highlight automatically. Items appear in the order summary first
                and are only added to basket when you click Add & Continue.
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600">
              Prices exclude VAT
            </div>
          </div>

          <BulkPricingTable family={productFamily} />
        </div>

        <FloatingOrderSummary />
      </section>
    );
  }

  /*
    OLD NORMAL PRODUCT DETAIL PAGE
    This keeps your existing UI for all other products.
  */

  const selectedProduct = product;

  if (!selectedProduct) {
    notFound();
  }

  const [selectedVariant, setSelectedVariant] = useState(
    selectedProduct.variants[0]
  );
  const [quantity, setQuantity] = useState(1);

  const activeTier = useMemo(() => {
    return getApplicableTier(selectedProduct.pricingTiers, quantity);
  }, [selectedProduct.pricingTiers, quantity]);

  const total = useMemo(() => {
    return calculateItemTotal(activeTier, quantity, isTradeMode);
  }, [activeTier, quantity, isTradeMode]);

  const nextTier = selectedProduct.pricingTiers.find(
    (tier) => tier.minQty > quantity
  );

  const handleAddToCart = () => {
    addItem(selectedProduct, selectedVariant, quantity);
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Modern Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link href="/" className="transition-colors hover:text-[var(--primary)]">
            Home
          </Link>
          <ChevronRight size={14} className="text-slate-300" />

          <Link href="/shop" className="transition-colors hover:text-[var(--primary)]">
            Shop
          </Link>
          <ChevronRight size={14} className="text-slate-300" />

          <span className="font-bold text-slate-900">
            {selectedProduct.name}
          </span>
        </nav>

        <Link
          href="/shop"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-[var(--primary)]"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to shop
        </Link>

        {/* Main Product Layout */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          {/* LEFT COLUMN */}
          <div className="sticky top-28 space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-2 shadow-sm">
              <ProductImage
                src={selectedProduct.image}
                alt={selectedProduct.name}
                emoji={selectedProduct.emoji}
                className="h-[400px] w-full rounded-3xl bg-slate-50 md:h-[500px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-center">
                <Truck className="mb-2 text-[var(--primary)]" size={20} />
                <p className="text-xs font-black text-slate-900">Next-Day</p>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-500">
                  UK Delivery
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-center">
                <ShieldCheck className="mb-2 text-[var(--primary)]" size={20} />
                <p className="text-xs font-black text-slate-900">Quality</p>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-500">
                  Guaranteed
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-center">
                <PackageCheck className="mb-2 text-[var(--primary)]" size={20} />
                <p className="text-xs font-black text-slate-900">In Stock</p>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-500">
                  Ready to Ship
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-md bg-slate-900 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                  {selectedProduct.category}
                </span>

                {selectedProduct.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-green-700"
                  >
                    {badge}
                  </span>
                ))}

                {isTradeMode && (
                  <span className="rounded-md border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-800">
                    Trade Mode Active
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                {selectedProduct.name}
              </h1>

              <div className="mt-4 flex items-center gap-3 text-sm">
                <span className="font-semibold text-slate-500">SKU:</span>
                <span className="rounded bg-slate-200 px-2 py-0.5 font-bold text-slate-700">
                  {selectedProduct.sku}
                </span>
              </div>
            </div>

            <p className="mb-8 text-base leading-relaxed text-slate-600">
              {selectedProduct.description}
            </p>

            {/* Standard / Trade Toggle */}
            <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-slate-950">
                  Pricing Mode
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Switch between standard and trade prices.
                </p>
              </div>

              <div className="flex w-fit items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                <span
                  className={`text-xs font-black ${
                    !isTradeMode ? "text-slate-950" : "text-slate-400"
                  }`}
                >
                  Standard
                </span>

                <button
                  onClick={toggleTradeMode}
                  className={`relative h-6 w-11 rounded-full transition ${
                    isTradeMode ? "bg-[var(--primary)]" : "bg-slate-300"
                  }`}
                  aria-label="Toggle trade pricing"
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      isTradeMode ? "left-6" : "left-1"
                    }`}
                  />
                </button>

                <span
                  className={`text-xs font-black ${
                    isTradeMode ? "text-[var(--primary)]" : "text-slate-400"
                  }`}
                >
                  Trade
                </span>
              </div>
            </div>

            {/* Modern Pricing Card */}
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Current Price
              </p>

              <div className="mt-2 flex flex-wrap items-baseline gap-2">
                <span className="text-5xl font-black tracking-tight text-slate-900">
                  £
                  {(isTradeMode
                    ? activeTier.tradePricePerPack
                    : activeTier.pricePerPack
                  ).toFixed(2)}
                </span>

                <span className="text-sm font-bold text-slate-500">
                  / {activeTier.unitLabel}
                </span>

                {isTradeMode && (
                  <span className="ml-3 text-sm font-bold text-slate-400 line-through">
                    £{activeTier.pricePerPack.toFixed(2)}
                  </span>
                )}
              </div>

              {nextTier && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-[var(--primary)]"
                  />
                  <p className="text-sm font-semibold text-slate-700">
                    Add{" "}
                    <span className="font-black text-slate-900">
                      {nextTier.minQty - quantity}
                    </span>{" "}
                    more to unlock the bulk price of{" "}
                    <span className="font-black text-[var(--primary-dark)]">
                      £
                      {(isTradeMode
                        ? nextTier.tradePricePerPack
                        : nextTier.pricePerPack
                      ).toFixed(2)}
                    </span>{" "}
                    per {activeTier.unitLabel}.
                  </p>
                </div>
              )}
            </div>

            <div className="mb-8 space-y-8">
              <VariantSelector
                variants={selectedProduct.variants}
                selectedVariant={selectedVariant}
                onChange={setSelectedVariant}
              />

              <PricingTierTable
                tiers={selectedProduct.pricingTiers}
                quantity={quantity}
              />

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <QuantitySelector
                  quantity={quantity}
                  setQuantity={setQuantity}
                  total={total}
                  unitLabel={activeTier.unitLabel}
                />
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--primary)] py-5 text-lg font-black text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-[var(--primary-dark)] active:translate-y-0"
            >
              <ShoppingCart
                size={22}
                className="transition-transform group-hover:scale-110"
              />
              Add to Cart — £{total.toFixed(2)}
            </button>
          </div>
        </div>

        <hr className="my-16 border-slate-200 md:my-24" />

        {/* Specifications */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-4xl">
              Product Specifications
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Technical details and measurements for {selectedProduct.name}
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {Object.entries(selectedProduct.specifications).map(
              ([key, value], index) => (
                <div
                  key={key}
                  className={`flex flex-col p-5 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center ${
                    index !== 0 ? "border-t border-slate-100" : ""
                  }`}
                >
                  <div className="w-full sm:w-1/3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {key}
                    </p>
                  </div>
                  <div className="mt-1 w-full sm:mt-0 sm:w-2/3">
                    <p className="text-sm font-black text-slate-900">
                      {value}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}