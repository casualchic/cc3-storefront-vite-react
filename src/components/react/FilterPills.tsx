/**
 * FilterPills Component
 * Horizontal filter pills with dropdowns (Shopify-style)
 * Provides clean, inline filtering UI for product listings
 */

import { useState, useRef, useEffect } from 'react';

export interface FilterOptions {
  priceMin?: number;
  priceMax?: number;
  categories?: string[];
  inStock?: boolean;
  onSale?: boolean;
  [key: string]: any; // Allow dynamic filter attributes
}

export interface DynamicFilterOption {
  id: string;
  label: string;
  type: 'multi-select' | 'single-select' | 'color-swatch';
  values: Array<{ id: string; value: string; count: number; colorHex?: string }>;
}

interface FilterPillsProps {
  currentFilters?: FilterOptions;
  availableCategories?: Array<{ id: string; name: string; count: number }>;
  priceRange?: { min: number; max: number };
  dynamicFilters?: DynamicFilterOption[]; // Dynamic filters from product attributes
  onFilterChange?: (filters: FilterOptions) => void;
}

type OpenDropdown = string | null; // Allow any filter name to be opened

export default function FilterPills({
  currentFilters = {},
  availableCategories = [],
  priceRange = { min: 0, max: 500 },
  dynamicFilters = [],
  onFilterChange,
}: FilterPillsProps) {
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const [priceMin, setPriceMin] = useState<string>(currentFilters.priceMin?.toString() || '');
  const [priceMax, setPriceMax] = useState<string>(currentFilters.priceMax?.toString() || '');

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    setFilters(currentFilters);
    setPriceMin(currentFilters.priceMin?.toString() || '');
    setPriceMax(currentFilters.priceMax?.toString() || '');
  }, [currentFilters]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const dropdown = dropdownRefs.current[openDropdown];
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const toggleDropdown = (dropdown: OpenDropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const applyFilters = (newFilters: FilterOptions) => {
    if (onFilterChange) {
      onFilterChange(newFilters);
    } else {
      // Update URL params and reload
      const url = new URL(window.location.href);

      // Remove old filter params (including dynamic ones)
      url.searchParams.delete('priceMin');
      url.searchParams.delete('priceMax');
      url.searchParams.delete('categories');
      url.searchParams.delete('inStock');
      url.searchParams.delete('onSale');
      url.searchParams.delete('page');

      // Remove dynamic filter params
      dynamicFilters.forEach(filter => {
        url.searchParams.delete(filter.id);
      });

      // Add new filter params
      if (newFilters.priceMin) url.searchParams.set('priceMin', newFilters.priceMin.toString());
      if (newFilters.priceMax) url.searchParams.set('priceMax', newFilters.priceMax.toString());
      if (newFilters.categories?.length) url.searchParams.set('categories', newFilters.categories.join(','));
      if (newFilters.inStock) url.searchParams.set('inStock', 'true');
      if (newFilters.onSale) url.searchParams.set('onSale', 'true');

      // Add dynamic filter params
      dynamicFilters.forEach(filter => {
        const filterValue = newFilters[filter.id];
        if (filterValue) {
          if (Array.isArray(filterValue) && filterValue.length > 0) {
            url.searchParams.set(filter.id, filterValue.join(','));
          } else if (typeof filterValue === 'string') {
            url.searchParams.set(filter.id, filterValue);
          }
        }
      });

      window.location.href = url.toString();
    }
  };

  const handleAvailabilityChange = (option: 'all' | 'inStock' | 'onSale') => {
    const newFilters = { ...filters };

    if (option === 'all') {
      newFilters.inStock = false;
      newFilters.onSale = false;
    } else if (option === 'inStock') {
      newFilters.inStock = true;
      newFilters.onSale = false;
    } else {
      newFilters.inStock = false;
      newFilters.onSale = true;
    }

    setFilters(newFilters);
    applyFilters(newFilters);
    setOpenDropdown(null);
  };

  const handlePriceApply = () => {
    const newFilters = {
      ...filters,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
    };

    setFilters(newFilters);
    applyFilters(newFilters);
    setOpenDropdown(null);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const current = filters.categories || [];
    const updated = current.includes(categoryId)
      ? current.filter(id => id !== categoryId)
      : [...current, categoryId];

    const newFilters = { ...filters, categories: updated };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  // Handle dynamic filter changes (color, material, etc.)
  const handleDynamicFilterToggle = (filterId: string, valueId: string, isSingleSelect: boolean) => {
    const current = filters[filterId];
    let updated: string[] | string;

    if (isSingleSelect) {
      // Single select: replace value or clear if clicking same value
      updated = current === valueId ? '' : valueId;
    } else {
      // Multi-select: toggle value in array
      const currentArray = Array.isArray(current) ? current : [];
      updated = currentArray.includes(valueId)
        ? currentArray.filter((id: string) => id !== valueId)
        : [...currentArray, valueId];
    }

    const newFilters = { ...filters, [filterId]: updated };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    setPriceMin('');
    setPriceMax('');
    applyFilters({});
  };

  // Count active filters including dynamic filters
  const activeFilterCount =
    (filters.inStock || filters.onSale ? 1 : 0) +
    (priceMin || priceMax ? 1 : 0) +
    (filters.categories?.length || 0) +
    dynamicFilters.reduce((count, filter) => {
      const filterValue = filters[filter.id];
      if (!filterValue) return count;
      if (Array.isArray(filterValue)) return count + filterValue.length;
      return count + (filterValue ? 1 : 0);
    }, 0);

  // Get availability label
  const getAvailabilityLabel = () => {
    if (filters.inStock) return 'In Stock';
    if (filters.onSale) return 'On Sale';
    return 'Availability';
  };

  // Get price label
  const getPriceLabel = () => {
    if (priceMin && priceMax) return `$${priceMin} - $${priceMax}`;
    if (priceMin) return `$${priceMin}+`;
    if (priceMax) return `Up to $${priceMax}`;
    return 'Price';
  };

  // Get dynamic filter label
  const getDynamicFilterLabel = (filter: DynamicFilterOption) => {
    const filterValue = filters[filter.id];
    if (!filterValue) return filter.label;

    if (Array.isArray(filterValue) && filterValue.length > 0) {
      if (filterValue.length === 1) {
        const selectedValue = filter.values.find(v => v.id === filterValue[0]);
        return selectedValue ? selectedValue.value : filter.label;
      }
      return `${filter.label} (${filterValue.length})`;
    }

    if (typeof filterValue === 'string' && filterValue) {
      const selectedValue = filter.values.find(v => v.id === filterValue);
      return selectedValue ? selectedValue.value : filter.label;
    }

    return filter.label;
  };

  // Check if dynamic filter is active
  const isDynamicFilterActive = (filter: DynamicFilterOption) => {
    const filterValue = filters[filter.id];
    if (Array.isArray(filterValue)) return filterValue.length > 0;
    return !!filterValue;
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Availability Filter */}
      <div className="relative" ref={(el) => { dropdownRefs.current['availability'] = el; }}>
        <button
          onClick={() => toggleDropdown('availability')}
          className={`
            flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors
            ${filters.inStock || filters.onSale
              ? 'border-primary bg-primary/10 text-forest'
              : 'border-neutral bg-white text-charcoal hover:border-sage'
            }
          `}
        >
          <span>{getAvailabilityLabel()}</span>
          <svg
            className={`w-4 h-4 transition-transform ${openDropdown === 'availability' ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {openDropdown === 'availability' && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white border-2 border-neutral rounded-lg shadow-xl z-50 py-2">
            <button
              onClick={() => handleAvailabilityChange('all')}
              className={`
                w-full px-4 py-2 text-left text-sm hover:bg-neutral/30 transition-colors
                ${!filters.inStock && !filters.onSale ? 'bg-primary/10 text-forest font-medium' : 'text-charcoal'}
              `}
            >
              All Products
            </button>
            <button
              onClick={() => handleAvailabilityChange('inStock')}
              className={`
                w-full px-4 py-2 text-left text-sm hover:bg-neutral/30 transition-colors
                ${filters.inStock ? 'bg-primary/10 text-forest font-medium' : 'text-charcoal'}
              `}
            >
              In Stock Only
            </button>
            <button
              onClick={() => handleAvailabilityChange('onSale')}
              className={`
                w-full px-4 py-2 text-left text-sm hover:bg-neutral/30 transition-colors
                ${filters.onSale ? 'bg-primary/10 text-forest font-medium' : 'text-charcoal'}
              `}
            >
              On Sale
            </button>
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="relative" ref={(el) => { dropdownRefs.current['price'] = el; }}>
        <button
          onClick={() => toggleDropdown('price')}
          className={`
            flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors
            ${priceMin || priceMax
              ? 'border-primary bg-primary/10 text-forest'
              : 'border-neutral bg-white text-charcoal hover:border-sage'
            }
          `}
        >
          <span>{getPriceLabel()}</span>
          <svg
            className={`w-4 h-4 transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {openDropdown === 'price' && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-neutral rounded-lg shadow-xl z-50 p-4">
            <div className="mb-4">
              <label className="block text-xs font-medium text-charcoal mb-2">
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
            <button
              onClick={handlePriceApply}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-sage transition-colors font-medium text-sm"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Category Filter */}
      {availableCategories.length > 0 && (
        <div className="relative" ref={(el) => { dropdownRefs.current['category'] = el; }}>
          <button
            onClick={() => toggleDropdown('category')}
            className={`
              flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors
              ${filters.categories && filters.categories.length > 0
                ? 'border-primary bg-primary/10 text-forest'
                : 'border-neutral bg-white text-charcoal hover:border-sage'
              }
            `}
          >
            <span>
              Category
              {filters.categories && filters.categories.length > 0 && (
                <span className="ml-1">({filters.categories.length})</span>
              )}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${openDropdown === 'category' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openDropdown === 'category' && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-neutral rounded-lg shadow-xl z-50 py-2 max-h-80 overflow-y-auto">
              {availableCategories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-neutral/30 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories?.includes(category.id) || false}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 text-primary border-neutral rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-charcoal flex-1">{category.name}</span>
                  <span className="text-xs text-charcoal bg-neutral px-2 py-0.5 rounded">
                    {category.count}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dynamic Filters (Color, Material, etc.) */}
      {dynamicFilters.map((filter) => (
        <div key={filter.id} className="relative" ref={(el) => { dropdownRefs.current[filter.id] = el; }}>
          <button
            onClick={() => toggleDropdown(filter.id)}
            className={`
              flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors
              ${isDynamicFilterActive(filter)
                ? 'border-primary bg-primary/10 text-forest'
                : 'border-neutral bg-white text-charcoal hover:border-sage'
              }
            `}
          >
            <span>{getDynamicFilterLabel(filter)}</span>
            <svg
              className={`w-4 h-4 transition-transform ${openDropdown === filter.id ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openDropdown === filter.id && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-neutral rounded-lg shadow-xl z-50 py-2 max-h-80 overflow-y-auto">
              {filter.type === 'color-swatch' ? (
                // Color swatches with visual representation
                <div className="px-4 py-2">
                  <p className="text-xs font-medium text-charcoal mb-3">Select Color</p>
                  <div className="grid grid-cols-5 gap-2">
                    {filter.values.map((value) => {
                      const isSelected = Array.isArray(filters[filter.id])
                        ? filters[filter.id].includes(value.id)
                        : filters[filter.id] === value.id;

                      return (
                        <button
                          key={value.id}
                          onClick={() => handleDynamicFilterToggle(filter.id, value.id, filter.type === 'single-select')}
                          className={`
                            relative w-10 h-10 rounded-full border-2 transition-all
                            ${isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-neutral hover:border-sage'}
                          `}
                          title={value.value}
                          style={{ backgroundColor: value.colorHex || '#ccc' }}
                        >
                          {isSelected && (
                            <svg className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // Standard checkbox/radio list
                filter.values.map((value) => {
                  const isSelected = Array.isArray(filters[filter.id])
                    ? filters[filter.id].includes(value.id)
                    : filters[filter.id] === value.id;

                  return (
                    <label
                      key={value.id}
                      className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-neutral/30 transition-colors"
                    >
                      <input
                        type={filter.type === 'single-select' ? 'radio' : 'checkbox'}
                        name={filter.id}
                        checked={isSelected}
                        onChange={() => handleDynamicFilterToggle(filter.id, value.id, filter.type === 'single-select')}
                        className="w-4 h-4 text-primary border-neutral rounded focus:ring-primary focus:ring-2"
                      />
                      <span className="text-sm text-charcoal flex-1">{value.value}</span>
                      <span className="text-xs text-charcoal bg-neutral px-2 py-0.5 rounded">
                        {value.count}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          )}
        </div>
      ))}

      {/* Clear All Filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="px-3 py-2 text-sm text-charcoal hover:text-primary transition-colors font-medium"
        >
          Clear all ({activeFilterCount})
        </button>
      )}
    </div>
  );
}
