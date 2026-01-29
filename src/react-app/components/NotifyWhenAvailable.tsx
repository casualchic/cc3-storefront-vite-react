import { useState } from 'react';
import { Bell, Check, X } from 'lucide-react';

interface NotifyWhenAvailableProps {
  productId: string;
  productName: string;
  selectedSize?: string;
  selectedColor?: string;
}

export function NotifyWhenAvailable({
  productId,
  productName,
  selectedSize,
  selectedColor,
}: NotifyWhenAvailableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call - in production, this would send to backend
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In production: await notifyMeAPI({ productId, email, size: selectedSize, color: selectedColor });

      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setEmail('');
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors font-medium"
      >
        <Bell className="w-5 h-5" />
        Notify Me When Available
      </button>
    );
  }

  return (
    <div className="border-2 border-gray-900 dark:border-white rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            Get notified when back in stock
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We'll send you an email when {productName} is available
            {selectedSize && ` in size ${selectedSize}`}
            {selectedColor && ` in ${selectedColor}`}.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          aria-label="Close notification form"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {isSuccess ? (
        <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
          <Check className="w-5 h-5" />
          <span className="font-medium">You're on the list! We'll notify you soon.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="notify-email" className="sr-only">
              Email address
            </label>
            <input
              id="notify-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"
              disabled={isSubmitting}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Subscribing...' : 'Notify Me'}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            By subscribing, you agree to receive email notifications. You can unsubscribe at any time.
          </p>
        </form>
      )}
    </div>
  );
}
