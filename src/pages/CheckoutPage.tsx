import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  DollarSign,
  Loader2,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Snowflake,
  Store,
  Truck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { branches } from '../data/branches';
import { saveCustomerOrder } from '../data/orders';
import { formatCurrency } from '../utils/currency';
import type { DeliveryAddress, FulfilmentMethod, Order, PaymentMethod, OrderPaymentDetails } from '../types';

type CheckoutForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  suburb: string;
  city: string;
  postalCode: string;
};

export const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [fulfilmentMethod, setFulfilmentMethod] = useState<FulfilmentMethod>('delivery');
  const [branchId, setBranchId] = useState(() => {
    try {
      return localStorage.getItem('bms_selected_branch') || branches[0]?.id || '';
    } catch {
      return branches[0]?.id || '';
    }
  });
  const [cuttingNote, setCuttingNote] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('Morning · 08:00–12:00');
  const [form, setForm] = useState<CheckoutForm>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    streetAddress: '',
    suburb: '',
    city: 'Bulawayo',
    postalCode: '',
  });

  // ─── Payment State ────────────────────────────────────────────────────────
  const [paymentOption, setPaymentOption] = useState<'ecocash' | 'innbucks' | 'card' | 'cash' | 'zipit'>('ecocash');
  const [ecoCurrency, setEcoCurrency] = useState<'USD' | 'ZWG'>('USD');
  const [ecoPhone, setEcoPhone] = useState(user?.phone || '');
  const [ecoStatus, setEcoStatus] = useState<'idle' | 'prompting' | 'confirmed'>('idle');
  const [ecoCountdown, setEcoCountdown] = useState(15);

  const [innbucksNumber, setInnbucksNumber] = useState('');
  const [innbucksAuthCode, setInnbucksAuthCode] = useState('');

  const [cardHolder, setCardHolder] = useState(user ? `${user.firstName} ${user.lastName}` : '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardSimulating, setCardSimulating] = useState(false);
  const [cardVerified, setCardVerified] = useState(false);

  const [cashChange, setCashChange] = useState<'exact' | '20' | '50' | '100' | 'swipe'>('exact');
  const [order, setOrder] = useState<Order | null>(null);
  const [orderSaved, setOrderSaved] = useState(true);

  const updateForm = (event: ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  // Simulate EcoCash push prompt
  const handleTriggerEcoPrompt = () => {
    if (!ecoPhone.trim()) {
      alert('Please enter your mobile phone number for the payment prompt.');
      return;
    }
    setEcoStatus('prompting');
    setEcoCountdown(10);
    const interval = setInterval(() => {
      setEcoCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setEcoStatus('confirmed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Simulate Card Verification
  const handleVerifyCard = () => {
    if (cardNumber.replace(/\s/g, '').length < 12) {
      alert('Please enter a valid card number.');
      return;
    }
    setCardSimulating(true);
    setTimeout(() => {
      setCardSimulating(false);
      setCardVerified(true);
    }, 1200);
  };

  const deliveryFee = fulfilmentMethod === 'collection' ? 0 : cart.deliveryFee;
  const total = cart.subtotal + deliveryFee;

  const placeOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart.items.length) return;

    const createdAt = new Date().toISOString();
    const deliveryAddress: DeliveryAddress | undefined =
      fulfilmentMethod === 'delivery'
        ? {
            fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
            phone: form.phone.trim(),
            email: form.email.trim(),
            street: form.streetAddress.trim(),
            suburb: form.suburb.trim(),
            city: form.city.trim(),
            postalCode: form.postalCode.trim(),
            instructions: cuttingNote.trim() || undefined,
          }
        : undefined;

    const orderNumber = `BMS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // Build payment details based on selected payment method
    let resolvedPaymentMethod: PaymentMethod = 'cash_on_delivery';
    let paymentDetails: OrderPaymentDetails;

    if (paymentOption === 'ecocash') {
      resolvedPaymentMethod = 'ecocash';
      paymentDetails = {
        methodName: `EcoCash (${ecoCurrency})`,
        provider: 'ecocash',
        status: ecoStatus === 'confirmed' ? 'paid' : 'pending_on_delivery',
        phone: ecoPhone || form.phone,
        currency: ecoCurrency,
        transactionRef: `EC-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    } else if (paymentOption === 'innbucks') {
      resolvedPaymentMethod = 'innbucks';
      paymentDetails = {
        methodName: 'InnBucks Wallet',
        provider: 'innbucks',
        status: 'paid',
        phone: innbucksNumber || form.phone,
        transactionRef: innbucksAuthCode ? `IB-${innbucksAuthCode}` : `IB-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    } else if (paymentOption === 'card') {
      resolvedPaymentMethod = 'card';
      const cleanCard = cardNumber.replace(/\s/g, '');
      paymentDetails = {
        methodName: 'Debit / Credit Card (Visa/Mastercard)',
        provider: 'card',
        status: 'paid',
        cardLast4: cleanCard.slice(-4) || '4242',
        currency: 'USD',
        transactionRef: `AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    } else if (paymentOption === 'zipit') {
      resolvedPaymentMethod = 'eft';
      paymentDetails = {
        methodName: 'ZIPIT / Bank Transfer',
        provider: 'zipit',
        status: 'awaiting_confirmation',
        transactionRef: `ZIPIT-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    } else {
      resolvedPaymentMethod = fulfilmentMethod === 'collection' ? 'pay_on_collection' : (cashChange === 'swipe' ? 'swipe_on_delivery' : 'cash_on_delivery');
      const changeText =
        cashChange === 'exact'
          ? `Exact cash ($${total.toFixed(2)})`
          : cashChange === 'swipe'
          ? 'Card POS swipe on delivery'
          : `Need change for $${cashChange}`;
      paymentDetails = {
        methodName: cashChange === 'swipe' ? 'POS Swipe Machine on Delivery' : (fulfilmentMethod === 'collection' ? 'Pay at Counter' : 'Cash on Delivery'),
        provider: cashChange === 'swipe' ? 'swipe' : 'cash',
        status: 'pending_on_delivery',
        changeFor: changeText,
      };
    }

    const newOrder: Order = {
      id: orderNumber,
      orderNumber,
      customerId: user?.id,
      items: cart.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        unit: item.unit,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant,
      })),
      status: 'pending',
      fulfilmentMethod,
      deliveryAddress,
      branchId: fulfilmentMethod === 'collection' ? branchId : undefined,
      paymentMethod: resolvedPaymentMethod,
      paymentDetails,
      subtotal: cart.subtotal,
      deliveryFee,
      discount: 0,
      total,
      notes: [cuttingNote.trim(), `Preferred time: ${deliverySlot}`, paymentDetails.changeFor].filter(Boolean).join(' · '),
      createdAt,
      updatedAt: createdAt,
    };

    setOrderSaved(saveCustomerOrder(newOrder));
    setOrder(newOrder);
    clearCart();
  };

  if (order) {
    const branch = branches.find((item) => item.id === order.branchId);
    const confirmationMessage = encodeURIComponent(
      `Hello Budget Meat Shop, I have just placed order ${order.orderNumber}.\n${order.items
        .map((item) => `${item.quantity} × ${item.name}`)
        .join('\n')}\nTotal: ${formatCurrency(order.total)}\nPayment: ${order.paymentDetails?.methodName} (${order.paymentDetails?.status === 'paid' ? 'PAID' : 'PAY ON DELIVERY'})\n${
        order.fulfilmentMethod === 'delivery'
          ? `Delivery to ${order.deliveryAddress?.street}, ${order.deliveryAddress?.suburb}.`
          : `Collection at ${branch?.name || 'your branch'}.`
      }`
    );

    return (
      <section className="min-h-[72vh] bg-[#f6f9ff] px-4 py-8 sm:py-16">
        <div className="paper-card mx-auto max-w-2xl p-5 text-center shadow-[0_15px_55px_rgba(8,40,105,.08)] sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf5ed] text-[#318052]">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <p className="eyebrow mt-4">Order Received & Confirmed</p>
          <h1 className="font-display mt-2 text-3xl text-[#082869] sm:text-5xl">
            Thank you, {form.firstName || 'Customer'}.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-xs sm:text-sm leading-6 text-[#687789]">
            Your order <strong className="text-[#082869] font-mono">{order.orderNumber}</strong> has been successfully booked with our butchery team.
          </p>

          {/* Payment Status Pill */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold border border-[#e2e8f0] bg-white shadow-2xs">
            <span className={`h-2.5 w-2.5 rounded-full ${order.paymentDetails?.status === 'paid' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-[#082869]">
              Payment: <strong>{order.paymentDetails?.methodName}</strong> ·{' '}
              <span className={order.paymentDetails?.status === 'paid' ? 'text-emerald-600 uppercase font-black' : 'text-amber-700 font-bold'}>
                {order.paymentDetails?.status === 'paid' ? 'Paid & Verified' : 'Pay on Delivery'}
              </span>
            </span>
          </div>

          <div className="mt-6 rounded-xl border border-[#e6e8eb] bg-[#f6f9ff] p-4 sm:p-6 text-left">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5e7e9] pb-3 text-xs">
              <span className="text-[#758295] font-semibold">{order.fulfilmentMethod === 'delivery' ? 'Delivery Address' : 'Collection Branch'}</span>
              <strong className="text-right text-[#34465c]">
                {order.fulfilmentMethod === 'delivery' ? `${order.deliveryAddress?.street}, ${order.deliveryAddress?.suburb}` : branch?.name}
              </strong>
            </div>

            <div className="space-y-2 py-3">
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.selectedVariant?.id || ''}`} className="flex justify-between gap-4 text-xs">
                  <span className="text-[#506074]">
                    {item.quantity} × {item.name}
                    {item.selectedVariant ? ` · ${item.selectedVariant.label}` : ''}
                  </span>
                  <strong className="text-[#082869]">{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-[#e5e7e9] pt-3">
              <span className="text-sm font-bold text-[#34465c]">Total Due</span>
              <strong className="text-2xl font-black text-[#ed1c2e]">{formatCurrency(order.total)}</strong>
            </div>
          </div>

          <div role="note" className="mt-4 rounded-xl bg-[#edf2fb] p-4 text-left text-xs leading-5 text-[#4a586d]">
            <p className="font-bold text-[#082869] mb-1">Instant Order Dispatch Ready</p>
            Your order is {orderSaved ? 'saved securely in your account and' : 'ready and'} now visible in the Staff & Driver dispatch portals. Tap the WhatsApp button below to notify the head butcher directly with your reference number.
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={`https://wa.me/263711234567?text=${confirmationMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#258450] px-5 text-xs font-extrabold uppercase tracking-[.07em] text-white transition hover:bg-[#1e7043] shadow-sm"
            >
              <MessageCircle className="h-4 w-4" /> Message on WhatsApp
            </a>
            <Link
              to="/account"
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-[#dfe3e8] bg-white px-5 text-xs font-extrabold uppercase tracking-[.07em] text-[#082869] hover:bg-[#edf2fb]"
            >
              Track in My Orders
            </Link>
          </div>

          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#082869] hover:text-[#ed1c2e]">
            <ArrowLeft className="h-4 w-4" /> Back to butcher shop
          </Link>
        </div>
      </section>
    );
  }

  if (!cart.items.length) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center bg-[#f6f9ff] px-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#edf2fb] text-[#082869]">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <h1 className="font-display mt-5 text-3xl text-[#082869]">Your basket is waiting for something good.</h1>
        <p className="mt-2 text-sm text-[#758295]">Add a few favourites, then come back to arrange delivery or pickup.</p>
        <Link to="/shop" className="btn-primary mt-6">
          Explore the shop <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    );
  }

  const selectedBranch = branches.find((branch) => branch.id === branchId);

  return (
    <div className="min-h-screen bg-[#f6f9ff] pb-14">
      {/* Header Banner */}
      <div className="border-b border-[#e8e9eb] bg-white">
        <div className="page-shell py-6 sm:py-9">
          <Link to="/cart" className="inline-flex items-center gap-2 text-xs font-bold text-[#667486] hover:text-[#082869]">
            <ArrowLeft className="h-4 w-4" /> Back to basket
          </Link>
          <p className="eyebrow mt-4">Checkout & Secure Payment</p>
          <h1 className="font-display mt-1 text-3xl sm:text-5xl text-[#082869]">Arrange your order.</h1>
          <p className="mt-1 text-xs sm:text-sm text-[#758295]">Fast delivery across Bulawayo or free local collection.</p>
        </div>
      </div>

      <form onSubmit={placeOrder} className="page-shell grid items-start gap-6 py-6 lg:grid-cols-[1fr_380px] lg:py-10">
        <div className="space-y-6">
          {/* Step 1: Fulfilment Method */}
          <section className="paper-card p-4 sm:p-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#082869] text-xs font-black text-white shrink-0">
                1
              </span>
              <div>
                <h2 className="text-base font-extrabold text-[#082869]">How would you like your order?</h2>
                <p className="mt-0.5 text-xs text-[#8993a0]">Choose chilled refrigerated delivery or branch pickup.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  value: 'delivery' as const,
                  icon: Truck,
                  label: 'Chilled delivery',
                  detail: cart.deliveryFee === 0 ? 'Free on this order' : `From ${formatCurrency(cart.deliveryFee)}`,
                },
                {
                  value: 'collection' as const,
                  icon: Store,
                  label: 'Click & collect',
                  detail: 'Pick up from your local branch · free',
                },
              ].map(({ value, icon: Icon, label, detail }) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    fulfilmentMethod === value
                      ? 'border-[#082869] bg-[#f5f7fa] ring-1 ring-[#082869]'
                      : 'border-[#e4e7eb] hover:border-[#bac4cf] bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="fulfilment"
                    checked={fulfilmentMethod === value}
                    onChange={() => setFulfilmentMethod(value)}
                    className="mt-1 accent-[#082869]"
                  />
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#ed1c2e]" />
                  <span>
                    <span className="block text-sm font-extrabold text-[#34465c]">{label}</span>
                    <span className="mt-1 block text-xs text-[#758295]">{detail}</span>
                  </span>
                </label>
              ))}
            </div>

            {fulfilmentMethod === 'collection' ? (
              <div className="mt-5">
                <label className="form-label" htmlFor="branch">
                  Choose your collection branch
                </label>
                <select
                  id="branch"
                  value={branchId}
                  onChange={(event) => {
                    setBranchId(event.target.value);
                    try {
                      localStorage.setItem('bms_selected_branch', event.target.value);
                    } catch {
                      // ignore
                    }
                  }}
                  className="form-field text-xs sm:text-sm"
                  required
                >
                  {branches
                    .filter((branch) => branch.isCollectionPoint)
                    .map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name} · {branch.address}, {branch.suburb}
                      </option>
                    ))}
                </select>
                {selectedBranch && (
                  <a
                    href={`tel:${selectedBranch.phone.replaceAll(' ', '')}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#082869]"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    {selectedBranch.city} · {selectedBranch.phone}
                  </a>
                )}
              </div>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="streetAddress" className="form-label">
                    Street address
                  </label>
                  <input
                    id="streetAddress"
                    name="streetAddress"
                    autoComplete="street-address"
                    value={form.streetAddress}
                    onChange={updateForm}
                    required
                    className="form-field text-xs sm:text-sm"
                    placeholder="e.g. 14 Chikwanha Ave"
                  />
                </div>
                <div>
                  <label htmlFor="suburb" className="form-label">
                    Suburb / Neighbourhood
                  </label>
                  <input
                    id="suburb"
                    name="suburb"
                    autoComplete="address-level3"
                    value={form.suburb}
                    onChange={updateForm}
                    required
                    className="form-field text-xs sm:text-sm"
                    placeholder="e.g. Kumalo, Suburbs, Hillside"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={updateForm}
                    required
                    className="form-field text-xs sm:text-sm"
                    placeholder="Bulawayo"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Step 2: Contact Details */}
          <section className="paper-card p-4 sm:p-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#082869] text-xs font-black text-white shrink-0">
                2
              </span>
              <div>
                <h2 className="text-base font-extrabold text-[#082869]">Your contact details</h2>
                <p className="mt-0.5 text-xs text-[#8993a0]">We’ll use this to send order status updates.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="form-label">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={updateForm}
                  required
                  className="form-field text-xs sm:text-sm"
                  placeholder="First name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="form-label">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={updateForm}
                  required
                  className="form-field text-xs sm:text-sm"
                  placeholder="Last name"
                />
              </div>
              <div>
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={updateForm}
                  required
                  className="form-field text-xs sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="form-label">
                  Mobile number (with WhatsApp)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={updateForm}
                  required
                  className="form-field text-xs sm:text-sm"
                  placeholder="+263 7..."
                />
              </div>
            </div>
          </section>

          {/* Step 3: Paying Options (NEW RICH SECTION) */}
          <section className="paper-card p-4 sm:p-7">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#082869] text-xs font-black text-white shrink-0">
                  3
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-[#082869]">Choose your payment option</h2>
                  <p className="mt-0.5 text-xs text-[#8993a0]">Instant mobile wallet, card or cash on delivery.</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <Lock className="h-3 w-3" /> Secure 256-bit SSL
              </span>
            </div>

            {/* Payment Options Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
              {/* Option 1: EcoCash */}
              <button
                type="button"
                onClick={() => setPaymentOption('ecocash')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  paymentOption === 'ecocash'
                    ? 'border-[#082869] bg-[#edf2fb] ring-2 ring-[#082869]/20 shadow-xs'
                    : 'border-[#e4e7eb] hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="h-6 flex items-center">
                    <img
                      src="/images/ecocash-logo.png"
                      alt="EcoCash"
                      className="h-4.5 max-w-[80px] w-auto object-contain"
                    />
                  </div>
                  {paymentOption === 'ecocash' && <Check className="h-3.5 w-3.5 text-[#082869]" />}
                </div>
                <div className="mt-2">
                  <span className="block text-xs font-black text-[#082869]">EcoCash</span>
                  <span className="text-[10px] text-gray-500">USD & ZWG</span>
                </div>
              </button>

              {/* Option 2: InnBucks */}
              <button
                type="button"
                onClick={() => setPaymentOption('innbucks')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  paymentOption === 'innbucks'
                    ? 'border-[#082869] bg-[#edf2fb] ring-2 ring-[#082869]/20 shadow-xs'
                    : 'border-[#e4e7eb] hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="h-6 flex items-center">
                    <img
                      src="/images/innbucks-wordmark.png"
                      alt="InnBucks"
                      className="h-4.5 max-w-[82px] w-auto object-contain rounded-xs shadow-2xs"
                    />
                  </div>
                  {paymentOption === 'innbucks' && <Check className="h-3.5 w-3.5 text-[#082869]" />}
                </div>
                <div className="mt-2">
                  <span className="block text-xs font-black text-[#082869]">InnBucks</span>
                  <span className="text-[10px] text-gray-500">Wallet / QR</span>
                </div>
              </button>

              {/* Option 3: Card */}
              <button
                type="button"
                onClick={() => setPaymentOption('card')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  paymentOption === 'card'
                    ? 'border-[#082869] bg-[#edf2fb] ring-2 ring-[#082869]/20 shadow-xs'
                    : 'border-[#e4e7eb] hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  {paymentOption === 'card' && <Check className="h-3.5 w-3.5 text-[#082869]" />}
                </div>
                <div className="mt-2">
                  <span className="block text-xs font-black text-[#082869]">Bank Card</span>
                  <span className="text-[10px] text-gray-500">Visa / Mastercard</span>
                </div>
              </button>

              {/* Option 4: Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentOption('cash')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  paymentOption === 'cash'
                    ? 'border-[#082869] bg-[#edf2fb] ring-2 ring-[#082869]/20 shadow-xs'
                    : 'border-[#e4e7eb] hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  {paymentOption === 'cash' && <Check className="h-3.5 w-3.5 text-[#082869]" />}
                </div>
                <div className="mt-2">
                  <span className="block text-xs font-black text-[#082869]">Cash / POS</span>
                  <span className="text-[10px] text-gray-500">On Delivery</span>
                </div>
              </button>

              {/* Option 5: ZIPIT / Transfer */}
              <button
                type="button"
                onClick={() => setPaymentOption('zipit')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  paymentOption === 'zipit'
                    ? 'border-[#082869] bg-[#edf2fb] ring-2 ring-[#082869]/20 shadow-xs'
                    : 'border-[#e4e7eb] hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <QrCode className="h-5 w-5 text-purple-600" />
                  {paymentOption === 'zipit' && <Check className="h-3.5 w-3.5 text-[#082869]" />}
                </div>
                <div className="mt-2">
                  <span className="block text-xs font-black text-[#082869]">ZIPIT / EFT</span>
                  <span className="text-[10px] text-gray-500">Bank Transfer</span>
                </div>
              </button>
            </div>

            {/* Payment Details Drawer per Method */}
            <div className="mt-5 rounded-xl border border-[#dfe3e8] bg-[#f8faff] p-4 sm:p-5">
              {/* 1. EcoCash Details */}
              {paymentOption === 'ecocash' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <img src="/images/ecocash-logo.png" alt="EcoCash" className="h-5 w-auto object-contain" />
                      <strong className="text-xs sm:text-sm text-[#082869]">Express Push Prompt</strong>
                    </div>
                    {/* Currency selector */}
                    <div className="flex items-center gap-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setEcoCurrency('USD')}
                        className={`px-3 py-1 rounded-md font-bold text-xs transition ${
                          ecoCurrency === 'USD' ? 'bg-[#082869] text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        USD ($)
                      </button>
                      <button
                        type="button"
                        onClick={() => setEcoCurrency('ZWG')}
                        className={`px-3 py-1 rounded-md font-bold text-xs transition ${
                          ecoCurrency === 'ZWG' ? 'bg-[#082869] text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        ZWG (Zig)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ecoPhone" className="form-label">
                      EcoCash Registered Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        id="ecoPhone"
                        type="tel"
                        value={ecoPhone}
                        onChange={(e) => setEcoPhone(e.target.value)}
                        placeholder="077 ... or 078 ..."
                        className="form-field pl-9 text-xs sm:text-sm font-medium"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-gray-500">
                      You will receive a pop-up on your phone requesting your EcoCash PIN to authorize{' '}
                      <strong>{ecoCurrency === 'USD' ? formatCurrency(total) : `ZWG ${(total * 26.5).toFixed(2)}`}</strong>.
                    </p>
                  </div>

                  {/* Interactive Push Simulation Button */}
                  {ecoStatus === 'idle' && (
                    <button
                      type="button"
                      onClick={handleTriggerEcoPrompt}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#082869] hover:bg-[#061e50] text-white px-5 py-2.5 text-xs font-bold transition shadow-xs w-full sm:w-auto"
                    >
                      <Smartphone className="h-4 w-4" /> Send Payment Prompt to Phone
                    </button>
                  )}

                  {ecoStatus === 'prompting' && (
                    <div className="flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-900">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600 shrink-0" />
                      <div>
                        <strong>Push prompt sent to {ecoPhone || 'mobile'}!</strong>
                        <p className="text-[11px] text-blue-700">Check phone and enter PIN... ({ecoCountdown}s)</p>
                      </div>
                    </div>
                  )}

                  {ecoStatus === 'confirmed' && (
                    <div className="flex items-center gap-3 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <div>
                        <strong>Payment Authorized! (Ref: #EC-99382)</strong>
                        <p className="text-[11px] text-emerald-700">Funds reserved. Order will be marked paid upon submitting.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. InnBucks Details */}
              {paymentOption === 'innbucks' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3">
                    <img src="/images/innbucks-wordmark.png" alt="InnBucks" className="h-5 w-auto object-contain rounded-xs shadow-2xs" />
                    <strong className="text-xs sm:text-sm text-[#082869]">Instant Checkout</strong>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="innbucksNumber" className="form-label">
                        InnBucks Mobile Number
                      </label>
                      <input
                        id="innbucksNumber"
                        type="tel"
                        value={innbucksNumber}
                        onChange={(e) => setInnbucksNumber(e.target.value)}
                        placeholder="077... or account ID"
                        className="form-field text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="innbucksAuthCode" className="form-label">
                        Express Authorization Code <span className="text-[10px] text-gray-400">(Optional)</span>
                      </label>
                      <input
                        id="innbucksAuthCode"
                        type="text"
                        value={innbucksAuthCode}
                        onChange={(e) => setInnbucksAuthCode(e.target.value)}
                        placeholder="From your InnBucks App"
                        className="form-field text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    You can also scan our in-store InnBucks QR code upon delivery or collection.
                  </p>
                </div>
              )}

              {/* 3. Card Details */}
              {paymentOption === 'card' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <strong className="text-xs sm:text-sm text-[#082869]">Debit or Credit Card</strong>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                      <span className="border border-gray-300 rounded px-1">VISA</span>
                      <span className="border border-gray-300 rounded px-1">Mastercard</span>
                      <span className="border border-gray-300 rounded px-1">Zimswitch</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cardHolder" className="form-label">
                      Cardholder Name
                    </label>
                    <input
                      id="cardHolder"
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name on card"
                      className="form-field text-xs sm:text-sm"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label htmlFor="cardNumber" className="form-label">
                        Card Number
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                          setCardNumber(val);
                        }}
                        placeholder="4444 0000 1234 5678"
                        className="form-field text-xs sm:text-sm font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="cardExpiry" className="form-label">
                          MM / YY
                        </label>
                        <input
                          id="cardExpiry"
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="08/27"
                          className="form-field text-xs sm:text-sm text-center font-mono"
                        />
                      </div>
                      <div>
                        <label htmlFor="cardCvv" className="form-label">
                          CVV
                        </label>
                        <input
                          id="cardCvv"
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="form-field text-xs sm:text-sm text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {!cardVerified ? (
                    <button
                      type="button"
                      onClick={handleVerifyCard}
                      disabled={cardSimulating}
                      className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#082869] text-white px-4 py-2 text-xs font-bold hover:bg-[#061e50] transition"
                    >
                      {cardSimulating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
                      {cardSimulating ? 'Verifying with bank...' : 'Verify Card'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Card verified securely. Ready to complete checkout.</span>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Cash / POS on Delivery */}
              {paymentOption === 'cash' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <strong className="text-xs sm:text-sm text-[#082869]">Pay When Your Cuts Arrive</strong>
                  </div>
                  <p className="text-xs text-gray-600">
                    Please specify your cash tender so our delivery driver or counter staff has the correct change prepared:
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 text-xs">
                    {[
                      { id: 'exact', label: `Exact ($${total.toFixed(2)})` },
                      { id: '20', label: 'Change for $20' },
                      { id: '50', label: 'Change for $50' },
                      { id: '100', label: 'Change for $100' },
                      { id: 'swipe', label: 'Bring POS Swipe' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCashChange(opt.id as any)}
                        className={`p-2.5 rounded-lg border text-center font-bold transition ${
                          cashChange === opt.id
                            ? 'border-[#082869] bg-[#082869] text-white shadow-2xs'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. ZIPIT / EFT */}
              {paymentOption === 'zipit' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3">
                    <QrCode className="h-4 w-4 text-purple-600" />
                    <strong className="text-xs sm:text-sm text-[#082869]">Direct Bank Transfer / ZIPIT</strong>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 text-[11px] text-gray-700">
                    <div className="rounded-lg bg-white p-3 border border-gray-200">
                      <strong className="block text-[#082869]">CABS Bank (USD & ZWG)</strong>
                      <span>Account: 1102948192</span>
                      <span className="block text-gray-500">Branch: Jason Moyo, Bulawayo</span>
                    </div>
                    <div className="rounded-lg bg-white p-3 border border-gray-200">
                      <strong className="block text-[#082869]">Stanbic Bank (USD)</strong>
                      <span>Account: 914000384729</span>
                      <span className="block text-gray-500">Branch: Main Street, Bulawayo</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Please use your Order Number or Mobile Number as the payment reference.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Step 4: Notes & Preferences */}
          <section className="paper-card p-4 sm:p-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#082869] text-xs font-black text-white shrink-0">
                4
              </span>
              <div>
                <h2 className="text-base font-extrabold text-[#082869]">Butcher instructions & timing</h2>
                <p className="mt-0.5 text-xs text-[#8993a0]">Let us know how you want your cuts prepared.</p>
              </div>
            </div>

            <label htmlFor="cuttingNote" className="form-label">
              Cutting or packing instructions <span className="font-normal text-[#8993a0]">(optional)</span>
            </label>
            <textarea
              id="cuttingNote"
              rows={3}
              value={cuttingNote}
              onChange={(event) => setCuttingNote(event.target.value)}
              placeholder="e.g. Portion beef mince into 500g vacuum packs; cut ribs into finger lengths..."
              className="form-field min-h-[80px] resize-y text-xs sm:text-sm"
            />

            <div className="mt-4">
              <label htmlFor="deliverySlot" className="form-label flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5 text-[#082869]" /> Preferred delivery / pickup window
              </label>
              <select
                id="deliverySlot"
                value={deliverySlot}
                onChange={(event) => setDeliverySlot(event.target.value)}
                className="form-field text-xs sm:text-sm"
              >
                <option>Morning · 08:00–12:00</option>
                <option>Afternoon · 13:00–17:00</option>
                <option>Express Same-Day (Within 2 Hours)</option>
              </select>
            </div>
          </section>
        </div>

        {/* Sidebar Order Summary */}
        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className="paper-card p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-[#e8eaed] pb-4">
              <h2 className="font-display text-2xl text-[#082869]">Your basket</h2>
              <span className="rounded-full bg-[#edf2fb] px-2.5 py-1 text-[10px] font-extrabold text-[#506074]">
                {cart.itemCount} items
              </span>
            </div>

            <div className="max-h-[220px] space-y-3 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.image} alt="" className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs font-bold text-[#34465c]">{item.name}</p>
                    <p className="mt-0.5 text-[10px] text-[#8993a0]">
                      {item.quantity} × {item.selectedVariant?.label || item.unit}
                    </p>
                  </div>
                  <strong className="shrink-0 text-xs text-[#082869]">
                    {formatCurrency(item.price * item.quantity)}
                  </strong>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-[#e8eaed] pt-4 text-xs text-[#687789]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <strong className="text-[#34465c]">{formatCurrency(cart.subtotal)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Fulfilment ({fulfilmentMethod === 'collection' ? 'Collection' : 'Delivery'})</span>
                <strong className={deliveryFee === 0 ? 'text-[#318052]' : 'text-[#34465c]'}>
                  {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                </strong>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between border-t border-[#e8eaed] pt-4">
              <span className="text-sm font-extrabold text-[#082869]">Total Amount</span>
              <strong className="text-2xl font-black text-[#ed1c2e]">{formatCurrency(total)}</strong>
            </div>

            <p className="mt-1 text-right text-[10px] text-[#8993a0]">
              USD · {paymentOption === 'ecocash' ? `EcoCash (${ecoCurrency})` : paymentOption.toUpperCase()}
            </p>

            <button type="submit" className="btn-primary mt-5 w-full flex items-center justify-center gap-2 py-3.5 text-sm">
              Confirm & Book Order <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-3 flex items-start gap-2 text-[10px] leading-4 text-[#8993a0]">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#082869]" />
              Order syncs instantly across our Staff, Butcher and Driver Dashboards for priority preparation.
            </p>
          </section>

          <div className="flex items-start gap-3 rounded-xl bg-[#edf3f8] p-4 text-xs leading-5 text-[#506074]">
            <Snowflake className="mt-0.5 h-4 w-4 shrink-0 text-[#082869]" />
            <span>Vacuum sealed and chilled to 2°C with certified food-grade insulation packs.</span>
          </div>
        </aside>
      </form>
    </div>
  );
};
