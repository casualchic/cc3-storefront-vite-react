import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/terms')({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
        <p className="text-gray-600 dark:text-gray-400">Terms of service coming soon</p>
      </div>
    </div>
  );
}
