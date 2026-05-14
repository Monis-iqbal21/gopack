"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { CartItem, Product, ProductVariant } from "@/types";

type CartStore = {
  items: CartItem[];
  couponCode: string;
  discount: number;

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

  clearCart: () => void;
  applyCoupon: (code: string, subtotal: number) => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: "",
      discount: 0,

      addItem: (product, selectedVariant, quantity = 1) => {
        const existingItem = get().items.find(
          (item) =>
            item.product.id === product.id &&
            item.selectedVariant.value === selectedVariant.value
        );

        if (existingItem) {
          set({
            items: get().items.map((item) =>
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
          items: get().items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.selectedVariant.value === variantValue
              )
          ),
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
            item.product.id === productId &&
            item.selectedVariant.value === variantValue
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => {
        set({
          items: [],
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
    }
  )
);