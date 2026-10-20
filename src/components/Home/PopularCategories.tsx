import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 'beef', name: 'Beef & steak', note: 'The butcher’s favourites', image: '/images/category_beef.jpg' },
  { id: 'chicken', name: 'Chicken', note: 'Ready for any recipe', image: '/images/category_chicken.jpg' },
  { id: 'lamb', name: 'Lamb', note: 'Something a little special', image: '/images/category_lamb.jpg' },
  { id: 'pork', name: 'Pork', note: 'Tender and full of flavour', image: '/images/category_pork.jpg' },
  { id: 'mince', name: 'Mince', note: 'A weeknight essential', image: '/images/category_mince.jpg' },
  { id: 'sausages', name: 'Wors & sausages', note: 'Made for the braai', image: '/images/category_processed.jpg' },
  { id: 'packs', name: 'Family bundles', note: 'More to share', image: '/images/family_bundles_banner.jpg' },
];

export const PopularCategories = () => (
  <section className="bg-white py-16 sm:py-20">
    <div className="page-shell">
      <div className="mb-8 flex items-end justify-between gap-5 sm:mb-10">
        <div>
          <p className="eyebrow mb-3 !text-[#082869]">Find your favourites</p>
          <h2 className="section-heading">A good cut for <span className="text-[#ed1c2e]">every table.</span></h2>
        </div>
        <Link to="/shop" className="hidden items-center gap-2 pb-1 text-xs font-extrabold uppercase tracking-[.08em] text-[#082869] hover:text-[#ed1c2e] sm:inline-flex">Browse everything <ArrowUpRight className="h-4 w-4" /></Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-7">
        {categories.map((category) => (
          <Link key={category.id} to={`/shop?category=${category.id}`} className="group relative isolate aspect-[.83/1] overflow-hidden rounded-md bg-[#082869] sm:aspect-[.78/1]">
            <img src={category.image} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#061b50]/95 via-[#061b50]/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3.5 text-white sm:p-4">
              <span className="mb-2 block h-[2px] w-7 bg-white/50 transition-all group-hover:w-12" />
              <h3 className="font-display text-xl leading-tight sm:text-[22px]">{category.name}</h3>
              <p className="mt-1 text-[10px] text-white/75 sm:text-[11px]">{category.note}</p>
            </div>
            <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#082869] opacity-0 transition group-hover:opacity-100"><ArrowUpRight className="h-4 w-4" /></span>
          </Link>
        ))}
      </div>
      <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.08em] text-[#082869] hover:text-[#ed1c2e] sm:hidden">Browse everything <ArrowUpRight className="h-4 w-4" /></Link>
    </div>
  </section>
);
