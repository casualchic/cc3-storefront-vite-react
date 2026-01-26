import { createFileRoute } from '@tanstack/react-router';
import { SalePage } from '../pages/SalePage';

export const Route = createFileRoute('/sale')({
  component: SalePage,
});
