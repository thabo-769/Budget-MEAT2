import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import { products } from '../../data/products';
import { ProductGrid } from '../Products/ProductGrid';

export const MeatPacks: React.FC = () => {
  const packs = products.filter((p) => p.category === 'packs');

  return (
    <section className="py-14 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-gray-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700 mb-1">
              <Package className="w-4 h-4" /> Bulk Meat Hampers
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Value Meat Packs & Braai Combos
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Curated butcher combos engineered to give you the biggest savings per kilogram.
            </p>
          </div>
          <Link
            to="/shop?category=packs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B2B64] hover:text-[#E51E2A] transition-colors"
          >
            All Meat Packs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={packs} />
      </div>
    </section>
  );
};
