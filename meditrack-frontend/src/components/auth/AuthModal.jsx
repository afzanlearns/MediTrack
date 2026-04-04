import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { X } from 'lucide-react';
import googleLogo from '../../assets/google-logo.svg';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuthModal();

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const sheetVariants = {
    hidden: { y: '100%' },
    visible: { y: 0, transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] } },
    exit: { y: '100%', transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] } },
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={closeAuthModal}
        >
          <motion.div
            className="bg-surface w-full rounded-t-2xl pb-8"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-2">
              <button onClick={closeAuthModal} className="p-2 rounded-full hover:bg-surface-2">
                <X size={20} className="text-ink-3" />
              </button>
            </div>
            <div className="px-6 text-center">
              <h2 className="text-xl font-bold text-ink">Unlock All Features</h2>
              <p className="text-sm text-ink-3 mt-2 mb-6">
                Sign in to securely save your health data and access it from any device.
              </p>
              <button className="w-full bg-bg-surface border border-edge rounded-xl py-3.5 flex items-center justify-center gap-3 shadow-sm hover:bg-surface-2 transition-colors">
                <img src={googleLogo} alt="Google" className="w-5 h-5" />
                <span className="font-bold text-sm text-ink">Sign in with Google</span>
              </button>
              <p className="text-xs text-ink-4 mt-4">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
