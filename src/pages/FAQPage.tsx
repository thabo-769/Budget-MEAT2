import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  { category: 'Ordering', question: 'How do I place an order?', answer: 'Choose your cuts, add them to your basket and continue to checkout. You can choose delivery or collection, then add your contact details and any preparation notes. This demo saves the order in your browser; use the WhatsApp confirmation button to send it to the shop.' },
  { category: 'Delivery & collection', question: 'What does delivery cost?', answer: 'The current demo shows a flat $5 delivery fee on orders below $50. Delivery is free at $50 or more, and collection from a branch is free. Confirm availability and delivery details with the shop when you message your order.' },
  { category: 'Delivery & collection', question: 'Can I collect my order from a branch?', answer: 'Yes. Choose Click & collect at checkout and select one of the Bulawayo branches. Add a preferred time and message the team so they can confirm when your order will be ready.' },
  { category: 'Cuts & preparation', question: 'Can I ask for a custom cut or packing size?', answer: 'Add your request in the butcher’s note at checkout. We’ll pass that note along in the WhatsApp order message so the team can confirm what they can prepare.' },
  { category: 'Cuts & preparation', question: 'How do I know which cut to choose?', answer: 'Think about how you plan to cook and how many people you are serving. Browse the product descriptions for ideas, or contact your local branch and the team can help you compare cuts.' },
  { category: 'Ordering', question: 'Can I change an order after I submit it?', answer: 'Orders are saved in this browser and prepared for confirmation with the shop. Contact the team as soon as possible with your order details so they can tell you whether a change can still be made.' },
  { category: 'Ordering', question: 'Where can I find meal ideas?', answer: 'Visit the Budget Meat Shop blog for meal inspiration, shopping guides and tips from the counter.' },
  { category: 'Payment', question: 'How can I pay for my order?', answer: 'We accept EcoCash (USD & ZWG), InnBucks instant wallet, Bank Cards, ZIPIT instant bank transfers, and Cash on Delivery.' },
];

export const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="min-h-[70vh] bg-[#f6f9ff] py-10 sm:py-16">
      <div className="page-shell max-w-4xl">
        <div className="mb-8 text-center sm:mb-10"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#edf2fb] text-[#082869]"><HelpCircle className="h-5 w-5" /></div><p className="eyebrow mb-2">Good to know</p><h1 className="page-title">A few helpful answers.</h1><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#758295]">The details you need to shop, collect and get in touch with your local butcher.</p></div>
        <div className="space-y-3">{faqs.map((faq, index) => { const isOpen = index === openIndex; return <section key={faq.question} className="overflow-hidden rounded-md border border-[#e6e8eb] bg-white"><h2><button type="button" aria-expanded={isOpen} onClick={() => setOpenIndex(isOpen ? null : index)} className="flex w-full items-center justify-between gap-5 p-5 text-left transition hover:bg-[#f6f9ff] sm:p-6"><span><span className="mb-1 block text-[10px] font-extrabold uppercase tracking-[.12em] text-[#ed1c2e]">{faq.category}</span><span className="block text-sm font-extrabold text-[#082869] sm:text-base">{faq.question}</span></span><ChevronDown className={`h-4 w-4 shrink-0 text-[#506074] transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button></h2>{isOpen && <p className="border-t border-[#eceef0] bg-[#f6f9ff] px-5 pb-5 pt-4 text-sm leading-6 text-[#687789] sm:px-6 sm:pb-6">{faq.answer}</p>}</section>; })}</div>
        <div className="mt-7 flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-5"><p className="text-sm text-[#758295]">Still need help? <Link to="/contact" className="font-bold text-[#ed1c2e] hover:underline">Talk to the butcher.</Link></p><span className="hidden text-[#bac4d0] sm:inline" aria-hidden="true">·</span><p className="text-sm text-[#758295]">Looking for ideas? <Link to="/blog" className="font-bold text-[#ed1c2e] hover:underline">Read the blog.</Link></p></div>
      </div>
    </div>
  );
};
