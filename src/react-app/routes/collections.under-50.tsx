import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/collections/under-50')({
  component: Under50Page,
});

function Under50Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Under $50</h1>
        <p className="text-gray-600 dark:text-gray-400">Under $50 collection coming soon</p>
      </div>
    </div>
  );
}
