export type PricingTier = {
  minQty: number;
  maxQty: number | null;
  pricePerPack: number;
  tradePricePerPack: number;
  unitLabel: string;
  isPopular?: boolean;
};

export type ProductVariant = {
  name: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  sku: string;
  category: string;
  emoji: string;
  description: string;
  variants: ProductVariant[];
  pricingTiers: PricingTier[];
  specifications: Record<string, string>;
  badges: string[];
  isEco: boolean;
  isFeatured: boolean;
};

export type CartItem = {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
};

export type CartTotals = {
  subtotal: number;
  vat: number;
  delivery: number;
  discount: number;
  total: number;
  qualifiesForFreeDelivery: boolean;
  amountForFreeDelivery: number;
};

export type Order = {
  items: CartItem[];
  subtotal: number;
  vat: number;
  delivery: number;
  discount: number;
  total: number;
  isTrade: boolean;
};