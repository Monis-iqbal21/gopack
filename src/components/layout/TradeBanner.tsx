"use client";

import { useTradeStore } from "@/store/tradeStore";
import { Building2, X } from "lucide-react";

export default function TradeBanner() {
  const { isTradeMode, setTradeMode } = useTradeStore();

  if (!isTradeMode) return null;

  return (
    <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Building2 size={18} />
          <span>
            Trade Prices Active — up to 40% off. Min basket £500 ex VAT.
          </span>
        </div>

        <button
          onClick={() => setTradeMode(false)}
          className="rounded-full p-1 text-emerald-700 hover:bg-emerald-100"
          aria-label="Turn off trade mode"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}