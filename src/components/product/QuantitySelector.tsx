"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  quantity: number;
  setQuantity: (quantity: number) => void;
  total: number;
  unitLabel: string;
};

export default function QuantitySelector({
  quantity,
  setQuantity,
  total,
  unitLabel,
}: QuantitySelectorProps) {
  const decrease = () => {
    setQuantity(Math.max(1, quantity - 1));
  };

  const increase = () => {
    setQuantity(quantity + 1);
  };

  const handleInputChange = (value: string) => {
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) return;

    setQuantity(Math.max(1, parsedValue));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-black text-slate-950">Quantity</h2>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-fit items-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
          <button
            onClick={decrease}
            className="flex h-11 w-11 items-center justify-center text-slate-700 hover:bg-slate-100"
          >
            <Minus size={17} />
          </button>

          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => handleInputChange(e.target.value)}
            className="h-11 w-20 border-x border-slate-200 bg-white text-center text-sm font-black text-slate-950 outline-none"
          />

          <button
            onClick={increase}
            className="flex h-11 w-11 items-center justify-center text-slate-700 hover:bg-slate-100"
          >
            <Plus size={17} />
          </button>
        </div>

        <div className="rounded-2xl bg-slate-50 px-5 py-3">
          <p className="text-xs font-semibold text-slate-500">
            Total for {quantity} {unitLabel.replace("per ", "")}
          </p>
          <p className="text-2xl font-black text-slate-950">
            £{total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}