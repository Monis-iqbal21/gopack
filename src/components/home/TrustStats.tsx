import { Star, Truck, Users, PackageCheck } from "lucide-react";

const stats = [
  {
    icon: PackageCheck,
    value: "2,500+",
    label: "Packaging products",
  },
  {
    icon: Users,
    value: "47k+",
    label: "Customers served",
  },
  {
    icon: Star,
    value: "4.8",
    label: "Average rating",
  },
  {
    icon: Truck,
    value: "99%",
    label: "Fast dispatch rate",
  },
];

export default function TrustStats() {
  return (
    <section className="bg-white px-4 py-12">
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <Icon size={22} />
              </div>

              <p className="text-3xl font-black text-slate-950">
                {stat.value}
              </p>

              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}