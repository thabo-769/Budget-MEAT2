import { ArrowRight, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroBanner = () => (
  <section className="relative isolate min-h-[470px] overflow-hidden bg-[#082869] text-white sm:min-h-[500px] lg:min-h-[350px]" aria-labelledby="home-hero-title">
    <img
      src="/images/customer-service-hero.jpg"
      alt="A butcher in his shop hands a tray of fresh cuts to a customer"
      fetchPriority="high"
      className="absolute inset-y-0 right-0 -z-20 h-full w-full object-cover object-[28%_center] md:w-1/2 md:object-center"
    />
    <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(7,29,78,.92)_0%,rgba(8,40,105,.84)_50%,rgba(8,40,105,.74)_100%)] md:bg-[linear-gradient(90deg,#082869_0%,#082869_35%,rgba(8,40,105,.92)_42%,rgba(8,40,105,.5)_54%,rgba(8,40,105,.12)_69%,rgba(8,40,105,.04)_100%)]" />
    <div className="absolute inset-y-0 left-[51%] -z-10 hidden w-8 -skew-x-[13deg] bg-[#ed1c2e]/90 lg:block" />
    <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-[#071d4e]/35 to-transparent" />

    <div className="page-shell flex min-h-[470px] items-center py-12 sm:min-h-[500px] lg:min-h-[350px] lg:py-8">
      <div className="max-w-[620px] animate-fadeIn">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#ed1c2e] px-4 py-1.5 text-[10px] font-black uppercase tracking-[.12em] text-white shadow-lg sm:text-[11px]">
          <BadgeCheck className="h-3.5 w-3.5" /> Our customers
        </p>
        <h1 id="home-hero-title" className="max-w-[620px] font-sans text-[clamp(2rem,4vw,3.6rem)] font-black leading-[.98] tracking-[-.045em] text-white">
          Happy Customers,<br /><span className="text-[#ed1c2e]">Our Greatest Success</span>
        </h1>
        <p className="mt-5 max-w-[500px] text-sm leading-6 text-white/90 sm:text-base sm:leading-7">
          At Budget Meat Shop, our customers are at the heart of what we do. We’re proud to serve you with fresh, quality meat, friendly service and an easy shopping experience you can trust.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/shop" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#ed1c2e] px-6 text-xs font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#c91525]">
            Shop now <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/about" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/85 px-6 text-xs font-extrabold text-white transition hover:bg-white hover:text-[#082869]">
            Learn more
          </Link>
        </div>
      </div>
    </div>
    <span className="pointer-events-none absolute bottom-5 right-7 hidden rounded-full border border-white/45 bg-[#082869]/80 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-white backdrop-blur sm:block lg:right-[7%]">Good meat · good value</span>
  </section>
);
