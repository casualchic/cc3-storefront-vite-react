import { Link } from '@tanstack/react-router';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard = ({ product, viewMode = 'grid' }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        inStock: product.inStock,
      });
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className={`product-card product-card-${viewMode}`}>
      <div className="product-image-container">
        <Link to="/products/$id" params={{ id: product.id }}>
          <img src={product.image} alt={product.name} className="product-image" />
        </Link>
        
        {product.isSale && discount > 0 && (
          <span className="product-badge sale-badge">-{discount}%</span>
        )}
        
        {product.isNew && (
          <span className="product-badge new-badge">New</span>
        )}
        
        {!product.inStock && (
          <span className="product-badge out-of-stock-badge">Out of Stock</span>
        )}

        <button
          className={`wishlist-button${inWishlist ? ' active' : ''}`}
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {inWishlist ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="product-info">
        <Link to="/products/$id" params={{ id: product.id }} className="product-name">
          {product.name}
        </Link>

        {viewMode === 'list' && product.description && (
          <p className="product-description">{product.description}</p>
        )}

        <div className="product-price">
          {product.originalPrice && (
            <span className="original-price">${product.originalPrice.toFixed(2)}</span>
          )}
          <span className={`current-price${product.isSale ? ' sale-price' : ''}`}>
            ${product.price.toFixed(2)}
          </span>
        </div>

        {product.rating && (
          <div className="product-rating">
            <span className="rating-stars">{'⭐'.repeat(Math.round(product.rating))}</span>
            <span className="rating-text">
              {product.rating} ({product.reviews || 0})
            </span>
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="product-colors">
            {product.colors.slice(0, 5).map((color) => (
              <span key={color} className="color-dot" title={color} />
            ))}
            {product.colors.length > 5 && (
              <span className="color-more">+{product.colors.length - 5}</span>
            )}
          </div>
        )}

        <button
          className="add-to-cart-button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};