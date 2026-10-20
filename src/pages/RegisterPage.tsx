import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, Phone, ShieldAlert, UserRoundPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const update = (event: ChangeEvent<HTMLInputElement>) => setFormData((form) => ({ ...form, [event.target.name]: event.target.value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    try {
      if (await register(formData)) navigate('/account');
      else setError('That email already has an account. Try signing in instead.');
    } catch {
      setError('We couldn’t create your account in this browser. Please try again.');
    }
  };

  return (
    <div className="min-h-[72vh] bg-[#f6f9ff] py-10 sm:py-16">
      <div className="page-shell grid max-w-5xl overflow-hidden rounded-lg border border-[#e5e7e9] bg-white shadow-[0_18px_60px_rgba(8,40,105,.09)] md:grid-cols-2">
        <div className="relative hidden min-h-[600px] bg-[#082869] md:block"><img src="/images/family_bundles_banner.jpg" alt="A butcher’s selection ready to share" className="absolute inset-0 h-full w-full object-cover opacity-55" /><div className="absolute inset-0 bg-gradient-to-t from-[#061b50] via-[#061b50]/25 to-[#061b50]/10" /><div className="absolute inset-x-0 bottom-0 p-9 text-white"><p className="eyebrow !text-[#ed1c2e]">Pull up a chair</p><h2 className="font-display mt-3 text-4xl leading-tight">There’s always room<br />for one more.</h2><p className="mt-3 max-w-sm text-sm leading-6 text-white/75">Join us for fresh cuts, family bundles and the next good meal.</p></div></div>
        <div className="p-6 sm:p-10 md:p-12">
          <div className="mb-7"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#edf2fb] text-[#082869]"><UserRoundPlus className="h-5 w-5" /></div><p className="eyebrow">Join the table</p><h1 className="font-display mt-1 text-4xl text-[#082869]">Create an account.</h1><p className="mt-2 text-sm text-[#758295]">Your details will be ready for next time.</p></div>
          {error && <div role="alert" className="mb-5 flex items-start gap-2 rounded border border-[#f2c9cc] bg-[#fff5f5] p-3 text-xs text-[#a72832]"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3"><div><label htmlFor="firstName" className="form-label">First name</label><input id="firstName" name="firstName" autoComplete="given-name" value={formData.firstName} onChange={update} required className="form-field" /></div><div><label htmlFor="lastName" className="form-label">Last name</label><input id="lastName" name="lastName" autoComplete="family-name" value={formData.lastName} onChange={update} required className="form-field" /></div></div>
            <div><label htmlFor="email" className="form-label">Email address</label><div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8993a0]" /><input id="email" name="email" type="email" autoComplete="email" value={formData.email} onChange={update} required className="form-field pl-10" placeholder="you@example.com" /></div></div>
            <div><label htmlFor="phone" className="form-label">Mobile number <span className="font-normal text-[#8993a0]">(optional)</span></label><div className="relative"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8993a0]" /><input id="phone" name="phone" type="tel" autoComplete="tel" value={formData.phone} onChange={update} placeholder="+263 ..." className="form-field pl-10" /></div></div>
            <div><label htmlFor="password" className="form-label">Create a password</label><div className="relative"><LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8993a0]" /><input id="password" name="password" type="password" autoComplete="new-password" value={formData.password} onChange={update} minLength={8} required className="form-field pl-10" placeholder="At least 8 characters" /></div></div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:cursor-wait disabled:opacity-60">{isLoading ? 'Creating your account…' : <>Create my account <ArrowRight className="h-4 w-4" /></>}</button>
          </form>
          <p className="mt-5 border-t border-[#e8eaed] pt-5 text-center text-xs text-[#758295]">Already have an account? <Link to="/login" className="font-extrabold text-[#ed1c2e] hover:underline">Sign in</Link></p>
          <p className="mt-4 text-center text-[10px] leading-5 text-[#8993a0]">This demo account is saved only in your browser. The live shop will need a secure account service.</p>
        </div>
      </div>
    </div>
  );
};
