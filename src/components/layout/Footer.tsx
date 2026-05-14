import Link from "next/link";
import { Package } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Package size={22} />
            </div>
            <span className="text-lg font-black text-slate-950">
              GoPackagingProducts
            </span>
          </div>

          <p className="text-sm leading-6 text-slate-500">
            UK-based packaging supplies for ecommerce brands, warehouses,
            retailers, and growing businesses.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-slate-950">Products</h3>
          <div className="space-y-3 text-sm text-slate-500">
            <Link href="/shop" className="block hover:text-orange-500">
              Cardboard Boxes
            </Link>
            <Link href="/shop" className="block hover:text-orange-500">
              Bubble Wrap
            </Link>
            <Link href="/shop" className="block hover:text-orange-500">
              Mailing Bags
            </Link>
            <Link href="/shop" className="block hover:text-orange-500">
              Pallet Wrap
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-slate-950">Customer</h3>
          <div className="space-y-3 text-sm text-slate-500">
            <Link href="/cart" className="block hover:text-orange-500">
              Cart
            </Link>
            <Link href="/checkout" className="block hover:text-orange-500">
              Checkout
            </Link>
            <span className="block">Next-Day Delivery</span>
            <span className="block">Free Returns</span>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-slate-950">Company</h3>
          <p className="mb-4 text-sm leading-6 text-slate-500">
            Built for standard buyers and trade customers with smart pricing,
            volume discounts, and fast fulfilment.
          </p>

          <div className="flex flex-wrap gap-2 text-xs font-black text-slate-900">
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
              VISA
            </span>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
              MC
            </span>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
              AMEX
            </span>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
              PayPal
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
        © 2026 GoPackagingProducts. All rights reserved.
      </div>
    </footer>
  );
}