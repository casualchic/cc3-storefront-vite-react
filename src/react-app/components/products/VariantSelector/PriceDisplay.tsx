import './PriceDisplay.css';

interface PriceDisplayProps {
  price?: number;
  originalPrice?: number;
}

export function PriceDisplay({ price, originalPrice }: PriceDisplayProps) {
  if (price === undefined) {
    return (
      <div className="price-display price-placeholder">
        <span className="price-select-text">Select options</span>
      </div>
    );
  }

  const isOnSale = originalPrice && originalPrice > price;
  const ariaLabel = isOnSale
    ? `Sale price: $${price.toFixed(2)}, original price: $${originalPrice.toFixed(2)}`
    : `Price: $${price.toFixed(2)}`;

  return (
    <div className="price-display" aria-label={ariaLabel}>
      <span className="price-current">${price.toFixed(2)}</span>
      {isOnSale && (
        <span className="price-original" aria-hidden="true">
          ${originalPrice.toFixed(2)}
        </span>
      )}
    </div>
  );
}
