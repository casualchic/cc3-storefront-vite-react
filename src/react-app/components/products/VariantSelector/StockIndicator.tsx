import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import './StockIndicator.css';

interface StockIndicatorProps {
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  quantity?: number;
  message: string;
}

export function StockIndicator({ status, message }: StockIndicatorProps) {
  const Icon =
    status === 'in-stock'
      ? CheckCircle
      : status === 'low-stock'
      ? AlertCircle
      : XCircle;

  return (
    <div
      className={`stock-indicator stock-${status}`}
      role="status"
      aria-live="polite"
    >
      <Icon className="stock-icon" size={16} aria-hidden="true" />
      <span className="stock-message">{message}</span>
    </div>
  );
}
