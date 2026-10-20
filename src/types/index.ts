// ─── Product Types ────────────────────────────────────────────────────────────

export type MeatCategory =
  | 'beef'
  | 'chicken'
  | 'pork'
  | 'lamb'
  | 'sausages'
  | 'mince'
  | 'offal'
  | 'processed'
  | 'packs'
  | 'other';

export type PricingUnit = 'kg' | 'pack' | 'each' | '500g' | '250g';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ProductVariant {
  id: string;
  label: string;       // e.g. "1 kg", "500 g", "Family Pack"
  price: number;
  unit: PricingUnit;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: MeatCategory;
  image: string;
  price: number;           // base price
  salePrice?: number;      // sale/promo price if active
  unit: PricingUnit;
  variants?: ProductVariant[];
  stockStatus: StockStatus;
  stockQty?: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  isWholesale?: boolean;
  minOrderQty?: number;    // for wholesale
  tags?: string[];
  weight?: number;         // in grams
  createdAt: string;
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  unit: PricingUnit;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  vat: number;
  deliveryFee: number;
  total: number;
}

// ─── Order Types ──────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_collection'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export type FulfilmentMethod = 'delivery' | 'collection';

export type PaymentMethod =
  | 'card'
  | 'eft'
  | 'cash_on_delivery'
  | 'pay_on_collection'
  | 'snapscan'
  | 'ecocash'
  | 'innbucks'
  | 'onemoney'
  | 'swipe_on_delivery';

export interface OrderPaymentDetails {
  methodName: string;
  provider?: 'ecocash' | 'onemoney' | 'innbucks' | 'card' | 'cash' | 'swipe' | 'zipit';
  status: 'paid' | 'pending_on_delivery' | 'awaiting_confirmation';
  phone?: string;
  currency?: string;
  cardLast4?: string;
  changeFor?: string;
  transactionRef?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  unit: PricingUnit;
  quantity: number;
  selectedVariant?: ProductVariant;
  actualWeight?: number;  // for weight-based items
  finalPrice?: number;    // calculated from actual weight
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  suburb: string;
  city: string;
  postalCode: string;
  instructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  items: OrderItem[];
  status: OrderStatus;
  fulfilmentMethod: FulfilmentMethod;
  deliveryAddress?: DeliveryAddress;
  branchId?: string;
  paymentMethod: PaymentMethod;
  paymentDetails?: OrderPaymentDetails;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  assignedDriverId?: string;
  driverName?: string;
}

// ─── User / Auth Types ────────────────────────────────────────────────────────

export type UserRole =
  | 'customer'
  | 'wholesale_customer'
  | 'admin'
  | 'staff'
  | 'driver'
  | 'supplier';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}

export interface CustomerProfile {
  userId: string;
  savedAddresses: DeliveryAddress[];
  favouriteProductIds: string[];
}

export interface BusinessProfile {
  userId: string;
  businessName: string;
  contactPerson: string;
  businessEmail: string;
  phone: string;
  address: string;
  businessType: string;
  registrationNumber?: string;
  isApproved: boolean;
  creditTerms?: string;
}

// ─── Wholesale Types ──────────────────────────────────────────────────────────

export type QuoteStatus = 'pending' | 'reviewed' | 'sent' | 'accepted' | 'declined';

export interface WholesaleQuoteItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: PricingUnit;
  notes?: string;
}

export interface WholesaleQuote {
  id: string;
  businessId: string;
  items: WholesaleQuoteItem[];
  preferredDeliveryDate?: string;
  deliveryLocation: string;
  specialRequirements?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: QuoteStatus;
  quotedPrice?: number;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Branch Types ─────────────────────────────────────────────────────────────

export interface BranchHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  suburb: string;
  city: string;
  lat?: number;
  lng?: number;
  phone: string;
  email?: string;
  hours: BranchHours[];
  services: string[];
  isCollectionPoint: boolean;
  mapsUrl?: string;
  isActive: boolean;
}

// ─── Promotion Types ──────────────────────────────────────────────────────────

export interface Promotion {
  id: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  productIds: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// ─── Review Types ─────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  productId?: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

// ─── Inventory Types ──────────────────────────────────────────────────────────

export type StockMovementType = 'received' | 'sold' | 'adjusted' | 'expired' | 'returned';

export interface StockMovement {
  id: string;
  productId: string;
  branchId: string;
  type: StockMovementType;
  quantity: number;
  notes?: string;
  staffId?: string;
  createdAt: string;
}

export interface InventoryRecord {
  id: string;
  productId: string;
  branchId: string;
  quantity: number;
  batchNumber?: string;
  expiryDate?: string;
  receivedAt: string;
  updatedAt: string;
}

// ─── Supplier Types ───────────────────────────────────────────────────────────

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  products: string[];
  isActive: boolean;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: Array<{ productId: string; quantity: number; unit: PricingUnit; unitPrice: number }>;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  expectedDelivery?: string;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Driver Types ─────────────────────────────────────────────────────────────

export type DeliveryStatus = 'assigned' | 'collected' | 'in_transit' | 'delivered' | 'failed';

export interface DeliveryAssignment {
  id: string;
  orderId: string;
  driverId: string;
  status: DeliveryStatus;
  assignedAt: string;
  collectedAt?: string;
  deliveredAt?: string;
  failureReason?: string;
  notes?: string;
}
