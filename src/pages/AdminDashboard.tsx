import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Clock,
  CheckCircle2,
  TrendingUp,
  Search,
  LayoutDashboard,
  ClipboardList,
  Package,
  Boxes,
  Truck,
  Building2,
  CreditCard,
  Settings,
  Plus,
  RefreshCw,
  X,
  Phone,
  Menu,
} from 'lucide-react';
import BrandLogo from '../components/Shared/BrandLogo';
import { getAllOrders, updateOrderStatus, assignOrderDriver } from '../data/orders';
import { products as initialProducts } from '../data/products';
import { formatCurrency } from '../utils/currency';
import type { Order, OrderStatus, Product } from '../types';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('Last 7 days');
  const [searchQuery, setSearchQuery] = useState('');

  // Live orders state
  const [orders, setOrders] = useState<Order[]>(() => getAllOrders());
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Products state (stored in local state with persistent stock/price changes)
  const [productList, setProductList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bms_admin_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('beef');
  const [newProductPrice, setNewProductPrice] = useState('9.99');
  const [newProductUnit] = useState('kg');

  // Inventory records state
  const [inventoryStock, setInventoryStock] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('bms_admin_inventory');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      'beef-fillet': 45,
      'chicken-portions': 120,
      'mince-beef': 80,
      'pork-chops': 35,
      'boerewors': 60,
      'braai-pack': 25,
      'lamb-chops': 18,
      't-bone-steak': 30,
    };
  });

  // Drivers roster state
  const [drivers] = useState([
    { id: 'dr-1', name: 'Tendai Moyo', vehicle: 'Toyota Quantum #04 (Chilled)', phone: '+263 71 123 4567', activeDeliveries: 3, status: 'On Route' },
    { id: 'dr-2', name: 'Blessings Ndlovu', vehicle: 'Express Delivery Bike #02', phone: '+263 77 222 3344', activeDeliveries: 1, status: 'Available' },
    { id: 'dr-3', name: 'Farai Gumbo', vehicle: 'Isuzu D-Max 4x4 Bakkie #01', phone: '+263 78 555 8899', activeDeliveries: 0, status: 'Standby' },
  ]);

  // Suppliers state
  const [suppliers] = useState([
    { id: 'sup-1', name: 'Matopos Cattle Ranchers', category: 'A-Grade Beef', contact: 'M. Sibanda', phone: '+263 71 900 1122', activePO: 'PO-2026-08', balance: '$2,450.00' },
    { id: 'sup-2', name: 'Premier Poultry Farms', category: 'Broiler & Free-Range', contact: 'C. Dube', phone: '+263 77 333 4455', activePO: 'PO-2026-09', balance: '$1,180.00' },
    { id: 'sup-3', name: 'Khami River Piggery', category: 'Fresh Pork & Loins', contact: 'T. Ncube', phone: '+263 78 666 7788', activePO: 'PO-2026-10', balance: '$860.00' },
  ]);

  // Listen for order updates
  useEffect(() => {
    const handleUpdate = () => {
      setOrders(getAllOrders());
    };
    window.addEventListener('bms_orders_updated', handleUpdate);
    return () => window.removeEventListener('bms_orders_updated', handleUpdate);
  }, []);

  const refreshOrders = () => {
    setOrders(getAllOrders());
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    setOrders(getAllOrders());
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleAssignDriver = (orderId: string, driverId: string, driverName: string) => {
    assignOrderDriver(orderId, driverId, driverName);
    setOrders(getAllOrders());
  };

  const toggleStockStatus = (productId: string) => {
    const updated = productList.map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          stockStatus: p.stockStatus === 'in_stock' ? ('out_of_stock' as const) : ('in_stock' as const),
        };
      }
      return p;
    });
    setProductList(updated);
    try {
      localStorage.setItem('bms_admin_products', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const updatePrice = (productId: string, priceDelta: number) => {
    const updated = productList.map((p) => {
      if (p.id === productId) {
        const newPrice = Math.max(1, Number((p.price + priceDelta).toFixed(2)));
        return { ...p, price: newPrice };
      }
      return p;
    });
    setProductList(updated);
    try {
      localStorage.setItem('bms_admin_products', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;
    const newProd: Product = {
      id: `custom-${Date.now()}`,
      name: newProductName.trim(),
      category: newProductCategory as any,
      price: parseFloat(newProductPrice) || 9.99,
      unit: newProductUnit as any,
      stockStatus: 'in_stock',
      image: '/images/category_beef.jpg',
      description: 'Fresh quality meat cut prepared daily.',
      createdAt: new Date().toISOString(),
    };
    const updated = [newProd, ...productList];
    setProductList(updated);
    try {
      localStorage.setItem('bms_admin_products', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setShowAddProductModal(false);
    setNewProductName('');
  };

  const restockInventory = (productId: string, amountKg: number) => {
    const updated = {
      ...inventoryStock,
      [productId]: (inventoryStock[productId] || 0) + amountKg,
    };
    setInventoryStock(updated);
    try {
      localStorage.setItem('bms_admin_inventory', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.deliveryAddress?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.paymentDetails?.methodName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // KPI Computations
  const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.total : 0), 12450);
  const pendingCount = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  const sidebarLinks = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Orders', icon: ClipboardList, badge: pendingCount > 0 ? pendingCount : undefined },
    { label: 'Products', icon: Package },
    { label: 'Inventory', icon: Boxes },
    { label: 'Drivers', icon: Truck },
    { label: 'Suppliers', icon: Building2 },
    { label: 'Invoices & Payments', icon: CreditCard },
    { label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col md:flex-row">
      {/* ─── Desktop Sidebar ─────────────────────────────────────────────────── */}
      <aside className="hidden w-60 shrink-0 flex-col justify-between bg-[#0B2B64] text-blue-100 md:flex">
        <div>
          <div className="border-b border-white/10 bg-[#082454] p-5">
            <BrandLogo size="sm" linkToHome={true} tone="light" />
          </div>

          <nav className="p-3 space-y-1 text-xs font-semibold">
            {sidebarLinks.map((item) => {
              const active = activeTab === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveTab(item.label)}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-left transition-colors flex items-center justify-between gap-3 ${
                    active ? 'bg-[#ed1c2e] text-white font-bold shadow-xs' : 'hover:bg-white/5 hover:text-white text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="rounded-full bg-white text-[#ed1c2e] px-1.5 py-0.2 text-[10px] font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 text-[11px] text-gray-400">
          <p className="font-bold text-white">Budget Meat Shop v2.4</p>
          <span>Admin Manager Control Panel</span>
        </div>
      </aside>

      {/* ─── Mobile Header & Mobile Navigation ───────────────────────────────── */}
      <div className="md:hidden bg-[#0B2B64] text-white sticky top-0 z-30 border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <BrandLogo size="sm" linkToHome={true} tone="light" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshOrders}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              aria-label="Refresh orders"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Tabs Bar (Fast Phone Tapping) */}
        <div className="overflow-x-auto no-scrollbar flex items-center gap-1 px-3 py-2 border-t border-white/10 bg-[#082454]">
          {sidebarLinks.map((item) => (
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
              {item.badge !== undefined && (
                <span className="rounded-full bg-white text-[#ed1c2e] px-1 text-[9px] font-black">{item.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Mobile Full Menu Drawer */}
        {mobileMenuOpen && (
          <div className="bg-[#0B2B64] border-t border-white/10 p-3 space-y-1">
            {sidebarLinks.map((item) => (
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
                <div className="flex items-center gap-2.5">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && <span className="bg-white text-[#ed1c2e] px-1.5 rounded-full text-[10px]">{item.badge}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Main Content Area ──────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Desktop Navbar */}
        <header className="hidden md:flex bg-white border-b border-gray-200 px-6 py-3.5 items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search orders, customers, cuts, payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-9 pr-4 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#082869]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={refreshOrders}
              className="text-xs font-bold text-[#082869] hover:bg-gray-100 p-2 rounded-lg flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sync Live
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#082869] text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="text-xs">
                <span className="font-bold text-gray-900 block leading-tight">Admin Manager</span>
                <span className="text-[10px] text-gray-400">Bulawayo Central Hub</span>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Contents */}
        <main className="p-4 sm:p-6 space-y-6">
          {/* Top Bar for View Title & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{activeTab}</h1>
              <p className="text-xs text-gray-500">
                {activeTab === 'Overview' && 'Operational health, revenue metrics and priority alerts'}
                {activeTab === 'Orders' && 'Manage placed customer orders, statuses and dispatch'}
                {activeTab === 'Products' && 'Real-time catalog pricing and availability'}
                {activeTab === 'Inventory' && 'Cold storage kg stock counts and fast restock'}
                {activeTab === 'Drivers' && 'Chilled fleet dispatch and delivery tracking'}
                {activeTab === 'Suppliers' && 'Wholesale livestock & poultry purchase orders'}
                {activeTab === 'Invoices & Payments' && 'Payment reconciliation (EcoCash, Cards, COD, InnBucks)'}
                {activeTab === 'Settings' && 'Branch hours, delivery rates and notifications'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                aria-label="Filter time range"
                className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs outline-none"
              >
                <option>Today</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>This month</option>
              </select>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════════
              TAB 1: OVERVIEW
             ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              {/* 4 KPI Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-semibold">Total Revenue</span>
                    <span className="w-7 h-7 rounded-full bg-blue-50 text-[#082869] flex items-center justify-center">
                      <DollarSign className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-gray-900">${totalRevenue.toLocaleString()}</div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> +18% vs last week
                  </span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-semibold">Orders Active</span>
                    <span className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-gray-900">{orders.length}</div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-amber-600 flex items-center gap-1 mt-1">
                    {pendingCount} new · {preparingCount} in prep
                  </span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-semibold">Delivered</span>
                    <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-gray-900">{deliveredCount + 210}</div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                    100% on-time chilled
                  </span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-semibold">Fleet Vans</span>
                    <span className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Truck className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-gray-900">3 / 3 Active</div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-purple-600 flex items-center gap-1 mt-1">
                    Bulawayo Central Zone
                  </span>
                </div>
              </div>

              {/* Best Sellers & Quick Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Best Selling Meat Cuts */}
                <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-gray-900">Top In-Demand Cuts</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('Products')}
                      className="text-xs font-bold text-[#ed1c2e] hover:underline"
                    >
                      Manage
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Chicken Mixed Portions', sold: 58, stock: 'In Stock' },
                      { name: 'Lean Mince Beef (85/15)', sold: 46, stock: 'In Stock' },
                      { name: 'Prime Beef Fillet', sold: 34, stock: 'Low Stock' },
                      { name: 'Farmstyle Boerewors', sold: 29, stock: 'In Stock' },
                      { name: 'Pork Chops', sold: 22, stock: 'In Stock' },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-xs py-2 border-b border-gray-100 last:border-none">
                        <div>
                          <span className="font-bold text-gray-800 block">{item.name}</span>
                          <span className="text-[10px] text-gray-400">{item.stock}</span>
                        </div>
                        <span className="font-black text-[#ed1c2e] bg-red-50 px-2.5 py-1 rounded-full text-xs">
                          {item.sold} sold
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority Orders Feed */}
                <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-gray-900">Recent Customer Orders</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('Orders')}
                      className="text-xs font-bold text-[#082869] hover:underline"
                    >
                      View All ({orders.length})
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {orders.slice(0, 4).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3 rounded-xl border border-gray-200/70 hover:border-gray-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-3">
                          <span className="h-8 w-8 rounded-full bg-blue-50 text-[#082869] flex items-center justify-center font-bold text-xs shrink-0">
                            #{ord.orderNumber.slice(-4)}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-gray-900">
                                {ord.deliveryAddress?.fullName || 'Walk-in / Customer'}
                              </span>
                              <span
                                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  ord.status === 'delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : ord.status === 'dispatched'
                                    ? 'bg-blue-100 text-blue-800'
                                    : ord.status === 'preparing'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {ord.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {ord.items.length} items · {ord.paymentDetails?.methodName || ord.paymentMethod}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-none border-gray-100">
                          <strong className="text-sm font-black text-gray-900">{formatCurrency(ord.total)}</strong>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(ord);
                              setActiveTab('Orders');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              TAB 2: ORDERS MANAGEMENT
             ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'Orders' && (
            <div className="space-y-4">
              {/* Order Status Filters & Search */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {['all', 'pending', 'confirmed', 'preparing', 'dispatched', 'delivered', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 rounded-full font-bold capitalize transition ${
                        orderFilter === st ? 'bg-[#082869] text-white shadow-2xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {st} {st !== 'all' && `(${orders.filter((o) => o.status === st).length})`}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search order #, customer, payment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Orders Grid / Cards for Mobile & Table for Desktop */}
              <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl text-center text-gray-500 text-sm">
                    No orders matching this filter.
                  </div>
                ) : (
                  filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#082869]/30 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-sm text-[#082869] bg-blue-50 px-2.5 py-1 rounded-lg">
                            {ord.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'dispatched'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.status === 'preparing'
                                ? 'bg-amber-100 text-amber-800'
                                : ord.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">
                            Payment: <strong className="text-gray-900">{ord.paymentDetails?.methodName || ord.paymentMethod}</strong>
                          </span>
                          <span className="text-lg font-black text-[#ed1c2e]">{formatCurrency(ord.total)}</span>
                        </div>
                      </div>

                      <div className="py-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-gray-400 block mb-0.5">Customer & Contact</span>
                          <strong className="text-gray-900 block">{ord.deliveryAddress?.fullName || 'Walk-in Customer'}</strong>
                          <span className="text-gray-600 block">{ord.deliveryAddress?.phone || 'No phone'}</span>
                          {ord.deliveryAddress?.street && (
                            <span className="text-gray-500 block truncate">
                              {ord.deliveryAddress.street}, {ord.deliveryAddress.suburb}
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="text-gray-400 block mb-0.5">Items Ordered ({ord.items.length})</span>
                          <div className="space-y-1">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="text-gray-700">
                                <strong>{it.quantity}x</strong> {it.name}{' '}
                                <span className="text-gray-400">({formatCurrency(it.price * it.quantity)})</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-400 block mb-0.5">Driver & Notes</span>
                          <p className="text-gray-800 font-medium">{ord.driverName || 'No driver assigned yet'}</p>
                          {ord.notes && <p className="text-gray-500 italic mt-1">"{ord.notes}"</p>}
                        </div>
                      </div>

                      {/* Interactive Action Controls */}
                      <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap text-xs">
                          <span className="font-bold text-gray-500 text-[11px] mr-1">Change Status:</span>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(ord.id, 'preparing')}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold transition"
                          >
                            Preparing
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(ord.id, 'dispatched')}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold transition"
                          >
                            Dispatch
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(ord.id, 'delivered')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition"
                          >
                            Delivered
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(ord.id, 'cancelled')}
                            className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold transition"
                          >
                            Cancel
                          </button>
                        </div>

                        {/* Assign Driver Dropdown */}
                        <div className="flex items-center gap-2">
                          <select
                            aria-label="Assign driver"
                            onChange={(e) => {
                              const d = drivers.find((drv) => drv.id === e.target.value);
                              if (d) handleAssignDriver(ord.id, d.id, `${d.name} (${d.vehicle})`);
                            }}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Assign Driver...
                            </option>
                            {drivers.map((drv) => (
                              <option key={drv.id} value={drv.id}>
                                {drv.name} ({drv.status})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              TAB 3: PRODUCTS MANAGEMENT
             ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'Products' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    aria-label="Filter meat cut category"
                    className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 outline-none"
                  >
                    <option value="all">All Categories ({productList.length})</option>
                    <option value="beef">Beef</option>
                    <option value="chicken">Chicken</option>
                    <option value="pork">Pork</option>
                    <option value="mince">Mince</option>
                    <option value="sausages">Sausages & Wors</option>
                    <option value="packs">Meat Packs</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddProductModal(true)}
                  className="btn-primary text-xs flex items-center gap-1.5 py-2 px-4"
                >
                  <Plus className="h-4 w-4" /> Add New Meat Cut
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {productList
                  .filter((p) => productCategoryFilter === 'all' || p.category === productCategoryFilter)
                  .map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between"
                    >
                      <div className="flex gap-3">
                        <img src={prod.image} alt={prod.name} className="h-16 w-16 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ed1c2e]">
                            {prod.category}
                          </span>
                          <h4 className="font-bold text-sm text-gray-900 truncate">{prod.name}</h4>
                          <span className="text-base font-black text-[#082869]">
                            {formatCurrency(prod.price)} <span className="text-xs text-gray-500 font-normal">/ {prod.unit}</span>
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        {/* Toggle in/out of stock */}
                        <button
                          type="button"
                          onClick={() => toggleStockStatus(prod.id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                            prod.stockStatus === 'in_stock'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {prod.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                        </button>

                        {/* Price adjusters */}
                        <div className="flex items-center gap-1 text-xs">
                          <button
                            type="button"
                            onClick={() => updatePrice(prod.id, -0.5)}
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-black"
                            title="Decrease $0.50"
                          >
                            -
                          </button>
                          <span className="font-bold text-gray-700 px-1">{formatCurrency(prod.price)}</span>
                          <button
                            type="button"
                            onClick={() => updatePrice(prod.id, 0.5)}
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-black"
                            title="Increase $0.50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Add Product Modal */}
              {showAddProductModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b pb-3">
                      <h3 className="font-bold text-base text-[#082869]">Add New Product Cut</h3>
                      <button type="button" onClick={() => setShowAddProductModal(false)} aria-label="Close modal">
                        <X className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>

                    <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
                      <div>
                        <label className="form-label" htmlFor="newProdName">Product Cut Name</label>
                        <input
                          id="newProdName"
                          type="text"
                          required
                          value={newProductName}
                          onChange={(e) => setNewProductName(e.target.value)}
                          placeholder="e.g. Ribeye Steak"
                          className="form-field text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="form-label" htmlFor="newProdCat">Category</label>
                          <select
                            id="newProdCat"
                            value={newProductCategory}
                            onChange={(e) => setNewProductCategory(e.target.value)}
                            className="form-field text-xs"
                          >
                            <option value="beef">Beef</option>
                            <option value="chicken">Chicken</option>
                            <option value="pork">Pork</option>
                            <option value="mince">Mince</option>
                            <option value="sausages">Sausages</option>
                            <option value="packs">Packs</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label" htmlFor="newProdPrice">Base Price ($)</label>
                          <input
                            id="newProdPrice"
                            type="number"
                            step="0.01"
                            required
                            value={newProductPrice}
                            onChange={(e) => setNewProductPrice(e.target.value)}
                            className="form-field text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-3">
                        <button
                          type="button"
                          onClick={() => setShowAddProductModal(false)}
                          className="px-4 py-2 rounded-xl border border-gray-300 font-bold text-gray-600"
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary text-xs py-2 px-5">
                          Add Cut
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              TAB 4: INVENTORY MANAGEMENT
             ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'Inventory' && (
            <div className="space-y-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Cold Room Meat Weights & Stock Levels</h3>
                    <p className="text-xs text-gray-500">Live kilogram counts in Bulawayo Central butchery cold store</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.entries(inventoryStock).map(([cutId, kg]) => {
                    const isLow = kg < 25;
                    return (
                      <div key={cutId} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                            Cut #{cutId}
                          </span>
                          <strong className="text-sm font-bold text-gray-900 capitalize block mt-0.5">
                            {cutId.replace(/-/g, ' ')}
                          </strong>
                        </div>

                        <div className="mt-3 flex items-baseline justify-between">
                          <span className="text-2xl font-black text-[#082869]">{kg} kg</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isLow ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isLow ? 'Low Stock' : 'Optimal'}
                          </span>
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between gap-1 text-xs">
                          <span className="text-[11px] text-gray-500">Restock:</span>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => restockInventory(cutId, 10)}
                              className="px-2 py-0.5 rounded bg-white border border-gray-300 font-bold hover:bg-gray-100"
                            >
                              +10kg
                            </button>
                            <button
                              type="button"
                              onClick={() => restockInventory(cutId, 25)}
                              className="px-2 py-0.5 rounded bg-white border border-gray-300 font-bold hover:bg-gray-100"
                            >
                              +25kg
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              TAB 5: DRIVERS
             ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'Drivers' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {drivers.map((drv) => (
                  <div key={drv.id} className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-full bg-[#082869] text-white flex items-center justify-center font-black text-sm">
                        {drv.name[0]}
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          drv.status === 'On Route'
                            ? 'bg-blue-100 text-[#082869]'
                            : drv.status === 'Available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {drv.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{drv.name}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Truck className="h-3.5 w-3.5 text-[#ed1c2e]" /> {drv.vehicle}
                      </p>
                      <a href={`tel:${drv.phone}`} className="text-xs text-blue-600 flex items-center gap-1 mt-1 font-semibold">
                        <Phone className="h-3 w-3" /> {drv.phone}
                      </a>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-500">Active Deliveries:</span>
                      <strong className="text-gray-900 font-black">{drv.activeDeliveries} stops</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              TAB 6: SUPPLIERS
             ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'Suppliers' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead className="text-[10px] text-gray-400 uppercase border-b border-gray-100 pb-2">
                    <tr>
                      <th className="pb-2">Supplier Partner</th>
                      <th className="pb-2">Supply Line</th>
                      <th className="pb-2">Contact</th>
                      <th className="pb-2">Active PO</th>
                      <th className="pb-2 text-right">Balance Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {suppliers.map((sup) => (
                      <tr key={sup.id} className="hover:bg-gray-50">
                        <td className="py-3 font-bold text-gray-900">{sup.name}</td>
                        <td className="py-3 text-gray-700">{sup.category}</td>
                        <td className="py-3 text-gray-600">{sup.contact} · {sup.phone}</td>
                        <td className="py-3 font-mono font-bold text-blue-600">{sup.activePO}</td>
                        <td className="py-3 text-right font-black text-gray-900">{sup.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              TAB 7: INVOICES & PAYMENTS
             ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'Invoices & Payments' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <span className="text-xs text-gray-500 block">EcoCash USD/ZWG</span>
                  <span className="text-xl font-black text-[#082869] block mt-1">$6,420.00</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Live mobile settlement</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <span className="text-xs text-gray-500 block">InnBucks</span>
                  <span className="text-xl font-black text-[#ed1c2e] block mt-1">$2,190.00</span>
                  <span className="text-[10px] text-emerald-600 font-bold">QR code verified</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <span className="text-xs text-gray-500 block">Visa & Mastercard</span>
                  <span className="text-xl font-black text-blue-600 block mt-1">$3,840.00</span>
                  <span className="text-[10px] text-emerald-600 font-bold">3D Secure settled</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <span className="text-xs text-gray-500 block">Cash On Delivery</span>
                  <span className="text-xl font-black text-emerald-600 block mt-1">$1,850.00</span>
                  <span className="text-[10px] text-gray-500 font-bold">Driver custody verified</span>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              TAB 8: SETTINGS
             ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'Settings' && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-4 max-w-xl text-xs">
              <h3 className="font-bold text-sm text-gray-900">Butchery Hub Operational Settings</h3>
              <div className="space-y-3 pt-2">
                <div>
                  <label className="form-label" htmlFor="deliveryFeeSetting">Standard Bulawayo Delivery Fee (USD)</label>
                  <input id="deliveryFeeSetting" type="number" defaultValue="5.00" className="form-field text-xs w-48" />
                </div>
                <div>
                  <label className="form-label" htmlFor="freeDeliveryThreshold">Free Delivery Threshold (Orders over $)</label>
                  <input id="freeDeliveryThreshold" type="number" defaultValue="50.00" className="form-field text-xs w-48" />
                </div>
                <div>
                  <label className="form-label" htmlFor="zwgExchangeRate">USD to ZWG Exchange Rate</label>
                  <input id="zwgExchangeRate" type="number" defaultValue="26.50" className="form-field text-xs w-48" />
                </div>
                <button
                  type="button"
                  onClick={() => alert('Settings saved successfully!')}
                  className="btn-primary text-xs py-2 px-5 mt-2"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
