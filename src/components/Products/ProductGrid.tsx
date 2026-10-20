import React from 'react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  tone?: 'brand' | 'neutral';
  compact?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  emptyMessage = 'No meat products found matching your selection.',
  tone = 'brand',
  compact = false,
}) => {
  if (products.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-[#dfe3e8] px-4 py-12 text-center">
        <p className="text-sm font-medium text-[#758295]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={compact ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5' : 'grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4'}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} tone={tone} compact={compact} />
      ))}
    </div>
  );
};
