import { useMemo, useState } from 'react';
import { BookOpen, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { BlogPostCard } from '../components/Blog/BlogPostCard';

export const BlogPage = () => {
  const [category, setCategory] = useState('All stories');
  const [query, setQuery] = useState('');
  const categories = ['All stories', ...new Set(blogPosts.map((post) => post.category))];
  const visiblePosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return blogPosts.filter((post) => {
      const matchesCategory = category === 'All stories' || post.category === category;
      const matchesQuery = !normalizedQuery || `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="min-h-[70vh] bg-[#f6f9ff] pb-14 sm:pb-20">
      <div className="page-shell pt-6 sm:pt-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#e4eaf4] bg-white p-4 shadow-[0_6px_22px_rgba(8,40,105,.06)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:pb-0" aria-label="Filter stories by category">
            {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`shrink-0 rounded-full border px-3.5 py-2 text-[11px] font-extrabold transition ${category === item ? 'border-[#082869] bg-[#082869] text-white' : 'border-[#e1e7f0] bg-white text-[#536783] hover:border-[#082869] hover:text-[#082869]'}`}>{item}</button>)}
          </div>
          <label className="flex min-h-11 min-w-0 items-center gap-2 rounded-full border border-[#e1e7f0] px-4 focus-within:border-[#082869] sm:w-64">
            <Search className="h-4 w-4 shrink-0 text-[#082869]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search blog stories" placeholder="Search stories..." className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#98a1ab]" />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear story search" className="text-[#758295] hover:text-[#ed1c2e]"><X className="h-4 w-4" /></button>}
          </label>
        </div>

        <div className="mb-5 mt-8 flex items-center justify-between gap-3 sm:mt-10"><div><p className="eyebrow mb-1">Fresh from the journal</p><h2 className="font-sans text-2xl font-black tracking-[-.03em] text-[#082869] sm:text-3xl">{category}</h2></div><p aria-live="polite" className="text-xs font-semibold text-[#758295]">{visiblePosts.length} {visiblePosts.length === 1 ? 'story' : 'stories'}</p></div>
        {visiblePosts.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visiblePosts.map((post) => <BlogPostCard key={post.slug} post={post} />)}</div> : (
          <div className="rounded-2xl border border-[#e4eaf4] bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-[#082869]" />
            <h3 className="font-sans mt-4 text-xl font-black text-[#082869]">No stories found</h3>
            <p className="mt-2 text-sm text-[#758295]">Try another phrase or clear your filters to see every story.</p>
            <button type="button" onClick={() => { setQuery(''); setCategory('All stories'); }} className="mt-4 rounded-full bg-[#ed1c2e] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-[#c91525]">Show all stories</button>
          </div>
        )}
        <section className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl bg-[#eaf2ff] p-6 sm:mt-14 sm:flex-row sm:items-center sm:p-8">
          <div><p className="eyebrow mb-2">Have supper sorted</p><h2 className="font-sans text-2xl font-black tracking-[-.03em] text-[#082869]">Find something fresh for the menu.</h2><p className="mt-2 text-sm leading-6 text-[#536783]">Browse everyday cuts, family bundles and this week’s specials.</p></div>
          <Link to="/shop" className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-[#ed1c2e] px-5 text-xs font-extrabold text-white transition hover:bg-[#c91525]">Explore the shop</Link>
        </section>
      </div>
    </div>
  );
};
