import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ArrowRight, LockKeyhole, Plane, Shield, X } from 'lucide-react';

type AuthMode = 'signin' | 'signup' | 'admin';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, login, setActiveRoute } = useAppStore();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isAuthModalOpen) return null;

  const close = () => {
    setAuthModalOpen(false);
    setError('');
  };

  const enterTraveler = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    if (mode === 'signup' && (!name.trim() || !email.trim())) {
      setError('Add your name and email to create a demo profile.');
      setBusy(false);
      return;
    }
    if (mode === 'signin' && !email.trim()) {
      setError('Enter an email address to open your local demo profile.');
      setBusy(false);
      return;
    }
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => undefined);
    login('traveler', name.trim() || undefined, email.trim());
    setActiveRoute('/account');
    setBusy(false);
    close();
  };

  const enterAdmin = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Admin sign-in failed.');
      login('admin');
      setActiveRoute('/admin');
      window.dispatchEvent(new Event('aerovista-admin-authenticated'));
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const selectMode = (next: AuthMode) => {
    setMode(next);
    setError('');
    setAccessCode('');
  };

  return (
    <div className="fixed inset-0 z-[90] bg-[#07191e]/80 p-3 sm:p-6 grid place-items-center" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="auth-title" className="relative w-full max-w-4xl min-h-[min(640px,92dvh)] bg-[#f4f2ec] text-[#12282c] shadow-[0_35px_100px_rgba(0,0,0,.45)] grid md:grid-cols-[.82fr_1.18fr] overflow-y-auto">
        <button type="button" onClick={close} aria-label="Close sign-in" className="absolute z-10 top-4 right-4 w-10 h-10 grid place-items-center border border-black/10 bg-[#f4f2ec]/90 hover:bg-white"><X size={18}/></button>
        <aside className="relative min-h-[190px] md:min-h-full bg-[#102b30] text-[#f4f2ec] p-7 sm:p-10 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 48px, rgba(201,169,85,.22) 49px, transparent 50px)' }}/>
          <div className="relative"><span className="text-[10px] tracking-[.3em] uppercase text-[#d4b86e]">Aerovista · travel planning</span><div className="mt-10 md:mt-20 text-6xl sm:text-7xl font-serif leading-[.86]">A trip<br/><i className="text-[#d4b86e]">starts here.</i></div></div>
          <p className="relative max-w-xs mt-8 text-sm leading-6 text-white/65">Sign in to your local demo profile, or create one to explore the traveler dashboard. This prototype does not create a real account.</p>
          <div className="relative hidden md:flex items-center gap-3 mt-10 text-[10px] tracking-[.2em] uppercase text-white/50"><span className="w-8 h-px bg-[#d4b86e]"/> West African departures · sample data</div>
        </aside>
        <div className="p-6 sm:p-10 md:p-14 flex flex-col justify-center">
          <p className="text-[10px] tracking-[.25em] uppercase text-[#94752e]">Your travel desk</p>
          <h2 id="auth-title" className="mt-3 font-serif text-4xl sm:text-5xl leading-tight">{mode === 'admin' ? 'Admin access' : mode === 'signup' ? 'Create a demo profile' : 'Welcome back'}</h2>
          <p className="mt-3 text-sm leading-6 text-[#536366]">{mode === 'admin' ? 'Admin access requires a server-configured access code. There is no public demo shortcut.' : 'Your traveler profile stays in this browser. Do not enter sensitive or payment information.'}</p>

          {mode !== 'admin' ? <>
            <div className="mt-8 grid grid-cols-2 border-b border-[#c9c8c0] text-sm">
              <button type="button" aria-pressed={mode === 'signin'} onClick={() => selectMode('signin')} className={`py-3 border-b-2 ${mode === 'signin' ? 'border-[#94752e] text-[#12282c]' : 'border-transparent text-[#758184]'}`}>Sign in</button>
              <button type="button" aria-pressed={mode === 'signup'} onClick={() => selectMode('signup')} className={`py-3 border-b-2 ${mode === 'signup' ? 'border-[#94752e] text-[#12282c]' : 'border-transparent text-[#758184]'}`}>Create profile</button>
            </div>
            <form onSubmit={enterTraveler} className="mt-6 space-y-4">
              {mode === 'signup' && <label className="block text-xs font-medium">Name<input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="How should we address you?" className="mt-2 w-full h-12 px-4 bg-white border border-[#d4d3cb] focus:border-[#94752e] outline-none" required/></label>}
              <label className="block text-xs font-medium">Email<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 w-full h-12 px-4 bg-white border border-[#d4d3cb] focus:border-[#94752e] outline-none" required/></label>
              <button disabled={busy} className="w-full min-h-12 px-5 bg-[#102b30] text-white hover:bg-[#1b4549] disabled:opacity-50 flex items-center justify-between text-sm"><span>{busy ? 'Opening your profile…' : mode === 'signup' ? 'Create local demo profile' : 'Continue to my trips'}</span><ArrowRight size={17}/></button>
            </form>
            <button type="button" onClick={() => selectMode('admin')} className="mt-8 pt-5 border-t border-[#d4d3cb] w-full flex items-center gap-3 text-left text-xs text-[#536366] hover:text-[#102b30]"><Shield size={17}/><span>Administrator? Use protected sign-in</span><ArrowRight className="ml-auto" size={15}/></button>
          </> : <form onSubmit={enterAdmin} className="mt-8 space-y-4">
            <label className="block text-xs font-medium">Server access code<input type="password" autoComplete="current-password" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder="Enter your administrator code" className="mt-2 w-full h-12 px-4 bg-white border border-[#d4d3cb] focus:border-[#94752e] outline-none" required/></label>
            <button disabled={busy} className="w-full min-h-12 px-5 bg-[#102b30] text-white hover:bg-[#1b4549] disabled:opacity-50 flex items-center justify-between text-sm"><span>{busy ? 'Checking access…' : 'Sign in to operations'}</span><LockKeyhole size={17}/></button>
            <button type="button" onClick={() => selectMode('signin')} className="text-xs text-[#536366] hover:text-[#102b30]">← Back to traveler sign-in</button>
          </form>}
          {error && <p role="alert" className="mt-4 border-l-2 border-[#8e3b2e] pl-3 text-sm text-[#8e3b2e]">{error}</p>}
          <div className="mt-7 text-[10px] leading-5 text-[#758184]">Demo only. No booking, payment, email verification or credit application is submitted.</div>
        </div>
      </section>
    </div>
  );
};
