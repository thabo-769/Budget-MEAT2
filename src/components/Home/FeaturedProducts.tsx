import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../../data/products';
import { ProductGrid } from '../Products/ProductGrid';

export const FeaturedProducts = () => {
  const frontPageIds = ['beef-steak', 'chicken-portions', 'pork-chops', 'lamb-chops', 'sausages-wors'];
  const featured = frontPageIds.map((id) => products.find((product) => product.id === id)).filter((product) => product !== undefined);
  return (
    <section className="bg-[#f8faff] py-7 sm:py-8" aria-labelledby="featured-products-title">
      <div className="page-shell">
        <div className="mb-4 flex flex-col items-center justify-between gap-3 text-center sm:mb-5">
          <div>
            <p className="eyebrow mb-2 inline-flex items-center gap-2 text-[#082869]"><span className="h-0.5 w-7 bg-[#ed1c2e]" /> Our products</p>
            <h2 id="featured-products-title" className="section-heading !font-sans !font-black !tracking-[-.035em]">Fresh Cuts, <span className="text-[#ed1c2e]">Great Choices</span></h2>
            <p className="mt-1 text-xs text-[#18365f] sm:text-sm">Explore our wide range of quality meat products.</p>
          </div>
          <Link to="/shop" className="hidden items-center gap-2 pb-1 text-xs font-extrabold uppercase tracking-[.08em] text-[#082869] hover:text-[#ed1c2e] sm:inline-flex">Shop all cuts <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <ProductGrid products={featured} compact />
        <Link to="/shop" className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.08em] text-[#082869] hover:text-[#ed1c2e] sm:hidden">Shop all cuts <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
};
