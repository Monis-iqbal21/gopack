import Link from "next/link";
import { categories, products } from "@/data/products";

const categoryEmojis: Record<string, string> = {
  "Cardboard Boxes": "📦",
  "Bubble Wrap": "🫧",
  "Mailing Bags": "✉️",
  "Printed Packaging": "🎨",
  "Pallet Wrap": "🏭",
  "Eco Packaging": "🌱",
  "Postal Bags": "📮",
  Strapping: "🧵",
};

export default function CategoryStrip() {
  return (
    <section className="bg-white px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-orange-500">
              Shop by category
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Packaging categories
            </h2>
          </div>

          <Link
            href="/shop"
            className="text-sm font-black text-orange-500 hover:text-orange-600"
          >
            View all products →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const count = products.filter(
              (product) => product.category === category
            ).length;

            return (
              <Link
                key={category}
                href="/shop"
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl">
                  {categoryEmojis[category] ?? "📦"}
                </div>

                <h3 className="font-black text-slate-950">{category}</h3>

                <p className="mt-1 text-sm text-slate-500">
                  {count} demo product{count === 1 ? "" : "s"}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}