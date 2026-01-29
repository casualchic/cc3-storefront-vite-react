# ProductGrid Component Documentation

## Overview

The `ProductGrid` component is a flexible, production-ready product display component that features:

- ✅ Responsive grid layout (1/2/3-4 columns based on viewport)
- ✅ Infinite scroll pagination with TanStack Query
- ✅ Loading skeleton states
- ✅ Empty and error states with retry functionality
- ✅ Grid and list view modes
- ✅ Intersection Observer-based lazy loading
- ✅ Manual "Load More" button fallback
- ✅ Full TypeScript support
- ✅ Dark mode compatible

## Installation

The component requires the following dependencies:

```bash
npm install @tanstack/react-query lucide-react
```

## Basic Usage

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';
import { ProductGrid } from '@/components/ProductGrid';
import { fetchProducts } from '@/api/products';

function ProductsPage() {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = 0 }) => fetchProducts({ pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  return (
    <ProductGrid
      products={products}
      isLoading={isLoading}
      isError={isError}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      onRetry={() => refetch()}
    />
  );
}
```

## Props API

### ProductGridProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `products` | `Product[]` | ✅ | - | Array of product objects to display |
| `isLoading` | `boolean` | ✅ | - | Initial loading state (shows skeletons) |
| `isError` | `boolean` | ✅ | - | Error state (shows error UI) |
| `hasNextPage` | `boolean` | ❌ | `false` | Whether more pages are available |
| `isFetchingNextPage` | `boolean` | ❌ | `false` | Loading state for next page |
| `fetchNextPage` | `() => void` | ❌ | - | Function to fetch next page |
| `viewMode` | `'grid' \| 'list'` | ❌ | `'grid'` | Display mode |
| `columns` | `2 \| 3 \| 4` | ❌ | `4` | Number of columns in desktop grid |
| `onRetry` | `() => void` | ❌ | - | Retry function for error state |
| `emptyStateMessage` | `string` | ❌ | `'No products found'` | Message for empty state |
| `emptyStateAction` | `{ label: string; onClick: () => void }` | ❌ | - | Optional action button for empty state |

## Product Type

The component expects products with the following structure:

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description?: string;
  category: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  rating?: number;
  reviews?: number;
}
```

## View Modes

### Grid View (Default)

Displays products in a responsive grid:
- Mobile: 1 column
- Tablet (640px+): 2 columns
- Desktop (1024px+): 3-4 columns (configurable)

```tsx
<ProductGrid
  products={products}
  isLoading={isLoading}
  isError={isError}
  viewMode="grid"
  columns={4}
  // ... other props
/>
```

### List View

Displays products in horizontal cards with more details:

```tsx
<ProductGrid
  products={products}
  isLoading={isLoading}
  isError={isError}
  viewMode="list"
  // ... other props
/>
```

## Infinite Scroll

The component uses Intersection Observer API to automatically load more products when the user scrolls near the bottom:

- Triggers 200px before reaching the bottom
- Debounced to prevent multiple simultaneous loads
- Works seamlessly with TanStack Query's `useInfiniteQuery`
- Falls back to "Load More" button

## Loading States

### Initial Load
Shows 12 skeleton loaders in the grid layout while fetching the first page:

```tsx
<ProductGrid
  products={[]}
  isLoading={true}
  isError={false}
  // ... other props
/>
```

### Loading More
Shows 4 skeleton loaders below existing products when fetching next page:

```tsx
<ProductGrid
  products={existingProducts}
  isLoading={false}
  isError={false}
  isFetchingNextPage={true}
  hasNextPage={true}
  fetchNextPage={fetchNextPage}
  // ... other props
/>
```

## Error State

Displays error UI with retry button:

```tsx
<ProductGrid
  products={[]}
  isLoading={false}
  isError={true}
  onRetry={() => refetch()}
  // ... other props
/>
```

Error state includes:
- Alert icon
- "Oops! Something went wrong" message
- "Try Again" button (if `onRetry` is provided)

## Empty State

Displays when no products match the criteria:

```tsx
<ProductGrid
  products={[]}
  isLoading={false}
  isError={false}
  emptyStateMessage="No products found in this category"
  emptyStateAction={{
    label: "Browse All Products",
    onClick: () => navigate('/collections')
  }}
  // ... other props
/>
```

Empty state includes:
- Package icon
- Custom message
- Optional action button

## Integration with TanStack Query

### Setup QueryClient

First, wrap your app with `QueryClientProvider`:

```tsx
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
    </QueryClientProvider>
  );
}
```

### Create API Function

Create a paginated fetch function:

```typescript
// api/products.ts
export interface ProductsResponse {
  products: Product[];
  nextCursor: number | null;
  hasMore: boolean;
  total: number;
}

export async function fetchProducts({
  pageParam = 0,
  category,
  limit = 12,
}: {
  pageParam?: number;
  category?: string;
  limit?: number;
}): Promise<ProductsResponse> {
  const response = await fetch(
    `/api/products?page=${pageParam}&category=${category}&limit=${limit}`
  );
  return response.json();
}
```

### Use in Component

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

function CategoryPage() {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['products', 'category', categorySlug],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({ pageParam, category: categorySlug, limit: 12 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  return (
    <ProductGrid
      products={products}
      isLoading={isLoading}
      isError={isError}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      onRetry={() => refetch()}
    />
  );
}
```

## Performance Considerations

### Image Loading
All product images use `loading="lazy"` for optimal performance:
- Images only load when near viewport
- Reduces initial page load time
- Improves LCP (Largest Contentful Paint)

### Virtualization
For lists > 100 items, consider using `@tanstack/react-virtual`:

```bash
npm install @tanstack/react-virtual
```

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

// Implement virtual scrolling for large lists
```

### Debouncing
The intersection observer includes built-in debouncing to prevent multiple simultaneous page loads.

## Accessibility

The component follows accessibility best practices:

- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy
- ✅ ARIA labels for interactive elements
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader friendly

## Styling

The component uses Tailwind CSS for styling:

- Responsive breakpoints: `sm:`, `lg:`
- Dark mode support: `dark:` variants
- Customizable via Tailwind config
- No inline styles

### Customizing Styles

Modify Tailwind config to customize:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Custom colors
      },
    },
  },
};
```

## Examples

### Sale Page with Filtering

```tsx
function SalePage() {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['products', 'sale'],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({ pageParam, onSale: true, limit: 12 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  return (
    <ProductGrid
      products={products}
      isLoading={isLoading}
      isError={isError}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      viewMode="grid"
      columns={4}
      onRetry={() => refetch()}
      emptyStateMessage="No sale items available"
    />
  );
}
```

### List View with Toggle

```tsx
function ProductsWithToggle() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
          Toggle View
        </button>
      </div>

      <ProductGrid
        products={products}
        viewMode={viewMode}
        // ... other props
      />
    </div>
  );
}
```

### With Custom Empty State

```tsx
<ProductGrid
  products={[]}
  isLoading={false}
  isError={false}
  emptyStateMessage="No matching products"
  emptyStateAction={{
    label: "Clear Filters",
    onClick: () => clearFilters()
  }}
  // ... other props
/>
```

## Troubleshooting

### Products not loading

1. Check network requests in DevTools
2. Verify API endpoint is returning correct format
3. Ensure `getNextPageParam` returns correct cursor

### Infinite scroll not triggering

1. Check if `hasNextPage` is true
2. Verify `fetchNextPage` function is provided
3. Check browser console for intersection observer errors

### Skeletons showing indefinitely

1. Verify `isLoading` changes to `false` after fetch
2. Check if products array is being populated
3. Ensure data structure matches expected format

## Related Components

- `ProductCard` - Individual product card component
- `ProductCardList` - List view product card (internal)
- `ProductSkeleton` - Loading skeleton (internal)

## Future Enhancements

Potential improvements tracked in Linear:

- [ ] Virtual scrolling for lists > 100 items
- [ ] View mode persistence (localStorage)
- [ ] Sorting options (price, date, popularity)
- [ ] Filter integration
- [ ] Product comparison feature
- [ ] Quick add to cart from grid

## Support

For issues or questions:
- Check the component source: `src/react-app/components/ProductGrid.tsx`
- Review requirements: `COMPONENT_REQUIREMENTS.md` (PROD-001 through PROD-005)
- Create a Linear issue with tag `frontend`

## Version History

### v1.0.0 (2026-01-28)
- Initial implementation
- Grid and list view modes
- Infinite scroll with TanStack Query
- Loading, error, and empty states
- Responsive layout
- Dark mode support
