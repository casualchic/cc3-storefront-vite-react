/**
 * Mock Product Data for Development
 * Use this when Medusa backend is not available
 */

import type { Product, ProductVariant } from './products';

export const mockProducts: Product[] = [
  {
    id: 'prod_casual_denim_jacket',
    title: 'Classic Denim Jacket',
    handle: 'classic-denim-jacket',
    description: 'A timeless denim jacket crafted from premium cotton denim. Features a relaxed fit, classic button closure, and multiple pockets. Perfect for layering in any season.',
    subtitle: 'Premium Cotton Denim',
    status: 'published' as any,
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    images: [
      {
        id: 'img_1',
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      },
      {
        id: 'img_2',
        url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800',
      },
    ],
    options: [
      {
        id: 'opt_size',
        title: 'Size',
        values: [
          { id: 'val_xs', value: 'XS', option_id: 'opt_size' },
          { id: 'val_s', value: 'S', option_id: 'opt_size' },
          { id: 'val_m', value: 'M', option_id: 'opt_size' },
          { id: 'val_l', value: 'L', option_id: 'opt_size' },
          { id: 'val_xl', value: 'XL', option_id: 'opt_size' },
        ],
      },
    ],
    variants: [
      {
        id: 'var_jacket_xs',
        title: 'XS',
        sku: 'DENIM-JACKET-XS',
        inventory_quantity: 5,
        manage_inventory: true,
        allow_backorder: false,
        options: [{ id: 'opt_val_1', value: 'XS', option: { id: 'opt_size', title: 'Size' } }],
        calculated_price: { calculated_amount: 8900, currency_code: 'usd' },
      } as any,
      {
        id: 'var_jacket_s',
        title: 'S',
        sku: 'DENIM-JACKET-S',
        inventory_quantity: 12,
        manage_inventory: true,
        allow_backorder: false,
        options: [{ id: 'opt_val_2', value: 'S', option: { id: 'opt_size', title: 'Size' } }],
        calculated_price: { calculated_amount: 8900, currency_code: 'usd' },
      } as any,
      {
        id: 'var_jacket_m',
        title: 'M',
        sku: 'DENIM-JACKET-M',
        inventory_quantity: 8,
        manage_inventory: true,
        allow_backorder: false,
        options: [{ id: 'opt_val_3', value: 'M', option: { id: 'opt_size', title: 'Size' } }],
        calculated_price: { calculated_amount: 8900, currency_code: 'usd' },
      } as any,
      {
        id: 'var_jacket_l',
        title: 'L',
        sku: 'DENIM-JACKET-L',
        inventory_quantity: 3,
        manage_inventory: true,
        allow_backorder: false,
        options: [{ id: 'opt_val_4', value: 'L', option: { id: 'opt_size', title: 'Size' } }],
        calculated_price: { calculated_amount: 8900, currency_code: 'usd' },
      } as any,
      {
        id: 'var_jacket_xl',
        title: 'XL',
        sku: 'DENIM-JACKET-XL',
        inventory_quantity: 0,
        manage_inventory: true,
        allow_backorder: false,
        options: [{ id: 'opt_val_5', value: 'XL', option: { id: 'opt_size', title: 'Size' } }],
        calculated_price: { calculated_amount: 8900, currency_code: 'usd' },
      } as any,
    ] as any,
    collection: null,
    categories: null,
    type: null,
    tags: null,
    weight: 500,
    length: null,
    height: null,
    width: null,
    hs_code: null,
    origin_country: null,
    mid_code: null,
    material: 'Cotton Denim',
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15'),
    deleted_at: null,
    metadata: null,
  } as any,
  {
    id: 'prod_linen_summer_dress',
    title: 'Linen Summer Dress',
    handle: 'linen-summer-dress',
    description: 'Breezy linen dress perfect for warm weather. Features a flattering A-line silhouette, adjustable straps, and side pockets. Made from 100% European linen.',
    subtitle: '100% European Linen',
    status: 'published' as any,
    thumbnail: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
    images: [
      {
        id: 'img_3',
        url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
      },
      {
        id: 'img_4',
        url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      },
    ],
    options: [
      {
        id: 'opt_size_2',
        title: 'Size',
        values: [
          { id: 'val2_xs', value: 'XS', option_id: 'opt_size_2' },
          { id: 'val2_s', value: 'S', option_id: 'opt_size_2' },
          { id: 'val2_m', value: 'M', option_id: 'opt_size_2' },
          { id: 'val2_l', value: 'L', option_id: 'opt_size_2' },
        ],
      },
      {
        id: 'opt_color',
        title: 'Color',
        values: [
          { id: 'val_beige', value: 'Beige', option_id: 'opt_color' },
          { id: 'val_white', value: 'White', option_id: 'opt_color' },
        ],
      },
    ],
    variants: [
      {
        id: 'var_dress_s_beige',
        title: 'S / Beige',
        sku: 'LINEN-DRESS-S-BEIGE',
        inventory_quantity: 7,
        manage_inventory: true,
        allow_backorder: false,
        options: [
          { id: 'opt_val_6', value: 'S', option: { id: 'opt_size_2', title: 'Size' } },
          { id: 'opt_val_7', value: 'Beige', option: { id: 'opt_color', title: 'Color' } },
        ],
        calculated_price: { calculated_amount: 12500, currency_code: 'usd' },
      } as any,
      {
        id: 'var_dress_m_beige',
        title: 'M / Beige',
        sku: 'LINEN-DRESS-M-BEIGE',
        inventory_quantity: 10,
        manage_inventory: true,
        allow_backorder: false,
        options: [
          { id: 'opt_val_8', value: 'M', option: { id: 'opt_size_2', title: 'Size' } },
          { id: 'opt_val_9', value: 'Beige', option: { id: 'opt_color', title: 'Color' } },
        ],
        calculated_price: { calculated_amount: 12500, currency_code: 'usd' },
      } as any,
      {
        id: 'var_dress_s_white',
        title: 'S / White',
        sku: 'LINEN-DRESS-S-WHITE',
        inventory_quantity: 5,
        manage_inventory: true,
        allow_backorder: false,
        options: [
          { id: 'opt_val_10', value: 'S', option: { id: 'opt_size_2', title: 'Size' } },
          { id: 'opt_val_11', value: 'White', option: { id: 'opt_color', title: 'Color' } },
        ],
        calculated_price: { calculated_amount: 12500, currency_code: 'usd' },
      } as any,
      {
        id: 'var_dress_m_white',
        title: 'M / White',
        sku: 'LINEN-DRESS-M-WHITE',
        inventory_quantity: 8,
        manage_inventory: true,
        allow_backorder: false,
        options: [
          { id: 'opt_val_12', value: 'M', option: { id: 'opt_size_2', title: 'Size' } },
          { id: 'opt_val_13', value: 'White', option: { id: 'opt_color', title: 'Color' } },
        ],
        calculated_price: { calculated_amount: 12500, currency_code: 'usd' },
      } as any,
    ] as any,
    collection: null,
    categories: null,
    type: null,
    tags: null,
    weight: 300,
    length: null,
    height: null,
    width: null,
    hs_code: null,
    origin_country: null,
    mid_code: null,
    material: 'Linen',
    created_at: new Date('2024-02-01'),
    updated_at: new Date('2024-02-01'),
    deleted_at: null,
    metadata: null,
  } as any,
  {
    id: 'prod_cashmere_sweater',
    title: 'Luxury Cashmere Sweater',
    handle: 'luxury-cashmere-sweater',
    description: 'Ultra-soft cashmere sweater that defines luxury comfort. Features a classic crew neck, ribbed cuffs and hem, and a relaxed fit. Made from 100% Grade A Mongolian cashmere.',
    subtitle: '100% Mongolian Cashmere',
    status: 'published' as any,
    thumbnail: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400',
    images: [
      {
        id: 'img_5',
        url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
      },
    ],
    options: [
      {
        id: 'opt_size_3',
        title: 'Size',
        values: [
          { id: 'val3_s', value: 'S', option_id: 'opt_size_3' },
          { id: 'val3_m', value: 'M', option_id: 'opt_size_3' },
          { id: 'val3_l', value: 'L', option_id: 'opt_size_3' },
        ],
      },
      {
        id: 'opt_color_2',
        title: 'Color',
        values: [
          { id: 'val_navy', value: 'Navy', option_id: 'opt_color_2' },
          { id: 'val_cream', value: 'Cream', option_id: 'opt_color_2' },
          { id: 'val_charcoal', value: 'Charcoal', option_id: 'opt_color_2' },
        ],
      },
    ],
    variants: [
      {
        id: 'var_sweater_m_navy',
        title: 'M / Navy',
        sku: 'CASHMERE-SWEATER-M-NAVY',
        inventory_quantity: 4,
        manage_inventory: true,
        allow_backorder: false,
        options: [
          { id: 'opt_val_14', value: 'M', option: { id: 'opt_size_3', title: 'Size' } },
          { id: 'opt_val_15', value: 'Navy', option: { id: 'opt_color_2', title: 'Color' } },
        ],
        calculated_price: { calculated_amount: 24900, currency_code: 'usd' },
      } as any,
      {
        id: 'var_sweater_l_navy',
        title: 'L / Navy',
        sku: 'CASHMERE-SWEATER-L-NAVY',
        inventory_quantity: 6,
        manage_inventory: true,
        allow_backorder: false,
        options: [
          { id: 'opt_val_16', value: 'L', option: { id: 'opt_size_3', title: 'Size' } },
          { id: 'opt_val_17', value: 'Navy', option: { id: 'opt_color_2', title: 'Color' } },
        ],
        calculated_price: { calculated_amount: 24900, currency_code: 'usd' },
      } as any,
      {
        id: 'var_sweater_m_cream',
        title: 'M / Cream',
        sku: 'CASHMERE-SWEATER-M-CREAM',
        inventory_quantity: 3,
        manage_inventory: true,
        allow_backorder: false,
        options: [
          { id: 'opt_val_18', value: 'M', option: { id: 'opt_size_3', title: 'Size' } },
          { id: 'opt_val_19', value: 'Cream', option: { id: 'opt_color_2', title: 'Color' } },
        ],
        calculated_price: { calculated_amount: 24900, currency_code: 'usd' },
      } as any,
    ] as any,
    collection: null,
    categories: null,
    type: null,
    tags: null,
    weight: 250,
    length: null,
    height: null,
    width: null,
    hs_code: null,
    origin_country: null,
    mid_code: null,
    material: 'Cashmere',
    created_at: new Date('2024-03-01'),
    updated_at: new Date('2024-03-01'),
    deleted_at: null,
    metadata: null,
  } as any,
];

/**
 * Mock function to get product by handle
 */
export function getMockProductByHandle(handle: string): Product | null {
  return mockProducts.find(p => p.handle === handle) || null;
}

/**
 * Mock function to get product by ID
 */
export function getMockProductById(id: string): Product | null {
  return mockProducts.find(p => p.id === id) || null;
}

/**
 * Mock function to search products
 */
export function searchMockProducts(query?: string): Product[] {
  if (!query) return mockProducts;

  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(p =>
    p.title.toLowerCase().includes(lowerQuery) ||
    p.description?.toLowerCase().includes(lowerQuery)
  );
}
