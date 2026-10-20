import { ArrowUpRight, Clock3, Calendar, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../../data/blogPosts';

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogPostCard = ({ post, featured = false }: BlogPostCardProps) => (
  <article
    className={`group overflow-hidden rounded-3xl border border-[#e4eaf4] bg-white shadow-[0_8px_25px_rgba(8,40,105,.05)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(8,40,105,.12)] flex flex-col justify-between ${
      featured ? 'lg:grid lg:grid-cols-[1.1fr_1fr]' : ''
    }`}
  >
    <Link
      to={`/blog/${post.slug}`}
      aria-label={`Read ${post.title}`}
      className={`relative block overflow-hidden bg-[#edf2fb] ${
        featured ? 'min-h-[260px] lg:min-h-[350px]' : 'aspect-[1.55/1]'
      }`}
    >
      <img
        src={post.image}
        alt={post.imageAlt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

      {/* Floating Category Badge */}
      <div className="absolute left-4 top-4 flex items-center gap-1.5">
        <span className="rounded-full bg-white/95 backdrop-blur-xs px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#082869] shadow-sm flex items-center gap-1">
          <Flame className="h-3 w-3 text-[#ed1c2e]" />
          {post.category}
        </span>
      </div>
    </Link>

    <div className={`flex flex-col p-5 sm:p-7 flex-1 justify-between ${featured ? 'justify-center lg:p-9' : ''}`}>
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-[#758295]">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <time dateTime={post.date}>
              {new Date(`${post.date}T12:00:00`).toLocaleDateString('en-ZW', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </time>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5 text-gray-400" />
            {post.readTime}
          </span>
        </div>

        <h3
          className={`font-sans font-black leading-tight tracking-tight text-[#082869] group-hover:text-[#ed1c2e] transition duration-200 ${
            featured ? 'mt-3 text-2xl sm:text-4xl' : 'mt-2.5 text-lg sm:text-xl'
          }`}
        >
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className={`mt-2.5 text-xs sm:text-sm leading-relaxed text-[#536783] line-clamp-3 ${featured ? 'max-w-xl' : ''}`}>
          {post.excerpt}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#ed1c2e] hover:gap-2.5 transition-all"
        >
          <span>Read Story & Tips</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        {post.shopLabel && (
          <Link
            to={post.shopLink}
            className="text-[11px] font-bold text-[#082869] hover:text-[#ed1c2e] transition"
          >
            {post.shopLabel} →
          </Link>
        )}
      </div>
    </div>
  </article>
);
