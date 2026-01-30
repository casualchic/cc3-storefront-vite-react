import { useState, useEffect, useMemo } from 'react';
import { SortOption, ViewMode, ProductFilters as FilterState } from '../../types';
import { products } from '../../mocks/products';
import { ProductFilters } from './ProductFilters';
import { ProductSort } from './ProductSort';
import { ProductGrid } from './ProductGrid';
import './ProductLayout.css';

interface ProductLayoutProps {
  category?: string;
  subcategory?: string;
}

const VIEW_MODE_KEY = 'cc3-view-mode';

export const ProductLayout = ({ category, subcategory }: ProductLayoutProps) => {
  // Get initial view mode from localStorage
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(VIEW_MODE_KEY);
      if (stored === 'grid' || stored === 'list') {
        return stored;
      }
    }
    return 'grid';
  });

  const [filtersOpen, setFiltersOpen] = useState(false);

  // Parse filters from URL on mount and when URL changes
  const [filters, setFilters] = useState<FilterState>(() => {
    if (typeof window === 'undefined') return {};

    const params = new URLSearchParams(window.location.search);
    return {
      category: params.get('category') || category,
      subcategory: params.get('subcategory') || subcategory,
      sizes: params.get('sizes')?.split(',').filter(Boolean),
      colors: params.get('colors')?.split(',').filter(Boolean),
      minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
      maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
      inStockOnly: params.get('inStock') === 'true',
      onSale: params.get('onSale') === 'true',
    };
  });

  const [sortBy, setSortBy] = useState<SortOption>(() => {
    if (typeof window === 'undefined') return 'relevance';
    const params = new URLSearchParams(window.location.search);
    const sort = params.get('sort');
    if (
      sort === 'relevance' ||
      sort === 'price-low-high' ||
      sort === 'price-high-low' ||
      sort === 'newest' ||
      sort === 'bestselling'
    ) {
      return sort;
    }
    return 'relevance';
  });

  // Update URL when filters or sort change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams();

    if (filters.category) params.set('category', filters.category);
    if (filters.subcategory) params.set('subcategory', filters.subcategory);
    if (filters.sizes && filters.sizes.length > 0) params.set('sizes', filters.sizes.join(','));
    if (filters.colors && filters.colors.length > 0)
      params.set('colors', filters.colors.join(','));
    if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.inStockOnly) params.set('inStock', 'true');
    if (filters.onSale) params.set('onSale', 'true');
    if (sortBy !== 'relevance') params.set('sort', sortBy);

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [filters, sortBy]);

  // Persist view mode to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(VIEW_MODE_KEY, viewMode);
    }
  }, [viewMode]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.subcategory && product.subcategory !== filters.subcategory) return false;
      if (filters.inStockOnly && !product.inStock) return false;
      if (filters.onSale && !product.isSale) return false;

      if (filters.minPrice !== undefined && product.price < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) return false;

      if (filters.sizes && filters.sizes.length > 0) {
        if (!product.sizes || !filters.sizes.some((size) => product.sizes?.includes(size))) {
          return false;
        }
      }

      if (filters.colors && filters.colors.length > 0) {
        if (
          !product.colors ||
          !filters.colors.some((color) => product.colors?.includes(color))
        ) {
          return false;
        }
      }

      return true;
    });
  }, [products, filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price-low-high':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'bestselling':
        return sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
      case 'relevance':
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category,
      subcategory,
    });
  };

  const activeFilterCount =
    (filters.sizes?.length || 0) +
    (filters.colors?.length || 0) +
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.onSale ? 1 : 0);

  return (
    <div className="product-layout">
      <aside className="product-sidebar">
        <ProductFilters
          selectedCategory={filters.category}
          selectedSubcategory={filters.subcategory}
          selectedSizes={filters.sizes}
          selectedColors={filters.colors}
          priceRange={
            filters.minPrice !== undefined && filters.maxPrice !== undefined
              ? [filters.minPrice, filters.maxPrice]
              : undefined
          }
          inStockOnly={filters.inStockOnly}
          onSale={filters.onSale}
          onFilterChange={(newFilters) => {
            handleFilterChange({
              category: newFilters.category,
              subcategory: newFilters.subcategory,
              sizes: newFilters.sizes,
              colors: newFilters.colors,
              minPrice: newFilters.priceRange?.[0],
              maxPrice: newFilters.priceRange?.[1],
              inStockOnly: newFilters.inStockOnly,
              onSale: newFilters.onSale,
            });
          }}
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        />
      </aside>

      {filtersOpen && (
        <div className="filter-overlay" onClick={() => setFiltersOpen(false)} />
      )}

      <div className="product-main">
        <div className="product-header">
          <div className="product-header-left">
            <button
              className="filter-toggle"
              onClick={() => setFiltersOpen(true)}
              aria-label="Open filters"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4h14M3 10h10M3 16h6" stroke="currentColor" strokeWidth="2" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="filter-badge">{activeFilterCount}</span>
              )}
            </button>

            <div className="results-count">
              Showing {sortedProducts.length} of {products.length} products
            </div>
          </div>

          <div className="product-header-right">
            {activeFilterCount > 0 && (
              <button className="clear-filters" onClick={handleClearFilters}>
                Clear all
              </button>
            )}
            <ProductSort currentSort={sortBy} onSortChange={setSortBy} />
          </div>
        </div>

        <ProductGrid
          products={sortedProducts}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>
    </div>
  );
};