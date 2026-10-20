import { useState, type FormEvent } from 'react';
import { Clock3, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General question', message: '' });
  const [draftOpened, setDraftOpened] = useState(false);
  const [whatsAppDraftUrl, setWhatsAppDraftUrl] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = encodeURIComponent(`Hello Budget Meat Shop, my name is ${form.name}.\n${form.subject}\n${form.message}\nEmail: ${form.email}${form.phone ? `\nPhone: ${form.phone}` : ''}`);
    const draftUrl = `https://wa.me/263711234567?text=${message}`;
    window.open(draftUrl, '_blank', 'noopener,noreferrer');
    setWhatsAppDraftUrl(draftUrl);
    setDraftOpened(true);
  };

  return (
    <div className="min-h-[70vh] bg-[#f6f9ff] py-9 sm:py-14">
      <div className="page-shell">
        <div className="mb-8 max-w-2xl"><p className="eyebrow mb-2">We’re happy to help</p><h1 className="page-title">Talk to your butcher.</h1><p className="mt-3 text-sm leading-6 text-[#758295]">Ask us about a cut, a family bundle, or an order you’ve placed. The Main Avenue team is a good place to start.</p></div>
        <div className="grid items-start gap-6 lg:grid-cols-[.85fr_1.15fr]">
          <aside className="space-y-4">
            <section className="paper-card p-5 sm:p-6"><p className="eyebrow mb-4">Main Avenue branch</p><a href="tel:+263711234567" className="flex items-center gap-3 text-sm font-extrabold text-[#082869] hover:text-[#ed1c2e]"><span className="flex h-10 w-10 items-center justify-center rounded bg-[#edf2fb]"><Phone className="h-4 w-4" /></span>+263 71 123 4567</a><a href="mailto:main@budgetmeatshop.co.zw" className="mt-3 flex items-center gap-3 text-xs font-semibold text-[#506074] hover:text-[#ed1c2e]"><span className="flex h-10 w-10 items-center justify-center rounded bg-[#edf2fb]"><Mail className="h-4 w-4" /></span>main@budgetmeatshop.co.zw</a><p className="mt-4 flex items-start gap-3 border-t border-[#e8eaed] pt-4 text-xs leading-5 text-[#687789]"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#ed1c2e]" />124 Main Avenue (Corner 12th Ave), Bulawayo</p><p className="mt-3 flex items-start gap-3 text-xs leading-5 text-[#687789]"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#082869]" />Mon–Fri 07:30–17:30<br />Sat 07:30–15:00 · Sun 08:00–12:30</p><Link to="/branches" className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-[#ed1c2e]">See all three branches <span aria-hidden="true">→</span></Link></section>
            <section className="rounded-md bg-[#082869] p-5 text-white sm:p-6"><div className="flex items-start gap-3"><MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#ed1c2e]" /><div><h2 className="text-sm font-extrabold">Prefer WhatsApp?</h2><p className="mt-1 text-xs leading-5 text-white/70">Send the team a message directly. We’ll help you find the right cut.</p><a href="https://wa.me/263711234567" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-10 items-center rounded bg-white px-4 text-xs font-extrabold text-[#082869] hover:bg-[#edf2fb]">Open WhatsApp</a></div></div></section>
          </aside>

          <section className="paper-card p-5 sm:p-8"><p className="eyebrow mb-2">Send us a note</p><h2 className="font-display text-3xl text-[#082869]">What can we help with?</h2><p className="mt-2 text-xs leading-5 text-[#758295]">We’ll prepare your message in WhatsApp so you can send it straight to the shop.</p>
            {draftOpened && <div role="status" className="mt-5 rounded border border-[#cfe4d7] bg-[#f1f8f3] p-3 text-xs leading-5 text-[#267448]">Your message is ready in WhatsApp. Press send there to reach the team. If it didn’t open, <a href={whatsAppDraftUrl} target="_blank" rel="noopener noreferrer" className="font-extrabold underline">open your message</a>.</div>}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="contact-name" className="form-label">Your name</label><input id="contact-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required autoComplete="name" className="form-field" placeholder="Your name" /></div><div><label htmlFor="contact-email" className="form-label">Email address</label><input id="contact-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required autoComplete="email" className="form-field" placeholder="you@example.com" /></div></div>
              <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="contact-phone" className="form-label">Phone number <span className="font-normal text-[#8993a0]">(optional)</span></label><input id="contact-phone" type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} autoComplete="tel" className="form-field" placeholder="+263 ..." /></div><div><label htmlFor="contact-subject" className="form-label">I’m asking about</label><select id="contact-subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="form-field"><option>General question</option><option>An existing order</option><option>A custom cut or pack</option><option>Bulk family order</option><option>Branch information</option></select></div></div>
              <div><label htmlFor="contact-message" className="form-label">Your message</label><textarea id="contact-message" rows={5} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} required className="form-field min-h-[130px] resize-y" placeholder="Tell us how we can help..." /></div>
              <button type="submit" className="btn-primary"><Send className="h-4 w-4" />Prepare WhatsApp message</button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};
