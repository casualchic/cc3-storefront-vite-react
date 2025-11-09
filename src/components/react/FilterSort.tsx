/**
 * FilterSort Component
 * Client-side filter and sort controls for product listings
 */

import { useState, useEffect } from 'react';
import ProductFilter, { type FilterOptions } from './ProductFilter';

interface FilterSortProps {
  currentSort?: string;
  currentFilters?: FilterOptions;
  availableCategories?: Array<{ id: string; name: string; count: number }>;
  priceRange?: { min: number; max: number };
  onSortChange?: (sort: string) => void;
  onFilterChange?: (filters: FilterOptions) => void;
}

export default function FilterSort({
  currentSort = 'newest',
  currentFilters = {},
  availableCategories = [],
  priceRange,
  onSortChange,
  onFilterChange,
}: FilterSortProps) {
  const [sort, setSort] = useState(currentSort);

  useEffect(() => {
    setSort(currentSort);
  }, [currentSort]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSort(newSort);

    if (onSortChange) {
      onSortChange(newSort);
    } else {
      // Update URL and reload
      const url = new URL(window.location.href);
      url.searchParams.set('sort', newSort);
      url.searchParams.delete('page'); // Reset to page 1 when sorting
      window.location.href = url.toString();
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Product Filters */}
      <ProductFilter
        currentFilters={currentFilters}
        availableCategories={availableCategories}
        priceRange={priceRange}
        onFilterChange={onFilterChange}
      />

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-charcoal font-medium">
          Sort by:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={handleSortChange}
          className="text-sm border-2 border-neutral rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white text-forest"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A-Z</option>
        </select>
      </div>
    </div>
  );
}
