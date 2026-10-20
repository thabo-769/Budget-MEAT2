export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  shopLink: string;
  shopLabel: string;
  sections: { heading: string; paragraphs: string[]; tips?: string[] }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'make-the-most-of-your-braai',
    title: 'A butcher’s guide to a better family braai',
    category: 'Braai & entertaining',
    date: '2026-10-08',
    readTime: '4 min read',
    excerpt: 'Build a crowd-pleasing braai around a few dependable cuts, a simple plan and sides everyone can share.',
    image: '/images/weekly_specials_banner.jpg',
    imageAlt: 'Meat sizzling over an open flame',
    shopLink: '/shop?category=sausages',
    shopLabel: 'Shop wors & sausages',
    sections: [
      { heading: 'Start with a mix', paragraphs: ['A good braai has something for everyone. Pair a quick-cooking favourite like boerewors with a couple of steaks or chops, then add chicken portions for guests who prefer a lighter option.', 'For a larger table, a family braai bundle is an easy starting point. You can add extra cuts to suit your guest list and leave a preparation note with your order.'] },
      { heading: 'Keep the plan simple', paragraphs: ['Choose two or three mains rather than trying to cook everything at once. Put out shared sides, sauces and fresh bread so guests can build a plate while each cut has its moment on the grill.'], tips: ['Ask the butcher for cuts that fit your cooking time.', 'Keep raw and cooked items on separate serving plates.', 'Order a little ahead when you are planning for a group.'] },
      { heading: 'Finish with everyone around the table', paragraphs: ['The best braai is about good company as much as the menu. Pick familiar favourites, make room for a new cut and let the butcher help with the quantities and preparation.'] },
    ],
  },
  {
    slug: 'weeknight-mince-meals',
    title: 'Three easy ways to turn mince into dinner',
    category: 'Meal inspiration',
    date: '2026-10-02',
    readTime: '3 min read',
    excerpt: 'Keep beef mince in your weekly shop and you have a flexible start for comforting, family-friendly meals.',
    image: '/images/category_mince.jpg',
    imageAlt: 'Fresh minced beef ready for the kitchen',
    shopLink: '/shop?category=mince',
    shopLabel: 'Shop fresh mince',
    sections: [
      { heading: 'A reliable base for many meals', paragraphs: ['Mince is one of the most adaptable choices at the counter. Brown it with onion and your favourite seasoning, then use that base in a pasta sauce, a cottage pie or a tray of savoury patties.', 'Make extra when you have time and use it as a head start for another meal later in the week. Add vegetables, beans or tomatoes to change the flavour and stretch the meal.'] },
      { heading: 'Make it your own', paragraphs: ['For a quick supper, serve a rich mince sauce with pasta. For a shared family meal, layer seasoned mince under mashed potato or spoon it into wraps with crisp vegetables.'], tips: ['Choose the pack size that suits your household.', 'Ask the butcher if you would like a particular mince texture.', 'Add a note at checkout for a custom pack size request.'] },
    ],
  },
  {
    slug: 'choosing-the-right-steak',
    title: 'Choosing the right steak for the way you cook',
    category: 'Butcher’s tips',
    date: '2026-09-24',
    readTime: '4 min read',
    excerpt: 'A few questions about your meal and cooking method can help you find a steak that feels just right.',
    image: '/images/category_beef.jpg',
    imageAlt: 'Fresh beef steak on a wooden board',
    shopLink: '/shop?category=beef',
    shopLabel: 'Explore beef cuts',
    sections: [
      { heading: 'Think about the meal first', paragraphs: ['Are you cooking quickly in a pan, grilling over a flame or planning a slow-cooked meal? Tell your butcher how you want to cook and how many people you are serving. They can help you choose a cut and portion that fit.', 'Beef fillet is a popular tender choice for a special meal, while rump and everyday steak offer a full beef flavour for a simple supper or braai. Availability can vary, so ask the team what is on the counter.'] },
      { heading: 'Ask for the details you need', paragraphs: ['You can ask about thickness, trimming and portion sizes before you order. If you are shopping online, choose a product variant and include your preparation request in the butcher’s note at checkout.'] },
    ],
  },
  {
    slug: 'plan-a-family-meal-shop',
    title: 'A simpler way to plan your family meat shop',
    category: 'Shopping guides',
    date: '2026-09-16',
    readTime: '3 min read',
    excerpt: 'Build a flexible weekly shop with a mix of quick-cooking cuts, family favourites and a meal for the weekend.',
    image: '/images/family_bundles_banner.jpg',
    imageAlt: 'A selection of meat for a family meal',
    shopLink: '/shop?category=packs',
    shopLabel: 'Browse family bundles',
    sections: [
      { heading: 'Plan around the week you have', paragraphs: ['Start with the meals your household already enjoys. Add a quick option for a busy evening, something that can become leftovers and a favourite for the weekend.', 'Family bundles can help you get started with a variety of cuts in one order. Check the product details and add any preferences in the notes at checkout.'] },
      { heading: 'Shop with a little flexibility', paragraphs: ['Keep a short list of substitute ideas in case a particular cut is unavailable. Your selected branch and contact details help the team confirm your order and discuss any changes before it is prepared.'] },
    ],
  },
  {
    slug: 'chicken-for-every-occasion',
    title: 'Chicken portions: one shop, plenty of possibilities',
    category: 'Meal inspiration',
    date: '2026-09-09',
    readTime: '3 min read',
    excerpt: 'From a tray bake to a relaxed weekend lunch, chicken portions are an easy favourite to season your way.',
    image: '/images/category_chicken.jpg',
    imageAlt: 'Fresh chicken portions ready to prepare',
    shopLink: '/shop?category=chicken',
    shopLabel: 'Shop chicken',
    sections: [
      { heading: 'Choose a meal your family loves', paragraphs: ['Chicken portions work across plenty of familiar meals. Season them for a tray bake with vegetables, add them to a curry or prepare them for a weekend grill.', 'A larger pack can make planning easier if you are cooking for a group. Check the listed pack sizes and ask the butcher about other options.'] },
      { heading: 'Add your own flavour', paragraphs: ['A simple marinade of pantry spices, citrus or herbs can take chicken in a new direction. Prep ahead when it suits you and serve with a fresh salad, rice or roasted vegetables.'] },
    ],
  },
  {
    slug: 'meet-your-local-counter',
    title: 'Good service starts with a conversation at the counter',
    category: 'From our counter',
    date: '2026-09-01',
    readTime: '2 min read',
    excerpt: 'Not sure what to order? A quick chat with your local team can help you pick cuts for the meal you have in mind.',
    image: '/images/customer-service-hero.jpg',
    imageAlt: 'A butcher helping a customer at the counter',
    shopLink: '/branches',
    shopLabel: 'Find your local branch',
    sections: [
      { heading: 'Tell us what is on the menu', paragraphs: ['Our team can help you explore the counter, compare cuts and ask about preparation. It is helpful to share how many people you are feeding and how you plan to cook.', 'You can also shop online and leave a note with your order. The shop can follow up to confirm details before you collect or arrange delivery.'] },
      { heading: 'Visit or get in touch', paragraphs: ['Find your closest Bulawayo branch for directions, phone details and trading hours. If you have a question before placing an order, the contact page makes it easy to reach the team.'] },
    ],
  },
];
