import { ProductLayout } from '../components/products/ProductLayout';

interface CategoryPageProps {
  categorySlug?: string;
  subcategorySlug?: string;
}

export const CategoryPage = ({ categorySlug, subcategorySlug }: CategoryPageProps) => {
  return (
    <div className="category-page">
      <ProductLayout category={categorySlug} subcategory={subcategorySlug} />
    </div>
  );
};