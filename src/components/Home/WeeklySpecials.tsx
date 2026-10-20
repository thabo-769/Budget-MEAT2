import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, Clock } from 'lucide-react';
import { products } from '../../data/products';
import { ProductGrid } from '../Products/ProductGrid';

export const WeeklySpecials: React.FC = () => {
  // Grab products with discounts
  const specials = products
    .filter((p) => p.salePrice && p.salePrice < p.price)
    .slice(0, 4);

  return (
    <section className="py-14 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider bg-red-100 text-[#E51E2A] px-2 py-0.5 rounded">
                <Tag className="w-3.5 h-3.5" /> Limited Stock Deals
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" /> Deals end Sunday midnight
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Weekly Butchery Specials
            </h2>
          </div>
          <Link
            to="/specials"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E51E2A] hover:underline"
          >
            View All Specials <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={specials} />
      </div>
    </section>
  );
};
