import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAuthModal } from '../contexts/AuthModalContext';
import { 
  ArrowRight, 
  Pill, 
  Activity, 
  Thermometer, 
  AlertTriangle, 
  FileText, 
  Calendar, 
  ShieldCheck,
  Lock
} from 'lucide-react';
import Button from '../components/ui/Button';

const FeatureCard = ({ icon: Icon, title, desc, locked }) => (
  <div className="bg-white border border-border rounded-xl p-6 relative hover:shadow-md transition-shadow">
    {locked && (
      <div className="absolute top-4 right-4 group">
        <Lock className="w-3 h-3 text-text-secondary/50" />
        <span className="absolute bottom-full right-0 mb-2 invisible group-hover:visible bg-text-primary text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
          Requires sign in
        </span>
      </div>
    )}
    <div className="bg-page-bg p-3 rounded-lg w-fit mb-4">
      <Icon className="w-6 h-6 text-accent" />
    </div>
    <h3 className="text-lg font-bold text-text-primary mb-2 leading-tight">
      {title}
    </h3>
    <p className="text-sm text-text-secondary leading-normal">
      {desc}
    </p>
  </div>
);

const LandingPage = () => {
  const { enterGuestMode } = useAuth();
  const { openAuthModal } = useAuthModal();

  const features = [
    { icon: Pill, title: "Medication Tracking", desc: "Never miss a dose with smart scheduling.", locked: false },
    { icon: Activity, title: "Vitals Monitoring", desc: "Track BP, sugar levels, and heart rate.", locked: false },
    { icon: Thermometer, title: "Symptom Journal", desc: "Log symptoms and visualise trends.", locked: false },
    { icon: AlertTriangle, title: "Emergency Mode", desc: "One tap to show critical info to paramedics.", locked: true },
    { icon: FileText, title: "Prescription Store", desc: "Upload and access your prescriptions.", locked: true },
    { icon: Calendar, title: "Appointments", desc: "Schedule and track medical visits.", locked: true }
  ];

  return (
    <div className="min-h-screen bg-page-bg font-sans selection:bg-accent/10">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <span className="text-xl font-bold text-text-primary">MediTrack</span>
          <span className="text-xs bg-accent-light text-accent rounded px-2 py-0.5 ml-2 font-semibold">PHR</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => openAuthModal()}>
            Sign in
          </Button>
          <Button variant="primary" size="sm" onClick={() => enterGuestMode()}>
            Get Started Free
          </Button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-4xl mx-auto text-center pt-24 pb-16 px-6">
        <h1 className="text-5xl font-bold text-text-primary leading-tight tracking-tight">
          Your health records,<br />always within reach.
        </h1>
        <p className="text-xl text-text-secondary mt-6 max-w-2xl mx-auto leading-relaxed">
          Track medications, monitor vitals, log symptoms, and access emergency information — all in one secure place.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Button variant="primary" size="lg" onClick={() => enterGuestMode()}>
            Start Using Free <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="secondary" size="lg" onClick={() => openAuthModal()}>
            <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Sign in with Google
          </Button>
        </div>
        <p className="mt-4 text-sm text-text-secondary">
          No account required to get started. Sign in later to sync your data.
        </p>
      </section>

      {/* FEATURES GRID */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto px-6">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </section>

      {/* AUTH REQUIRED BANNER */}
      <section className="mt-12 max-w-2xl mx-auto px-6">
        <div className="bg-accent-light border border-accent/20 rounded-xl p-5 flex items-start gap-4">
          <ShieldCheck className="w-8 h-8 text-accent shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-text-primary mb-1">Sign in to unlock all features</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              Prescriptions, appointments, emergency exports, and cloud sync require a free account. Your guest data syncs automatically when you sign in.
            </p>
            <Button variant="primary" size="sm" onClick={() => openAuthModal()}>
              Sign in with Google
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-border py-8 text-center text-sm text-text-secondary">
        MediTrack PHR — Personal Health Record System
      </footer>
    </div>
  );
};

export default LandingPage;
