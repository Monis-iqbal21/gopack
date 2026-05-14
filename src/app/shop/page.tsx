"use client";

import { useMemo, useState } from "react";
import { Filter, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { categories, products } from "@/data/products";

export default function ShopPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(100);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    result = result.filter(
      (product) => product.pricingTiers[0].pricePerPack <= maxPrice
    );

    if (sortBy === "price-low") {
      result.sort(
        (a, b) => a.pricingTiers[0].pricePerPack - b.pricingTiers[0].pricePerPack
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) => b.pricingTiers[0].pricePerPack - a.pricingTiers[0].pricePerPack
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === "featured") {
      result.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }

    return result;
  }, [selectedCategories, sortBy, maxPrice]);

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-orange-500">
            Packaging Supplies
          </p>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-black text-slate-950 md:text-5xl">
                Shop packaging products
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                Browse cardboard boxes, bubble wrap, mailing bags, pallet wrap,
                printed packaging, eco packaging and warehouse supplies.
              </p>
            </div>

            <div className="rounded-2xl bg-orange-50 px-5 py-4 text-sm text-orange-700">
              <span className="font-black">{filteredProducts.length}</span>{" "}
              products found
            </div>
          </div>
        </div>

        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategories([])}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${
              selectedCategories.length === 0
                ? "bg-orange-500 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            All Products
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${
                selectedCategories.includes(category)
                  ? "bg-orange-500 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-5 flex items-center gap-2">
              <Filter size={18} className="text-orange-500" />
              <h2 className="font-black text-slate-950">Filters</h2>
            </div>

            <div className="mb-7">
              <h3 className="mb-4 text-sm font-bold text-slate-800">
                Categories
              </h3>

              <div className="space-y-3">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="h-4 w-4 accent-orange-500"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold text-slate-800">
                Max starting price: £{maxPrice}
              </h3>

              <input
                type="range"
                min="5"
                max="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
          </aside>

          <main>
            <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <SlidersHorizontal size={18} />
                Showing {filteredProducts.length} of {products.length} products
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 outline-none"
              >
                <option value="featured">Featured first</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <h3 className="text-xl font-black text-slate-950">
                  No products found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try removing some filters or increasing the price range.
                </p>

                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setMaxPrice(100);
                  }}
                  className="mt-5 rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}