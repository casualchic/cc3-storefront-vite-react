import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sustainability')({
  component: SustainabilityPage,
});

function SustainabilityPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Our Commitment to Sustainability</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            At Casual Chic, we believe fashion should never come at the expense of our planet. We're committed to creating beautiful, sustainable pieces that you can feel good about wearing.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Sustainable Materials</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We use organic, recycled, and responsibly sourced materials in our collections.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Ethical Production</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All our partners maintain fair labor practices and safe working conditions.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Carbon Neutral Shipping</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We offset 100% of our shipping emissions through verified carbon credits.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Circular Fashion</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our take-back program ensures your old pieces are recycled or repurposed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
