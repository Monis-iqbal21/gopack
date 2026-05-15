"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import {
  BulkProductRow,
  CartItem,
  DynamicPriceBreak,
  PendingBulkOrderItem,
  Product,
  ProductVariant,
} from "@/types";

type CartStore = {
  items: CartItem[];
  pendingBulkItems: PendingBulkOrderItem[];
  couponCode: string;
  discount: number;

  // Standard cart actions
  addItem: (
    product: Product,
    selectedVariant: ProductVariant,
    quantity?: number
  ) => void;

  removeItem: (productId: string, variantValue: string) => void;

  updateQuantity: (
    productId: string,
    variantValue: string,
    quantity: number
  ) => void;

  // Temporary bulk order actions
  setPendingBulkQuantity: (
    row: BulkProductRow,
    quantity: number,
    priceBreaks: DynamicPriceBreak[]
  ) => void;

  removePendingBulkItem: (rowId: string) => void;
  clearPendingBulkOrder: () => void;
  addPendingBulkOrderToCart: () => void;

  // Bulk cart actions
  addBulkItem: (
    row: BulkProductRow,
    quantity: number,
    priceBreaks: DynamicPriceBreak[]
  ) => void;

  removeBulkItem: (rowId: string) => void;
  updateBulkQuantity: (rowId: string, quantity: number) => void;

  // General actions
  clearCart: () => void;
  applyCoupon: (code: string, subtotal: number) => void;
};

const isStandardItem = (item: CartItem) => {
  return item.type === "standard";
};

const isBulkItem = (item: CartItem) => {
  return item.type === "bulk";
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      pendingBulkItems: [],
      couponCode: "",
      discount: 0,

      addItem: (product, selectedVariant, quantity = 1) => {
        const existingItem = get().items.find(
          (item) =>
            isStandardItem(item) &&
            item.product.id === product.id &&
            item.selectedVariant.value === selectedVariant.value
        );

        if (existingItem && isStandardItem(existingItem)) {
          set({
            items: get().items.map((item) =>
              isStandardItem(item) &&
              item.product.id === product.id &&
              item.selectedVariant.value === selectedVariant.value
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                type: "standard",
                product,
                selectedVariant,
                quantity,
              },
            ],
          });
        }

        toast.success("Item added to cart");
      },

      removeItem: (productId, variantValue) => {
        set({
          items: get().items.filter((item) => {
            if (!isStandardItem(item)) return true;

            return !(
              item.product.id === productId &&
              item.selectedVariant.value === variantValue
            );
          }),
        });

        toast.success("Item removed from cart");
      },

      updateQuantity: (productId, variantValue, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantValue);
          return;
        }

        set({
          items: get().items.map((item) =>
            isStandardItem(item) &&
            item.product.id === productId &&
            item.selectedVariant.value === variantValue
              ? { ...item, quantity }
              : item
          ),
        });
      },

      setPendingBulkQuantity: (row, quantity, priceBreaks) => {
        if (quantity <= 0) {
          get().removePendingBulkItem(row.id);
          return;
        }

        const existingPendingItem = get().pendingBulkItems.find(
          (item) => item.row.id === row.id
        );

        if (existingPendingItem) {
          set({
            pendingBulkItems: get().pendingBulkItems.map((item) =>
              item.row.id === row.id
                ? { ...item, quantity, priceBreaks }
                : item
            ),
          });
        } else {
          set({
            pendingBulkItems: [
              ...get().pendingBulkItems,
              {
                row,
                quantity,
                priceBreaks,
              },
            ],
          });
        }
      },

      removePendingBulkItem: (rowId) => {
        set({
          pendingBulkItems: get().pendingBulkItems.filter(
            (item) => item.row.id !== rowId
          ),
        });
      },

      clearPendingBulkOrder: () => {
        set({
          pendingBulkItems: [],
        });
      },

      addPendingBulkOrderToCart: () => {
        const pendingItems = get().pendingBulkItems;

        if (pendingItems.length === 0) {
          toast.error("No items selected");
          return;
        }

        pendingItems.forEach((item) => {
          get().addBulkItem(item.row, item.quantity, item.priceBreaks);
        });

        set({
          pendingBulkItems: [],
        });

        toast.success("Selected items added to cart");
      },

      addBulkItem: (row, quantity, priceBreaks) => {
        const existingItem = get().items.find(
          (item) => isBulkItem(item) && item.row.id === row.id
        );

        if (existingItem && isBulkItem(existingItem)) {
          set({
            items: get().items.map((item) =>
              isBulkItem(item) && item.row.id === row.id
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    priceBreaks,
                  }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                type: "bulk",
                row,
                quantity,
                priceBreaks,
              },
            ],
          });
        }
      },

      removeBulkItem: (rowId) => {
        set({
          items: get().items.filter((item) => {
            if (!isBulkItem(item)) return true;
            return item.row.id !== rowId;
          }),
        });

        toast.success("Item removed from cart");
      },

      updateBulkQuantity: (rowId, quantity) => {
        if (quantity <= 0) {
          get().removeBulkItem(rowId);
          return;
        }

        set({
          items: get().items.map((item) =>
            isBulkItem(item) && item.row.id === rowId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => {
        set({
          items: [],
          pendingBulkItems: [],
          couponCode: "",
          discount: 0,
        });
      },

      applyCoupon: (code, subtotal) => {
        const normalizedCode = code.trim().toUpperCase();

        if (normalizedCode === "PACK10") {
          set({
            couponCode: "PACK10",
            discount: Math.round(subtotal * 0.1 * 100) / 100,
          });

          toast.success("Coupon applied: 10% off");
          return;
        }

        if (normalizedCode === "15OFF") {
          set({
            couponCode: "15OFF",
            discount: 15,
          });

          toast.success("Coupon applied: £15 off");
          return;
        }

        set({
          couponCode: "",
          discount: 0,
        });

        toast.error("Invalid coupon code");
      },
    }),
    {
      name: "gopackagingproducts-cart",
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discount: state.discount,
      }),
    }
  )
);