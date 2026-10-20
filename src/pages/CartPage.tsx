import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';

const FREE_DELIVERY_THRESHOLD = 50;

export const CartPage = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const neededForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - cart.subtotal);
  const percentToFree = Math.min(100, (cart.subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  if (!cart.items.length) return (
    <section className="flex min-h-[62vh] flex-col items-center justify-center bg-[#f6f9ff] px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#edf2fb] text-[#082869]"><ShoppingBag className="h-7 w-7" /></div>
      <h1 className="font-display mt-5 text-3xl text-[#082869] sm:text-4xl">Your basket is ready for the good stuff.</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#758295]">Add some fresh cuts or a family bundle and we’ll keep them here for you.</p>
      <Link to="/shop" className="btn-primary mt-6">Explore fresh cuts <ArrowRight className="h-4 w-4" /></Link>
    </section>
  );

  return (
    <div className="min-h-[70vh] bg-[#f6f9ff] pb-16">
      <div className="border-b border-[#e8e9eb] bg-white">
        <div className="page-shell py-8 sm:py-10"><p className="eyebrow mb-2">One step closer to dinner</p><h1 className="font-display text-4xl text-[#082869] sm:text-5xl">Your basket<span className="font-sans text-xl font-bold text-[#8993a0]"> · {cart.itemCount}</span></h1><Link to="/shop" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#506074] hover:text-[#ed1c2e]"><ArrowLeft className="h-3.5 w-3.5" /> Keep shopping</Link></div>
      </div>
      <div className="page-shell grid items-start gap-6 py-7 lg:grid-cols-[1fr_350px] lg:py-9">
        <div className="space-y-4">
          <div className="paper-card p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4 text-xs"><span className="flex items-center gap-2 font-bold text-[#34465c]"><Truck className="h-4 w-4 text-[#082869]" />{neededForFree === 0 ? 'You have free delivery on this basket.' : <>Add <strong className="text-[#ed1c2e]">{formatCurrency(neededForFree)}</strong> for free delivery.</>}</span><span className="shrink-0 font-bold text-[#8993a0]">{percentToFree.toFixed(0)}%</span></div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e8eaed]"><div className="h-full rounded-full bg-[#ed1c2e] transition-all" style={{ width: `${percentToFree}%` }} /></div>
          </div>

          <div className="paper-card divide-y divide-[#eceef0]">
            {cart.items.map((item) => <article key={item.id} className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap sm:gap-5 sm:p-5">
              <Link to={`/product/${item.productId}`} className="h-[74px] w-[74px] shrink-0 overflow-hidden rounded bg-[#edf2fb] sm:h-[90px] sm:w-[90px]"><img src={item.image} alt={item.name} className="h-full w-full object-cover" /></Link>
              <div className="min-w-0 flex-1"><Link to={`/product/${item.productId}`} className="font-extrabold text-[#082869] hover:text-[#ed1c2e]">{item.name}</Link><p className="mt-1 text-xs text-[#8993a0]">{item.selectedVariant?.label || item.unit} · {formatCurrency(item.price)} each</p></div>
              <div className="flex h-9 items-center rounded border border-[#dfe3e8] bg-white">
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`} className="flex h-9 w-9 items-center justify-center text-[#506074] hover:text-[#ed1c2e]"><Minus className="h-3.5 w-3.5" /></button>
                <span aria-live="polite" className="w-7 text-center text-xs font-extrabold text-[#34465c]">{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`} className="flex h-9 w-9 items-center justify-center text-[#506074] hover:text-[#082869]"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              <strong className="ml-auto min-w-[82px] text-right text-sm font-black text-[#082869] sm:ml-0">{formatCurrency(item.price * item.quantity)}</strong>
              <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`} className="flex h-9 w-9 items-center justify-center rounded text-[#9aa3ac] hover:bg-[#fff1f2] hover:text-[#c91525]"><Trash2 className="h-4 w-4" /></button>
            </article>)}
          </div>
          <div className="flex items-center justify-between px-1"><Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-[#082869] hover:text-[#ed1c2e]"><ArrowLeft className="h-3.5 w-3.5" /> Add more to your basket</Link><button type="button" onClick={clearCart} className="text-xs font-semibold text-[#8993a0] hover:text-[#c91525]">Clear basket</button></div>
        </div>

        <aside className="paper-card p-5 sm:p-6 lg:sticky lg:top-36">
          <h2 className="font-display border-b border-[#e8eaed] pb-4 text-2xl text-[#082869]">Order summary</h2>
          <div className="space-y-3 py-4 text-xs text-[#687789]"><div className="flex justify-between"><span>Subtotal · {cart.itemCount} items</span><strong className="text-[#34465c]">{formatCurrency(cart.subtotal)}</strong></div><div className="flex justify-between"><span>Estimated VAT included</span><strong className="text-[#34465c]">{formatCurrency(cart.vat)}</strong></div><div className="flex justify-between"><span>Chilled delivery</span><strong className={cart.deliveryFee === 0 ? 'text-[#318052]' : 'text-[#34465c]'}>{cart.deliveryFee ? formatCurrency(cart.deliveryFee) : 'Free'}</strong></div></div>
          <div className="flex items-baseline justify-between border-t border-[#e8eaed] pt-4"><span className="text-sm font-extrabold text-[#082869]">Total</span><strong className="text-2xl font-black text-[#ed1c2e]">{formatCurrency(cart.total)}</strong></div>
          <p className="mt-1 text-right text-[10px] text-[#8993a0]">USD</p>
          <button type="button" onClick={() => navigate('/checkout')} className="btn-primary mt-5 w-full">Arrange checkout <ArrowRight className="h-4 w-4" /></button>
          <div className="mt-5 space-y-2 border-t border-[#eceef0] pt-4 text-[11px] text-[#687789]"><p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#082869]" /> Carefully packed and kept chilled</p><p className="flex items-center gap-2"><Truck className="h-4 w-4 text-[#082869]" /> Choose delivery or free branch collection</p></div>
        </aside>
      </div>
    </div>
  );
};
