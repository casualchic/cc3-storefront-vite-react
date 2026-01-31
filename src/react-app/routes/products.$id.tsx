import { createFileRoute } from '@tanstack/react-router';
import { products } from '../mocks/products';

export const Route = createFileRoute('/products/$id')({
  head: ({ params }) => {
    const product = products.find(p => p.id === params.id);
    if (!product) return {};

    return {
      meta: [
        { title: `${product.name} | Casual Chic Boutique` },
        { name: 'description', content: product.description || `Shop ${product.name} at Casual Chic Boutique. Premium quality, free shipping on orders over $75.` },
        { property: 'og:title', content: `${product.name} | Casual Chic Boutique` },
        { property: 'og:description', content: product.description || `Shop ${product.name}` },
        { property: 'og:image', content: product.image },
        { property: 'og:type', content: 'product' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `${product.name} | Casual Chic Boutique` },
        { name: 'twitter:description', content: product.description || `Shop ${product.name}` },
        { name: 'twitter:image', content: product.image },
      ],
    };
  },
});
