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
            <a href="/">Casual Chic</a>
          </div>

          <nav className="header-nav">
            <a href="/category/women">Women</a>
            <a href="/category/men">Men</a>
            <a href="/category/accessories">Accessories</a>
            <a href="/category/sale">Sale</a>
          </nav>

          <div className="header-actions">
            <button
              className="icon-button"
              onClick={toggleTheme}
              aria-label={'Switch to ' + (theme === 'light' ? 'dark' : 'light') + ' mode'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <a href="/wishlist" className="icon-button" aria-label="Wishlist">
              ❤️
            </a>

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
