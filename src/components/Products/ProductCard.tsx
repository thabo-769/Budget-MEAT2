import { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';

interface ProductCardProps { product: Product; tone?: 'brand' | 'neutral'; compact?: boolean; }

export const ProductCard = ({ product, compact = false }: ProductCardProps) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const defaultVariant = product.variants?.find((variant) => variant.price === product.price) || product.variants?.[0];
  const currentPrice = product.salePrice ?? defaultVariant?.price ?? product.price;
  const addToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (product.stockStatus === 'out_of_stock') return;
    addItem(product, 1, defaultVariant);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className={`group flex min-w-0 flex-col overflow-hidden rounded-md border border-[#e7e9ec] bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#c8d0d9] hover:shadow-[0_12px_30px_rgba(8,40,105,.1)] ${compact ? 'shadow-[0_6px_18px_rgba(8,40,105,.06)]' : ''}`}>
      <Link to={`/product/${product.id}`} className={`relative block overflow-hidden bg-[#f1f2f3] ${compact ? 'aspect-[1.55/1]' : 'aspect-[1.08/1] sm:aspect-[1.2/1]'}`}>
        <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" onError={(event) => { event.currentTarget.src = '/images/category_beef.jpg'; }} />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.08em] text-[#405168] shadow-sm sm:left-3 sm:top-3 sm:text-[10px]">{product.category === 'packs' ? 'Bundle' : (product.tags?.[0] || product.category)}</span>
        {product.salePrice && <span className="absolute right-2.5 top-2.5 rounded-full bg-[#ed1c2e] px-2.5 py-1 text-[9px] font-black uppercase tracking-[.08em] text-white sm:right-3 sm:top-3">Special</span>}
        <span className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#082869] opacity-0 shadow-md transition group-hover:opacity-100"><ArrowUpRight className="h-4 w-4" /></span>
      </Link>

      <div className={`flex flex-1 flex-col ${compact ? 'p-2.5 sm:p-3' : 'p-3 sm:p-4'}`}>
        <Link to={`/product/${product.id}`} className={compact ? 'min-h-[38px]' : 'min-h-[42px]'}>
          <h3 className={`line-clamp-2 font-extrabold leading-5 text-[#082869] transition-colors group-hover:text-[#ed1c2e] ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>{product.name}</h3>
        </Link>
        {!compact && <p className="mt-1 hidden line-clamp-2 min-h-9 text-xs leading-5 text-[#788494] sm:block">{product.description}</p>}
        <div className="mt-auto flex flex-wrap items-baseline gap-x-1.5 gap-y-1 pt-3">
          <span className="text-base font-black text-[#082869] sm:text-lg">{formatCurrency(currentPrice)}</span>
          {product.salePrice && <span className="text-xs text-[#96a0ab] line-through">{formatCurrency(product.price)}</span>}
          <span className="text-[10px] font-medium text-[#788494]">/{product.unit}</span>
        </div>
        <button type="button" onClick={addToCart} disabled={product.stockStatus === 'out_of_stock'} className={`mt-3 inline-flex min-h-10 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-extrabold transition sm:min-h-10 ${compact ? 'text-[9px] normal-case tracking-normal sm:text-[10px]' : 'text-[10px] uppercase tracking-[.08em] sm:text-[10px]'} ${added ? 'bg-[#e8f4ed] text-[#227247]' : product.stockStatus === 'out_of_stock' ? 'cursor-not-allowed bg-[#eff1f3] text-[#8993a0]' : 'bg-[#ed1c2e] text-white hover:bg-[#c91525]'}`}>
          {added ? <><Check className="h-3.5 w-3.5" /> In your basket</> : product.stockStatus === 'out_of_stock' ? 'Currently unavailable' : <><ShoppingBag className="h-3.5 w-3.5" /> Add to basket</>}
        </button>
      </div>
    </article>
  );
};
