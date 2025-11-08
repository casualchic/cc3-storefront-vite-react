export interface Product {
  id: string;
  title: string;
  description: string | null;
  handle: string;
  thumbnail: string | null;
  price: number;
  compare_at_price: number | null;
  inventory_quantity: number | null;
  brand_id: string;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  synced_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  title: string | null;
  sku: string | null;
  price: number | null;
  inventory_quantity: number | null;
  options: Record<string, string> | null;
  synced_at: string;
}

export interface Category {
  id: string;
  name: string;
  handle: string;
  description: string | null;
  parent_id: string | null;
  synced_at: string;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  content: any;
  meta_title: string | null;
  meta_description: string | null;
  brand_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}
