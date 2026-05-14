import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import { products } from "@/data/products";

export default function FeaturedProducts() {
  const featuredProducts = products.filter((product) => product.isFeatured).slice(0, 4);

  return (
    <section className="bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-orange-500">
              Featured products
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Popular packaging supplies
            </h2>
          </div>

          <Link
            href="/shop"
            className="rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white hover:bg-orange-600"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}