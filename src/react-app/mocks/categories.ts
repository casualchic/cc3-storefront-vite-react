import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'women',
    name: 'Women',
    slug: 'women',
    description: 'Stylish clothing and accessories for women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=600&fit=crop',
    subcategories: [
      { id: 'women-tops', name: 'Tops', slug: 'tops', parentId: 'women', productCount: 24 },
      { id: 'women-dresses', name: 'Dresses', slug: 'dresses', parentId: 'women', productCount: 18 },
      { id: 'women-bottoms', name: 'Bottoms', slug: 'bottoms', parentId: 'women', productCount: 20 },
      { id: 'women-outerwear', name: 'Outerwear', slug: 'outerwear', parentId: 'women', productCount: 15 },
      { id: 'women-accessories', name: 'Accessories', slug: 'accessories', parentId: 'women', productCount: 30 },
    ],
    productCount: 107,
  },
  {
    id: 'men',
    name: 'Men',
    slug: 'men',
    description: 'Contemporary fashion for men',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=600&fit=crop',
    subcategories: [
      { id: 'men-shirts', name: 'Shirts', slug: 'shirts', parentId: 'men', productCount: 22 },
      { id: 'men-pants', name: 'Pants', slug: 'pants', parentId: 'men', productCount: 18 },
      { id: 'men-outerwear', name: 'Outerwear', slug: 'outerwear', parentId: 'men', productCount: 12 },
      { id: 'men-accessories', name: 'Accessories', slug: 'accessories', parentId: 'men', productCount: 25 },
    ],
    productCount: 77,
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Complete your look with our curated accessories',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop',
    subcategories: [
      { id: 'acc-bags', name: 'Bags', slug: 'bags', parentId: 'accessories', productCount: 15 },
      { id: 'acc-jewelry', name: 'Jewelry', slug: 'jewelry', parentId: 'accessories', productCount: 28 },
      { id: 'acc-hats', name: 'Hats', slug: 'hats', parentId: 'accessories', productCount: 12 },
      { id: 'acc-scarves', name: 'Scarves', slug: 'scarves', parentId: 'accessories', productCount: 10 },
    ],
    productCount: 65,
  },
  {
    id: 'sale',
    name: 'Sale',
    slug: 'sale',
    description: 'Shop amazing deals on select items',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&h=600&fit=crop',
    productCount: 42,
  },
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find((cat) => cat.slug === slug);
};

export const getSubcategoryBySlug = (categorySlug: string, subcategorySlug: string) => {
  const category = getCategoryBySlug(categorySlug);
  return category?.subcategories?.find((sub) => sub.slug === subcategorySlug);
};
