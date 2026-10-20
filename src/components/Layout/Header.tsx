import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Beef, ChevronDown, Menu, Search, ShoppingCart, UserRound, X } from 'lucide-react';
import CustomerBrandMark from '../Shared/CustomerBrandMark';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Customer', href: '/#customer-reviews' },
  { label: 'Contact', href: '/contact' },
];

const moreLinks = [
  { label: 'Weekly specials', href: '/specials' },
  { label: 'Family bundles', href: '/shop?category=packs' },
  { label: 'Find a branch', href: '/branches' },
  { label: 'FAQs', href: '/faq' },
];

export default function Header() {
  const { cart, openCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [query, setQuery] = useState(new URLSearchParams(location.search).get('search') || '');
  const isMoreActive = moreLinks.some((link) => {
    const [pathname, queryString] = link.href.split('?');
    if (location.pathname !== pathname) return false;
    if (!queryString) return true;
    const currentParams = new URLSearchParams(location.search);
    return [...new URLSearchParams(queryString)].every(([key, value]) => currentParams.get(key) === value);
  });

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setMoreMenuOpen(false);
    setUserMenuOpen(false);
    setQuery(new URLSearchParams(location.search).get('search') || '');
    if (location.hash) window.setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' }), 80);
  }, [location.pathname, location.search, location.hash]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    setSearchOpen(false);
    navigate(value ? `/shop?search=${encodeURIComponent(value)}` : '/shop');
  };

  const isActive = (href: string) => {
    if (href === '/#customer-reviews') return location.pathname === '/' && location.hash === '#customer-reviews';
    if (href === '/') return location.pathname === '/' && !location.hash;
    if (href === '/blog') return location.pathname === '/blog' || location.pathname.startsWith('/blog/');
    return location.pathname === href;
  };

  const searchForm = (mobile = false) => (
    <form onSubmit={submitSearch} role="search" className={`flex h-11 items-center rounded-full border border-[#dfe5ee] bg-white px-4 shadow-sm focus-within:border-[#082869] ${mobile ? 'w-full' : 'w-full max-w-[560px]'}`}>
      <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-[#082869]" />
      <input
        aria-label="Search cuts and bundles"
        className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[#172638] outline-none placeholder:text-[#8994a1]"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search cuts, bundles and specials..."
        autoFocus
      />
      <button className="text-xs font-extrabold text-[#ed1c2e]" type="submit">Search</button>
    </form>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-[#e6eaf0] bg-white/98 text-[#172638] shadow-[0_4px_18px_rgba(8,40,105,.06)] backdrop-blur-md">
      <div className="page-shell flex min-h-[76px] items-center justify-between gap-4 py-2.5">
        <Link to="/" aria-label="Budget Meat Shop home" className="shrink-0">
          <CustomerBrandMark className="h-[54px] w-auto sm:h-[62px]" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.href} className={`relative flex h-[76px] items-center text-[13px] font-extrabold transition-colors ${isActive(link.href) ? 'text-[#ed1c2e]' : 'text-[#102b61] hover:text-[#ed1c2e]'}`}>
              {link.label}
              <span className={`absolute inset-x-0 bottom-3 h-[2px] bg-[#ed1c2e] transition-transform ${isActive(link.href) ? 'scale-x-100' : 'scale-x-0'}`} />
            </Link>
          ))}
          <div className="relative flex h-[76px] items-center">
            <button type="button" onClick={() => setMoreMenuOpen((open) => !open)} aria-expanded={moreMenuOpen} aria-controls="customer-more-menu" className={`inline-flex items-center gap-1 text-[13px] font-extrabold transition-colors ${moreMenuOpen || isMoreActive ? 'text-[#ed1c2e]' : 'text-[#102b61] hover:text-[#ed1c2e]'}`}>
              More <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {moreMenuOpen && <div id="customer-more-menu" className="absolute right-0 top-[calc(100%-8px)] z-50 w-52 rounded-xl border border-[#e3e9f2] bg-white p-2 shadow-[0_14px_35px_rgba(8,40,105,.16)]">
              {moreLinks.map((link) => <Link key={link.label} to={link.href} onClick={() => setMoreMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-bold text-[#102b61] transition hover:bg-[#f1f5fc] hover:text-[#ed1c2e]">{link.label}</Link>)}
            </div>}
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button type="button" onClick={() => setSearchOpen((open) => !open)} aria-label={searchOpen ? 'Close search' : 'Open search'} aria-expanded={searchOpen} className="flex h-10 w-10 items-center justify-center rounded-full text-[#082869] transition hover:bg-[#eff3f9] hover:text-[#ed1c2e]">
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
          <div className="relative hidden sm:flex">
            <button
              type="button"
              id="user-menu-btn"
              aria-label={user ? `${user.firstName}'s account` : 'Sign in'}
              aria-expanded={userMenuOpen}
              aria-controls="user-menu"
              onClick={() => setUserMenuOpen((open) => !open)}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-[#082869] transition hover:bg-[#eff3f9] hover:text-[#ed1c2e] ${userMenuOpen ? 'bg-[#eff3f9] text-[#ed1c2e]' : ''}`}
            >
              <UserRound className="h-5 w-5" />
            </button>
            {userMenuOpen && (
              <div
                id="user-menu"
                role="menu"
                className="absolute right-0 top-[calc(100%+6px)] z-50 w-52 overflow-hidden rounded-xl border border-[#e3e9f2] bg-white shadow-[0_14px_35px_rgba(8,40,105,.18)]"
              >
                {/* My account */}
                <div className="border-b border-[#eef1f7] px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8994a1]">My Account</p>
                </div>
                <Link
                  to={user ? '/account' : '/login'}
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold text-[#102b61] transition hover:bg-[#f1f5fc] hover:text-[#ed1c2e]"
                >
                  <UserRound className="h-4 w-4 shrink-0" />
                  {user ? 'My account' : 'Sign in / Join'}
                </Link>

                {/* Staff dashboards */}
                <div className="border-t border-[#eef1f7] px-3 pb-1 pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8994a1]">Staff Dashboards</p>
                </div>
                <Link
                  to="/admin"
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold text-[#102b61] transition hover:bg-[#f1f5fc] hover:text-[#ed1c2e]"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
                  Admin Dashboard
                </Link>
                <Link
                  to="/supplier"
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold text-[#102b61] transition hover:bg-[#f1f5fc] hover:text-[#ed1c2e]"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4"/><circle cx="7" cy="16" r="1"/><circle cx="17" cy="16" r="1"/></svg>
                  Supplier Dashboard
                </Link>
                <Link
                  to="/driver"
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 pb-3 py-2.5 text-sm font-bold text-[#102b61] transition hover:bg-[#f1f5fc] hover:text-[#ed1c2e]"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 6v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  Driver Dashboard
                </Link>
              </div>
            )}
          </div>
          <button type="button" onClick={openCart} aria-label={`Open basket, ${cart.itemCount} items`} className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#082869] transition hover:bg-[#eff3f9] hover:text-[#ed1c2e] sm:h-11 sm:w-11">
            <ShoppingCart className="h-[21px] w-[21px]" />
            <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ed1c2e] px-1 text-[9px] font-black text-white">{cart.itemCount}</span>
          </button>
          <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4e7eb] text-[#082869] lg:hidden" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-[#edf0f4] bg-[#f8faff] px-3 py-3 sm:px-6">
          <div className="page-shell flex justify-end w-full">{searchForm(true)}</div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="border-t border-[#e9ebee] bg-white px-4 pb-6 pt-3 shadow-xl lg:hidden">
          <nav className="mx-auto flex max-w-xl flex-col" aria-label="Mobile navigation">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#eef0f2]">
              <Link
                to={user ? '/account' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl bg-[#f1f5fc] p-2.5 text-xs font-bold text-[#082869]"
              >
                <UserRound className="h-4 w-4 text-[#ed1c2e]" />
                <span>{user ? 'My Account' : 'Sign in / Join'}</span>
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl bg-[#f1f5fc] p-2.5 text-xs font-bold text-[#082869]"
              >
                <ShoppingCart className="h-4 w-4 text-[#ed1c2e]" />
                <span>Cart ({cart.itemCount})</span>
              </Link>
            </div>

            <div className="py-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#8994a1] mb-1">Navigation</p>
              <div className="grid grid-cols-2 gap-1 text-xs font-bold text-[#102b61]">
                {[...navLinks, ...moreLinks].map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2 px-2 rounded-lg transition ${isActive(link.href) ? 'text-[#ed1c2e] bg-red-50' : 'hover:bg-gray-50'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#eef0f2]">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#8994a1] mb-2">Staff & Partner Dashboards</p>
              <div className="space-y-1.5">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 bg-[#f8faff] text-xs font-bold text-[#082869]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="h-6 w-6 rounded-md bg-[#082869] text-white flex items-center justify-center font-bold text-[10px]">A</span>
                    <span>Admin Control Dashboard</span>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-red-50 text-[#ed1c2e] px-2 py-0.5 rounded-full">Live</span>
                </Link>

                <Link
                  to="/supplier"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 bg-[#f8faff] text-xs font-bold text-[#082869]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="h-6 w-6 rounded-md bg-[#082869] text-white flex items-center justify-center font-bold text-[10px]">S</span>
                    <span>Supplier Partner Portal</span>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-blue-50 text-[#082869] px-2 py-0.5 rounded-full">Abattoir</span>
                </Link>

                <Link
                  to="/driver"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 bg-[#f8faff] text-xs font-bold text-[#082869]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="h-6 w-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">D</span>
                    <span>Driver Van Dispatch</span>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">Route GPS</span>
                </Link>
              </div>
            </div>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#ed1c2e] py-3 text-xs font-extrabold text-white shadow-sm"
            >
              Talk to your butcher <Beef className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
