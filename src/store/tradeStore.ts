"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type TradeStore = {
  isTradeMode: boolean;
  toggleTradeMode: () => void;
  setTradeMode: (value: boolean) => void;
};

export const useTradeStore = create<TradeStore>()(
  persist(
    (set) => ({
      isTradeMode: false,

      toggleTradeMode: () =>
        set((state) => ({
          isTradeMode: !state.isTradeMode,
        })),

      setTradeMode: (value) =>
        set({
          isTradeMode: value,
        }),
    }),
    {
      name: "gopackagingproducts-trade-mode",
    }
  )
);