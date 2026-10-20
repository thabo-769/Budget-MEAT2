import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, MessageCircle, Minus, Plus, ShieldCheck, ShoppingBag, Snowflake } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { ProductGrid } from '../components/Products/ProductGrid';
import { formatCurrency } from '../utils/currency';

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((item) => item.id === id);
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setSelectedVariantId('');
    setAdded(false);
  }, [id]);

  if (!product) return <section className="flex min-h-[60vh] flex-col items-center justify-center bg-[#f6f9ff] px-4 py-16 text-center"><p className="eyebrow">Our counter</p><h1 className="font-display mt-2 text-4xl text-[#082869]">We couldn’t find that cut.</h1><p className="mt-2 text-sm text-[#758295]">It may have moved off the counter. Have a look through the full shop.</p><Link to="/shop" className="btn-primary mt-6"><ArrowLeft className="h-4 w-4" />Back to the shop</Link></section>;

  const defaultVariant = product.variants?.find((variant) => variant.price === product.price) || product.variants?.[0];
  const selectedVariant = product.variants?.find((variant) => variant.id === selectedVariantId) || defaultVariant;
  const unitPrice = selectedVariant?.price ?? product.salePrice ?? product.price;
  const unitLabel = selectedVariant?.label || product.unit;
  const related = products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4);
  const unavailable = product.stockStatus === 'out_of_stock';

  const addToBasket = () => {
    if (unavailable) return;
    addItem(product, quantity, selectedVariant);
    setAdded(true);
    openCart();
  };

  const orderOnWhatsApp = () => {
    const message = encodeURIComponent(`Hello Budget Meat Shop, please confirm availability for ${quantity} × ${product.name}${selectedVariant ? ` (${selectedVariant.label})` : ''}. Estimated total: ${formatCurrency(unitPrice * quantity)}.`);
    window.open(`https://wa.me/263711234567?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#f6f9ff] pb-16">
      <div className="page-shell pt-6 sm:pt-8"><nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#8993a0]"><Link to="/" className="hover:text-[#082869]">Home</Link><ChevronRight className="h-3 w-3" /><Link to="/shop" className="hover:text-[#082869]">Shop</Link><ChevronRight className="h-3 w-3" /><Link to={`/shop?category=${product.category}`} className="capitalize hover:text-[#082869]">{product.category}</Link><ChevronRight className="h-3 w-3" /><span className="font-bold text-[#34465c]">{product.name}</span></nav></div>

      <div className="page-shell grid items-start gap-8 py-6 sm:gap-12 sm:py-9 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-md bg-[#edf2fb]">
          <img src={product.image} alt={product.name} className="aspect-square w-full object-cover sm:aspect-[1.1/1]" />
          {product.salePrice && <span className="absolute left-4 top-4 rounded-full bg-[#ed1c2e] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.08em] text-white">This week’s special</span>}
        </div>

        <div className="py-1 sm:py-3">
          <p className="eyebrow">{product.tags?.[0] || 'From our butcher’s counter'}</p>
          <h1 className="font-display mt-3 text-4xl leading-tight text-[#082869] sm:text-5xl">{product.name}</h1>
          <div className="mt-5 flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-black text-[#ed1c2e]">{formatCurrency(unitPrice)}</span>
            {product.salePrice && <span className="text-sm text-[#8993a0] line-through">{formatCurrency(product.price)}</span>}
            <span className="text-sm text-[#758295]">/ {unitLabel}</span>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#687789]">{product.description}</p>

          {product.variants?.length ? <fieldset className="mt-7"><legend className="mb-3 text-xs font-extrabold uppercase tracking-[.08em] text-[#34465c]">Choose your pack size</legend><div className="flex flex-wrap gap-2">{product.variants.map((variant) => <button key={variant.id} type="button" onClick={() => setSelectedVariantId(variant.id)} aria-pressed={selectedVariant?.id === variant.id} className={`min-h-11 rounded border px-4 text-xs font-bold transition ${selectedVariant?.id === variant.id ? 'border-[#082869] bg-[#082869] text-white' : 'border-[#dfe3e8] bg-white text-[#506074] hover:border-[#082869]'}`}><span>{variant.label}</span><span className={`ml-2 ${selectedVariant?.id === variant.id ? 'text-white/75' : 'text-[#8993a0]'}`}>{formatCurrency(variant.price)}</span></button>)}</div></fieldset> : <p className="mt-7 rounded border border-[#e8eaed] bg-white px-4 py-3 text-xs text-[#687789]">Priced per {product.unit}. Add the number of portions you need.</p>}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <div className="flex h-[52px] items-center justify-between rounded border border-[#dfe3e8] bg-white px-2 sm:w-[132px]">
              <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Decrease quantity" className="flex h-9 w-9 items-center justify-center rounded text-[#506074] hover:bg-[#edf2fb]"><Minus className="h-4 w-4" /></button>
              <span aria-live="polite" className="min-w-6 text-center text-sm font-extrabold text-[#34465c]">{quantity}</span>
              <button type="button" onClick={() => setQuantity((current) => current + 1)} aria-label="Increase quantity" className="flex h-9 w-9 items-center justify-center rounded text-[#506074] hover:bg-[#edf2fb]"><Plus className="h-4 w-4" /></button>
            </div>
            <button type="button" disabled={unavailable} onClick={addToBasket} className={`btn-primary flex-1 ${unavailable ? 'cursor-not-allowed border-[#b9c1c9] bg-[#b9c1c9]' : ''}`}>{added ? <><Check className="h-4 w-4" />Added to your basket</> : unavailable ? 'Currently unavailable' : <><ShoppingBag className="h-4 w-4" />Add to basket · {formatCurrency(unitPrice * quantity)}</>}</button>
          </div>

          <button type="button" onClick={orderOnWhatsApp} className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded border border-[#cfe4d7] bg-[#f1f8f3] px-5 text-xs font-extrabold uppercase tracking-[.07em] text-[#267448] transition hover:bg-[#e7f4ea]"><MessageCircle className="h-4 w-4" />Ask about this cut on WhatsApp</button>

          <div className="mt-7 grid grid-cols-2 gap-3 border-y border-[#e6e8eb] py-4">
            <div className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#082869]" /><span className="text-[11px] leading-4 text-[#687789]">Prepared with care by our local butchers</span></div>
            <div className="flex items-start gap-2"><Snowflake className="mt-0.5 h-4 w-4 shrink-0 text-[#082869]" /><span className="text-[11px] leading-4 text-[#687789]">Packed to stay fresh on the way home</span></div>
          </div>
          <p className="mt-4 text-[10px] text-[#8993a0]">Product code: BMS-{product.id.toUpperCase().slice(0, 7)}</p>
        </div>
      </div>

      <section className="page-shell border-t border-[#e8eaed] pt-10 sm:pt-12">
        <div className="mb-6"><p className="eyebrow mb-2">From the same counter</p><h2 className="section-heading !text-3xl sm:!text-4xl">More {product.category === 'packs' ? 'to share' : product.category === 'other' ? 'fresh favourites' : product.category + ' favourites'}.</h2></div>
        <ProductGrid products={related.length ? related : products.filter((item) => item.id !== product.id).slice(0, 4)} />
      </section>
    </div>
  );
};
