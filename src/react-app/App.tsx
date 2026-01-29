import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { RootLayout } from './components/layout/RootLayout';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import './App.css';

function App() {
  // Simple client-side routing simulation
  // In production, this would use TanStack Router
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Listen for popstate events (browser back/forward)
  useState(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  });

  // Simple route matching
  const renderPage = () => {
    const pathParts = currentPath.split('/').filter(Boolean);

    if (pathParts[0] === 'category' && pathParts[1]) {
      const categorySlug = pathParts[1];
      const subcategorySlug = pathParts[2];
      return <CategoryPage categorySlug={categorySlug} subcategorySlug={subcategorySlug} />;
    }

    // Default to home page
    return <HomePage />;
  };

  return (
    <ThemeProvider>
      <WishlistProvider>
        <CartProvider>
          <RootLayout>{renderPage()}</RootLayout>
        </CartProvider>
      </WishlistProvider>
    </ThemeProvider>
  );
}

export default App;