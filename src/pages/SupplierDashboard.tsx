import React, { useState } from 'react';
import {
  FileText,
  Truck,
  CreditCard,
  Search,
  LayoutDashboard,
  Package,
  MessageCircle,
  ClipboardList,
  Menu,
  X,
  ThermometerSnowflake,
} from 'lucide-react';
import BrandLogo from '../components/Shared/BrandLogo';
import { formatCurrency } from '../utils/currency';

interface SupplierPO {
  poNumber: string;
  item: string;
  quantity: string;
  date: string;
  status: 'Pending' | 'Accepted' | 'Preparing' | 'Dispatched' | 'Received';
  total: number;
}

interface SupplierProduct {
  id: string;
  name: string;
  category: string;
  availableKg: number;
  wholesalePriceKg: number;
  inStock: boolean;
}

export const SupplierDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Purchase Orders state
  const [purchaseOrders, setPurchaseOrders] = useState<SupplierPO[]>([
    { poNumber: 'PO-2026-08', item: 'A-Grade Beef Quarters', quantity: '500 kg', date: '2026-10-15', status: 'Accepted', total: 2450.0 },
    { poNumber: 'PO-2026-09', item: 'Fresh Broiler Whole Birds', quantity: '350 birds', date: '2026-10-14', status: 'Preparing', total: 1180.0 },
    { poNumber: 'PO-2026-10', item: 'Lean Pork Carcasses', quantity: '200 kg', date: '2026-10-12', status: 'Dispatched', total: 860.0 },
    { poNumber: 'PO-2026-11', item: 'Prime Ox Liver & Offal', quantity: '150 kg', date: '2026-10-10', status: 'Received', total: 620.0 },
  ]);

  // Supplier catalog state
  const [products, setProducts] = useState<SupplierProduct[]>([
    { id: 'sp-1', name: 'A-Grade Beef Quarters (Cold Hanging)', category: 'Beef', availableKg: 1200, wholesalePriceKg: 4.90, inStock: true },
    { id: 'sp-2', name: 'Whole Broiler Chickens (1.3kg avg)', category: 'Poultry', availableKg: 850, wholesalePriceKg: 3.20, inStock: true },
    { id: 'sp-3', name: 'Farm Pork Bellies & Loins', category: 'Pork', availableKg: 400, wholesalePriceKg: 4.30, inStock: true },
    { id: 'sp-4', name: 'Grain-Fed Lamb Sides', category: 'Lamb', availableKg: 180, wholesalePriceKg: 6.80, inStock: false },
  ]);

  // Quotation requests from restaurants/wholesale
  const [quotes] = useState([
    { id: 'QT-991', client: 'Bulawayo Club Hotel', request: '300kg Beef Ribs & Fillet', requestedDate: 'Oct 20, 2026', status: 'Pending Review', offer: '$1,350' },
    { id: 'QT-992', client: 'Horizon Bar & Braai Lounge', request: '500kg Mixed Braai Wors', requestedDate: 'Oct 18, 2026', status: 'Quote Submitted', offer: '$2,100' },
  ]);

  const updatePOStatus = (poNumber: string, newStatus: SupplierPO['status']) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.poNumber === poNumber ? { ...po, status: newStatus } : po))
    );
  };

  const toggleProductStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const updateProductPrice = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, wholesalePriceKg: Math.max(1, Number((p.wholesalePriceKg + delta).toFixed(2))) } : p))
    );
  };

  const supplierLinks = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Purchase Orders', icon: ClipboardList, count: purchaseOrders.filter((p) => p.status === 'Preparing' || p.status === 'Accepted').length },
    { label: 'My Products', icon: Package },
    { label: 'Quotations', icon: MessageCircle, count: 1 },
    { label: 'Deliveries', icon: Truck },
    { label: 'Invoices', icon: FileText },
    { label: 'Payment Records', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col md:flex-row">
      {/* ─── Desktop Sidebar ──────────────────────────────────────────────── */}
      <aside className="hidden w-60 shrink-0 flex-col justify-between bg-[#0B2B64] text-blue-100 md:flex">
        <div>
          <div className="border-b border-white/10 bg-[#082454] p-5">
            <BrandLogo size="sm" linkToHome={true} tone="light" />
          </div>

          <nav className="p-3 space-y-1 text-xs font-semibold">
            {supplierLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveTab(item.label)}
                className={`w-full rounded-xl px-3.5 py-2.5 text-left transition-colors flex items-center justify-between gap-3 ${
                  activeTab === item.label
                    ? 'bg-[#ed1c2e] text-white font-bold shadow-xs'
                    : 'hover:bg-white/5 hover:text-white text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="rounded-full bg-white text-[#ed1c2e] px-1.5 text-[10px] font-black">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 text-[11px] text-gray-400">
          <p className="font-bold text-white">Matopos Cattle Ranchers</p>
          <span>Accredited Supplier #SUP-4491</span>
        </div>
      </aside>

      {/* ─── Mobile Header & Responsive Mobile Navigation ─────────────────── */}
      <div className="md:hidden bg-[#0B2B64] text-white sticky top-0 z-30 border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <BrandLogo size="sm" linkToHome={true} tone="light" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg bg-white/10 text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Fast Tabs */}
        <div className="overflow-x-auto no-scrollbar flex items-center gap-1 px-3 py-2 border-t border-white/10 bg-[#082454]">
          {supplierLinks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveTab(item.label)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === item.label ? 'bg-[#ed1c2e] text-white' : 'text-blue-200 hover:bg-white/10'
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
              {item.count ? <span className="bg-white text-[#ed1c2e] px-1 rounded-full text-[9px]">{item.count}</span> : null}
            </button>
          ))}
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="bg-[#0B2B64] border-t border-white/10 p-3 space-y-1">
            {supplierLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setActiveTab(item.label);
                  setMobileMenuOpen(false);
                }}
                className={`w-full rounded-lg px-3 py-2 text-left text-xs font-bold flex items-center justify-between ${
                  activeTab === item.label ? 'bg-[#ed1c2e] text-white' : 'text-gray-200 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.count && <span className="bg-white text-[#ed1c2e] px-1.5 rounded-full text-[10px]">{item.count}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Main Content ───────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Navbar */}
        <header className="hidden md:flex bg-white border-b border-gray-200 px-6 py-3.5 items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search purchase orders, batch numbers, cuts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-9 pr-4 py-1.5 text-xs text-gray-800 outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#0B2B64] text-white flex items-center justify-center font-bold text-xs">
                S
              </div>
              <div className="text-xs">
                <span className="font-bold text-gray-900 block leading-tight">Matopos Cattle Ranch</span>
                <span className="text-[10px] text-gray-400">Bulawayo Abattoir Partner</span>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content Body */}
        <main className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{activeTab}</h1>
              <p className="text-xs text-gray-500">Live wholesale slaughterhouse & farm dispatch control</p>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200 flex items-center gap-1.5">
              <ThermometerSnowflake className="h-3.5 w-3.5" /> Cold Chain Verified (-18°C / +2°C)
            </span>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              {/* 4 Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
                  <span className="text-xs text-gray-500 block mb-1">Active POs</span>
                  <span className="text-2xl font-black text-gray-900 block leading-tight">{purchaseOrders.length}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">+2 Ready for dispatch</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
                  <span className="text-xs text-gray-500 block mb-1">Deliveries This Week</span>
                  <span className="text-2xl font-black text-[#0B2B64] block leading-tight">8 loads</span>
                  <span className="text-[10px] text-emerald-600 font-bold">100% accepted</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
                  <span className="text-xs text-gray-500 block mb-1">Total Supplies Value</span>
                  <span className="text-2xl font-black text-gray-900 block leading-tight">$5,110.00</span>
                  <span className="text-[10px] text-gray-400">All batches audited</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
                  <span className="text-xs text-gray-500 block mb-1">Payment Status</span>
                  <span className="text-2xl font-black text-emerald-600 block leading-tight">Settled</span>
                  <span className="text-[10px] text-gray-400">Direct CABS USD Transfer</span>
                </div>
              </div>

              {/* Recent POs Feed */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="font-bold text-sm text-gray-900">Incoming Butcher Purchase Orders</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('Purchase Orders')}
                    className="text-xs font-bold text-[#ed1c2e] hover:underline"
                  >
                    View All ({purchaseOrders.length})
                  </button>
                </div>

                <div className="space-y-2.5">
                  {purchaseOrders.map((po) => (
                    <div
                      key={po.poNumber}
                      className="p-3.5 rounded-xl border border-gray-200/70 hover:border-gray-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="font-mono text-xs text-[#0B2B64]">{po.poNumber}</strong>
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              po.status === 'Received'
                                ? 'bg-emerald-100 text-emerald-800'
                                : po.status === 'Dispatched'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {po.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-gray-900 mt-1">
                          {po.item} · <span className="text-gray-500 font-normal">{po.quantity}</span>
                        </p>
                        <span className="text-[11px] text-gray-400">Ordered {po.date}</span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-none border-gray-100">
                        <strong className="text-sm font-black text-gray-900">{formatCurrency(po.total)}</strong>
                        {po.status === 'Accepted' && (
                          <button
                            type="button"
                            onClick={() => updatePOStatus(po.poNumber, 'Dispatched')}
                            className="px-3 py-1.5 rounded-xl bg-[#0B2B64] text-white text-xs font-bold hover:bg-[#071f4b]"
                          >
                            Dispatch Batch
                          </button>
                        )}
                        {po.status === 'Preparing' && (
                          <button
                            type="button"
                            onClick={() => updatePOStatus(po.poNumber, 'Accepted')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                          >
                            Mark Ready
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PURCHASE ORDERS */}
          {activeTab === 'Purchase Orders' && (
            <div className="space-y-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-gray-900">All Purchase Orders</h3>
                <div className="space-y-3">
                  {purchaseOrders.map((po) => (
                    <div key={po.poNumber} className="p-4 rounded-xl border border-gray-200 bg-gray-50/40 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#0B2B64]">{po.poNumber}</span>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            {po.status}
                          </span>
                        </div>
                        <span className="text-base font-black text-gray-900">{formatCurrency(po.total)}</span>
                      </div>

                      <div className="text-xs text-gray-700">
                        <p><strong>Item:</strong> {po.item}</p>
                        <p><strong>Quantity:</strong> {po.quantity}</p>
                        <p><strong>Delivery Destination:</strong> Budget Meat Shop Central Butchery Cold Store, Bulawayo</p>
                      </div>

                      <div className="pt-2 border-t border-gray-200 flex flex-wrap gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => updatePOStatus(po.poNumber, 'Accepted')}
                          className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold hover:bg-emerald-200"
                        >
                          Accept PO
                        </button>
                        <button
                          type="button"
                          onClick={() => updatePOStatus(po.poNumber, 'Dispatched')}
                          className="px-3 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold hover:bg-blue-200"
                        >
                          Dispatch Chilled Truck
                        </button>
                        <button
                          type="button"
                          onClick={() => updatePOStatus(po.poNumber, 'Received')}
                          className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300"
                        >
                          Mark Delivered
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MY PRODUCTS */}
          {activeTab === 'My Products' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((prod) => (
                  <div key={prod.id} className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ed1c2e]">
                        {prod.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleProductStock(prod.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          prod.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {prod.inStock ? 'Supplying' : 'Out of Stock'}
                      </button>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{prod.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Holding in abattoir cold room: {prod.availableKg} kg</p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Wholesale Price / kg</span>
                        <strong className="text-base font-black text-[#0B2B64]">${prod.wholesalePriceKg.toFixed(2)}</strong>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateProductPrice(prod.id, -0.2)}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => updateProductPrice(prod.id, 0.2)}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QUOTATIONS */}
          {activeTab === 'Quotations' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-gray-900">Wholesale & Trade Quote Requests</h3>
                <div className="space-y-3">
                  {quotes.map((q) => (
                    <div key={q.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#0B2B64]">{q.id}</span>
                        <h4 className="font-bold text-sm text-gray-900 mt-0.5">{q.client}</h4>
                        <p className="text-gray-600 mt-0.5">{q.request} · Required by: {q.requestedDate}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-gray-900">{q.offer}</span>
                        <button
                          type="button"
                          onClick={() => alert(`Quote ${q.id} confirmed and dispatched to ${q.client}!`)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                        >
                          Send Quotation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DELIVERIES & INVOICES */}
          {(activeTab === 'Deliveries' || activeTab === 'Invoices' || activeTab === 'Payment Records') && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3 text-xs">
              <h3 className="font-bold text-sm text-gray-900">Supplier Statement of Accounts</h3>
              <p className="text-gray-500">All historical delivery slips and bank remittance advices are archived and available for export.</p>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
                <strong>Next Settlement Date: October 20, 2026</strong>
                <p>Direct electronic transfer to Stanbic Bank account #914000384729.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
