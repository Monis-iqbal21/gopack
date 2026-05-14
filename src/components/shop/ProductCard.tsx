"use client";

import Link from "next/link";
import { ShoppingCart, Tag } from "lucide-react";
import { Product } from "@/types";
import { useTradeStore } from "@/store/tradeStore";
import { useCartStore } from "@/store/cartStore";
import { getSavingsPercentage } from "@/lib/pricing";
import ProductImage from "./ProductImage";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const isTradeMode = useTradeStore((state) => state.isTradeMode);
  const addItem = useCartStore((state) => state.addItem);

  const firstTier = product.pricingTiers[0];
  const defaultVariant = product.variants[0];

  const activePrice = isTradeMode
    ? firstTier.tradePricePerPack
    : firstTier.pricePerPack;

  const saving = getSavingsPercentage(
    firstTier.pricePerPack,
    firstTier.tradePricePerPack
  );

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product, defaultVariant, 1);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden border border-slate-200 bg-white transition hover:border-[var(--primary)] hover:shadow-md"
    >
      {/* Image first, emoji fallback if image is missing */}
      <ProductImage
        src={product.image}
        alt={product.name}
        emoji={product.emoji}
        className="h-48 w-full border-b border-slate-100"
      />

      <div className="p-4 text-center">
        {/* Product badge */}
        {product.badges?.[0] && (
          <p className="mb-2 text-xs font-bold text-[var(--primary)]">
            {product.badges[0]}
          </p>
        )}

        {/* Product name */}
        <h3 className="mx-auto min-h-[42px] max-w-[200px] text-sm font-black leading-5 text-slate-900">
          {product.name}
        </h3>

        {/* Product category */}
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {product.category}
        </p>

        {/* Price */}
        <div className="mt-3">
          <p className="text-xs font-semibold text-slate-500">
            From{" "}
            {isTradeMode && (
              <span className="mr-1 text-slate-400 line-through">
                £{firstTier.pricePerPack.toFixed(2)}
              </span>
            )}
            <span className="font-black text-[var(--primary)]">
              £{activePrice.toFixed(2)}
            </span>
          </p>

          <p className="mt-1 text-xs text-slate-400">{firstTier.unitLabel}</p>
        </div>

        {/* Trade saving */}
        {isTradeMode && (
          <p className="mt-2 text-xs font-bold text-emerald-700">
            Trade saving {saving}%
          </p>
        )}

        {/* Eco badge */}
        {product.isEco && (
          <div className="mx-auto mt-3 flex w-fit items-center gap-1 rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-bold text-[var(--primary-dark)]">
            <Tag size={12} />
            Eco
          </div>
        )}

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full rounded-md bg-[var(--primary)] px-4 py-3 text-sm font-black text-white transition hover:bg-[var(--primary-dark)]"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <ShoppingCart size={17} />
            Add to Cart
          </span>
        </button>
      </div>
    </Link>
  );
}