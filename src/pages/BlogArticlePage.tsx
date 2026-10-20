import { ArrowLeft, ArrowRight, Clock3 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { BlogPostCard } from '../components/Blog/BlogPostCard';

export const BlogArticlePage = () => {
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) return (
    <div className="page-shell py-20 text-center">
      <p className="eyebrow">The journal</p><h1 className="font-sans mt-3 text-3xl font-black text-[#082869]">That story has wandered off.</h1>
      <p className="mt-2 text-sm text-[#758295]">Browse the journal to find more ideas from our counter.</p>
      <Link to="/blog" className="btn-primary mt-5">Back to the blog <ArrowRight className="h-4 w-4" /></Link>
    </div>
  );

  const related = blogPosts.filter((item) => item.slug !== post.slug && item.category === post.category).slice(0, 2);
  const otherStories = related.length ? related : blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <article className="bg-[#f6f9ff] pb-14 sm:pb-20">
      <div className="page-shell pt-5 sm:pt-7">
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-extrabold text-[#082869] hover:text-[#ed1c2e]"><ArrowLeft className="h-4 w-4" />All stories</Link>
        <header className="mx-auto max-w-4xl py-7 text-center sm:py-10">
          <p className="eyebrow">{post.category}</p>
          <h1 className="font-sans mt-3 text-3xl font-black leading-[1.05] tracking-[-.04em] text-[#082869] sm:text-5xl">{post.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#536783] sm:text-base">{post.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-[#758295]"><time dateTime={post.date}>{new Date(`${post.date}T12:00:00`).toLocaleDateString('en-ZW', { day: 'numeric', month: 'long', year: 'numeric' })}</time><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{post.readTime}</span><span>From the Budget Meat Shop team</span></div>
        </header>
        <img src={post.image} alt={post.imageAlt} className="mx-auto aspect-[1.8/1] max-h-[520px] w-full max-w-5xl rounded-2xl object-cover shadow-[0_14px_40px_rgba(8,40,105,.12)]" />

        <div className="mx-auto mt-8 grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
          <div className="space-y-8 rounded-2xl border border-[#e4eaf4] bg-white p-5 sm:p-8">
            {post.sections.map((section, index) => <section key={section.heading} id={`story-section-${index + 1}`} className="scroll-mt-28">
              <h2 className="font-sans text-xl font-black tracking-[-.025em] text-[#082869] sm:text-2xl">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-3 text-sm leading-7 text-[#536783]">{paragraph}</p>)}
              {section.tips && <ul className="mt-4 space-y-2 rounded-xl bg-[#f6f9ff] p-4 sm:p-5">{section.tips.map((tip) => <li key={tip} className="flex gap-2 text-sm leading-6 text-[#18365f]"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ed1c2e]" />{tip}</li>)}</ul>}
            </section>)}
            <div className="rounded-xl bg-[#082869] p-5 text-white sm:p-6"><p className="eyebrow !text-[#ed1c2e]">Make it a meal</p><h2 className="font-sans mt-2 text-2xl font-black">Ready to choose your cuts?</h2><p className="mt-2 text-sm leading-6 text-white/75">Browse our counter and add a note if you would like help with a cut or preparation.</p><Link to={post.shopLink} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#ed1c2e] px-4 text-xs font-extrabold text-white hover:bg-[#c91525]">{post.shopLabel}<ArrowRight className="h-4 w-4" /></Link></div>
          </div>

          <aside className="h-fit rounded-2xl border border-[#e4eaf4] bg-white p-5 lg:sticky lg:top-28">
            <p className="eyebrow mb-3">In this story</p>
            <nav aria-label="Article contents" className="space-y-1">{post.sections.map((section, index) => <a key={section.heading} href={`#story-section-${index + 1}`} className="block rounded-lg px-3 py-2 text-xs font-bold leading-5 text-[#536783] hover:bg-[#f6f9ff] hover:text-[#ed1c2e]">{section.heading}</a>)}</nav>
            <div className="mt-5 border-t border-[#e8edf4] pt-5"><p className="text-xs font-extrabold text-[#082869]">Need a hand choosing?</p><p className="mt-1 text-xs leading-5 text-[#758295]">Your local team can help with cuts, pack sizes and orders.</p><Link to="/contact" className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-[#ed1c2e]">Ask the butcher <ArrowRight className="h-3.5 w-3.5" /></Link></div>
          </aside>
        </div>

        <section className="page-shell mt-12 max-w-5xl px-0 sm:mt-16" aria-labelledby="related-stories-title">
          <div className="mb-5 flex items-end justify-between gap-3"><div><p className="eyebrow mb-1">Keep browsing</p><h2 id="related-stories-title" className="font-sans text-2xl font-black text-[#082869]">More from the journal</h2></div><Link to="/blog" className="text-xs font-extrabold text-[#ed1c2e] hover:underline">All stories</Link></div>
          <div className="grid gap-4 md:grid-cols-2">{otherStories.map((item) => <BlogPostCard key={item.slug} post={item} />)}</div>
        </section>
      </div>
    </article>
  );
};
