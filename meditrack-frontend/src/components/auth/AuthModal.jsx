import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../contexts/AuthContext'
import { useAuthModal } from '../../contexts/AuthModalContext'

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuthModal()
  const { login, googleConfigured } = useAuth()

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return
    const ok = await login(credentialResponse.credential)
    if (ok) closeAuthModal()
  }

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
        >
          <motion.div
            className="w-full max-w-app mx-auto bg-[#080B0F] border-t border-[#1C2530] rounded-t-[2.5rem] px-8 pt-14 pb-20 relative"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-[#1C2530]" />

            <div className="text-center">
              <h2 className="font-display text-3xl text-[#F0F4F8] mb-3">Sync Your Records</h2>
              <p className="font-sans text-sm text-[#3D5166] leading-relaxed max-w-[280px] mx-auto mb-10">
                Sign in to securely save your health data and access it from any device.
              </p>
              
              <div className="flex justify-center mb-8 w-full">
                {googleConfigured ? (
                  <div className="w-full flex justify-center">
                    <GoogleLogin 
                      onSuccess={handleSuccess} 
                      onError={() => {}} 
                      useOneTap={false}
                      theme="filled_black"
                      shape="pill"
                    />
                  </div>
                ) : (
                  <div className="w-full bg-[#0E1318] border border-[#1C2530] rounded-2xl p-5 text-left">
                    <p className="font-mono text-[10px] text-[#3D5166] uppercase tracking-widest mb-1.5">
                      Configuration required
                    </p>
                    <p className="font-sans text-xs text-[#8A9BAE] leading-relaxed">
                      Google Sign-In is not enabled. Add your Client ID to the environment settings to persist your health data.
                    </p>
                  </div>
                )}
              </div>

              <button 
                onClick={closeAuthModal}
                className="font-sans text-sm text-[#3D5166] hover:text-[#8A9BAE] press font-medium"
              >
                Continue as Guest
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

