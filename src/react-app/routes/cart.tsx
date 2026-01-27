import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cart')({
  component: CartPage,
});

function CartPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Shopping Cart</h1>
        <p className="text-gray-600 dark:text-gray-400">Cart page coming soon</p>
      </div>
    </div>
  );
}
