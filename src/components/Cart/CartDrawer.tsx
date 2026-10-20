import { useEffect } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';

export default function CartDrawer() {
  const { cart, isOpen, closeCart, removeItem, updateQuantity } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button type="button" aria-label="Close basket" onClick={closeCart} className="absolute inset-0 cursor-default bg-[#061b50]/50 backdrop-blur-[2px]" />
      <aside aria-label="Shopping basket" aria-modal="true" role="dialog" className="relative flex h-full w-full max-w-[440px] animate-fadeIn flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e8eaed] px-5 py-4 sm:px-6">
          <div><p className="eyebrow">Ready when you are</p><h2 className="font-display mt-1 text-2xl text-[#082869]">Your basket <span className="font-sans text-sm font-bold text-[#8993a0]">· {cart.itemCount}</span></h2></div>
          <button type="button" onClick={closeCart} aria-label="Close basket" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e7e9ec] text-[#506074] hover:bg-[#edf2fb]"><X className="h-4 w-4" /></button>
        </div>
        {cart.items.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center px-8 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#edf2fb] text-[#082869]"><ShoppingBag className="h-7 w-7" /></div><h3 className="font-display mt-5 text-2xl text-[#082869]">Nothing in the basket yet.</h3><p className="mt-2 text-sm text-[#758295]">The good cuts are just around the corner.</p><Link to="/shop" onClick={closeCart} className="btn-primary mt-6">Browse the shop <ArrowRight className="h-4 w-4" /></Link></div> : <>
          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5 sm:px-6">
            {cart.items.map((item) => <article key={item.id} className="flex gap-3 rounded-md border border-[#e8eaed] p-3">
              <Link to={`/product/${item.productId}`} onClick={closeCart} className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded bg-[#f1f2f3]"><img src={item.image} alt={item.name} className="h-full w-full object-cover" /></Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link to={`/product/${item.productId}`} onClick={closeCart} className="line-clamp-1 text-sm font-extrabold text-[#082869] hover:text-[#ed1c2e]">{item.name}</Link>
                <p className="mt-1 text-[10px] text-[#8993a0]">{item.selectedVariant?.label || item.unit} · {formatCurrency(item.price)}</p>
                <div className="mt-auto flex items-center gap-1 pt-2">
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`} className="flex h-7 w-7 items-center justify-center rounded border border-[#e6e9ec] text-[#506074] hover:text-[#ed1c2e]"><Minus className="h-3 w-3" /></button>
                  <span className="w-7 text-center text-xs font-bold text-[#34465c]">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`} className="flex h-7 w-7 items-center justify-center rounded border border-[#e6e9ec] text-[#506074] hover:text-[#082869]"><Plus className="h-3 w-3" /></button>
                  <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`} className="ml-auto p-1.5 text-[#9aa3ac] hover:text-[#c91525]"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <strong className="self-start pt-1 text-xs text-[#082869]">{formatCurrency(item.price * item.quantity)}</strong>
            </article>)}
          </div>
          <div className="border-t border-[#e8eaed] px-5 py-5 sm:px-6">
            <div className="mb-2 flex justify-between text-xs text-[#687789]"><span>Subtotal</span><strong className="text-[#34465c]">{formatCurrency(cart.subtotal)}</strong></div>
            <div className="flex justify-between text-xs text-[#687789]"><span>Chilled delivery</span><strong className="text-[#34465c]">{cart.deliveryFee === 0 ? 'Free' : formatCurrency(cart.deliveryFee)}</strong></div>
            {cart.deliveryFee > 0 && <p className="mt-2 text-[10px] text-[#8993a0]">Add {formatCurrency(Math.max(0, 50 - cart.subtotal))} for free delivery.</p>}
            <div className="mt-3 flex justify-between border-t border-[#e8eaed] pt-3 text-sm font-extrabold text-[#082869]"><span>Total · USD</span><strong className="text-lg text-[#ed1c2e]">{formatCurrency(cart.total)}</strong></div>
            <Link to="/checkout" onClick={closeCart} className="btn-primary mt-4 w-full">Arrange checkout <ArrowRight className="h-4 w-4" /></Link>
            <button type="button" onClick={closeCart} className="mt-2 w-full rounded py-2.5 text-xs font-bold text-[#667486] hover:bg-[#edf2fb]">Keep shopping</button>
          </div>
        </>}
      </aside>
    </div>
  );
}
