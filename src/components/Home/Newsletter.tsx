import { useState, type FormEvent } from 'react';
import { CheckCircle2, Mail } from 'lucide-react';

const NEWSLETTER_KEY = 'bms_newsletter_emails';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    try {
      const current = JSON.parse(localStorage.getItem(NEWSLETTER_KEY) || '[]') as string[];
      localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(Array.from(new Set([...current, normalizedEmail]))));
    } catch {
      localStorage.setItem(NEWSLETTER_KEY, JSON.stringify([normalizedEmail]));
    }
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="border-t border-[#e6e2da] bg-white py-14 sm:py-16">
      <div className="page-shell grid items-center gap-7 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="eyebrow mb-3 flex items-center gap-2"><Mail className="h-4 w-4" /> From our counter to your inbox</p>
          <h2 className="font-display text-3xl leading-tight text-[#082869] sm:text-4xl">A good deal is worth sharing.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#687789]">Get the weekly specials and family bundle offers before the weekend rush.</p>
        </div>
        {subscribed ? (
          <div role="status" className="flex items-start gap-3 rounded-md border border-[#b7dfc5] bg-[#eff8f2] p-5 text-sm font-semibold leading-5 text-[#276543]"><CheckCircle2 className="h-5 w-5 shrink-0" /> Your address is saved in this browser. Email delivery isn’t connected on this demo site yet.</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="specials-email">Email address</label>
            <input id="specials-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" required className="form-field min-h-[52px] flex-1" />
            <button type="submit" className="btn-primary min-h-[52px]">Send me the specials</button>
          </form>
        )}
        {!subscribed && <p className="-mt-4 text-[11px] text-[#8993a0] lg:col-start-2">Demo sign-up: your address stays on this device until a newsletter service is connected.</p>}
      </div>
    </section>
  );
};
