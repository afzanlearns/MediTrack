import React from 'react';
import { Lock } from 'lucide-react';
import { useAuthModal } from '../contexts/AuthModalContext';

const LockedPage = ({ featureName }) => {
  const { openAuthModal } = useAuthModal();

  return (
    <div className="mx-5 mt-20 text-center">
      <div className="bg-surface border border-edge rounded-xl p-8">
        <Lock size={40} className="text-ink-4 mx-auto mb-4" />
        <h1 className="text-lg font-bold text-ink mb-2">Sign in Required</h1>
        <p className="text-sm text-ink-2 mb-6">
          {featureName} requires a free account.
        </p>
        <button
          onClick={() => openAuthModal(featureName)}
          className="bg-brand text-white rounded-xl py-4 w-full font-bold"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LockedPage;
