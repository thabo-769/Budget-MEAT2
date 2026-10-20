import { ArrowRight, BadgeDollarSign, Check, ShoppingCart, Leaf, ShieldCheck, Truck, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroBanner } from '../components/Home/HeroBanner';
import { FeaturedProducts } from '../components/Home/FeaturedProducts';
import { CustomerReviews } from '../components/Home/CustomerReviews';
import { PopularCategories } from '../components/Home/PopularCategories';
import { BranchSection } from '../components/Home/BranchSection';

const promises = [
  { icon: ShieldCheck, title: 'Quality you can trust', detail: 'Good cuts, prepared with care.', color: 'red' },
  { icon: Leaf, title: 'Fresh & natural', detail: 'Fresh favourites for every table.', color: 'blue' },
  { icon: Truck, title: 'Friendly service', detail: 'Collection or delivery to suit you.', color: 'red' },
  { icon: BadgeDollarSign, title: 'Great value', detail: 'Fair prices on everyday cuts.', color: 'blue' },
  { icon: UsersRound, title: 'A local favourite', detail: 'Proud to serve Bulawayo families.', color: 'red' },
];

export const HomePage = () => (
  <div>
    <HeroBanner />

    <section className="border-b border-[#e4eaf4] bg-white py-5 sm:py-6" aria-label="Why shop with Budget Meat Shop">
      <div className="page-shell grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0">
        {promises.map(({ icon: Icon, title, detail, color }, index) => (
          <div key={title} className={`flex flex-col items-center px-3 text-center last:col-span-2 sm:last:col-span-1 ${index > 0 ? 'lg:border-l lg:border-[#b8c8e3]' : ''}`}>
            <span className={`mb-2 flex h-11 w-11 items-center justify-center rounded-full text-white shadow-sm ${color === 'red' ? 'bg-[#ed1c2e]' : 'bg-[#082f83]'}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-xs font-extrabold text-[#082869] sm:text-sm">{title}</h2>
            <p className="mt-1 text-[10px] leading-4 text-[#25416e] sm:text-[11px]">{detail}</p>
          </div>
        ))}
      </div>
    </section>

    <section id="about-us" className="relative overflow-hidden bg-[#f8faff] py-6 sm:py-8" aria-labelledby="about-home-title">
      <div className="page-shell grid items-center gap-6 lg:grid-cols-[.95fr_1.15fr] lg:gap-10">
        <div className="relative min-h-[240px] overflow-hidden rounded-xl sm:min-h-[260px] lg:min-h-[245px]">
          <img src="/images/category_beef.jpg" alt="Fresh beef cuts ready for the family table" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071d4e]/85 to-transparent p-5 pt-20 text-white sm:p-6 sm:pt-24">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-white/80">From our counter to your kitchen</p>
            <p className="font-display mt-1 text-2xl sm:text-3xl">Fresh meat. Happier meals.</p>
          </div>
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.08em] text-[#082869]">Since day one · Local & proud</span>
        </div>

        <div className="relative z-10 py-2 lg:py-5">
          <p className="eyebrow mb-2 flex items-center gap-2 text-[#082869]"><span className="h-0.5 w-7 bg-[#ed1c2e]" /> About us</p>
          <h2 id="about-home-title" className="font-sans text-[clamp(2.15rem,4vw,3.35rem)] font-black leading-[1.02] tracking-[-.04em] text-[#082869]">
            Welcome to <span className="text-[#ed1c2e]">Budget Meat Shop</span>
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#18365f] sm:text-[15px] sm:leading-7">
            We are your neighbourhood butcher in Bulawayo, bringing good-quality meat and everyday value to family tables. Choose your favourite cuts online, then collect from a branch or arrange delivery.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {['Fresh favourites for every meal', 'An easy, helpful way to shop', 'Collection and delivery options', 'Local branches across Bulawayo'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs font-semibold text-[#18365f] sm:text-sm"><Check className="h-4 w-4 shrink-0 rounded-full bg-[#ed1c2e] p-0.5 text-white" />{item}</li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
            <Link to="/about" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#082869] px-5 text-xs font-extrabold text-[#082869] transition hover:bg-[#082869] hover:text-white">Our story <ArrowRight className="h-4 w-4" /></Link>
            <p className="rotate-[-5deg] pr-6 font-serif text-2xl font-bold italic leading-[.88] text-[#082869] sm:text-3xl">Good meat.<br />Good life.<span className="mt-1 block h-1 w-20 rotate-[-6deg] rounded-full bg-[#ed1c2e]" /></p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute -right-32 bottom-[-18px] hidden h-32 w-44 rounded-tl-[100%] border-l-[12px] border-t-[12px] border-[#ed1c2e] opacity-90 lg:block" />
    </section>

    <PopularCategories />
    <FeaturedProducts />
    <CustomerReviews />
    <BranchSection />

    <section className="relative isolate overflow-hidden bg-[#ed1c2e] text-white" aria-label="Shop fresh meat online">
      <img src="/images/weekly_specials_banner.jpg" alt="Steak grilling over an open flame" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-[#c7192a]/50" />
      <div className="absolute -left-24 -top-14 -z-10 h-[calc(100%+7rem)] w-[calc(100%+12rem)] bg-[#082869]/88 sm:w-[71%] sm:bg-[#082869] sm:rounded-r-[48%] sm:shadow-[18px_0_0_rgba(255,255,255,.94),28px_0_0_7px_#ed1c2e] lg:w-[65%]" />
      <div className="page-shell relative grid min-h-[200px] items-center gap-6 py-8 sm:min-h-[220px] sm:grid-cols-[auto_1fr_auto] sm:py-10">
        <span className="hidden h-16 w-16 items-center justify-center rounded-full border border-white/45 bg-white/10 sm:flex"><ShoppingCart className="h-9 w-9" /></span>
        <div className="max-w-xl">
          <p className="eyebrow !text-[#ffc7ca]">Good food starts here</p>
          <h2 className="mt-1 font-sans text-3xl font-black leading-tight tracking-[-.035em] sm:text-4xl">Shop fresh, eat better.</h2>
          <p className="mt-1 text-sm text-white/85 sm:text-base">Pick your cuts online. We’ll get them ready for you.</p>
        </div>
        <Link to="/shop" className="inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-full bg-[#ed1c2e] px-6 text-xs font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#c91525]">Shop now <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  </div>
);
