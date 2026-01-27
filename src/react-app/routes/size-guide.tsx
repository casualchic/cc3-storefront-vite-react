import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/size-guide')({
  component: SizeGuidePage,
});

function SizeGuidePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Size Guide</h1>
        <p className="text-gray-600 dark:text-gray-400">Size guide coming soon</p>
      </div>
    </div>
  );
}
