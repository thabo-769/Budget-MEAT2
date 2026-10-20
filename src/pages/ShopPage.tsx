import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, RotateCcw, ArrowRight, MessageCircle, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/Products/ProductCard';

const categories = [
  { label: 'Everything', value: 'all' },
  { label: 'Beef', value: 'beef' },
  { label: 'Chicken', value: 'chicken' },
  { label: 'Pork', value: 'pork' },
  { label: 'Lamb', value: 'lamb' },
  { label: 'Mince', value: 'mince' },
  { label: 'Wors & sausages', value: 'sausages' },
  { label: 'Offals', value: 'offal' },
  { label: 'Fish', value: 'other' },
  { label: 'Family bundles', value: 'packs' },
];
const MAX_PRICE = 50;

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSearchQuery(searchParams.get('search') || '');
    setCurrentPage(1);
  }, [searchParams]);

  const chooseCategory = (category: string) => {
    setSelectedCategory(category);
    const next = new URLSearchParams(searchParams);
    if (category === 'all') next.delete('category'); else next.set('category', category);
    const search = searchQuery.trim();
    if (search) next.set('search', search); else next.delete('search');
    setSearchParams(next);
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);
    const search = searchQuery.trim();
    if (search) next.set('search', search); else next.delete('search');
    setSearchParams(next, { replace: true });
  };

  const clearSearch = () => {
    setSearchQuery('');
    const next = new URLSearchParams(searchParams);
    next.delete('search');
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMaxPrice(MAX_PRICE);
    setInStockOnly(false);
    setSortBy('popular');
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => products.filter((product) => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    const search = searchQuery.trim().toLowerCase();
    if (search && !product.name.toLowerCase().includes(search) && !product.description.toLowerCase().includes(search) && !product.tags?.some((tag) => tag.toLowerCase().includes(search))) return false;
    if (maxPrice < MAX_PRICE && (product.salePrice ?? product.price) > maxPrice) return false;
    if (inStockOnly && product.stockStatus === 'out_of_stock') return false;
    return true;
  }).sort((a, b) => {
    const priceA = a.salePrice ?? a.price;
    const priceB = b.salePrice ?? b.price;
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return Number(Boolean(b.isPopular)) - Number(Boolean(a.isPopular));
  }), [selectedCategory, searchQuery, maxPrice, inStockOnly, sortBy]);

  const pageSize = 9;
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pageProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => setCurrentPage(1), [selectedCategory, searchQuery, maxPrice, inStockOnly, sortBy]);
  useEffect(() => setCurrentPage((page) => Math.min(page, pageCount)), [pageCount]);

  return (
    <div className="min-h-[70vh] bg-[#f6f9ff] pb-16">
      <section className="relative overflow-hidden text-white" aria-label="Fresh meat cuts">
        <img
          src="/images/hero_steak.jpg"
          alt="Fresh butcher steak"
          className="absolute inset-0 h-full w-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#082869] via-[#082869] via-35% sm:via-48% to-transparent" />
        <div className="page-shell relative py-12 sm:py-16">
          <p className="eyebrow mb-3 !text-[#ed1c2e]">Fresh from our butchers</p>
          <h1 className="font-display max-w-xl text-4xl leading-tight sm:text-5xl text-white">
            Your next good meal starts here.
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-white/90 sm:text-base">
            Browse the cuts, everyday favourites and family bundles our Bulawayo team prepares with care.
          </p>
        </div>
      </section>

      <div className="page-shell">
        <div className="py-7 sm:py-9">
          <form role="search" onSubmit={submitSearch} className="flex min-h-12 items-center gap-3 rounded-md border border-[#dfe3e8] bg-white px-4 shadow-[0_2px_9px_rgba(8,40,105,.03)] focus-within:border-[#082869]">
            <Search className="h-[18px] w-[18px] shrink-0 text-[#738094]" />
            <input aria-label="Search meat cuts" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search steak, mince, chicken, bundles..." className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#98a1ab]" />
            {searchQuery && <button type="button" onClick={clearSearch} aria-label="Clear search" className="text-[#758295] hover:text-[#ed1c2e]"><X className="h-4 w-4" /></button>}
            <button type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen} className="inline-flex h-9 items-center gap-2 rounded border border-[#e2e5e9] px-3 text-xs font-bold text-[#34465c] transition hover:border-[#082869] sm:hidden"><SlidersHorizontal className="h-4 w-4" />Filters</button>
          </form>

          <div className="scrollbar-hide mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="Product categories">
            {categories.map((category) => <button key={category.value} type="button" onClick={() => chooseCategory(category.value)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${selectedCategory === category.value ? 'border-[#082869] bg-[#082869] text-white' : 'border-[#dfe3e8] bg-white text-[#506074] hover:border-[#082869] hover:text-[#082869]'}`}>{category.label}</button>)}
          </div>
        </div>

        <div className="grid items-start gap-7 lg:grid-cols-[220px_1fr]">
          <aside className={`${filtersOpen ? 'block' : 'hidden'} space-y-6 rounded-md border border-[#e6e8eb] bg-white p-5 lg:sticky lg:top-36 lg:block`}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-[#082869]">Refine your shop</h2>
              <button onClick={clearFilters} type="button" className="text-[11px] font-bold text-[#ed1c2e] hover:underline">Reset</button>
            </div>
            <div>
              <label htmlFor="price-range" className="mb-3 flex items-center justify-between text-xs font-bold text-[#405168]">Maximum price <span className="text-[#ed1c2e]">{maxPrice === MAX_PRICE ? '$50+' : `$${maxPrice}`}</span></label>
              <input id="price-range" type="range" min="5" max="50" step="1" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="w-full accent-[#ed1c2e]" />
              <div className="flex justify-between text-[10px] text-[#8993a0]"><span>$5</span><span>$50+</span></div>
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 border-t border-[#edf0f2] pt-5 text-xs font-semibold text-[#405168]">
              <input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} className="h-4 w-4 accent-[#ed1c2e]" />
              Show available cuts only
            </label>
            <div className="border-t border-[#edf0f2] pt-5">
              <label htmlFor="shop-sort" className="form-label">Sort by</label>
              <select id="shop-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="form-field !min-h-10 !py-2 text-xs">
                <option value="popular">Most popular</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option>
              </select>
            </div>
          </aside>

          <main>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div><p className="eyebrow mb-1">Our counter</p><h2 className="font-display text-3xl text-[#082869]">{categories.find((category) => category.value === selectedCategory)?.label || 'Fresh cuts'}</h2></div>
              <p aria-live="polite" className="text-xs font-medium text-[#788494]">{filteredProducts.length} {filteredProducts.length === 1 ? 'cut' : 'cuts'} to explore</p>
            </div>

            {pageProducts.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">{pageProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : (
              <div className="paper-card px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf2fb] text-[#082869]"><Search className="h-6 w-6" /></div>
                <h3 className="font-display mt-4 text-2xl text-[#082869]">Nothing on the counter just yet</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#758295]">Try another cut, clear a filter or search for a different favourite.</p>
                <button type="button" onClick={clearFilters} className="btn-primary mt-5"><RotateCcw className="h-4 w-4" />Clear filters</button>
              </div>
            )}

            {filteredProducts.length > pageSize && <nav aria-label="Shop pages" className="mt-9 flex justify-center gap-2">
              <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} aria-label="Previous page" className="flex h-10 w-10 items-center justify-center rounded border border-[#e1e5e9] text-[#082869] disabled:opacity-35"><ChevronLeft className="h-4 w-4" /></button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => <button key={page} type="button" onClick={() => setCurrentPage(page)} aria-current={currentPage === page ? 'page' : undefined} className={`h-10 w-10 rounded text-xs font-extrabold ${page === currentPage ? 'bg-[#082869] text-white' : 'border border-[#e1e5e9] text-[#405168] hover:border-[#082869]'}`}>{page}</button>)}
              <button type="button" onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} disabled={currentPage === pageCount} aria-label="Next page" className="flex h-10 w-10 items-center justify-center rounded border border-[#e1e5e9] text-[#082869] disabled:opacity-35"><ChevronRight className="h-4 w-4" /></button>
            </nav>}
          </main>
        </div>
      </div>

      <section className="page-shell mt-12 sm:mt-16" aria-labelledby="shop-guide-title">
        <div className="mb-6 max-w-2xl"><p className="eyebrow mb-2">A simple way to order</p><h2 id="shop-guide-title" className="section-heading">From our counter to your kitchen.</h2><p className="mt-2 text-sm leading-6 text-[#536783]">Choose your cuts, tell us how you would like them prepared and pick a convenient way to receive your order.</p></div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[{ icon: Search, title: '1. Find your favourites', detail: 'Browse categories, compare pack sizes and add the cuts you need to your basket.' }, { icon: MessageCircle, title: '2. Add a butcher’s note', detail: 'Share a preparation request or question at checkout so the team can confirm the details.' }, { icon: Store, title: '3. Choose how to get it', detail: 'Select collection from a branch or delivery, then confirm your order with the shop.' }].map(({ icon: Icon, title, detail }) => <article key={title} className="rounded-2xl border border-[#e4eaf4] bg-white p-5 sm:p-6"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2fb] text-[#082869]"><Icon className="h-5 w-5" /></span><h3 className="mt-4 text-sm font-extrabold text-[#082869]">{title}</h3><p className="mt-2 text-xs leading-5 text-[#687789]">{detail}</p></article>)}
        </div>
        <div className="mt-5 flex flex-col justify-between gap-4 rounded-2xl bg-[#082869] p-5 text-white sm:flex-row sm:items-center sm:p-6"><div><p className="text-sm font-extrabold">Need inspiration for tonight?</p><p className="mt-1 text-xs leading-5 text-white/70">Read meal ideas and butcher’s tips from our team.</p></div><Link to="/blog" className="inline-flex min-h-10 w-fit shrink-0 items-center gap-2 rounded-full bg-white px-4 text-xs font-extrabold text-[#082869] hover:bg-[#edf2fb]">Visit the blog <ArrowRight className="h-4 w-4" /></Link></div>
      </section>
    </div>
  );
};
