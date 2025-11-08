-- E-commerce tables (synced from Medusa - read-only for Storefront)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  handle TEXT UNIQUE NOT NULL,
  thumbnail TEXT,
  price INTEGER NOT NULL,
  compare_at_price INTEGER,
  inventory_quantity INTEGER,
  brand_id TEXT DEFAULT 'casual-chic',
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  title TEXT,
  sku TEXT,
  price INTEGER,
  inventory_quantity INTEGER,
  options JSON,
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id TEXT REFERENCES categories(id),
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_categories (
  product_id TEXT NOT NULL REFERENCES products(id),
  category_id TEXT NOT NULL REFERENCES categories(id),
  PRIMARY KEY (product_id, category_id)
);

-- CMS tables (Payload owns - Storefront reads)
CREATE TABLE IF NOT EXISTS cms_pages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content JSON,
  meta_title TEXT,
  meta_description TEXT,
  brand_id TEXT DEFAULT 'casual-chic',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cms_blocks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSON,
  brand_id TEXT DEFAULT 'casual-chic',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cms_media (
  id TEXT PRIMARY KEY,
  r2_key TEXT UNIQUE NOT NULL,
  filename TEXT,
  mime_type TEXT,
  size INTEGER,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_handle ON products(handle);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_handle ON categories(handle);
CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_brand ON cms_pages(brand_id, published);
