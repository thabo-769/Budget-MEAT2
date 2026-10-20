import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, LogOut, MapPin, PackageCheck, ShoppingBag, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCustomerOrders } from '../data/orders';
import { branches } from '../data/branches';
import { formatCurrency } from '../utils/currency';
import type { Order, OrderItem } from '../types';

const statusLabel: Record<string, string> = { pending: 'Awaiting confirmation', confirmed: 'Confirmed', preparing: 'Being prepared', ready_collection: 'Ready to collect', dispatched: 'On the way', delivered: 'Delivered', cancelled: 'Cancelled' };

export const AccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(() => {
    const all = getCustomerOrders();
    return user?.id ? all.filter((order) => order.customerId === user.id || !order.customerId) : all;
  });
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      const all = getCustomerOrders();
      setOrders(user?.id ? all.filter((order) => order.customerId === user.id || !order.customerId) : all);
    };
    window.addEventListener('bms_orders_updated', handleUpdate);
    return () => window.removeEventListener('bms_orders_updated', handleUpdate);
  }, [user]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-[70vh] bg-[#f6f9ff] pb-16">
      <section className="bg-[#082869] py-8 text-white sm:py-14">
        <div className="page-shell flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow !text-[#ed1c2e]">Your butcher account</p>
            <h1 className="font-display mt-1 text-3xl sm:text-5xl">Hello, {user?.firstName || 'there'}.</h1>
            <p className="mt-1 text-xs sm:text-sm text-white/70">Your meat orders, payment receipts and delivery status.</p>
          </div>
          {user ? (
            <button type="button" onClick={handleLogout} className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-white/30 px-4 text-xs font-bold text-white hover:bg-white/10">
              <LogOut className="h-4 w-4" />Sign out
            </button>
          ) : (
            <Link to="/login" className="btn-primary w-fit text-xs py-2 px-5">
              Sign in <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      <div className="page-shell grid items-start gap-6 py-6 lg:grid-cols-[280px_1fr] lg:py-10">
        <aside className="paper-card p-5 sm:p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf2fb] text-[#082869]">
            <UserRound className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-display text-2xl text-[#082869]">Your details</h2>
          {user ? (
            <div className="mt-4 space-y-3 border-t border-[#e8eaed] pt-4 text-xs">
              <div><span className="block text-[#8993a0]">Name</span><strong className="mt-1 block text-[#34465c]">{user.firstName} {user.lastName}</strong></div>
              <div><span className="block text-[#8993a0]">Email</span><strong className="mt-1 block break-all text-[#34465c]">{user.email}</strong></div>
              {user.phone && <div><span className="block text-[#8993a0]">Mobile</span><strong className="mt-1 block text-[#34465c]">{user.phone}</strong></div>}
            </div>
          ) : (
            <div className="mt-4 border-t border-[#e8eaed] pt-4">
              <p className="text-xs leading-5 text-[#758295]">Sign in to keep your account details ready for the next order.</p>
              <Link to="/login" className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#ed1c2e]">
                Sign in or join <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
          <Link to="/branches" className="mt-5 flex items-center gap-2 border-t border-[#e8eaed] pt-4 text-xs font-bold text-[#506074] hover:text-[#ed1c2e]">
            <MapPin className="h-4 w-4 text-[#082869]" />Find your nearest branch
          </Link>
        </aside>

        <section className="paper-card overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-[#e8eaed] p-4 sm:p-6">
            <div>
              <p className="eyebrow mb-1">Your history</p>
              <h2 className="font-display text-2xl text-[#082869]">Recent orders ({orders.length})</h2>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[.06em] text-[#ed1c2e]">
              Order again <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {orders.length ? (
            <div className="divide-y divide-[#eceef0]">
              {orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                const branch = branches.find((item) => item.id === order.branchId);
                return (
                  <article key={order.id} className="p-4 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <strong className="font-mono text-sm text-[#082869]">{order.orderNumber}</strong>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            order.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'preparing' ? 'bg-amber-100 text-amber-800' : 'bg-[#edf2fb] text-[#506074]'
                          }`}>
                            {statusLabel[order.status] || order.status}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#8993a0]">
                          {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} · {order.fulfilmentMethod === 'delivery' ? 'Delivery' : 'Collection'} · Payment: {order.paymentDetails?.methodName || order.paymentMethod}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <strong className="text-base font-black text-[#ed1c2e]">{formatCurrency(order.total)}</strong>
                        <button
                          type="button"
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          aria-expanded={isExpanded}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6e9ec] text-[#506074] hover:border-[#082869] hover:text-[#082869]"
                          aria-label={`${isExpanded ? 'Hide' : 'View'} ${order.orderNumber} details`}
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 rounded-xl bg-[#f6f9ff] p-4 text-xs">
                        <div className="space-y-2">
                          {order.items.map((item: OrderItem, index: number) => (
                            <div key={`${item.productId}-${index}`} className="flex justify-between gap-3">
                              <span className="text-[#506074]">
                                {item.quantity} × {item.name}
                                {item.selectedVariant ? ` · ${item.selectedVariant.label}` : ''}
                              </span>
                              <strong className="text-[#34465c]">{formatCurrency(item.price * item.quantity)}</strong>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 border-t border-[#e5e7e9] pt-3 text-[#687789] space-y-1">
                          <div>
                            <strong>Destination: </strong>
                            {order.fulfilmentMethod === 'delivery'
                              ? `${order.deliveryAddress?.street}, ${order.deliveryAddress?.suburb}, ${order.deliveryAddress?.city}`
                              : `Collect from ${branch?.name || 'selected branch'}`}
                          </div>
                          <div>
                            <strong>Payment: </strong>
                            {order.paymentDetails?.methodName} (
                            <span className={order.paymentDetails?.status === 'paid' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                              {order.paymentDetails?.status === 'paid' ? 'Verified Paid' : 'Pay on Delivery'}
                            </span>)
                          </div>
                          {order.notes && <div><strong>Butcher note: </strong>{order.notes}</div>}
                          {order.driverName && <div><strong>Assigned van driver: </strong>{order.driverName}</div>}
                        </div>

                        <p className="mt-3 flex items-center gap-2 text-[10px] text-[#8993a0]">
                          <PackageCheck className="h-3.5 w-3.5 text-emerald-600" />
                          Order synchronized live with Budget Meat Shop Hub.
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf2fb] text-[#082869]">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-4 text-2xl text-[#082869]">No orders just yet.</h3>
              <p className="mt-2 text-sm text-[#758295]">When you place an order, it’ll show up here.</p>
              <Link to="/shop" className="btn-primary mt-5">Explore the shop <ArrowRight className="h-4 w-4" /></Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
