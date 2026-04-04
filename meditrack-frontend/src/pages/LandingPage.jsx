import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Pill, ClipboardList, HeartPulse, Thermometer, Calendar, FileText, AlertTriangle, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAuthModal } from '../contexts/AuthModalContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { enterGuestMode } = useAuth();
  const { openAuthModal } = useAuthModal();

  const handleGetStarted = () => {
    enterGuestMode();
    navigate('/dashboard');
  };

  const features = [
    { label: 'Medications', icon: Pill },
    { label: 'Dose Log', icon: ClipboardList },
    { label: 'Vitals', icon: HeartPulse },
    { label: 'Symptoms', icon: Thermometer },
    { label: 'Appointments', icon: Calendar, isLocked: true },
    { label: 'Prescriptions', icon: FileText, isLocked: true },
    { label: 'Emergency', icon: AlertTriangle, isLocked: true },
  ];

  return (
    <div className="bg-surface-2 min-h-screen flex flex-col">
      <header className="px-5 pt-12 pb-6 flex justify-between items-center">
        <div className="text-xl font-bold text-ink">
          MediTrack
        </div>
        <button
          onClick={() => openAuthModal()}
          className="border border-edge rounded-full px-4 py-1.5 text-sm font-semibold text-ink-2 hover:bg-surface-3 transition"
        >
          Sign in
        </button>
      </header>

      <main className="flex-1 flex flex-col justify-center px-5 pb-12">
        <div className="inline-flex items-center gap-1.5 bg-brand-light rounded-full px-3 py-1 text-xs font-semibold text-brand-text mb-6">
          <ShieldCheck size={11} />
          <span>Personal Health Record</span>
        </div>

        <h1 className="text-[2.6rem] font-extrabold text-ink leading-[1.1] tracking-tight mb-4">
          Your health,
          <br />
          always with
          <br />
          you.
        </h1>

        <p className="text-base text-ink-2 leading-relaxed max-w-xs mb-8">
          Track medications, log vitals, and access emergency info — from any device.
        </p>

        <button
          onClick={handleGetStarted}
          className="w-full bg-brand text-white rounded-xl py-4 text-base font-bold shadow-brand active:scale-[0.97] transition flex items-center justify-center gap-2"
        >
          <span>Get Started Free</span>
          <ArrowRight size={18} />
        </button>

        <button
          onClick={() => openAuthModal()}
          className="w-full bg-surface border border-edge rounded-xl py-4 text-base font-semibold text-ink flex items-center justify-center gap-2.5 mt-3"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.20455C17.64 8.56682 17.5827 7.95273 17.4727 7.36364H9V10.845H13.8436C13.6355 11.97 13.0005 12.9232 12.0477 13.5618V15.8195H14.9564C16.6582 14.2527 17.64 11.945 17.64 9.20455Z" fill="#4285F4"/>
            <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5618C11.2418 14.1018 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
            <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29H0.957275V9.62182C0.501818 10.565 0.628636 11.43 0.957275 12.0418L3.96409 10.71Z" fill="#FBBC05"/>
            <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03591 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="text-xs text-ink-4 text-center mt-5">
          No account needed · Sign in anytime to save your data
        </p>
      </main>

      <section className="px-5 pb-16">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-4 mb-4">
          Everything you need
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 scroll-snap-x">
          {features.map((feature) => (
            <div key={feature.label} className="snap-start flex-shrink-0 bg-surface border border-edge rounded-full px-4 py-2.5 flex items-center gap-2">
              {feature.isLocked ? (
                <Lock size={15} className="text-ink-4" />
              ) : (
                <feature.icon size={15} className="text-brand" />
              )}
              <span className="text-sm font-semibold text-ink">{feature.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
