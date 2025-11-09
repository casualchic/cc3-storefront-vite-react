/**
 * ProductFilter Component
 * Advanced filtering controls for product listings
 * Includes price range, categories, and availability filters
 */

import { useState, useEffect } from 'react';

export interface FilterOptions {
  priceMin?: number;
  priceMax?: number;
  categories?: string[];
  inStock?: boolean;
  onSale?: boolean;
}

interface ProductFilterProps {
  currentFilters?: FilterOptions;
  availableCategories?: Array<{ id: string; name: string; count: number }>;
  priceRange?: { min: number; max: number };
  onFilterChange?: (filters: FilterOptions) => void;
}

export default function ProductFilter({
  currentFilters = {},
  availableCategories = [],
  priceRange = { min: 0, max: 500 },
  onFilterChange,
}: ProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const [priceMin, setPriceMin] = useState<string>(currentFilters.priceMin?.toString() || '');
  const [priceMax, setPriceMax] = useState<string>(currentFilters.priceMax?.toString() || '');

  useEffect(() => {
    setFilters(currentFilters);
    setPriceMin(currentFilters.priceMin?.toString() || '');
    setPriceMax(currentFilters.priceMax?.toString() || '');
  }, [currentFilters]);

  const handleApplyFilters = () => {
    const updatedFilters: FilterOptions = {
      ...filters,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
    };

    if (onFilterChange) {
      onFilterChange(updatedFilters);
    } else {
      // Update URL params and reload
      const url = new URL(window.location.href);

      // Remove old filter params
      url.searchParams.delete('priceMin');
      url.searchParams.delete('priceMax');
      url.searchParams.delete('categories');
      url.searchParams.delete('inStock');
      url.searchParams.delete('onSale');
      url.searchParams.delete('page'); // Reset to page 1

      // Add new filter params
      if (updatedFilters.priceMin) url.searchParams.set('priceMin', updatedFilters.priceMin.toString());
      if (updatedFilters.priceMax) url.searchParams.set('priceMax', updatedFilters.priceMax.toString());
      if (updatedFilters.categories?.length) url.searchParams.set('categories', updatedFilters.categories.join(','));
      if (updatedFilters.inStock) url.searchParams.set('inStock', 'true');
      if (updatedFilters.onSale) url.searchParams.set('onSale', 'true');

      window.location.href = url.toString();
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    setPriceMin('');
    setPriceMax('');

    if (onFilterChange) {
      onFilterChange({});
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('priceMin');
      url.searchParams.delete('priceMax');
      url.searchParams.delete('categories');
      url.searchParams.delete('inStock');
      url.searchParams.delete('onSale');
      url.searchParams.delete('page');
      window.location.href = url.toString();
    }
  };

  const toggleCategory = (categoryId: string) => {
    const current = filters.categories || [];
    const updated = current.includes(categoryId)
      ? current.filter(id => id !== categoryId)
      : [...current, categoryId];
    setFilters({ ...filters, categories: updated });
  };

  const hasActiveFilters =
    priceMin || priceMax ||
    (filters.categories && filters.categories.length > 0) ||
    filters.inStock ||
    filters.onSale;

  return (
    <div className="relative">
      {/* Filter Toggle Button - Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border-2 border-neutral rounded-lg hover:border-sage transition-colors bg-white"
      >
        <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="font-medium text-forest">Filters</span>
        {hasActiveFilters && (
          <span className="ml-1 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
            {(filters.categories?.length || 0) +
             (priceMin || priceMax ? 1 : 0) +
             (filters.inStock ? 1 : 0) +
             (filters.onSale ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border-2 border-neutral rounded-lg shadow-xl z-50 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg font-bold text-forest">Filter Products</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-charcoal hover:text-forest transition-colors"
              aria-label="Close filters"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Price Range */}
            <div>
              <label className="block font-heading text-sm font-semibold text-forest mb-3">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="priceMin" className="block text-xs text-charcoal mb-1">
                    Min ($)
                  </label>
                  <input
                    id="priceMin"
                    type="number"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder={priceRange.min.toString()}
                    className="w-full px-3 py-2 border border-neutral rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="priceMax" className="block text-xs text-charcoal mb-1">
                    Max ($)
                  </label>
                  <input
                    id="priceMax"
                    type="number"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    placeholder={priceRange.max.toString()}
                    className="w-full px-3 py-2 border border-neutral rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            {availableCategories.length > 0 && (
              <div>
                <label className="block font-heading text-sm font-semibold text-forest mb-3">
                  Categories
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableCategories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-neutral/30 p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.categories?.includes(category.id) || false}
                        onChange={() => toggleCategory(category.id)}
                        className="w-4 h-4 text-primary border-neutral rounded focus:ring-primary focus:ring-2"
                      />
                      <span className="text-sm text-charcoal flex-1">{category.name}</span>
                      <span className="text-xs text-charcoal bg-neutral px-2 py-0.5 rounded">
                        {category.count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div>
              <label className="block font-heading text-sm font-semibold text-forest mb-3">
                Availability
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer hover:bg-neutral/30 p-2 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.inStock || false}
                    onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                    className="w-4 h-4 text-primary border-neutral rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-charcoal">In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:bg-neutral/30 p-2 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.onSale || false}
                    onChange={(e) => setFilters({ ...filters, onSale: e.target.checked })}
                    className="w-4 h-4 text-primary border-neutral rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-charcoal">On Sale</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-neutral flex gap-3">
            <button
              onClick={handleClearFilters}
              className="flex-1 px-4 py-2 border-2 border-neutral text-charcoal rounded-lg hover:border-sage hover:text-forest transition-colors font-medium"
            >
              Clear All
            </button>
            <button
              onClick={() => {
                handleApplyFilters();
                setIsOpen(false);
              }}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-sage transition-colors font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      {hasActiveFilters && !isOpen && (
        <div className="mt-3 flex flex-wrap gap-2">
          {priceMin && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-sage/10 text-forest text-sm rounded-full">
              Min: ${priceMin}
              <button
                onClick={() => {
                  setPriceMin('');
                  handleApplyFilters();
                }}
                className="hover:text-primary"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {priceMax && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-sage/10 text-forest text-sm rounded-full">
              Max: ${priceMax}
              <button
                onClick={() => {
                  setPriceMax('');
                  handleApplyFilters();
                }}
                className="hover:text-primary"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filters.categories?.map((catId) => {
            const category = availableCategories.find(c => c.id === catId);
            return category ? (
              <span key={catId} className="inline-flex items-center gap-1 px-3 py-1 bg-sage/10 text-forest text-sm rounded-full">
                {category.name}
                <button
                  onClick={() => {
                    toggleCategory(catId);
                    handleApplyFilters();
                  }}
                  className="hover:text-primary"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ) : null;
          })}
          {filters.inStock && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-sage/10 text-forest text-sm rounded-full">
              In Stock
              <button
                onClick={() => {
                  setFilters({ ...filters, inStock: false });
                  handleApplyFilters();
                }}
                className="hover:text-primary"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filters.onSale && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-sage/10 text-forest text-sm rounded-full">
              On Sale
              <button
                onClick={() => {
                  setFilters({ ...filters, onSale: false });
                  handleApplyFilters();
                }}
                className="hover:text-primary"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
