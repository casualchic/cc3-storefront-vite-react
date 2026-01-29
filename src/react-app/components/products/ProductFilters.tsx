import { useState } from 'react';
import { categories } from '../../mocks/categories';
import './ProductFilters.css';

interface ProductFiltersProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedSizes?: string[];
  selectedColors?: string[];
  priceRange?: [number, number];
  inStockOnly?: boolean;
  onSale?: boolean;
  onFilterChange: (filters: {
    category?: string;
    subcategory?: string;
    sizes?: string[];
    colors?: string[];
    priceRange?: [number, number];
    inStockOnly?: boolean;
    onSale?: boolean;
  }) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const AVAILABLE_COLORS = ['Black', 'White', 'Navy', 'Grey', 'Beige', 'Brown', 'Pink', 'Blue'];
const PRICE_RANGES: [number, number][] = [
  [0, 50],
  [50, 100],
  [100, 200],
  [200, 500],
];

export const ProductFilters = ({
  selectedCategory,
  selectedSubcategory,
  selectedSizes = [],
  selectedColors = [],
  priceRange,
  inStockOnly = false,
  onSale = false,
  onFilterChange,
  isOpen = true,
  onClose,
}: ProductFiltersProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['categories', 'price'])
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handleCategoryClick = (categorySlug: string) => {
    onFilterChange({
      category: categorySlug === selectedCategory ? undefined : categorySlug,
      subcategory: undefined,
      sizes: selectedSizes,
      colors: selectedColors,
      priceRange,
      inStockOnly,
      onSale,
    });
  };

  const handleSubcategoryClick = (subcategorySlug: string) => {
    onFilterChange({
      category: selectedCategory,
      subcategory: subcategorySlug === selectedSubcategory ? undefined : subcategorySlug,
      sizes: selectedSizes,
      colors: selectedColors,
      priceRange,
      inStockOnly,
      onSale,
    });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    onFilterChange({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      sizes: newSizes,
      colors: selectedColors,
      priceRange,
      inStockOnly,
      onSale,
    });
  };

  const handleColorToggle = (color: string) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    onFilterChange({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      sizes: selectedSizes,
      colors: newColors,
      priceRange,
      inStockOnly,
      onSale,
    });
  };

  const handlePriceRangeClick = (range: [number, number]) => {
    const isSameRange = priceRange && priceRange[0] === range[0] && priceRange[1] === range[1];
    onFilterChange({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      sizes: selectedSizes,
      colors: selectedColors,
      priceRange: isSameRange ? undefined : range,
      inStockOnly,
      onSale,
    });
  };

  const handleInStockToggle = () => {
    onFilterChange({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      sizes: selectedSizes,
      colors: selectedColors,
      priceRange,
      inStockOnly: !inStockOnly,
      onSale,
    });
  };

  const handleOnSaleToggle = () => {
    onFilterChange({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      sizes: selectedSizes,
      colors: selectedColors,
      priceRange,
      inStockOnly,
      onSale: !onSale,
    });
  };


  return (
    <div className={`product-filters${isOpen ? ' open' : ''}`}>
      <div className="filters-header">
        <h2>Filters</h2>
        {onClose && (
          <button className="close-button" onClick={onClose} aria-label="Close filters">
            ✕
          </button>
        )}
      </div>

      <div className="filters-content">
        <div className="filter-section">
          <button
            className="filter-section-header"
            onClick={() => toggleSection('categories')}
          >
            <span>Categories</span>
            <span>{expandedSections.has('categories') ? '−' : '+'}</span>
          </button>
          {expandedSections.has('categories') && (
            <div className="filter-section-content">
              {categories.map((category) => (
                <div key={category.id}>
                  <button
                    className={`filter-option${
                      selectedCategory === category.slug ? ' active' : ''
                    }`}
                    onClick={() => handleCategoryClick(category.slug)}
                  >
                    <span>{category.name}</span>
                    <span className="count">({category.productCount})</span>
                  </button>

                  {selectedCategory === category.slug &&
                    category.subcategories &&
                    category.subcategories.length > 0 && (
                      <div className="subcategory-list">
                        {category.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            className={`filter-option subcategory${
                              selectedSubcategory === sub.slug ? ' active' : ''
                            }`}
                            onClick={() => handleSubcategoryClick(sub.slug)}
                          >
                            <span>{sub.name}</span>
                            <span className="count">({sub.productCount})</span>
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="filter-section">
          <button className="filter-section-header" onClick={() => toggleSection('price')}>
            <span>Price</span>
            <span>{expandedSections.has('price') ? '−' : '+'}</span>
          </button>
          {expandedSections.has('price') && (
            <div className="filter-section-content">
              {PRICE_RANGES.map((range) => {
                const isActive =
                  priceRange && priceRange[0] === range[0] && priceRange[1] === range[1];
                return (
                  <button
                    key={`${range[0]}-${range[1]}`}
                    className={`filter-option${isActive ? ' active' : ''}`}
                    onClick={() => handlePriceRangeClick(range)}
                  >
                    ${range[0]} - ${range[1]}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="filter-section">
          <button className="filter-section-header" onClick={() => toggleSection('sizes')}>
            <span>Sizes</span>
            <span>{expandedSections.has('sizes') ? '−' : '+'}</span>
          </button>
          {expandedSections.has('sizes') && (
            <div className="filter-section-content">
              <div className="filter-chips">
                {AVAILABLE_SIZES.map((size) => (
                  <button
                    key={size}
                    className={`filter-chip${selectedSizes.includes(size) ? ' active' : ''}`}
                    onClick={() => handleSizeToggle(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="filter-section">
          <button className="filter-section-header" onClick={() => toggleSection('colors')}>
            <span>Colors</span>
            <span>{expandedSections.has('colors') ? '−' : '+'}</span>
          </button>
          {expandedSections.has('colors') && (
            <div className="filter-section-content">
              <div className="filter-chips">
                {AVAILABLE_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`filter-chip${selectedColors.includes(color) ? ' active' : ''}`}
                    onClick={() => handleColorToggle(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="filter-section">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={handleInStockToggle}
            />
            <span>In Stock Only</span>
          </label>
        </div>

        <div className="filter-section">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={onSale}
              onChange={handleOnSaleToggle}
            />
            <span>On Sale</span>
          </label>
        </div>
      </div>
    </div>
  );
};