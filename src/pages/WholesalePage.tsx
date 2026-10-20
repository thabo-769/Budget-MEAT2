import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowRight, Building2, CheckCircle2, Mail, PackageCheck, Phone, Scale, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

type TradeForm = { businessName: string; contactPerson: string; email: string; phone: string; businessType: string; weeklyVolume: string; deliveryCity: string; notes: string };

export const WholesalePage = () => {
  const [draftReady, setDraftReady] = useState(false);
  const [whatsAppDraftUrl, setWhatsAppDraftUrl] = useState('');
  const [form, setForm] = useState<TradeForm>({ businessName: '', contactPerson: '', email: '', phone: '', businessType: 'Restaurant or caterer', weeklyVolume: 'Under 25 kg', deliveryCity: 'Bulawayo', notes: '' });
  const update = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = encodeURIComponent(`Wholesale enquiry\nBusiness: ${form.businessName}\nContact: ${form.contactPerson}\nEmail: ${form.email}\nPhone: ${form.phone}\nBusiness type: ${form.businessType}\nExpected weekly volume: ${form.weeklyVolume}\nDelivery city: ${form.deliveryCity}\nRequirements: ${form.notes || 'Please contact me to discuss.'}`);
    const draftUrl = `https://wa.me/263711234567?text=${message}`;
    window.open(draftUrl, '_blank', 'noopener,noreferrer');
    setWhatsAppDraftUrl(draftUrl);
    setDraftReady(true);
  };

  return (
    <div className="min-h-[70vh] bg-[#f6f9ff] pb-14">
      <section className="bg-[#082869] py-11 text-white sm:py-16"><div className="page-shell"><p className="eyebrow !text-[#ed1c2e]">For kitchens and local businesses</p><h1 className="font-display mt-3 max-w-3xl text-5xl leading-[.98] sm:text-6xl">A dependable butcher for your business.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">Tell us what you need and our Bulawayo team can discuss available cuts, quantities and how to get them to you.</p><div className="mt-6 flex flex-wrap gap-5 text-xs font-semibold text-white/80"><span className="inline-flex items-center gap-2"><Scale className="h-4 w-4 text-[#ed1c2e]" />Bulk cut requests</span><span className="inline-flex items-center gap-2"><PackageCheck className="h-4 w-4 text-[#ed1c2e]" />Packing preferences</span><span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-[#ed1c2e]" />Local delivery or collection</span></div></div></section>
      <div className="page-shell grid items-start gap-6 py-8 lg:grid-cols-[1fr_330px] lg:py-10">
        <section className="paper-card p-5 sm:p-8"><p className="eyebrow mb-2">Start a conversation</p><h2 className="font-display text-3xl text-[#082869]">Tell us about your kitchen.</h2><p className="mt-2 text-xs leading-5 text-[#758295]">We’ll prepare your enquiry in WhatsApp so you can send it straight to the trade team.</p>
          {draftReady && <div role="status" className="mt-5 flex items-start gap-2 rounded border border-[#cfe4d7] bg-[#f1f8f3] p-3 text-xs leading-5 text-[#267448]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /><span>Your WhatsApp enquiry is ready. Press send to contact the team. If it didn’t open, <a href={whatsAppDraftUrl} target="_blank" rel="noopener noreferrer" className="font-extrabold underline">open your enquiry</a>.</span></div>}
          <form onSubmit={submit} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="businessName" className="form-label">Business name</label><input id="businessName" name="businessName" value={form.businessName} onChange={update} required className="form-field" placeholder="Your restaurant or business" /></div><div><label htmlFor="contactPerson" className="form-label">Contact person</label><input id="contactPerson" name="contactPerson" value={form.contactPerson} onChange={update} required autoComplete="name" className="form-field" placeholder="Your name" /></div></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="email" className="form-label">Work email</label><input id="email" name="email" type="email" value={form.email} onChange={update} required autoComplete="email" className="form-field" placeholder="you@business.com" /></div><div><label htmlFor="phone" className="form-label">Mobile number</label><input id="phone" name="phone" type="tel" value={form.phone} onChange={update} required autoComplete="tel" className="form-field" placeholder="+263 ..." /></div></div>
            <div className="grid gap-4 sm:grid-cols-3"><div><label htmlFor="businessType" className="form-label">Business type</label><select id="businessType" name="businessType" value={form.businessType} onChange={update} className="form-field"><option>Restaurant or caterer</option><option>Hotel or lodge</option><option>School or institution</option><option>Retail butcher</option><option>Other business</option></select></div><div><label htmlFor="weeklyVolume" className="form-label">Expected weekly volume</label><select id="weeklyVolume" name="weeklyVolume" value={form.weeklyVolume} onChange={update} className="form-field"><option>Under 25 kg</option><option>25–100 kg</option><option>More than 100 kg</option><option>Not sure yet</option></select></div><div><label htmlFor="deliveryCity" className="form-label">Delivery city</label><input id="deliveryCity" name="deliveryCity" value={form.deliveryCity} onChange={update} required className="form-field" /></div></div>
            <div><label htmlFor="notes" className="form-label">Cuts and packing you’re looking for <span className="font-normal text-[#8993a0]">(optional)</span></label><textarea id="notes" name="notes" rows={4} value={form.notes} onChange={update} className="form-field min-h-[110px] resize-y" placeholder="Tell us about the cuts, quantities or pack sizes you need." /></div>
            <button type="submit" className="btn-primary"><ArrowRight className="h-4 w-4" />Prepare trade enquiry</button>
          </form>
        </section>
        <aside className="space-y-4"><section className="paper-card p-5 sm:p-6"><p className="eyebrow mb-2">Talk to the team</p><h2 className="font-display text-2xl text-[#082869]">Let’s talk supply.</h2><p className="mt-2 text-xs leading-5 text-[#758295]">Contact our Main Avenue branch to ask about current trade pricing and availability.</p><a href="tel:+263711234567" className="mt-4 flex items-center gap-3 text-xs font-extrabold text-[#34465c] hover:text-[#ed1c2e]"><span className="flex h-9 w-9 items-center justify-center rounded bg-[#edf2fb]"><Phone className="h-4 w-4" /></span>+263 71 123 4567</a><a href="mailto:main@budgetmeatshop.co.zw" className="mt-3 flex items-center gap-3 text-xs font-semibold text-[#506074] hover:text-[#ed1c2e]"><span className="flex h-9 w-9 items-center justify-center rounded bg-[#edf2fb]"><Mail className="h-4 w-4" /></span>main@budgetmeatshop.co.zw</a><Link to="/branches" className="mt-4 inline-flex text-xs font-extrabold text-[#ed1c2e]">Visit a branch →</Link></section><section className="rounded-md bg-[#edf2fb] p-5 sm:p-6"><div className="flex h-10 w-10 items-center justify-center rounded bg-white text-[#082869]"><Building2 className="h-5 w-5" /></div><h3 className="font-display mt-4 text-2xl text-[#082869]">Need a retail order?</h3><p className="mt-2 text-xs leading-5 text-[#687789]">Shop family favourites and everyday cuts from the online counter.</p><Link to="/shop" className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#082869]">Browse cuts <ArrowRight className="h-3.5 w-3.5" /></Link></section></aside>
      </div>
    </div>
  );
};
