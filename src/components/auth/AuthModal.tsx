import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  X,
  ShieldCheck,
  Lock,
  Plane,
  Fingerprint,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  EyeOff,
  Radio,
  Cpu,
  User,
  Mail,
  Award,
  Terminal,
  ShieldAlert
} from 'lucide-react';

type PortalMode = 'traveler-signin' | 'traveler-enrol' | 'atc-admin';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, login, setActiveRoute, currentUser } = useAppStore();

  const [portalMode, setPortalMode] = useState<PortalMode>('traveler-signin');
  const [travelerIdentifier, setTravelerIdentifier] = useState('folashade.adeleke@lagoonhealth.ng');
  const [travelerName, setTravelerName] = useState('Dr. Folashade Adeleke');
  const [travelerTier, setTravelerTier] = useState<'Onyx Presidential' | 'Gold Sovereign' | 'Silver Vanguard'>('Onyx Presidential');
  const [travelerBvn, setTravelerBvn] = useState('2234 •••• 8901');

  // Admin Security States
  const [stationId, setStationId] = useState('LOS-MM2-ATC-ALPHA');
  const [adminAccessKey, setAdminAccessKey] = useState('');
  const [totpToken, setTotpToken] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Status feedback
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [securityLog, setSecurityLog] = useState<string[]>([]);

  // Hardware TOTP cadence timer for ATC clearance
  const [totpCountdown, setTotpCountdown] = useState(28);

  useEffect(() => {
    const timer = setInterval(() => {
      setTotpCountdown((prev) => (prev > 1 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setAuthModalOpen(false);
    setStatusMsg(null);
    setSecurityLog([]);
  };

  /* ─── Traveler Authentication ─── */
  const handleTravelerAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatusMsg({ type: 'info', text: 'Verifying sovereign biometric passport and CBN GDS registry...' });

    setTimeout(async () => {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => undefined);
      login('traveler', travelerName.trim() || undefined, travelerIdentifier.trim());
      setIsProcessing(false);
      setStatusMsg({ type: 'success', text: 'Biometric authorization nominal. Sovereign credentials verified.' });
      setTimeout(() => {
        handleClose();
        setActiveRoute('/account');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 700);
    }, 600);
  };

  /* ─── One-Click Passkey Touch ID / FaceID Sign-in ─── */
  const handleBiometricPasskey = async () => {
    setIsProcessing(true);
    setStatusMsg({ type: 'info', text: 'Engaging device hardware passkey (Touch ID / FaceID / FIDO2)...' });

    setTimeout(async () => {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => undefined);
      login('traveler', travelerName, travelerIdentifier);
      setIsProcessing(false);
      setStatusMsg({ type: 'success', text: 'FIDO2 Passkey authenticated. Welcome aboard.' });
      setTimeout(() => {
        handleClose();
        setActiveRoute('/account');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 700);
    }, 800);
  };

  /* ─── ATC Administrator Hardened Clearance ─── */
  const handleAdminClearance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) {
      setStatusMsg({ type: 'error', text: `Station locked. Security lockout active for ${lockoutRemaining}s.` });
      return;
    }

    setIsProcessing(true);
    setSecurityLog([
      `[HANDSHAKE] Connecting to MM2 Station Security Hub...`,
      `[CRYPT] Validating 256-bit Station Key for Station ${stationId}...`,
    ]);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: adminAccessKey.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        if (nextFailed >= 4) {
          setLockoutRemaining(60);
          throw new Error('Maximum failed clearance threshold breached. Terminal locked for 60 seconds.');
        }
        throw new Error(result.error || `Clearance rejected. (Attempt ${nextFailed} of 4)`);
      }

      setSecurityLog((prev) => [
        ...prev,
        `[CERT] NCAA/FAA Dispatch License #A00918234 verified.`,
        `[AUTH_OK] Station Commander Kayode Balogun authenticated.`,
      ]);

      setStatusMsg({ type: 'success', text: 'ATC Operations clearance confirmed. Initializing Dispatch HUD...' });
      login('admin');
      window.dispatchEvent(new Event('cjtravels-admin-authenticated'));

      setTimeout(() => {
        handleClose();
        setActiveRoute('/admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 900);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Clearance rejected. Check Station Key.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#030B0E]/85 backdrop-blur-xl p-3 sm:p-6 grid place-items-center animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isProcessing) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-4xl bg-[#07161B]/95 text-white border border-[#2B7574]/60 shadow-[0_30px_100px_rgba(0,0,0,0.85)] rounded-3xl overflow-hidden grid lg:grid-cols-[1fr_1.25fr]"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={isProcessing}
          aria-label="Close authentication modal"
          className="absolute z-20 top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-[#A5D1E1] hover:text-white border border-white/10 grid place-items-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ═══════════════════════════════════════════════════════════════
            LEFT FLIGHT DECK COLUMN (Sovereign Telemetry & Visual)
           ═══════════════════════════════════════════════════════════════ */}
        <div className="relative p-6 sm:p-10 bg-gradient-to-b from-[#091F26] via-[#0E2931] to-[#07161B] border-b lg:border-b-0 lg:border-r border-[#2B7574]/40 flex flex-col justify-between overflow-hidden">
          <div className="bg-topo absolute inset-0 opacity-15 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2B632]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#F2B632] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#F2B632] animate-pulse" />
              <span>CJ TRAVELS SECURITY PROTOCOL 4.2</span>
            </div>

            <div>
              <h2 className="font-monument text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight">
                {portalMode === 'atc-admin' ? (
                  <>
                    Airspace <br />
                    <span className="text-[#F2B632]">Command Deck</span>
                  </>
                ) : (
                  <>
                    Sovereign <br />
                    <span className="text-[#F2B632]">Traveler Vault</span>
                  </>
                )}
              </h2>
              <p className="text-xs text-[#A5D1E1]/80 font-mono mt-2 leading-relaxed">
                {portalMode === 'atc-admin'
                  ? 'Hardware-authenticated air traffic telemetry, automated GDS underwriting, and MM2 runway dispatch.'
                  : 'Encrypted passenger credentials, biometric fast-track at MM2 & DNAA, and sovereign 0% APR flight financing.'}
              </p>
            </div>
          </div>

          {/* Telemetry Micro-Widget */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/10 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[#A5D1E1]">
              <span className="text-[10px] uppercase">Encryption Grade</span>
              <span className="text-emerald-400 font-bold">256-Bit TLS · Zero-Knowledge</span>
            </div>
            <div className="flex items-center justify-between text-[#A5D1E1]">
              <span className="text-[10px] uppercase">GDS Verification</span>
              <span className="text-[#F2B632] font-bold">CBN FX Escrow Pegged</span>
            </div>
            <div className="flex items-center justify-between text-[#A5D1E1]">
              <span className="text-[10px] uppercase">MM2 Fast-Track</span>
              <span className="text-emerald-400 font-bold">Biometric Gate Active</span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            RIGHT INTERACTIVE AUTH CONSOLE
           ═══════════════════════════════════════════════════════════════ */}
        <div className="p-6 sm:p-10 flex flex-col justify-center space-y-6">
          {/* Top Mode Navigation Tabs */}
          <div className="grid grid-cols-3 p-1 rounded-2xl bg-[#040E12] border border-[#2B7574]/40 text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                setPortalMode('traveler-signin');
                setStatusMsg(null);
              }}
              className={`py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                portalMode === 'traveler-signin'
                  ? 'bg-[#12484C] text-[#F2B632] border border-[#2B7574]/80 shadow-md'
                  : 'text-[#A5D1E1] hover:text-white'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setPortalMode('traveler-enrol');
                setStatusMsg(null);
              }}
              className={`py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                portalMode === 'traveler-enrol'
                  ? 'bg-[#12484C] text-[#F2B632] border border-[#2B7574]/80 shadow-md'
                  : 'text-[#A5D1E1] hover:text-white'
              }`}
            >
              Enrol
            </button>

            <button
              type="button"
              onClick={() => {
                setPortalMode('atc-admin');
                setStatusMsg(null);
              }}
              className={`py-2.5 rounded-xl font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                portalMode === 'atc-admin'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-md'
                  : 'text-[#A5D1E1] hover:text-rose-300'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>ATC Clearance</span>
            </button>
          </div>

          {/* Status Toast Message */}
          {statusMsg && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2.5 ${
                statusMsg.type === 'error'
                  ? 'bg-rose-950/70 border-rose-500/60 text-rose-300'
                  : statusMsg.type === 'success'
                  ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300'
                  : 'bg-[#12484C]/60 border-[#2B7574]/60 text-cyan-300'
              }`}
            >
              {statusMsg.type === 'error' ? (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              ) : statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <Radio className="w-4 h-4 shrink-0 text-cyan-400 animate-pulse" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              MODE 1: TRAVELER SIGN IN
             ───────────────────────────────────────────────────────────── */}
          {portalMode === 'traveler-signin' && (
            <form onSubmit={handleTravelerAuth} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#A5D1E1] mb-1.5">
                  Sovereign Email or Mobile ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#F2B632] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={travelerIdentifier}
                    onChange={(e) => setTravelerIdentifier(e.target.value)}
                    placeholder="folashade.adeleke@lagoonhealth.ng"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#040E12] border border-[#2B7574]/50 focus:border-[#F2B632] text-sm text-white font-mono outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Instant Biometric Passkey CTA */}
              <button
                type="button"
                onClick={handleBiometricPasskey}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-[#091F26] hover:bg-[#0e2c36] text-[#F2B632] border border-[#2B7574]/60 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md group"
              >
                <Fingerprint className="w-4 h-4 text-[#F2B632] group-hover:scale-110 transition-transform" />
                <span>Instant Sign In with Biometric Passkey</span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#07161B] px-3 text-[10px] font-mono text-[#A5D1E1] uppercase">Or verify credentials</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full h-12 btn-gold text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>{isProcessing ? 'Authenticating...' : 'Enter Sovereign Traveler Desk'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ─────────────────────────────────────────────────────────────
              MODE 2: TRAVELER ENROLMENT
             ───────────────────────────────────────────────────────────── */}
          {portalMode === 'traveler-enrol' && (
            <form onSubmit={handleTravelerAuth} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#A5D1E1] mb-1">
                  Full Legal Name (as on Passport)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#F2B632] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    placeholder="e.g. Dr. Folashade Adeleke"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#040E12] border border-[#2B7574]/50 focus:border-[#F2B632] text-sm text-white font-mono outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#A5D1E1] mb-1">
                  Corporate / Diplomatic Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#F2B632] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={travelerIdentifier}
                    onChange={(e) => setTravelerIdentifier(e.target.value)}
                    placeholder="folashade.adeleke@lagoonhealth.ng"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#040E12] border border-[#2B7574]/50 focus:border-[#F2B632] text-sm text-white font-mono outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#A5D1E1] mb-1">
                    BVN / National ID (CBN Linked)
                  </label>
                  <input
                    type="text"
                    value={travelerBvn}
                    onChange={(e) => setTravelerBvn(e.target.value)}
                    placeholder="2234 •••• 8901"
                    className="w-full h-11 px-3.5 rounded-xl bg-[#040E12] border border-[#2B7574]/50 text-sm text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#A5D1E1] mb-1">
                    Privilege Tier
                  </label>
                  <select
                    value={travelerTier}
                    onChange={(e) => setTravelerTier(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-xl bg-[#040E12] border border-[#2B7574]/50 text-xs text-[#F2B632] font-mono font-bold outline-none cursor-pointer"
                  >
                    <option value="Onyx Presidential">Onyx Presidential</option>
                    <option value="Gold Sovereign">Gold Sovereign</option>
                    <option value="Silver Vanguard">Silver Vanguard</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full h-12 btn-gold text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
              >
                <span>{isProcessing ? 'Enrolling Profile...' : 'Complete Diplomatic Enrolment'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ─────────────────────────────────────────────────────────────
              MODE 3: RESTRICTED ATC AIRSPACE COMMAND CLEARANCE
             ───────────────────────────────────────────────────────────── */}
          {portalMode === 'atc-admin' && (
            <form onSubmit={handleAdminClearance} className="space-y-4">
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-2.5 text-[11px] font-mono text-rose-300">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-rose-200 uppercase tracking-wider">RESTRICTED DISPATCH CLEARANCE</strong>
                  Station authorization key and dynamic 2FA hardware token required. Unauthorized access attempts are logged and reported.
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#A5D1E1] mb-1">
                  Airspace Station Sector
                </label>
                <div className="relative">
                  <Cpu className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={stationId}
                    onChange={(e) => setStationId(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#040E12] border border-[#2B7574]/50 text-sm text-white font-mono outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono uppercase text-[#A5D1E1]">
                    Station Master Access Key
                  </label>
                  <span className="text-[10px] font-mono text-[#F2B632]">
                    Default: CJTRAVELS-ATC-COMMAND-2026
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#F2B632] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={adminAccessKey}
                    onChange={(e) => setAdminAccessKey(e.target.value)}
                    placeholder="Enter Station 256-bit Authorization Key"
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#040E12] border border-rose-500/40 focus:border-rose-400 text-sm text-white font-mono outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A5D1E1] hover:text-white"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Dynamic TOTP Authenticator Simulation */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono uppercase text-[#A5D1E1]">
                    Hardware Token Authenticator (TOTP)
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Cycle refresh in {totpCountdown}s
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={totpToken}
                  onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 784921 (Optional Token)"
                  className="w-full h-11 px-4 rounded-xl bg-[#040E12] border border-[#2B7574]/50 text-sm text-white font-mono tracking-widest outline-none text-center"
                />
              </div>

              {/* Security Handshake Terminal Output */}
              {securityLog.length > 0 && (
                <div className="p-3 rounded-xl bg-[#030A0D] border border-white/10 font-mono text-[10px] text-emerald-400 space-y-1 max-h-24 overflow-y-auto">
                  {securityLog.map((log, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-[#F2B632] shrink-0" />
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing || lockoutRemaining > 0}
                className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {lockoutRemaining > 0
                    ? `Station Locked (${lockoutRemaining}s)`
                    : isProcessing
                    ? 'Authenticating Station...'
                    : 'Authorize Airspace Command'}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
