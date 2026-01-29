import { Product, ViewMode } from '../../types';
import { ProductCard } from './ProductCard';
import './ProductGrid.css';

interface ProductGridProps {
  products: Product[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ProductGrid = ({ products, viewMode, onViewModeChange }: ProductGridProps) => {
  return (
    <div className="product-grid-container">
      <div className="view-toggle">
        <button
          className={`view-button${viewMode === 'grid' ? ' active' : ''}`}
          onClick={() => onViewModeChange('grid')}
          aria-label="Grid view"
          title="Grid view"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="2" y="2" width="7" height="7" />
            <rect x="11" y="2" width="7" height="7" />
            <rect x="2" y="11" width="7" height="7" />
            <rect x="11" y="11" width="7" height="7" />
          </svg>
        </button>
        <button
          className={`view-button${viewMode === 'list' ? ' active' : ''}`}
          onClick={() => onViewModeChange('list')}
          aria-label="List view"
          title="List view"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="2" y="3" width="16" height="2" />
            <rect x="2" y="9" width="16" height="2" />
            <rect x="2" y="15" width="16" height="2" />
          </svg>
        </button>
      </div>

      <div className={`product-grid product-grid-${viewMode}`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} viewMode={viewMode} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="no-products">
          <p>No products found matching your filters.</p>
          <p className="no-products-hint">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};