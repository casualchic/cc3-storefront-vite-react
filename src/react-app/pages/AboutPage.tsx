export function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">About Casual Chic</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Founded with a passion for timeless style and effortless elegance, Casual Chic has been redefining
            modern fashion since our inception. We believe that great style shouldn't be complicated—it should
            feel natural, comfortable, and uniquely you.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            To provide women with versatile, high-quality pieces that seamlessly transition from day to night,
            work to weekend. Every item in our collection is carefully curated to ensure it meets our standards
            for quality, comfort, and style.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">Our Values</h2>
          <ul className="space-y-4 text-gray-600 dark:text-gray-400">
            <li><strong className="text-gray-900 dark:text-white">Quality First:</strong> We source only the finest materials and partner with skilled artisans.</li>
            <li><strong className="text-gray-900 dark:text-white">Sustainability:</strong> We're committed to ethical production and reducing our environmental impact.</li>
            <li><strong className="text-gray-900 dark:text-white">Timeless Design:</strong> Our pieces are designed to last beyond seasonal trends.</li>
            <li><strong className="text-gray-900 dark:text-white">Customer Care:</strong> Your satisfaction is our priority, from browsing to delivery and beyond.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">Join Our Community</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Follow us on social media to see how our community styles their Casual Chic pieces, get early
            access to new collections, and stay inspired with style tips and behind-the-scenes content.
          </p>
        </div>
      </div>
    </div>
  );
}
