import { ArrowRight, Clock3, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomerBrandMark from '../Shared/CustomerBrandMark';
import { branches } from '../../data/branches';

const mainBranch = branches[0];

export const Footer = () => (
  <footer className="border-t-4 border-[#ed1c2e] bg-[#082869] text-white">
    <div className="page-shell grid gap-8 py-9 sm:grid-cols-2 sm:gap-10 lg:grid-cols-[1.25fr_.8fr_1.1fr_.9fr] lg:py-10">
      <div>
        <Link to="/" aria-label="Budget Meat Shop home" className="inline-flex rounded bg-white px-2 py-1.5">
          <CustomerBrandMark className="h-14 w-auto" />
        </Link>
        <p className="mt-3 max-w-xs text-xs leading-5 text-white/75">Fresh cuts, fair prices and family favourites from your neighbourhood butcher in Bulawayo.</p>
      </div>

      <div>
        <h2 className="mb-3 text-xs font-black uppercase tracking-[.13em] text-white">Quick links</h2>
        <ul className="space-y-2 text-xs text-white/75">
          <li><Link to="/" className="hover:text-white">Home</Link></li>
          <li><Link to="/shop" className="hover:text-white">Shop</Link></li>
          <li><Link to="/about" className="hover:text-white">About</Link></li>
          <li><Link to="/#customer-reviews" className="hover:text-white">Customer reviews</Link></li>
          <li><Link to="/specials" className="hover:text-white">Weekly specials</Link></li>
          <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
        </ul>
      </div>

      <div>
        <h2 className="mb-3 text-xs font-black uppercase tracking-[.13em] text-white">Contact us</h2>
        <ul className="space-y-2.5 text-xs leading-5 text-white/75">
          <li><a href={`tel:${mainBranch.phone.replaceAll(' ', '')}`} className="inline-flex items-center gap-2 hover:text-white"><Phone className="h-3.5 w-3.5 text-[#ff949b]" />{mainBranch.phone}</a></li>
          <li><a href={`mailto:${mainBranch.email}`} className="inline-flex items-center gap-2 hover:text-white">{mainBranch.email}</a></li>
          <li><Link to="/branches" className="inline-flex items-start gap-2 hover:text-white"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ff949b]" /><span>{mainBranch.address}<br />{mainBranch.city}, Zimbabwe</span></Link></li>
          <li className="inline-flex items-start gap-2"><Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ff949b]" /><span>{mainBranch.hours[0].day}: {mainBranch.hours[0].open}–{mainBranch.hours[0].close}</span></li>
        </ul>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div>
          <h2 className="mb-3 text-xs font-black uppercase tracking-[.13em] text-white">From our counter</h2>
          <p className="text-xs leading-5 text-white/75">Questions about a cut, an order or a branch? Our local team is happy to help.</p>
          <Link to="/contact" className="mt-3 inline-flex items-center gap-2 text-xs font-extrabold text-white transition hover:text-[#ffb0b5]">Talk to your butcher <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <p className="font-display rotate-[-4deg] text-[26px] italic leading-[.9] text-white/95">Thanks for<br />shopping local<span className="mt-1 block h-1 w-24 rotate-[-5deg] rounded-full bg-[#ed1c2e]" /></p>
      </div>
    </div>

    <div className="border-t border-white/15">
      <div className="page-shell flex flex-col gap-2 py-3 text-[10px] text-white/65 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Budget Meat Shop · Bulawayo, Zimbabwe</p>
        <p>Online demo orders are saved in this browser until confirmed with the shop.</p>
      </div>
    </div>
  </footer>
);
