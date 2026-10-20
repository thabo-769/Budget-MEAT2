import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Thandi M.',
    initials: 'TM',
    location: 'Bulawayo CBD',
    quote: '"The meat is always fresh and the staff are so friendly. Best butchery in town!"',
  },
  {
    name: 'Rudo K.',
    initials: 'RK',
    location: 'Lobengula',
    quote: '"Excellent quality and great prices. I always come back for my family\'s meat."',
  },
  {
    name: 'Brian S.',
    initials: 'BS',
    location: 'City Centre',
    quote: '"Fast service, a clean shop and top-quality meat. Highly recommended!"',
  },
  {
    name: 'Nomsa D.',
    initials: 'ND',
    location: 'Nketa',
    quote: '"I order online every week. The cuts are always perfect and delivery is on time."',
  },
  {
    name: 'Tafara M.',
    initials: 'TM',
    location: 'Tshabalala',
    quote: '"The family bundles are a game changer — great value and fresh every time."',
  },
  {
    name: 'Lindiwe P.',
    initials: 'LP',
    location: 'Pumula',
    quote: '"Friendly staff who actually help you choose the right cut. Love this place!"',
  },
];

// Duplicate for seamless loop
const ticker = [...reviews, ...reviews];

export const CustomerReviews = () => (
  <section
    id="customer-reviews"
    className="relative scroll-mt-24 overflow-hidden rounded-t-[28px] bg-[linear-gradient(180deg,#eaf2ff_0%,#f4f8ff_100%)] py-7 sm:py-8"
    aria-labelledby="customer-reviews-heading"
  >
    <div className="page-shell">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <p className="eyebrow flex items-center justify-center gap-2 text-[#082869]">
          <span className="h-0.5 w-7 bg-[#ed1c2e]" />
          Customer reviews
        </p>
        <h2
          id="customer-reviews-heading"
          className="section-heading mt-2 !font-sans !font-black !tracking-[-.035em]"
        >
          What Our <span className="text-[#ed1c2e]">Customers Say</span>
        </h2>
        <p className="mt-1 text-xs text-[#18365f] sm:text-sm">
          Why families keep coming back to Budget Meat Shop.
        </p>
      </div>
    </div>

    {/* Fade masks on edges */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#eaf2ff] to-transparent sm:w-24"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f4f8ff] to-transparent sm:w-24"
    />

    {/* Marquee track */}
    <div className="reviews-marquee flex gap-4 pb-2 pt-1" aria-label="Scrolling customer reviews">
      {ticker.map((review, idx) => (
        <article
          // eslint-disable-next-line react/no-array-index-key
          key={`${review.name}-${idx}`}
          className="reviews-card w-[300px] min-w-[300px] rounded-xl border border-white bg-white p-5 shadow-[0_8px_24px_rgba(8,40,105,.10)] sm:w-[340px] sm:min-w-[340px]"
          aria-label={`Review by ${review.name}`}
        >
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#082869] text-xs font-extrabold text-white"
            >
              {review.initials}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#082869]">{review.name}</h3>
              <p className="text-[10px] text-[#758295]">{review.location}</p>
              <div className="mt-1 flex gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} aria-hidden="true" className="h-3.5 w-3.5 fill-[#ed1c2e] text-[#ed1c2e]" />
                ))}
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-[#082869] sm:text-sm sm:leading-6">{review.quote}</p>
        </article>
      ))}
    </div>

    {/* Dot indicators */}
    <div className="mt-5 flex items-center justify-center gap-2">
      {reviews.map((review, index) => (
        <span
          key={review.name}
          aria-hidden="true"
          className={`h-2 rounded-full ${index === 0 ? 'w-5 bg-[#ed1c2e]' : 'w-2 bg-[#082869]/30'}`}
        />
      ))}
    </div>
  </section>
);
