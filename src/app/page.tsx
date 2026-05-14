import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import ProductImage from "@/components/shop/ProductImage";
import { categories, products } from "@/data/products";
import { Truck, BadgePoundSterling, ShieldCheck } from "lucide-react";

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

function BigCategoryCard({
  title,
  product,
  className = "",
}: {
  title: string;
  product: (typeof products)[number];
  className?: string;
}) {
  return (
    <Link
      href="/shop"
      className={`group relative flex flex-col overflow-hidden rounded-sm  bg-transparent transition ${className}`}
    >
      <div className="flex flex-1 items-center justify-center p-1 ">
        <ProductImage
          src={product?.image}
          alt={product?.name ?? title}
          emoji={product?.emoji ?? "📦"}
          className="h-full min-h-[170px] w-full max-w-md "
        />
      </div>

      <div className="absolute bottom-0 left-1/2 w-[35%] -translate-x-1/2">
        <div className="bg-[var(--primary)] px-5 py-3 text-center text-sm font-black text-white shadow-sm transition group-hover:bg-[var(--primary-dark)]">
          {title}
        </div>
      </div>
    </Link>
  );
}

function SmallCategoryCard({ category }: { category: string }) {
  return (
    <Link
      href="/shop"
      className="flex min-h-[115px] items-center gap-4 rounded-sm border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[var(--primary)] hover:shadow-md"
    >
      <span className="text-4xl">{categoryEmojis[category] ?? "📦"}</span>
      <span className="font-black text-slate-900">{category}</span>
    </Link>
  );
}

export default function HomePage() {
  const featuredProducts = products.slice(0, 5);

  return (
    <main className="bg-[#f3f5f4]">
      {/* Hero Grid */}
      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-2">
            <BigCategoryCard
              title="Cardboard Boxes"
              product={products[0]}
              className="min-h-[300px]"
            />

            <BigCategoryCard
              title="Protective Packaging"
              product={products[1]}
              className="min-h-[300px]"
            />

            <BigCategoryCard
              title="Mailing Bags"
              product={products[2]}
              className="min-h-[250px]"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              {categories.slice(3, 7).map((category) => (
                <SmallCategoryCard key={category} category={category} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Buttons */}
      <section className="px-4 pb-8">
        <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category}
              href="/shop"
              className="bg-slate-900 px-4 py-3 text-center text-xs font-black text-white transition hover:bg-[var(--primary)]"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      {/* Printed Packaging Banner */}
      <section className="bg-[var(--primary)] px-4 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h1 className="text-3xl font-black md:text-4xl">
              Need printed packaging?
            </h1>

            <p className="mt-2 text-sm font-semibold text-white/90">
              Custom boxes, branded bags and ecommerce packaging options.
            </p>
          </div>

          <Link
            href="/shop"
            className="rounded-md bg-white px-6 py-3 text-sm font-black text-[var(--primary)]"
          >
            View Printed Packaging
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 text-center">
            <h2 className="text-2xl font-black text-slate-950">
              Featured Products
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="px-4 pb-12">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          <div className="rounded-sm bg-white p-6 shadow-sm">
            <Truck className="mb-3 text-[var(--primary)]" />
            <h3 className="font-black text-slate-950">Fast UK Delivery</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Free delivery available on orders over £75.
            </p>
          </div>

          <div className="rounded-sm bg-white p-6 shadow-sm">
            <BadgePoundSterling className="mb-3 text-[var(--primary)]" />
            <h3 className="font-black text-slate-950">Volume Discounts</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Tier pricing helps customers save when buying in bulk.
            </p>
          </div>

          <div className="rounded-sm bg-white p-6 shadow-sm">
            <ShieldCheck className="mb-3 text-[var(--primary)]" />
            <h3 className="font-black text-slate-950">Trade Pricing</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Trade mode shows lower pricing with minimum basket rules.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}