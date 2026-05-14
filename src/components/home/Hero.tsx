import Link from "next/link";
import { ArrowRight, CheckCircle2, Package, Truck } from "lucide-react";
import { products } from "@/data/products";

export default function Hero() {
  const previewProducts = products.slice(0, 4);

  return (
    <section className="bg-slate-50 px-4 py-14 md:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
            <Package size={17} />
            UK packaging supplies for every business
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-6xl">
            Packaging that works as hard as you do
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Browse cardboard boxes, bubble wrap, mailing bags, pallet wrap,
            printed packaging and warehouse supplies with smart volume pricing
            and trade discounts.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-4 text-sm font-black text-white transition hover:bg-orange-600"
            >
              Shop All Products
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-800 transition hover:bg-slate-100"
            >
              View Trade Pricing
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-2xl font-black text-slate-950">2,500+</p>
              <p className="mt-1 text-sm text-slate-500">Packaging products</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-2xl font-black text-slate-950">99.2%</p>
              <p className="mt-1 text-sm text-slate-500">On-time dispatch</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-2xl font-black text-slate-950">£500</p>
              <p className="mt-1 text-sm text-slate-500">Unlocks trade mode</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-orange-500">
                Popular products
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Ready to ship
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <Truck size={21} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {previewProducts.map((product) => (
              <Link
                href={`/products/${product.slug}`}
                key={product.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-orange-200 hover:bg-orange-50"
              >
                <div className="mb-3 flex h-20 items-center justify-center rounded-xl bg-white text-5xl">
                  {product.emoji}
                </div>

                <p className="text-xs font-bold uppercase tracking-wide text-orange-500">
                  {product.category}
                </p>

                <h3 className="mt-1 line-clamp-2 text-sm font-black text-slate-950">
                  {product.name}
                </h3>

                <p className="mt-2 text-sm font-black text-slate-900">
                  From £{product.pricingTiers[0].pricePerPack.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              Trade pricing available across the full catalogue.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}