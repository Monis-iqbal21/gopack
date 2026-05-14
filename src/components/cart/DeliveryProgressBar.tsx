"use client";

type DeliveryProgressBarProps = {
  subtotal: number;
  amountForFreeDelivery: number;
  qualifiesForFreeDelivery: boolean;
};

export default function DeliveryProgressBar({
  subtotal,
  amountForFreeDelivery,
  qualifiesForFreeDelivery,
}: DeliveryProgressBarProps) {
  const threshold = 75;
  const progress = Math.min((subtotal / threshold) * 100, 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="font-black text-slate-950">Delivery progress</h2>

        <span className="text-sm font-bold text-slate-500">
          £{subtotal.toFixed(2)} / £75
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p
        className={`mt-3 text-sm font-semibold ${
          qualifiesForFreeDelivery ? "text-emerald-700" : "text-slate-600"
        }`}
      >
        {qualifiesForFreeDelivery
          ? "You qualify for FREE delivery!"
          : `Add £${amountForFreeDelivery.toFixed(2)} more for free delivery.`}
      </p>
    </div>
  );
}