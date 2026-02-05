import { Link } from '@tanstack/react-router';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { CartDrawer } from '../CartDrawer';
import './Header.css';

export const Header = () => {
  const { getCartItemCount, isDrawerOpen, openDrawer, closeDrawer } = useCart();
  const { theme, toggleTheme } = useTheme();
  const cartCount = getCartItemCount();

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-logo">
            <Link to="/">Casual Chic</Link>
          </div>

          <nav className="header-nav">
            <Link to="/category/$slug" params={{ slug: 'women' }}>Women</Link>
            <Link to="/category/$slug" params={{ slug: 'men' }}>Men</Link>
            <Link to="/category/$slug" params={{ slug: 'accessories' }}>Accessories</Link>
            <Link to="/category/$slug" params={{ slug: 'sale' }}>Sale</Link>
          </nav>

          <div className="header-actions">
            <button
              className="icon-button"
              onClick={toggleTheme}
              aria-label={'Switch to ' + (theme === 'light' ? 'dark' : 'light') + ' mode'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <Link to="/wishlist" className="icon-button" aria-label="Wishlist">
              ❤️
            </Link>

            <button
              onClick={openDrawer}
              className="icon-button cart-button"
              aria-label="Cart"
            >
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
};
