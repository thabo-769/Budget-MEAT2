import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, ShieldAlert, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    try {
      if (await login(email, password)) navigate('/account');
      else setError('We couldn’t match that email and password. Check your details or create an account.');
    } catch {
      setError('Sign in is unavailable in this browser. Please try again or continue as a guest.');
    }
  };

  return (
    <div className="min-h-[72vh] bg-[#f6f9ff] py-10 sm:py-16">
      <div className="page-shell grid max-w-5xl overflow-hidden rounded-lg border border-[#e5e7e9] bg-white shadow-[0_18px_60px_rgba(8,40,105,.09)] md:grid-cols-2">
        <div className="relative hidden min-h-[560px] bg-[#082869] md:block"><img src="/images/hero_cutting_board.jpg" alt="Fresh cuts selected at the butcher’s counter" className="absolute inset-0 h-full w-full object-cover opacity-55" /><div className="absolute inset-0 bg-gradient-to-t from-[#061b50] via-[#061b50]/25 to-[#061b50]/15" /><div className="absolute inset-x-0 bottom-0 p-9 text-white"><p className="eyebrow !text-[#ed1c2e]">Back to the table</p><h2 className="font-display mt-3 text-4xl leading-tight">Your favourites.<br />Just a little closer.</h2><p className="mt-3 max-w-sm text-sm leading-6 text-white/75">Keep your details handy and see the orders you’ve placed from this browser.</p></div></div>
        <div className="p-6 sm:p-10 md:p-12">
          <div className="mb-8"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#edf2fb] text-[#082869]"><UserRound className="h-5 w-5" /></div><p className="eyebrow">Welcome back</p><h1 className="font-display mt-1 text-4xl text-[#082869]">Sign in.</h1><p className="mt-2 text-sm leading-6 text-[#758295]">See your orders and speed up your next visit.</p></div>
          {error && <div role="alert" className="mb-5 flex items-start gap-2 rounded border border-[#f2c9cc] bg-[#fff5f5] p-3 text-xs text-[#a72832]"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label htmlFor="email" className="form-label">Email address</label><div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8993a0]" /><input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" className="form-field pl-10" /></div></div>
            <div><label htmlFor="password" className="form-label">Password</label><div className="relative"><LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8993a0]" /><input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Your password" className="form-field pl-10" /></div></div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:cursor-wait disabled:opacity-60">{isLoading ? 'Signing you in…' : <>Sign in <ArrowRight className="h-4 w-4" /></>}</button>
          </form>
          <div className="mt-6 border-t border-[#e8eaed] pt-5 text-center"><p className="text-xs text-[#758295]">New here? <Link to="/register" className="font-extrabold text-[#ed1c2e] hover:underline">Create an account</Link></p><p className="mt-5 text-[10px] leading-5 text-[#8993a0]">This account experience runs in your browser for demonstration. For a quick look, use <strong>customer@demo.com</strong> / <strong>demo1234</strong>.</p></div>
        </div>
      </div>
    </div>
  );
};
