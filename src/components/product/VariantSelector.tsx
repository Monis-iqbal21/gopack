"use client";

import { ProductVariant } from "@/types";

type VariantSelectorProps = {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onChange: (variant: ProductVariant) => void;
};

export default function VariantSelector({
  variants,
  selectedVariant,
  onChange,
}: VariantSelectorProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4">
        <h2 className="text-lg font-black text-slate-950">Choose size</h2>
        <p className="mt-1 text-sm text-slate-500">
          Selected:{" "}
          <span className="font-bold text-slate-800">
            {selectedVariant.name}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isActive = selectedVariant.value === variant.value;

          return (
            <button
              key={variant.value}
              onClick={() => onChange(variant)}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                isActive
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50"
              }`}
            >
              {variant.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}