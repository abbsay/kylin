export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  currency: string;
  stroke?: string;
  color?: string;
  tuning?: string;
  imageUrl?: string;
}

export interface KylinProductMedia {
  id: string;
  url: string;
  alt?: string;
}

export interface KylinProduct {
  id: string;
  slug: string;
  name: string;
  nameZh: string;
  categorySlug: 'machines' | 'parts-and-cams' | 'power-and-accessories';
  categoryName: string;
  categoryNameZh: string;
  type: 'pen' | 'brass' | 'part';
  description: string;
  descriptionZh: string;
  motor?: string;
  material?: string;
  voltage?: string;
  weight?: string;
  strokeOptions: string[];
  startingPriceUsd: number;
  startingPriceCny: number;
  badge?: string;
  badgeZh?: string;
  imageUrl: string;
  media?: KylinProductMedia[];
  variants: ProductVariant[];
}

export interface CartItem {
  variantId: string;
  productSlug: string;
  productName: string;
  variantName: string;
  sku: string;
  price: number;
  currency: string;
  quantity: number;
  imageUrl: string;
}
