import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Navigation,
  ClipboardList,
  Route,
  History,
  UserRound,
  CheckCircle2,
  DollarSign,
  MessageCircle,
  Truck,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import BrandLogo from '../components/Shared/BrandLogo';
import { getAllOrders, updateOrderStatus } from '../data/orders';
import { formatCurrency } from '../utils/currency';
import type { Order, OrderStatus } from '../types';

export const DriverDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Map' | 'History' | 'Profile'>('Active');
  const [orders, setOrders] = useState<Order[]>(() => getAllOrders());
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [codReceived, setCodReceived] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleUpdate = () => {
      const live = getAllOrders();
      setOrders(live);
      if (!selectedOrderId && live.length) {
        setSelectedOrderId(live[0].id);
      }
    };
    window.addEventListener('bms_orders_updated', handleUpdate);
    handleUpdate();
    return () => window.removeEventListener('bms_orders_updated', handleUpdate);
  }, []);

  // Filter deliveries
  const activeDeliveries = orders.filter(
    (o) => o.fulfilmentMethod === 'delivery' && (o.status === 'dispatched' || o.status === 'preparing' || o.status === 'pending')
  );
  const completedDeliveries = orders.filter(
    (o) => o.status === 'delivered' || o.status === 'cancelled'
  );

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || activeDeliveries[0] || orders[0];

  const handleAdvanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = 'dispatched';
    if (currentStatus === 'pending' || currentStatus === 'confirmed') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'dispatched';
    else if (currentStatus === 'dispatched') nextStatus = 'delivered';

    updateOrderStatus(orderId, nextStatus, 'Driver Tendai Moyo updated stop status');
    setOrders(getAllOrders());
  };

  const handleConfirmCashCollection = (orderId: string) => {
    setCodReceived((prev) => ({ ...prev, [orderId]: true }));
    alert(`Cash payment received and recorded in driver custody for order ${orderId}!`);
  };

  const driverSidebarLinks = [
    { label: 'Active', name: 'My Deliveries', icon: ClipboardList, badge: activeDeliveries.length },
    { label: 'Map', name: 'Live Route', icon: Route },
    { label: 'History', name: 'Completed Stops', icon: History, count: completedDeliveries.length },
    { label: 'Profile', name: 'Driver & Van Profile', icon: UserRound },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col md:flex-row">
      {/* ─── Desktop Sidebar ───────────────────────────────────────────────── */}
      <aside className="hidden w-60 shrink-0 flex-col justify-between bg-[#0B2B64] text-blue-100 md:flex">
        <div>
          <div className="border-b border-white/10 bg-[#082454] p-5">
            <BrandLogo size="sm" linkToHome={true} tone="light" />
          </div>

          <nav className="p-3 space-y-1 text-xs font-semibold">
            {driverSidebarLinks.map((item) => {
              const active = activeTab === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveTab(item.label as any)}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-left transition-colors flex items-center justify-between gap-3 ${
                    active ? 'bg-[#ed1c2e] text-white font-bold shadow-xs' : 'hover:bg-white/5 hover:text-white text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="rounded-full bg-white text-[#ed1c2e] px-1.5 text-[10px] font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 text-[11px] text-gray-400">
          <p className="font-bold text-white">Driver: Tendai Moyo</p>
          <span>Van: Toyota Quantum #04 (Chilled 2°C)</span>
        </div>
      </aside>

      {/* ─── Mobile Header & Phone Navigation ─────────────────────────────── */}
      <div className="md:hidden bg-[#0B2B64] text-white sticky top-0 z-30 border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <BrandLogo size="sm" linkToHome={true} tone="light" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> On Route
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-1.5 rounded-lg bg-white/10 text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="bg-[#082454] p-3 border-t border-white/10 space-y-1">
            {driverSidebarLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setActiveTab(item.label as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-2 px-3 rounded-lg text-left text-xs font-bold flex items-center justify-between ${
                  activeTab === item.label ? 'bg-[#ed1c2e] text-white' : 'text-gray-200 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge ? <span className="bg-white text-[#ed1c2e] px-1.5 rounded-full text-[10px]">{item.badge}</span> : null}
              </button>
            ))}
          </div>
        )}

        {/* Mobile Fast Tabs Bar */}
        <div className="grid grid-cols-4 px-2 py-1.5 border-t border-white/10 bg-[#082454] text-center text-xs">
          {driverSidebarLinks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveTab(item.label as any)}
              className={`py-1.5 rounded-lg font-bold transition flex flex-col items-center justify-center gap-0.5 ${
                activeTab === item.label ? 'bg-[#ed1c2e] text-white' : 'text-blue-200'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-[10px] leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Main Content Area ──────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Navbar */}
        <header className="hidden md:flex bg-white border-b border-gray-200 px-6 py-3.5 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-[#ed1c2e]" />
            <span className="font-black text-sm text-gray-900">Bulawayo Central Delivery Dispatch</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                T
              </div>
              <div className="text-xs">
                <span className="font-bold text-gray-900 block leading-tight">Tendai Moyo</span>
                <span className="text-[10px] text-gray-400">Driver #04 · Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-xl sm:text-2xl font-black text-gray-900 block leading-tight">{activeDeliveries.length}</span>
              <span className="text-[11px] text-gray-500 font-semibold">Active Stops</span>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-xl sm:text-2xl font-black text-[#0B2B64] block leading-tight">
                {activeDeliveries.filter((o) => o.status === 'dispatched').length}
              </span>
              <span className="text-[11px] text-gray-500 font-semibold">In Transit Now</span>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 block leading-tight">
                {completedDeliveries.length}
              </span>
              <span className="text-[11px] text-gray-500 font-semibold">Delivered Today</span>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-xl sm:text-2xl font-black text-[#ed1c2e] block leading-tight">$45.00</span>
              <span className="text-[11px] text-gray-500 font-semibold">Driver Bonus Earned</span>
            </div>
          </div>

          {/* TAB 1: ACTIVE DELIVERIES & DETAIL */}
          {activeTab === 'Active' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
              {/* Deliveries List */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="font-bold text-sm text-gray-900">Your Route Stops ({activeDeliveries.length})</h3>
                  <span className="text-xs text-gray-500">Tap a stop to inspect</span>
                </div>

                {activeDeliveries.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl text-center text-gray-500 text-sm border border-gray-200">
                    No active delivery stops assigned at the moment. All caught up!
                  </div>
                ) : (
                  activeDeliveries.map((item) => {
                    const isSelected = (currentOrder && currentOrder.id === item.id) || selectedOrderId === item.id;
                    const addressStr = item.deliveryAddress
                      ? `${item.deliveryAddress.street}, ${item.deliveryAddress.suburb}`
                      : 'Bulawayo Delivery';

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedOrderId(item.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white space-y-3 ${
                          isSelected
                            ? 'border-[#0B2B64] ring-2 ring-[#0B2B64]/10 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-red-100 text-[#ed1c2e] flex items-center justify-center shrink-0 mt-0.5">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-sm text-gray-900">{item.orderNumber}</span>
                                <span
                                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                    item.status === 'dispatched'
                                      ? 'bg-blue-100 text-[#0B2B64]'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {item.status === 'dispatched' ? 'In Transit' : 'Preparing at Shop'}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-gray-800 mt-0.5">{addressStr}</p>
                              <p className="text-[11px] text-gray-500">{item.deliveryAddress?.fullName}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-black text-gray-900 block">{formatCurrency(item.total)}</span>
                            <span className="text-[10px] text-gray-500 font-medium">
                              {item.paymentDetails?.status === 'paid' ? 'PAID' : 'COLLECT CASH'}
                            </span>
                          </div>
                        </div>

                        {/* Quick Action Touch Buttons on Phone */}
                        <div className="pt-2 border-t border-gray-100 grid grid-cols-3 gap-2 text-xs">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://maps.google.com?q=${encodeURIComponent(`${addressStr}, Bulawayo`)}`, '_blank');
                            }}
                            className="py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold flex items-center justify-center gap-1.5"
                          >
                            <Navigation className="w-3.5 h-3.5 text-[#0B2B64]" /> Map
                          </button>

                          <a
                            href={`tel:${item.deliveryAddress?.phone || '+263711234567'}`}
                            onClick={(e) => e.stopPropagation()}
                            className="py-2 rounded-xl bg-red-50 hover:bg-red-100 text-[#ed1c2e] font-bold flex items-center justify-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5" /> Call
                          </a>

                          <a
                            href={`https://wa.me/${(item.deliveryAddress?.phone || '263711234567').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(item.deliveryAddress?.fullName || 'Customer')}%2C%20your%20Budget%20Meat%20Shop%20delivery%20is%20on%20the%20way%21`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Order Detail & Action Sidebar */}
              {currentOrder && (
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Active Target Stop
                        </span>
                        <h4 className="font-bold text-base text-gray-900">{currentOrder.orderNumber}</h4>
                      </div>
                      <span className="bg-blue-100 text-[#0B2B64] text-xs font-black px-2.5 py-1 rounded-full uppercase">
                        {currentOrder.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-2 text-gray-700">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Recipient</span>
                        <strong className="text-sm text-gray-900">{currentOrder.deliveryAddress?.fullName}</strong>
                        <p className="text-gray-600">{currentOrder.deliveryAddress?.phone}</p>
                      </div>

                      <div>
                        <span className="text-gray-400 block text-[10px]">Delivery Address</span>
                        <p className="font-semibold text-gray-900">
                          {currentOrder.deliveryAddress?.street}, {currentOrder.deliveryAddress?.suburb}, {currentOrder.deliveryAddress?.city}
                        </p>
                      </div>

                      {/* Meat Cuts Checklist */}
                      <div>
                        <span className="text-gray-400 block text-[10px]">Meat Packs Checklist</span>
                        <div className="space-y-1 mt-1">
                          {currentOrder.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between p-2 rounded-lg bg-gray-50 border border-gray-200">
                              <span><strong>{it.quantity}x</strong> {it.name}</span>
                              <span className="font-mono">{formatCurrency(it.price * it.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Status Check */}
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
                        <div>
                          <strong className="block text-xs">Payment Method</strong>
                          <span className="text-[11px]">{currentOrder.paymentDetails?.methodName || currentOrder.paymentMethod}</span>
                        </div>
                        <div className="text-right">
                          <strong className="text-sm font-black text-gray-900 block">{formatCurrency(currentOrder.total)}</strong>
                          <span className="text-[10px] font-bold uppercase text-amber-800">
                            {currentOrder.paymentDetails?.status === 'paid' ? 'Paid Online' : 'Collect Cash/POS'}
                          </span>
                        </div>
                      </div>

                      {currentOrder.paymentDetails?.status !== 'paid' && !codReceived[currentOrder.id] && (
                        <button
                          type="button"
                          onClick={() => handleConfirmCashCollection(currentOrder.id)}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                        >
                          <DollarSign className="w-4 h-4" /> Record Cash Collected ({formatCurrency(currentOrder.total)})
                        </button>
                      )}

                      {codReceived[currentOrder.id] && (
                        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Cash payment recorded in van safe.
                        </div>
                      )}
                    </div>

                    {/* Status Step Progression Button */}
                    <div className="pt-2 border-t">
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus(currentOrder.id, currentOrder.status)}
                        className="w-full py-3 px-4 bg-[#ed1c2e] hover:bg-[#c91621] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        {currentOrder.status === 'pending' && 'Accept & Begin Prep'}
                        {currentOrder.status === 'preparing' && 'Loaded in Van · Start Transit'}
                        {currentOrder.status === 'dispatched' && 'Customer Received & Signed'}
                        {currentOrder.status === 'delivered' && 'Already Delivered'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ROUTE MAP */}
          {activeTab === 'Map' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Bulawayo Central Delivery Cluster</h3>
                  <p className="text-xs text-gray-500">Optimized route: Central Butchery Hub → Kumalo → Suburbs → North End</p>
                </div>
                <span className="text-xs font-bold text-[#0B2B64] flex items-center gap-1">
                  <Compass className="w-4 h-4" /> Live GPS Active
                </span>
              </div>

              {/* Map SVG Graphic Route */}
              <div className="relative h-64 bg-[#E8EEF5] rounded-xl flex items-center justify-center overflow-hidden border">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Grid lines */}
                  <line x1="0" y1="50" x2="400" y2="50" stroke="#d5e0ee" strokeWidth="1" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#d5e0ee" strokeWidth="1" />
                  <line x1="0" y1="150" x2="400" y2="150" stroke="#d5e0ee" strokeWidth="1" />
                  <line x1="100" y1="0" x2="100" y2="200" stroke="#d5e0ee" strokeWidth="1" />
                  <line x1="200" y1="0" x2="200" y2="200" stroke="#d5e0ee" strokeWidth="1" />
                  <line x1="300" y1="0" x2="300" y2="200" stroke="#d5e0ee" strokeWidth="1" />

                  {/* Route path */}
                  <path
                    d="M 50,150 L 120,90 L 220,130 L 320,60 L 370,80"
                    fill="none"
                    stroke="#0B2B64"
                    strokeWidth="4"
                    strokeDasharray="6 6"
                  />

                  {/* Origin Butchery Pin */}
                  <circle cx="50" cy="150" r="10" fill="#0B2B64" />
                  <text x="50" y="175" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0B2B64">
                    Hub
                  </text>

                  {/* Stop 1 */}
                  <circle cx="120" cy="90" r="8" fill="#3B82F6" />
                  <text x="120" y="80" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3B82F6">
                    Kumalo
                  </text>

                  {/* Stop 2 */}
                  <circle cx="220" cy="130" r="8" fill="#3B82F6" />
                  <text x="220" y="150" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3B82F6">
                    Suburbs
                  </text>

                  {/* Current Destination (Red) */}
                  <circle cx="320" cy="60" r="12" fill="#ed1c2e" />
                  <circle cx="320" cy="60" r="4" fill="white" />
                  <text x="320" y="45" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ed1c2e">
                    Current Stop
                  </text>
                </svg>

                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-[11px] font-bold text-gray-800 px-3 py-1.5 rounded-lg shadow-sm border border-gray-200">
                  Estimated next arrival: 14 mins · 4.2 km
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMPLETED HISTORY */}
          {activeTab === 'History' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4">
              <h3 className="font-bold text-sm text-gray-900">Delivered Orders Log</h3>
              <div className="space-y-2.5">
                {completedDeliveries.map((ord) => (
                  <div key={ord.id} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-900">{ord.orderNumber}</span>
                        <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                          Delivered
                        </span>
                      </div>
                      <p className="text-gray-600 mt-0.5">{ord.deliveryAddress?.street}, {ord.deliveryAddress?.suburb}</p>
                    </div>
                    <div className="text-right">
                      <strong className="text-sm font-black text-gray-900 block">{formatCurrency(ord.total)}</strong>
                      <span className="text-[10px] text-gray-400">Signed by customer</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'Profile' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4 text-xs max-w-lg">
              <h3 className="font-bold text-sm text-gray-900">Driver & Delivery Vehicle Information</h3>
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-gray-50 border">
                  <span className="text-gray-400 block text-[10px]">Assigned Van</span>
                  <strong className="text-sm text-gray-900">Toyota Quantum 2.5D Chilled</strong>
                  <p className="text-gray-600">Reg: ABZ 4910 · Refrigeration temp: +2.1°C</p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border">
                  <span className="text-gray-400 block text-[10px]">Driver License & Health Pass</span>
                  <strong className="text-sm text-gray-900">Class 2 Commercial · Food Handling Certified</strong>
                  <p className="text-gray-600">Expires: Dec 2027</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
