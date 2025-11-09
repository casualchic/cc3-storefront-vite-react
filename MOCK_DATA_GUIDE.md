# Mock Product Data Guide

The storefront now includes mock product data for development and testing purposes.

## When Mock Data is Used

Mock data is automatically enabled when:
- No `PUBLIC_MEDUSA_PUBLISHABLE_KEY` is set in `.env`
- The publishable key is set to `your_publishable_key` (placeholder value)
- Running in development mode (`npm run dev`)

## Available Mock Products

### 1. Classic Denim Jacket
- **Handle**: `classic-denim-jacket`
- **Price**: $89.00
- **Sizes**: XS, S, M, L, XL (XL is out of stock)
- **Material**: Premium Cotton Denim
- **URL**: `/products/classic-denim-jacket`

### 2. Linen Summer Dress
- **Handle**: `linen-summer-dress`
- **Price**: $125.00
- **Sizes**: S, M, L
- **Colors**: Beige, White
- **Material**: 100% European Linen
- **URL**: `/products/linen-summer-dress`

### 3. Luxury Cashmere Sweater
- **Handle**: `luxury-cashmere-sweater`
- **Price**: $249.00
- **Sizes**: S, M, L
- **Colors**: Navy, Cream, Charcoal
- **Material**: 100% Mongolian Cashmere
- **URL**: `/products/luxury-cashmere-sweater`

## Testing the PDP Functionality

### 1. Start the development server:
```bash
npm run dev
```

### 2. Visit any of these URLs:
- http://localhost:4321/products/classic-denim-jacket
- http://localhost:4321/products/linen-summer-dress
- http://localhost:4321/products/luxury-cashmere-sweater

### 3. Test Features:
- ✅ View product images
- ✅ See product details and pricing
- ✅ Select different sizes
- ✅ Select different colors (for multi-color products)
- ✅ Check inventory status
- ✅ Add items to cart
- ✅ See variant SKUs and availability

## Switching to Real Medusa Backend

To connect to a real Medusa v2 backend:

1. Update your `.env` file:
```env
PUBLIC_MEDUSA_API_URL=https://your-medusa-backend.com
PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_actual_key_here
```

2. Restart the dev server

The app will automatically switch from mock data to live Medusa API calls.

## Mock Data Features

The mock data includes:
- Realistic product information
- Multiple variants (sizes and colors)
- Inventory tracking (some items out of stock)
- Product images from Unsplash
- Proper pricing structure ($XX.00 format)
- SKUs and product metadata

## Customizing Mock Data

To add or modify mock products, edit:
```
src/lib/medusa/mock-data.ts
```

Each product should follow the Medusa v2 `StoreProduct` type structure.
