import type { Order, OrderStatus } from '../types';

const ORDERS_KEY = 'bms_customer_orders';

export const initialOrders: Order[] = [
  {
    id: 'BMS-2026-1042',
    orderNumber: 'BMS-2026-1042',
    customerId: 'cust-1',
    items: [
      { productId: 'chicken-portions', name: 'Chicken Portions', image: '/images/category_chicken.jpg', price: 7.99, unit: 'kg', quantity: 3 },
      { productId: 'mince-beef', name: 'Mince Beef', image: '/images/category_mince.jpg', price: 9.95, unit: 'kg', quantity: 2 },
    ],
    status: 'preparing',
    fulfilmentMethod: 'delivery',
    deliveryAddress: {
      fullName: 'Tendai Moyo',
      phone: '+263 71 123 4567',
      email: 'tendai.moyo@gmail.com',
      street: '14 Chikwanha Ave',
      suburb: 'Kumalo',
      city: 'Bulawayo',
      postalCode: '',
      instructions: 'Please portion mince into 500g packs',
    },
    paymentMethod: 'ecocash',
    paymentDetails: {
      methodName: 'EcoCash USD',
      provider: 'ecocash',
      status: 'paid',
      phone: '+263 77 123 4567',
      currency: 'USD',
      transactionRef: 'MP260510.1420.A0912',
    },
    subtotal: 43.87,
    deliveryFee: 5.00,
    discount: 0,
    total: 48.87,
    notes: 'Morning · 08:00–12:00 · Packed with ice packs',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    assignedDriverId: 'dr-1',
    driverName: 'Tendai Moyo (Van #04)',
    estimatedDelivery: '11:30 AM',
  },
  {
    id: 'BMS-2026-1038',
    orderNumber: 'BMS-2026-1038',
    customerId: 'cust-2',
    items: [
      { productId: 'beef-fillet', name: 'Beef Fillet', image: '/images/beef_fillet.jpg', price: 16.99, unit: 'kg', quantity: 2 },
      { productId: 'boerewors', name: 'Farmstyle Boerewors', image: '/images/category_sausages.jpg', price: 8.50, unit: 'kg', quantity: 2 },
    ],
    status: 'dispatched',
    fulfilmentMethod: 'delivery',
    deliveryAddress: {
      fullName: 'L. Dube',
      phone: '+263 71 987 6543',
      email: 'ldube@zol.co.zw',
      street: '42 7th Ave',
      suburb: 'Suburbs',
      city: 'Bulawayo',
      postalCode: '',
    },
    paymentMethod: 'card',
    paymentDetails: {
      methodName: 'Visa Card (Verified)',
      provider: 'card',
      status: 'paid',
      cardLast4: '4242',
      currency: 'USD',
      transactionRef: 'TXN-CARD-99182',
    },
    subtotal: 50.98,
    deliveryFee: 0,
    discount: 0,
    total: 50.98,
    notes: 'Afternoon delivery requested',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    assignedDriverId: 'dr-1',
    driverName: 'Tendai Moyo (Van #04)',
    estimatedDelivery: '01:15 PM',
  },
  {
    id: 'BMS-2026-1035',
    orderNumber: 'BMS-2026-1035',
    customerId: 'cust-3',
    items: [
      { productId: 'pork-chops', name: 'Pork Chops', image: '/images/category_pork.jpg', price: 8.95, unit: 'kg', quantity: 4 },
    ],
    status: 'confirmed',
    fulfilmentMethod: 'collection',
    branchId: 'bms-cbd-fife',
    paymentMethod: 'pay_on_collection',
    paymentDetails: {
      methodName: 'Pay on Collection (Cash/Card)',
      provider: 'cash',
      status: 'pending_on_delivery',
      changeFor: 'Exact Cash ($35.80)',
    },
    subtotal: 35.80,
    deliveryFee: 0,
    discount: 0,
    total: 35.80,
    notes: 'Customer collecting at Fife Street CBD branch around 3pm',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'BMS-2026-1029',
    orderNumber: 'BMS-2026-1029',
    customerId: 'cust-4',
    items: [
      { productId: 'braai-pack', name: 'Weekend Braai Pack', image: '/images/category_packs.jpg', price: 34.50, unit: 'pack', quantity: 2 },
    ],
    status: 'delivered',
    fulfilmentMethod: 'delivery',
    deliveryAddress: {
      fullName: 'Sipho Chikwiriye',
      phone: '+263 77 444 5555',
      email: 'sipho.c@yahoo.com',
      street: '88 Lobengula St',
      suburb: 'North End',
      city: 'Bulawayo',
      postalCode: '',
    },
    paymentMethod: 'cash_on_delivery',
    paymentDetails: {
      methodName: 'Cash on Delivery',
      provider: 'cash',
      status: 'paid',
      changeFor: 'Paid $70 USD in cash to driver',
      transactionRef: 'COD-RECEIPT-4412',
    },
    subtotal: 69.00,
    deliveryFee: 5.00,
    discount: 0,
    total: 74.00,
    notes: 'Delivered and verified by customer',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    assignedDriverId: 'dr-1',
    driverName: 'Tendai Moyo (Van #04)',
  },
];

export function getAllOrders(): Order[] {
  try {
    const stored = localStorage.getItem(ORDERS_KEY);
    if (!stored) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(initialOrders));
      return initialOrders;
    }
    const orders = JSON.parse(stored) as Order[];
    return Array.isArray(orders) && orders.length ? orders : initialOrders;
  } catch {
    return initialOrders;
  }
}

export function getCustomerOrders(): Order[] {
  return getAllOrders();
}

export function saveCustomerOrder(order: Order): boolean {
  try {
    const existing = getAllOrders();
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('bms_orders_updated', { detail: { orderId: order.id } }));
    return true;
  } catch {
    return false;
  }
}

export function updateOrderStatus(orderId: string, status: OrderStatus, extraNotes?: string): boolean {
  try {
    const orders = getAllOrders();
    const updated = orders.map((o) => {
      if (o.id === orderId || o.orderNumber === orderId) {
        return {
          ...o,
          status,
          updatedAt: new Date().toISOString(),
          notes: extraNotes ? [o.notes, extraNotes].filter(Boolean).join(' · ') : o.notes,
        };
      }
      return o;
    });
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('bms_orders_updated', { detail: { orderId, status } }));
    return true;
  } catch {
    return false;
  }
}

export function assignOrderDriver(orderId: string, driverId: string, driverName: string): boolean {
  try {
    const orders = getAllOrders();
    const updated = orders.map((o) => {
      if (o.id === orderId || o.orderNumber === orderId) {
        return {
          ...o,
          assignedDriverId: driverId,
          driverName,
          status: o.status === 'pending' ? 'confirmed' : o.status,
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    });
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('bms_orders_updated', { detail: { orderId, driverId } }));
    return true;
  } catch {
    return false;
  }
}
