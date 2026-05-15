"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useTradeStore } from "@/store/tradeStore";
import {
  calculateBulkItemTotal,
  calculateBulkTotalUnits,
  getBulkUnitPrice,
} from "@/lib/pricing";
import {
  Minus,
  Plus,
  ShoppingBasket,
  Trash2,
  GripVertical,
  X,
} from "lucide-react";

export default function FloatingOrderSummary() {
  const {
    pendingBulkItems,
    setPendingBulkQuantity,
    removePendingBulkItem,
    clearPendingBulkOrder,
    addPendingBulkOrderToCart,
  } = useCartStore();

  const isTradeMode = useTradeStore((state) => state.isTradeMode);

  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({
    x: 24,
    y: 180,
  });

  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    panelX: 0,
    panelY: 0,
  });

  const pendingSignature = useMemo(() => {
    return pendingBulkItems
      .map((item) => `${item.row.id}:${item.quantity}`)
      .join("|");
  }, [pendingBulkItems]);

  useEffect(() => {
    if (pendingBulkItems.length > 0) {
      setIsMinimized(false);
    }
  }, [pendingSignature, pendingBulkItems.length]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const dx = event.clientX - dragStartRef.current.mouseX;
      const dy = event.clientY - dragStartRef.current.mouseY;

      const nextX = dragStartRef.current.panelX + dx;
      const nextY = dragStartRef.current.panelY + dy;

      setPosition({
        x: Math.max(8, Math.min(window.innerWidth - 420, nextX)),
        y: Math.max(8, Math.min(window.innerHeight - 90, nextY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  if (pendingBulkItems.length === 0) return null;

  const subtotal = pendingBulkItems.reduce((total, item) => {
    return (
      total +
      calculateBulkItemTotal(
        item.row,
        item.quantity,
        isTradeMode,
        item.priceBreaks
      )
    );
  }, 0);

  const vat = Math.round(subtotal * 0.2 * 100) / 100;
  const total = Math.round((subtotal + vat) * 100) / 100;

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);

    dragStartRef.current = {
      mouseX: event.clientX,
      mouseY: event.clientY,
      panelX: position.x,
      panelY: position.y,
    };
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-green-800 px-5 py-3 text-sm font-black text-white shadow-2xl transition hover:bg-green-900 md:bottom-6 md:right-6"
      >
        <ShoppingBasket size={18} />
        Order Summary ({pendingBulkItems.length})
      </button>
    );
  }

  return (
    <aside
      className="fixed z-50 w-[calc(100%-2rem)] max-w-md overflow-hidden border border-green-900 bg-white shadow-2xl"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {/* Drag Header */}
      <div
        onMouseDown={handleMouseDown}
        className="flex cursor-move items-center justify-between bg-green-800 px-5 py-4 text-white"
      >
        <div className="flex items-center gap-2">
          <GripVertical size={18} className="text-green-200" />

          <div>
            <h2 className="font-black">Order Summary</h2>
            <p className="text-xs text-green-100">
              Items are not added to basket yet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setIsMinimized(true)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-green-700 text-white hover:bg-green-900"
            title="Minimize"
          >
            -
          </button>

          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={clearPendingBulkOrder}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-green-700 text-white hover:bg-red-600"
            title="Clear"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="max-h-[360px] overflow-y-auto p-4">
        <div className="space-y-3">
          {pendingBulkItems.map((item) => {
            const unitPrice = getBulkUnitPrice(
              item.row,
              item.quantity,
              isTradeMode,
              item.priceBreaks
            );

            const lineTotal = calculateBulkItemTotal(
              item.row,
              item.quantity,
              isTradeMode,
              item.priceBreaks
            );

            const totalUnits = calculateBulkTotalUnits(
              item.row,
              item.quantity
            );

            const sizeText =
              String(item.row.values.sizeInches ?? item.row.values.size ?? "");

            return (
              <div
                key={item.row.id}
                className="rounded-md border border-green-100 bg-green-50/40 p-3"
              >
                <div className="mb-3 flex justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-950">
                      {item.row.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      SKU: {item.row.sku}
                      {sizeText ? ` · ${sizeText}` : ""}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-600">
                      {totalUnits.toLocaleString()} bags total
                    </p>
                  </div>

                  <button
                    onClick={() => removePendingBulkItem(item.row.id)}
                    className="h-fit rounded bg-red-50 p-2 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex w-fit items-center overflow-hidden rounded-md border border-slate-300 bg-white">
                    <button
                      onClick={() =>
                        setPendingBulkQuantity(
                          item.row,
                          item.quantity - 1,
                          item.priceBreaks
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center hover:bg-slate-100"
                    >
                      <Minus size={14} />
                    </button>

                    <div className="flex h-8 w-12 items-center justify-center border-x border-slate-200 bg-white text-xs font-black text-slate-900">
                      {item.quantity}
                    </div>

                    <button
                      onClick={() =>
                        setPendingBulkQuantity(
                          item.row,
                          item.quantity + 1,
                          item.priceBreaks
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center hover:bg-slate-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      £{unitPrice.toFixed(2)} / {item.row.unitLabel}
                    </p>

                    <p className="text-base font-black text-slate-950">
                      £{lineTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white p-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal ex VAT</span>
            <span className="font-black text-slate-950">
              £{subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>VAT 20%</span>
            <span className="font-black text-slate-950">£{vat.toFixed(2)}</span>
          </div>

          <div className="flex justify-between border-t border-slate-200 pt-2">
            <span className="font-black text-slate-950">Total inc VAT</span>
            <span className="text-xl font-black text-green-700">
              £{total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            onClick={addPendingBulkOrderToCart}
            className="flex items-center justify-center gap-2 rounded-md bg-green-700 px-4 py-3 text-sm font-black text-white hover:bg-green-800"
          >
            <ShoppingBasket size={17} />
            Add & Continue
          </button>

          <Link
            href="/cart"
            onClick={addPendingBulkOrderToCart}
            className="flex items-center justify-center rounded-md border border-slate-300 px-4 py-3 text-sm font-black text-slate-800 hover:bg-slate-50"
          >
            Checkout Now
          </Link>
        </div>
      </div>
    </aside>
  );
}