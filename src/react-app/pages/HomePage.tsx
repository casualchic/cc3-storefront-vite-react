import { ProductLayout } from '../components/products/ProductLayout';

export const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Casual Chic Boutique</h1>
        <p>Discover your style with our curated collection</p>
      </section>
      
      <ProductLayout />
    </div>
  );
};