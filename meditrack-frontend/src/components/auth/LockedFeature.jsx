import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthModal } from '../../contexts/AuthModalContext';
import Button from '../ui/Button';

const LockedFeature = ({ featureName }) => {
  const { openAuthModal } = useAuthModal();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-page-bg p-6 rounded-full mb-6">
        <Lock className="w-12 h-12 text-text-secondary opacity-30" />
      </div>
      
      <h2 className="text-2xl font-bold text-text-primary mb-2">
        {featureName}
      </h2>
      
      <p className="text-text-secondary max-w-sm mb-8">
        This feature requires a free account to securely store and sync your health records.
      </p>
      
      <div className="space-y-4 w-full max-w-xs">
        <Button 
          variant="primary" 
          fullWidth
          onClick={() => openAuthModal(featureName)}
        >
          Sign in with Google
        </Button>
        
        <Link 
          to="/" 
          className="flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default LockedFeature;
