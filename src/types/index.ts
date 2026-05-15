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

/*
  DYNAMIC PRODUCT TABLE TYPES

  These are admin-panel-ready:
  - each product family can have its own visible columns
  - each product family can have its own price break columns
  - each row stores values and prices dynamically
*/

export type DynamicColumnType = "text" | "number" | "image";

export type DynamicTableColumn = {
  id: string;
  label: string;
  key: string;
  type: DynamicColumnType;
  visible: boolean;
  order: number;
};

export type DynamicPriceBreak = {
  id: string;
  label: string;
  startsAfterQty: number;
  order: number;
};

export type BulkOrderOption = {
  label: string;
  quantity: number;
  totalUnits: number;
};

export type BulkProductRow = {
  id: string;
  sku: string;
  name: string;
  image?: string;
  emoji: string;

  /*
    Dynamic row values.
    Example:
    values: {
      material: "Co-ex polythene",
      recycledInfo: "30% recycled content",
      sizeInches: "4 x 6",
      sizeMm: "102 x 152mm",
      gauge: "55mu"
    }
  */
  values: Record<string, string | number>;

  packQty: number;
  boxQty: number;
  unitLabel: string;

  /*
    Dynamic prices.
    Example:
    prices: {
      pb_1: 8.5,
      pb_4: 7.65,
      pb_8: 6.96,
      trade: 5.65
    }
  */
  prices: Record<string, number>;

  orderOptions: BulkOrderOption[];
};

export type ProductFamily = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  image?: string;
  isPublished: boolean;

  tableColumns: DynamicTableColumn[];
  priceBreaks: DynamicPriceBreak[];
  rows: BulkProductRow[];

  specifications?: Record<string, string>;
};

/*
  CART TYPES
*/

export type StandardCartItem = {
  type: "standard";
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
};

export type BulkCartItem = {
  type: "bulk";
  row: BulkProductRow;
  quantity: number;

  /*
    Important:
    Bulk cart item carries its own priceBreaks so cart/checkout can still
    calculate correct pricing even after leaving product detail page.
  */
  priceBreaks: DynamicPriceBreak[];
};

export type CartItem = StandardCartItem | BulkCartItem;

export type PendingBulkOrderItem = {
  row: BulkProductRow;
  quantity: number;

  /*
    Temporary order summary also needs priceBreaks because it calculates
    live totals before adding to cart.
  */
  priceBreaks: DynamicPriceBreak[];
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