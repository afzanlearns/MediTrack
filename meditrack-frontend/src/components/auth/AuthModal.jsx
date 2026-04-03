import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { useAuth } from '../../contexts/AuthContext';

const AuthModal = () => {
  const { isOpen, closeAuthModal, featureName } = useAuthModal();
  const { enterGuestMode, isGuest } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeAuthModal} size="sm">
      <div className="text-center">
        <div className="bg-accent-light p-3 rounded-full w-fit mx-auto mb-4">
          <ShieldCheck className="w-10 h-10 text-accent" />
        </div>
        
        <h2 className="text-xl font-bold mb-2">Sign in to MediTrack</h2>
        
        {featureName ? (
          <p className="text-sm text-text-secondary mb-6 leading-relaxed">
            You need an account to use <span className="font-semibold text-text-primary">{featureName}</span>.
          </p>
        ) : (
          <p className="text-sm text-text-secondary mb-6 leading-relaxed">
            Sign in to sync your data across devices and unlock all features.
          </p>
        )}

        <button
          onClick={() => {
            closeAuthModal();
            navigate('/login');
          }}
          className="w-full border border-border rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-page-bg transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          <span className="text-sm font-semibold">Continue with Google</span>
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-3 text-xs text-text-secondary uppercase tracking-wider">or</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        {!isGuest && (
          <button
            onClick={() => {
              enterGuestMode();
              closeAuthModal();
            }}
            className="w-full text-sm text-text-secondary hover:text-text-primary transition-colors py-1"
          >
            Continue as guest
          </button>
        )}

        {isGuest && (
          <p className="text-[10px] text-text-secondary mt-4 leading-tight italic">
            By signing in, your current data will be synced to your account.
          </p>
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;
