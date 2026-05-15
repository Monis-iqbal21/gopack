"use client";

import ProductImage from "@/components/shop/ProductImage";
import { BulkProductRow, DynamicTableColumn, ProductFamily } from "@/types";
import {
  calculateBulkItemTotal,
  calculateBulkTotalUnits,
  getActivePriceBreak,
  getBulkUnitPrice,
} from "@/lib/pricing";
import { useCartStore } from "@/store/cartStore";
import { useTradeStore } from "@/store/tradeStore";
import { Minus, Plus } from "lucide-react";

type BulkPricingTableProps = {
  family: ProductFamily;
};

export default function BulkPricingTable({ family }: BulkPricingTableProps) {
  const { pendingBulkItems, setPendingBulkQuantity } = useCartStore();
  const { isTradeMode } = useTradeStore();

  const visibleColumns = family.tableColumns
    .filter((column) => column.visible)
    .sort((a, b) => a.order - b.order);

  const priceBreaks = family.priceBreaks.sort((a, b) => a.order - b.order);

  const getPendingQuantity = (rowId: string) => {
    return pendingBulkItems.find((item) => item.row.id === rowId)?.quantity ?? 0;
  };

  const updateQuantity = (row: BulkProductRow, quantity: number) => {
    setPendingBulkQuantity(row, Math.max(0, quantity), family.priceBreaks);
  };

  const handleOrderOptionChange = (row: BulkProductRow, value: string) => {
    if (!value) {
      updateQuantity(row, 0);
      return;
    }

    updateQuantity(row, Number(value));
  };

  const renderColumnValue = (
    column: DynamicTableColumn,
    row: BulkProductRow
  ) => {
    if (column.key === "sku") {
      return <p className="break-words font-black text-green-800">{row.sku}</p>;
    }

    if (column.key === "image") {
      return (
        <ProductImage
          src={row.image}
          alt={row.name}
          emoji={row.emoji}
          className="h-12 w-12 rounded-md border border-green-100 bg-green-50"
        />
      );
    }

    if (column.key === "material") {
      return (
        <div>
          <p className="font-black leading-4 text-slate-900">
            {String(row.values.material ?? "-")}
          </p>

          {row.values.recycledInfo && (
            <p className="mt-1 text-[10px] font-semibold leading-4 text-green-700">
              {String(row.values.recycledInfo)}
            </p>
          )}
        </div>
      );
    }

    if (column.key === "size") {
      return (
        <div>
          <p className="font-black leading-4 text-slate-900">
            {String(row.values.sizeInches ?? "-")}
          </p>
          <p className="mt-1 text-[10px] leading-4 text-slate-500">
            {String(row.values.sizeMm ?? "")}
          </p>
        </div>
      );
    }

    if (column.key === "packQty") {
      return (
        <div>
          <p className="font-black text-green-800">
            {row.packQty.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500">per {row.unitLabel}</p>
        </div>
      );
    }

    if (column.key === "boxQty") {
      return (
        <p className="font-bold text-slate-700">
          {row.boxQty.toLocaleString()}
        </p>
      );
    }

    const value = row.values[column.key];

    return (
      <p className="font-bold text-slate-700">
        {value !== undefined && value !== null ? String(value) : "-"}
      </p>
    );
  };

  const minTableWidth =
    260 + visibleColumns.length * 90 + priceBreaks.length * 72 + 360;

  return (
    <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-green-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs font-bold text-green-900 sm:text-sm">
          Select pack quantity from the dropdown or use the quantity controls on
          the right.
        </p>

        <p className="text-xs font-bold text-slate-600">
          Prices shown exclude VAT
        </p>
      </div>

      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse text-xs xl:text-sm"
          style={{ minWidth: `${minTableWidth}px` }}
        >
          <thead>
            <tr className="border-b border-green-900 bg-green-800 text-left text-[10px] font-black uppercase tracking-wide text-white xl:text-xs">
              {visibleColumns.map((column) => (
                <th key={column.id} className="px-2 py-3">
                  {column.label}
                </th>
              ))}

              <th className="w-[170px] px-2 py-3">Unit Orders</th>

              {priceBreaks.map((priceBreak) => (
                <th
                  key={priceBreak.id}
                  className="w-[68px] px-2 py-3 text-center"
                >
                  {priceBreak.label}
                </th>
              ))}

              <th className="w-[68px] px-2 py-3 text-center">Trade</th>
              <th className="w-[120px] px-2 py-3 text-center">Order Qty</th>
            </tr>
          </thead>

          <tbody>
            {family.rows.map((row) => {
              const quantity = getPendingQuantity(row.id);
              const activePriceBreak = getActivePriceBreak(
                priceBreaks,
                quantity
              );

              const activeUnitPrice =
                quantity > 0
                  ? getBulkUnitPrice(row, quantity, isTradeMode, priceBreaks)
                  : 0;

              const rowTotal =
                quantity > 0
                  ? calculateBulkItemTotal(
                      row,
                      quantity,
                      isTradeMode,
                      priceBreaks
                    )
                  : 0;

              const totalUnits =
                quantity > 0 ? calculateBulkTotalUnits(row, quantity) : 0;

              const selectedOption = row.orderOptions.find(
                (option) => option.quantity === quantity
              );

              return (
                <tr
                  key={row.id}
                  className={`border-b border-slate-200 ${
                    quantity > 0 ? "bg-green-50" : "bg-white"
                  }`}
                >
                  {visibleColumns.map((column) => (
                    <td key={column.id} className="px-2 py-4 align-top">
                      {renderColumnValue(column, row)}
                    </td>
                  ))}

                  <td className="px-2 py-4 align-top">
                    <select
                      value={selectedOption ? String(quantity) : ""}
                      onChange={(e) =>
                        handleOrderOptionChange(row, e.target.value)
                      }
                      className={`w-full rounded-md border px-2 py-2 text-[11px] font-bold outline-none transition ${
                        quantity > 0
                          ? "border-green-500 bg-green-50 text-green-900"
                          : "border-slate-300 bg-white text-slate-600"
                      }`}
                    >
                      <option value="">— Select qty —</option>

                      {row.orderOptions.map((option) => {
                        const unitPrice = getBulkUnitPrice(
                          row,
                          option.quantity,
                          isTradeMode,
                          priceBreaks
                        );

                        const total = calculateBulkItemTotal(
                          row,
                          option.quantity,
                          isTradeMode,
                          priceBreaks
                        );

                        return (
                          <option
                            key={`${row.id}-${option.quantity}`}
                            value={option.quantity}
                          >
                            {option.label} — £{total.toFixed(2)} (£
                            {unitPrice.toFixed(2)}/{row.unitLabel})
                          </option>
                        );
                      })}
                    </select>

                    {quantity > 0 && (
                      <p className="mt-1 text-center text-[10px] font-bold text-green-700">
                        £{rowTotal.toFixed(2)} total
                      </p>
                    )}
                  </td>

                  {priceBreaks.map((priceBreak) => {
                    const isActive =
                      !isTradeMode &&
                      quantity > 0 &&
                      activePriceBreak?.id === priceBreak.id;

                    return (
                      <td
                        key={priceBreak.id}
                        className={`px-2 py-4 text-center align-top transition ${
                          isActive
                            ? "bg-green-600 text-white"
                            : "text-slate-800"
                        }`}
                      >
                        <p className="font-black">
                          £{(row.prices[priceBreak.id] ?? 0).toFixed(2)}
                        </p>
                      </td>
                    );
                  })}

                  <td
                    className={`px-2 py-4 text-center align-top transition ${
                      isTradeMode && quantity > 0
                        ? "bg-green-600 text-white"
                        : "bg-green-50 text-green-800"
                    }`}
                  >
                    <p className="font-black">
                      £{(row.prices.trade ?? 0).toFixed(2)}
                    </p>
                  </td>

                  <td className="px-2 py-4 align-top">
                    <div className="mx-auto flex w-fit items-center overflow-hidden rounded-md border border-slate-300 bg-white">
                      <button
                        onClick={() => updateQuantity(row, quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-slate-700 hover:bg-slate-100"
                      >
                        <Minus size={14} />
                      </button>

                      <div className="flex h-8 w-10 items-center justify-center border-x border-slate-200 bg-white text-xs font-black text-slate-900">
                        {quantity}
                      </div>

                      <button
                        onClick={() => updateQuantity(row, quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-slate-700 hover:bg-slate-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {quantity > 0 && (
                      <div className="mt-2 text-center text-[10px]">
                        <p className="font-black text-slate-900">
                          £{rowTotal.toFixed(2)}
                        </p>
                        <p className="text-slate-500">
                          {totalUnits.toLocaleString()} bags
                        </p>
                        <p className="font-semibold text-green-700">
                          £{activeUnitPrice.toFixed(2)} / {row.unitLabel}
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}