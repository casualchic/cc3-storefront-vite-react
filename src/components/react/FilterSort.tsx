/**
 * FilterSort Component
 * Client-side filter and sort controls for product listings
 */

import { useState, useEffect } from 'react';

interface FilterSortProps {
  currentSort?: string;
  onSortChange?: (sort: string) => void;
}

export default function FilterSort({ currentSort = 'newest', onSortChange }: FilterSortProps) {
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
      {/* Filters placeholder - can be expanded later */}
      <div className="flex items-center gap-4">
        {/* Add filter buttons/dropdowns here in future */}
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-gray-700 font-medium">
          Sort by:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={handleSortChange}
          className="text-sm border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
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
