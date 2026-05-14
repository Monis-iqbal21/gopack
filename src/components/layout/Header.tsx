"use client";

import Link from "next/link";
import { Package, Search, ShoppingCart, Menu, X, User, Truck, BadgePoundSterling, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useTradeStore } from "@/store/tradeStore";
import { categories } from "@/data/products";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = useCartStore((state) => state.items);
  const { isTradeMode, toggleTradeMode } = useTradeStore();

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Offer Bar */}
      <div className="border-b border-slate-200 bg-slate-100 px-4 py-2 text-center text-xs font-bold text-slate-700">
        £15 Off Any Order Over £150 — Use Code 15OFF At Checkout
      </div>

      {/* Main Header */}
      <div className="border-b border-slate-200 px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          {/* Search */}
          <div className="hidden w-[280px] items-center rounded-full border border-slate-300 bg-white px-4 py-2 lg:flex">
            <input
              type="text"
              placeholder="Search products"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            <Search size={18} className="text-slate-400" />
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--primary)] text-white">
              <Package size={22} />
            </div>
            <div>
              <p className="text-2xl font-black leading-none text-slate-950">
                GoPackaging
              </p>
              <p className="text-xs font-bold text-[var(--primary)]">
                Products
              </p>
            </div>
          </Link>

          {/* Right */}
          <div className="hidden items-center gap-5 md:flex">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <User size={20} className="text-[var(--primary)]" />
              <div>
                <p className="font-bold leading-none">Sign In</p>
                <p className="text-xs text-slate-500">Reorder</p>
              </div>
            </div>

            <Link href="/cart" className="relative flex items-center gap-2 text-sm text-slate-700">
              <ShoppingCart size={24} className="text-[var(--primary)]" />
              <div>
                <p className="font-bold leading-none">Cart</p>
                <p className="text-xs text-slate-500">{itemCount} items</p>
              </div>

              {itemCount > 0 && (
                <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--primary)] px-1 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Trade Toggle */}
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
              <span className={`text-xs font-black ${!isTradeMode ? "text-slate-950" : "text-slate-400"}`}>
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

              <span className={`text-xs font-black ${isTradeMode ? "text-[var(--primary)]" : "text-slate-400"}`}>
                Trade
              </span>
            </div>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-4 md:hidden">
            <Link href="/cart" className="relative text-slate-900">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--primary)] px-1 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            <button onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <nav className="hidden border-b border-slate-200 bg-white px-4 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-7 overflow-x-auto py-3 text-xs font-black text-slate-800">
          {categories.slice(0, 8).map((category) => (
            <Link key={category} href="/shop" className="whitespace-nowrap hover:text-[var(--primary)]">
              {category}
            </Link>
          ))}
          <Link href="/shop" className="whitespace-nowrap hover:text-[var(--primary)]">
            Box Calculator
          </Link>
        </div>
      </nav>

      {/* Trust Strip */}
      <div className="hidden border-b border-slate-200 bg-slate-50 px-4 md:block">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 py-3 text-xs font-bold text-slate-700">
          <div className="flex items-center justify-center gap-2">
            <Truck size={20} className="text-[var(--primary)]" />
            Free Delivery on orders over £75
          </div>
          <div className="flex items-center justify-center gap-2">
            <BadgePoundSterling size={20} className="text-[var(--primary)]" />
            Volume discounts when buying in bulk
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck size={20} className="text-[var(--primary)]" />
            Trade pricing available
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-5 md:hidden">
          <div className="mb-4 flex items-center rounded-full border border-slate-300 px-4 py-2">
            <input
              type="text"
              placeholder="Search products"
              className="w-full bg-transparent text-sm outline-none"
            />
            <Search size={18} className="text-slate-400" />
          </div>

          <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 p-3">
            <span className="text-sm font-bold">Standard Pricing</span>
            <button
              onClick={toggleTradeMode}
              className={`relative h-6 w-11 rounded-full transition ${
                isTradeMode ? "bg-[var(--primary)]" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  isTradeMode ? "left-6" : "left-1"
                }`}
              />
            </button>
            <span className="text-sm font-bold">Trade</span>
          </div>

          <div className="grid gap-3 text-sm font-bold text-slate-700">
            <Link onClick={() => setMobileOpen(false)} href="/">Home</Link>
            <Link onClick={() => setMobileOpen(false)} href="/shop">Shop</Link>
            {categories.slice(0, 6).map((category) => (
              <Link key={category} onClick={() => setMobileOpen(false)} href="/shop">
                {category}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}