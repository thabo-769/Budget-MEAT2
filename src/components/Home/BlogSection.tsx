import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Clock3,
  Flame,
  MessageCircle,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../../data/blogPosts';

export const BlogSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Braai & entertaining', 'Meal inspiration', "Butcher’s tips"];

  const filteredPosts = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter((post) => post.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const featuredPost = filteredPosts[0] || blogPosts[0];
  const sidePosts = filteredPosts.slice(1, 3).length ? filteredPosts.slice(1, 3) : blogPosts.slice(1, 3);

  return (
    <section className="relative overflow-hidden bg-[#f6f9ff] py-14 sm:py-20" aria-labelledby="home-blog-title">
      {/* Subtle background decorative accents */}
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-red-100/30 blur-3xl pointer-events-none" />

      <div className="page-shell relative z-10">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-100 px-3.5 py-1 text-xs font-bold text-[#ed1c2e] mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#ed1c2e]" />
              <span>The Butcher’s Table & Recipes</span>
            </div>
            <h2 id="home-blog-title" className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#082869] leading-[1.1]">
              Good ideas for <span className="text-[#ed1c2e]">good family meals.</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-6 sm:leading-7 text-[#536783]">
              Tested braai guides, secret marinades, and simple weeknight dinner ideas from our team of skilled butchers in Bulawayo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-white border border-[#082869]/20 hover:border-[#ed1c2e] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#082869] hover:text-[#ed1c2e] shadow-xs transition duration-200"
            >
              <span>Explore All Articles</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#082869] text-white shadow-sm ring-2 ring-[#082869]/20'
                    : 'bg-white text-[#506074] border border-gray-200 hover:border-gray-300 hover:text-[#082869]'
                }`}
              >
                {cat === 'All' ? 'All Stories' : cat}
              </button>
            );
          })}
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Featured Lead Story Card */}
          <article className="lg:col-span-7 flex flex-col justify-between rounded-3xl bg-white border border-gray-200/80 shadow-[0_12px_36px_rgba(8,40,105,.07)] overflow-hidden group transition duration-300 hover:shadow-[0_20px_45px_rgba(8,40,105,.12)]">
            <div className="relative aspect-[16/10] overflow-hidden bg-[#edf2fb]">
              <img
                src={featuredPost.image}
                alt={featuredPost.imageAlt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061b50]/80 via-[#061b50]/20 to-transparent" />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="rounded-full bg-[#ed1c2e] px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-sm flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5" />
                  {featuredPost.category}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-3 text-xs text-white/90 font-semibold mb-1.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(featuredPost.date).toLocaleDateString('en-ZW', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {featuredPost.readTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-sans text-2xl sm:text-3xl font-black tracking-tight text-[#082869] group-hover:text-[#ed1c2e] transition duration-200 leading-tight">
                  <Link to={`/blog/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm text-[#536783] leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#082869] text-white flex items-center justify-center font-black text-sm">
                    BM
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-900">Head Butcher's Guide</span>
                    <span className="block text-[11px] text-gray-500">Bulawayo Craft Kitchen</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={featuredPost.shopLink}
                    className="text-xs font-bold text-[#082869] hover:underline"
                  >
                    {featuredPost.shopLabel}
                  </Link>
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#ed1c2e] hover:bg-[#c91525] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow-sm"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Secondary Stories & Butcher's Tip Column */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5">
            {/* Side Story Cards */}
            {sidePosts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-2xl bg-white border border-gray-200/80 p-4 sm:p-5 shadow-[0_6px_20px_rgba(8,40,105,.05)] hover:shadow-[0_12px_30px_rgba(8,40,105,.1)] transition duration-200 flex flex-col sm:flex-row gap-4 items-center"
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="w-full sm:w-36 h-36 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative"
                >
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2 left-2 rounded-md bg-white/95 px-2 py-0.5 text-[9px] font-black uppercase text-[#082869]">
                    {post.category}
                  </span>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Clock3 className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-[#082869] group-hover:text-[#ed1c2e] transition duration-200 line-clamp-2 leading-snug">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h4>

                  <p className="mt-1 text-xs text-[#536783] line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#ed1c2e] hover:gap-2 transition-all"
                  >
                    <span>Read recipe</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}

            {/* Butcher's Pro-Tip Card (Brand Highlight) */}
            <div className="rounded-2xl bg-gradient-to-br from-[#082869] to-[#041538] text-white p-5 sm:p-6 shadow-[0_10px_30px_rgba(8,40,105,.18)] relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
              <div className="flex items-center gap-2 text-[#ff9fa6] text-xs font-bold uppercase tracking-wider mb-2">
                <UtensilsCrossed className="h-4 w-4 text-[#ed1c2e]" />
                <span>Butcher’s Secret of the Week</span>
              </div>
              <h4 className="font-sans text-lg font-black text-white leading-snug">
                "Rest your steaks for half their cooking time."
              </h4>
              <p className="mt-1.5 text-xs text-blue-100/80 leading-relaxed">
                Cutting meat too early lets delicious juices escape. A 5-minute rest on a warm board guarantees tender, succulent bites every time.
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <Link
                  to="/shop?category=beef"
                  className="font-bold text-white hover:text-[#ff9fa6] inline-flex items-center gap-1"
                >
                  <span>Browse prime beef cuts</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#ed1c2e]" />
                </Link>
                <Link
                  to="/contact"
                  className="text-[11px] font-semibold text-white/60 hover:text-white"
                >
                  Ask our butcher a question
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner Strip */}
        <div className="mt-10 rounded-2xl border border-blue-100 bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#082869] flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <strong className="text-xs sm:text-sm text-gray-900 block font-black">
                Have a recipe in mind or planning a braai event?
              </strong>
              <p className="text-xs text-gray-500">
                Our counter butchers can custom portion and pack your meat to your exact weights and instructions.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/263711234567?text=Hello%20Budget%20Meat%20Shop%2C%20I%20have%20a%20cutting%20instruction%20question%20for%20a%20recipe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#258450] hover:bg-[#1e7043] text-white px-5 py-2 text-xs font-bold transition shadow-2xs shrink-0"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat With Master Butcher</span>
          </a>
        </div>
      </div>
    </section>
  );
};
