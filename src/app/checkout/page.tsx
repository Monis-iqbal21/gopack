"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Mail,
  MapPin,
  PackageCheck,
  Truck,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useTradeStore } from "@/store/tradeStore";
import {
  calculateBulkItemTotal,
  calculateBulkTotalUnits,
  calculateCartTotals,
  calculateItemTotal,
  getApplicableTier,
  getBulkUnitPrice,
} from "@/lib/pricing";
import ProductImage from "@/components/shop/ProductImage";

type FormData = {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  country: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

export default function CheckoutPage() {
  const router = useRouter();

  const { items, discount, couponCode, clearCart } = useCartStore();
  const isTradeMode = useTradeStore((state) => state.isTradeMode);

  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "saturday">(
    "standard"
  );

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const baseTotals = calculateCartTotals(items, isTradeMode, discount);

  const totals = useMemo(() => {
    if (deliveryMethod === "saturday") {
      return {
        ...baseTotals,
        delivery: 14.95,
        total: Number(
          (baseTotals.subtotal + baseTotals.vat + 14.95).toFixed(2)
        ),
      };
    }

    return baseTotals;
  }, [baseTotals, deliveryMethod]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields: (keyof FormData)[] = [
      "name",
      "email",
      "phone",
      "addressLine1",
      "city",
      "postcode",
      "country",
      "cardNumber",
      "expiry",
      "cvv",
    ];

    const hasEmptyField = requiredFields.some(
      (field) => formData[field].trim() === ""
    );

    if (hasEmptyField) {
      toast.error("Please fill all required fields");
      return false;
    }

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (isTradeMode && totals.subtotal < 500) {
      toast.error("Trade checkout requires a minimum £500 basket ex VAT");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    toast.success("Order placed! You'll receive a confirmation email shortly");

    clearCart();

    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-10 text-center shadow-xl shadow-slate-200/50 md:p-16">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-green-50 text-green-600 shadow-inner">
            <PackageCheck size={40} strokeWidth={2} />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            No items to checkout
          </h1>

          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-500">
            Your cart is currently empty. Add packaging products before starting
            checkout.
          </p>

          <Link
            href="/shop"
            className="group mx-auto mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-8 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl hover:shadow-green-900/20"
          >
            Shop Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/cart"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-green-600"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to cart
        </Link>

        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-green-700">
            <Lock size={14} />
            Secure Checkout
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
            Complete your order
          </h1>

          <p className="mt-3 text-sm font-medium text-slate-500 md:text-base">
            Enter your delivery and payment details below to finalize your
            order.
          </p>
        </div>

        {isTradeMode && totals.subtotal < 500 && (
          <div className="mb-8 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <Building2 className="mt-0.5 shrink-0 text-red-600" size={20} />
            <p className="text-sm font-semibold leading-relaxed text-red-800">
              Trade pricing is active, but your basket is below the £500 minimum
              ex VAT. Add{" "}
              <span className="font-black">
                £{(500 - totals.subtotal).toFixed(2)}
              </span>{" "}
              more to continue checkout in trade mode.
            </p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Mail size={18} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  Contact Details
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Full Name *"
                  value={formData.name}
                  onChange={(value) => updateField("name", value)}
                  placeholder="John Smith"
                />
                <Input
                  label="Email Address *"
                  value={formData.email}
                  onChange={(value) => updateField("email", value)}
                  placeholder="john@example.com"
                />
                <Input
                  label="Phone Number *"
                  value={formData.phone}
                  onChange={(value) => updateField("phone", value)}
                  placeholder="+44 7000 000000"
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <MapPin size={18} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  Delivery Address
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Address Line 1 *"
                    value={formData.addressLine1}
                    onChange={(value) => updateField("addressLine1", value)}
                    placeholder="Unit 12, Packaging Estate"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="Address Line 2"
                    value={formData.addressLine2}
                    onChange={(value) => updateField("addressLine2", value)}
                    placeholder="Optional"
                  />
                </div>

                <Input
                  label="City *"
                  value={formData.city}
                  onChange={(value) => updateField("city", value)}
                  placeholder="London"
                />

                <Input
                  label="Postcode *"
                  value={formData.postcode}
                  onChange={(value) => updateField("postcode", value)}
                  placeholder="SW1A 1AA"
                />

                <Input
                  label="Country *"
                  value={formData.country}
                  onChange={(value) => updateField("country", value)}
                  placeholder="United Kingdom"
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Truck size={18} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  Delivery Method
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("standard")}
                  className={`relative flex flex-col rounded-2xl border p-5 text-left transition-all duration-200 ${
                    deliveryMethod === "standard"
                      ? "border-green-500 bg-green-50/50 shadow-sm ring-1 ring-green-500"
                      : "border-slate-200 bg-white hover:border-green-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <p className="font-black text-slate-900">
                      Standard Next-Day
                    </p>
                    {deliveryMethod === "standard" && (
                      <CheckCircle2 size={18} className="text-green-600" />
                    )}
                  </div>

                  <p className="mt-1.5 text-xs font-medium text-slate-500">
                    Free over £75, otherwise £6.95
                  </p>

                  <p
                    className={`mt-4 text-lg font-black ${
                      deliveryMethod === "standard"
                        ? "text-green-700"
                        : "text-slate-900"
                    }`}
                  >
                    {baseTotals.delivery === 0
                      ? "FREE"
                      : `£${baseTotals.delivery.toFixed(2)}`}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod("saturday")}
                  className={`relative flex flex-col rounded-2xl border p-5 text-left transition-all duration-200 ${
                    deliveryMethod === "saturday"
                      ? "border-green-500 bg-green-50/50 shadow-sm ring-1 ring-green-500"
                      : "border-slate-200 bg-white hover:border-green-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <p className="font-black text-slate-900">
                      Saturday Delivery
                    </p>
                    {deliveryMethod === "saturday" && (
                      <CheckCircle2 size={18} className="text-green-600" />
                    )}
                  </div>

                  <p className="mt-1.5 text-xs font-medium text-slate-500">
                    Premium weekend delivery option
                  </p>

                  <p
                    className={`mt-4 text-lg font-black ${
                      deliveryMethod === "saturday"
                        ? "text-green-700"
                        : "text-slate-900"
                    }`}
                  >
                    £14.95
                  </p>
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <CreditCard size={18} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  Payment Details
                </h2>
              </div>

              <div className="mb-6 flex items-start gap-3 rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-blue-800">
                <Lock size={18} className="mt-0.5 shrink-0 text-blue-600" />
                <p>
                  This is a secure demo checkout environment. No real payment
                  will be processed.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Card Number *"
                    value={formData.cardNumber}
                    onChange={(value) => updateField("cardNumber", value)}
                    placeholder="4242 4242 4242 4242"
                  />
                </div>

                <Input
                  label="Expiry Date *"
                  value={formData.expiry}
                  onChange={(value) => updateField("expiry", value)}
                  placeholder="MM/YY"
                />

                <Input
                  label="CVV *"
                  value={formData.cvv}
                  onChange={(value) => updateField("cvv", value)}
                  placeholder="123"
                />
              </div>
            </div>
          </div>

          <aside className="relative h-fit">
            <div className="sticky top-28 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 md:p-8">
              <h2 className="mb-6 text-2xl font-black tracking-tight text-slate-900">
                Order Summary
              </h2>

              {isTradeMode && (
                <div className="mb-6 flex gap-2 rounded-xl bg-green-50 p-3 text-xs font-bold text-green-800">
                  <CheckCircle2 size={16} className="text-green-600" />
                  Trade pricing active
                </div>
              )}

              <div className="custom-scrollbar mb-6 max-h-60 space-y-4 overflow-y-auto pr-2">
                {items.map((item) => {
                  if (item.type === "bulk") {
                    const unitPrice = getBulkUnitPrice(
                      item.row,
                      item.quantity,
                      isTradeMode,
                      item.priceBreaks ?? []
                    );

                    const lineTotal = calculateBulkItemTotal(
                      item.row,
                      item.quantity,
                      isTradeMode,
                      item.priceBreaks ?? []
                    );

                    const totalUnits = calculateBulkTotalUnits(
                      item.row,
                      item.quantity
                    );

                    const sizeText = String(
                      item.row.values?.sizeInches ??
                        item.row.values?.size ??
                        "-"
                    );

                    return (
                      <div
                        key={`bulk-${item.row.id}`}
                        className="flex items-center gap-3"
                      >
                        <ProductImage
                          src={item.row.image}
                          alt={item.row.name}
                          emoji={item.row.emoji}
                          className="h-12 w-12 shrink-0 rounded-xl border border-slate-100 bg-slate-50"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-slate-900">
                            {item.row.name}
                          </p>

                          <p className="text-[10px] font-medium text-slate-500">
                            Qty: {item.quantity} • {sizeText}
                          </p>

                          <p className="text-[10px] font-medium text-slate-400">
                            {totalUnits.toLocaleString()} bags • £
                            {unitPrice.toFixed(2)}/{item.row.unitLabel}
                          </p>
                        </div>

                        <p className="text-sm font-black text-slate-900">
                          £{lineTotal.toFixed(2)}
                        </p>
                      </div>
                    );
                  }

                  const tier = getApplicableTier(
                    item.product.pricingTiers,
                    item.quantity
                  );

                  const lineTotal = calculateItemTotal(
                    tier,
                    item.quantity,
                    isTradeMode
                  );

                  return (
                    <div
                      key={`standard-${item.product.id}-${item.selectedVariant.value}`}
                      className="flex items-center gap-3"
                    >
                      <ProductImage
                        src={item.product.image}
                        alt={item.product.name}
                        emoji={item.product.emoji}
                        className="h-12 w-12 shrink-0 rounded-xl border border-slate-100 bg-slate-50"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-900">
                          {item.product.name}
                        </p>

                        <p className="text-[10px] font-medium text-slate-500">
                          Qty: {item.quantity} • {item.selectedVariant.name}
                        </p>
                      </div>

                      <p className="text-sm font-black text-slate-900">
                        £{lineTotal.toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-5 text-sm font-medium">
                <SummaryRow
                  label="Subtotal (ex VAT)"
                  value={`£${totals.subtotal.toFixed(2)}`}
                />

                {discount > 0 && (
                  <SummaryRow
                    label={`Discount ${couponCode ? `(${couponCode})` : ""}`}
                    value={`-£${discount.toFixed(2)}`}
                    valueClassName="text-green-600"
                  />
                )}

                <SummaryRow
                  label="VAT (20%)"
                  value={`£${totals.vat.toFixed(2)}`}
                />

                <SummaryRow
                  label="Delivery"
                  value={
                    totals.delivery === 0
                      ? "Free"
                      : `£${totals.delivery.toFixed(2)}`
                  }
                  valueClassName={
                    totals.delivery === 0 ? "text-green-600 uppercase" : ""
                  }
                />
              </div>

              <div className="my-5 border-t border-dashed border-slate-200" />

              <div className="flex items-end justify-between">
                <div>
                  <span className="block text-sm font-bold text-slate-500">
                    Total
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    including VAT
                  </span>
                </div>

                <span className="text-3xl font-black tracking-tight text-green-600">
                  £{totals.total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isTradeMode && totals.subtotal < 500}
                className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 text-base font-bold text-white shadow-lg shadow-green-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-xl hover:shadow-green-900/20 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none disabled:transform-none"
              >
                <Lock
                  size={18}
                  className="text-green-200 transition-colors group-hover:text-white"
                />
                {isTradeMode && totals.subtotal < 500
                  ? "Minimum £500 Required"
                  : "Place Order Securely"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
      />
    </label>
  );
}

function SummaryRow({
  label,
  value,
  valueClassName = "text-slate-900",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between text-slate-500">
      <span>{label}</span>
      <span className={`font-bold ${valueClassName}`}>{value}</span>
    </div>
  );
}