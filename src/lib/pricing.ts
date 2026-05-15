import {
  BulkProductRow,
  CartItem,
  DynamicPriceBreak,
  PricingTier,
} from "@/types";

const roundToTwo = (value: number) => {
  return Math.round(value * 100) / 100;
};

/* 
  STANDARD PRODUCT PRICING
*/

export const getApplicableTier = (
  tiers: PricingTier[],
  quantity: number
): PricingTier => {
  const tier = tiers.find((tier) => {
    const meetsMin = quantity >= tier.minQty;
    const meetsMax = tier.maxQty === null || quantity <= tier.maxQty;

    return meetsMin && meetsMax;
  });

  return tier || tiers[0];
};

export const calculateItemTotal = (
  tier: PricingTier,
  quantity: number,
  isTrade: boolean
): number => {
  const price = isTrade ? tier.tradePricePerPack : tier.pricePerPack;
  return roundToTwo(price * quantity);
};

export const getSavingsPercentage = (
  standardPrice: number,
  tradePrice: number
): number => {
  if (standardPrice <= 0) return 0;

  const saving = ((standardPrice - tradePrice) / standardPrice) * 100;
  return Math.round(saving);
};

/* 
  DYNAMIC BULK TABLE PRICING
*/

export const getActivePriceBreak = (
  priceBreaks: DynamicPriceBreak[] = [],
  quantity: number
): DynamicPriceBreak | null => {
  if (quantity <= 0 || priceBreaks.length === 0) return null;

  const sortedBreaks = [...priceBreaks].sort(
    (a, b) => b.startsAfterQty - a.startsAfterQty
  );

  return (
    sortedBreaks.find((priceBreak) => quantity > priceBreak.startsAfterQty) ??
    priceBreaks[0] ??
    null
  );
};

export const getBulkUnitPrice = (
  row: BulkProductRow,
  quantity: number,
  isTrade: boolean,
  priceBreaks: DynamicPriceBreak[] = []
): number => {
  if (isTrade) {
    return row.prices.trade ?? 0;
  }

  const activeBreak = getActivePriceBreak(priceBreaks, quantity);

  if (!activeBreak) return 0;

  return row.prices[activeBreak.id] ?? 0;
};

export const calculateBulkItemTotal = (
  row: BulkProductRow,
  quantity: number,
  isTrade: boolean,
  priceBreaks: DynamicPriceBreak[] = []
): number => {
  const unitPrice = getBulkUnitPrice(row, quantity, isTrade, priceBreaks);
  return roundToTwo(unitPrice * quantity);
};

export const calculateBulkTotalUnits = (
  row: BulkProductRow,
  quantity: number
): number => {
  return row.packQty * quantity;
};

/*
  CART TOTALS
*/

export const calculateCartItemSubtotal = (
  item: CartItem,
  isTrade: boolean
): number => {
  if (item.type === "bulk") {
    return calculateBulkItemTotal(
      item.row,
      item.quantity,
      isTrade,
      item.priceBreaks ?? []
    );
  }

  const tier = getApplicableTier(item.product.pricingTiers, item.quantity);
  return calculateItemTotal(tier, item.quantity, isTrade);
};

export const calculateCartTotals = (
  items: CartItem[],
  isTrade: boolean,
  discount: number = 0
) => {
  const FREE_DELIVERY_THRESHOLD = 75;
  const DELIVERY_FEE = 6.95;
  const VAT_RATE = 0.2;

  const subtotalBeforeDiscount = items.reduce((total, item) => {
    const lineTotal = calculateCartItemSubtotal(item, isTrade);
    return total + lineTotal;
  }, 0);

  const subtotal = roundToTwo(Math.max(subtotalBeforeDiscount - discount, 0));

  const qualifiesForFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const delivery = qualifiesForFreeDelivery || subtotal === 0 ? 0 : DELIVERY_FEE;

  const vat = roundToTwo(subtotal * VAT_RATE);
  const total = roundToTwo(subtotal + vat + delivery);

  const amountForFreeDelivery = qualifiesForFreeDelivery
    ? 0
    : roundToTwo(FREE_DELIVERY_THRESHOLD - subtotal);

  return {
    subtotal,
    vat,
    delivery,
    discount,
    total,
    qualifiesForFreeDelivery,
    amountForFreeDelivery,
  };
};