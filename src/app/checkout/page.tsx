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
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useTradeStore } from "@/store/tradeStore";
import { calculateCartTotals, calculateItemTotal, getApplicableTier } from "@/lib/pricing";

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
        total: Number((baseTotals.subtotal + baseTotals.vat + 14.95).toFixed(2)),
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
      <section className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-500">
            <PackageCheck size={38} />
          </div>

          <h1 className="text-3xl font-black text-slate-950">
            No items to checkout
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Your cart is currently empty. Add packaging products before starting
            checkout.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-full bg-orange-500 px-6 py-4 text-sm font-black text-white hover:bg-orange-600"
          >
            Shop Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/cart"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-500"
        >
          <ArrowLeft size={17} />
          Back to cart
        </Link>

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-orange-500">
            Secure Checkout
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-5xl">
            Complete your order
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Enter your delivery and payment details to place this demo order.
          </p>
        </div>

        {isTradeMode && totals.subtotal < 500 && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
            Trade pricing is active, but your basket is below the £500 minimum
            ex VAT. Add £{(500 - totals.subtotal).toFixed(2)} more to continue
            checkout in trade mode.
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
          {/* Form */}
          <div className="space-y-6">
            {/* Contact */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-2">
                <Mail size={20} className="text-orange-500" />
                <h2 className="text-xl font-black text-slate-950">
                  Contact details
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full name *"
                  value={formData.name}
                  onChange={(value) => updateField("name", value)}
                  placeholder="John Smith"
                />

                <Input
                  label="Email address *"
                  value={formData.email}
                  onChange={(value) => updateField("email", value)}
                  placeholder="john@example.com"
                />

                <Input
                  label="Phone number *"
                  value={formData.phone}
                  onChange={(value) => updateField("phone", value)}
                  placeholder="+44 7000 000000"
                />
              </div>
            </div>

            {/* Address */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-2">
                <MapPin size={20} className="text-orange-500" />
                <h2 className="text-xl font-black text-slate-950">
                  Delivery address
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Address line 1 *"
                    value={formData.addressLine1}
                    onChange={(value) => updateField("addressLine1", value)}
                    placeholder="Unit 12, Packaging Estate"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="Address line 2"
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

            {/* Delivery Method */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-2">
                <Truck size={20} className="text-orange-500" />
                <h2 className="text-xl font-black text-slate-950">
                  Delivery method
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  onClick={() => setDeliveryMethod("standard")}
                  className={`rounded-2xl border p-5 text-left transition ${
                    deliveryMethod === "standard"
                      ? "border-orange-500 bg-orange-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <p className="font-black text-slate-950">
                    Standard Next-Day
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Free over £75, otherwise £6.95
                  </p>
                  <p className="mt-3 text-lg font-black text-orange-500">
                    {baseTotals.delivery === 0
                      ? "FREE"
                      : `£${baseTotals.delivery.toFixed(2)}`}
                  </p>
                </button>

                <button
                  onClick={() => setDeliveryMethod("saturday")}
                  className={`rounded-2xl border p-5 text-left transition ${
                    deliveryMethod === "saturday"
                      ? "border-orange-500 bg-orange-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <p className="font-black text-slate-950">
                    Saturday Delivery
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Premium weekend delivery option
                  </p>
                  <p className="mt-3 text-lg font-black text-orange-500">
                    £14.95
                  </p>
                </button>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-2">
                <CreditCard size={20} className="text-orange-500" />
                <h2 className="text-xl font-black text-slate-950">
                  Payment details
                </h2>
              </div>

              <div className="mb-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                This is a demo checkout. No real payment will be processed.
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Card number *"
                    value={formData.cardNumber}
                    onChange={(value) => updateField("cardNumber", value)}
                    placeholder="4242 4242 4242 4242"
                  />
                </div>

                <Input
                  label="Expiry *"
                  value={formData.expiry}
                  onChange={(value) => updateField("expiry", value)}
                  placeholder="12/28"
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

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-28">
            <h2 className="mb-5 text-xl font-black text-slate-950">
              Order summary
            </h2>

            {isTradeMode && (
              <div className="mb-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                Trade pricing active
              </div>
            )}

            <div className="mb-5 space-y-4">
              {items.map((item) => {
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
                    key={`${item.product.id}-${item.selectedVariant.value}`}
                    className="flex gap-3"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-2xl">
                      {item.product.emoji}
                    </div>

                    <div className="flex-1">
                      <p className="line-clamp-1 text-sm font-black text-slate-950">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.quantity} × {item.selectedVariant.name}
                      </p>
                    </div>

                    <p className="text-sm font-black text-slate-950">
                      £{lineTotal.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 border-t border-slate-200 pt-5 text-sm">
              <SummaryRow label="Subtotal ex VAT" value={`£${totals.subtotal.toFixed(2)}`} />

              {discount > 0 && (
                <SummaryRow
                  label={`Discount ${couponCode ? `(${couponCode})` : ""}`}
                  value={`-£${discount.toFixed(2)}`}
                  valueClassName="text-emerald-700"
                />
              )}

              <SummaryRow label="VAT 20%" value={`£${totals.vat.toFixed(2)}`} />

              <SummaryRow
                label="Delivery"
                value={
                  totals.delivery === 0
                    ? "FREE"
                    : `£${totals.delivery.toFixed(2)}`
                }
              />

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-base font-black text-slate-950">
                    Total inc VAT
                  </span>
                  <span className="text-2xl font-black text-orange-500">
                    £{totals.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-4 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Lock size={17} />
              Place Order
            </button>

            <p className="mt-4 text-center text-xs text-slate-500">
              Secure demo checkout. Stripe integration can be added later.
            </p>
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
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400"
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
    <div className="flex justify-between text-slate-600">
      <span>{label}</span>
      <span className={`font-bold ${valueClassName}`}>{value}</span>
    </div>
  );
}