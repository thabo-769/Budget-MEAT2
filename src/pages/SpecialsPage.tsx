import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { ProductGrid } from '../components/Products/ProductGrid';
import { formatCurrency } from '../utils/currency';

export const SpecialsPage = () => {
  const saleProducts = products.filter((product) => product.salePrice && product.salePrice < product.price);
  const savings = saleProducts.reduce((total, product) => total + product.price - (product.salePrice || product.price), 0);
  return (
    <div className="min-h-[70vh] bg-[#f6f9ff] pb-14">
      <section className="relative isolate overflow-hidden py-12 text-white sm:py-16">
        <img
          src="/images/weekly_specials_banner.jpg"
          alt="A steak sizzling over the fire"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-right"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#ed1c2e] via-[#ed1c2e] via-35% sm:via-48% to-transparent" />
        <div className="page-shell">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.1em]">
            <Flame className="h-3.5 w-3.5" /> From the specials board
          </span>
          <h1 className="font-display mt-5 max-w-2xl text-5xl leading-[.98] sm:text-6xl text-white">
            Good cuts.<br />
            <span className="text-white/90">Even better value.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/90">
            Take a look at the current offers from our counter. Specials and availability can change, so ask the team to confirm when you place your order.
          </p>
          <div className="mt-5 flex flex-wrap gap-5 text-xs font-semibold text-white/90">
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white/80" /> {saleProducts.length} current offers
            </span>
            <span>Free delivery over $50 · free branch collection</span>
          </div>
          <Link to="/shop" className="btn-secondary mt-7">
            Browse the full shop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <section className="page-shell py-9 sm:py-12"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow mb-2">This week’s value</p><h2 className="section-heading">On the specials board.</h2><p className="mt-2 text-sm text-[#758295]">Save {formatCurrency(savings)} when you choose one of each current offer.</p></div><Link to="/shop?category=packs" className="hidden items-center gap-2 text-xs font-extrabold uppercase tracking-[.07em] text-[#082869] hover:text-[#ed1c2e] sm:inline-flex">See family bundles <ArrowRight className="h-4 w-4" /></Link></div><ProductGrid products={saleProducts} emptyMessage="There are no discounted cuts on the board right now. Check back soon." /></section>
    </div>
  );
};
