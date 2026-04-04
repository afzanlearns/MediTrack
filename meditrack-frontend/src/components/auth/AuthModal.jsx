import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import { X } from 'lucide-react'
import googleLogo from '../../assets/google-logo.svg'
import { useAuth } from '../../contexts/AuthContext'
import { useAuthModal } from '../../contexts/AuthModalContext'

const AuthModal = () => {
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
          className="fixed inset-0 z-50 flex items-end bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
        >
          <motion.div
            className="w-full rounded-t-3xl border border-[#1E2D3D] bg-[#0F1722] pb-8"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-2">
              <button
                onClick={closeAuthModal}
                className="rounded-full p-2 text-[#6A7E92] transition-colors hover:bg-[#162232] hover:text-[#E8EDF2]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 text-center">
              <h2 className="text-2xl font-bold text-[#E8EDF2]">Unlock All Features</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-[#8BA3BA]">
                Sign in to securely save your health data and sync it across devices.
              </p>

              <div className="mt-6">
                {googleConfigured ? (
                  <div className="flex justify-center">
                    <GoogleLogin onSuccess={handleSuccess} onError={() => {}} useOneTap={false} />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[#F59E0B33] bg-[#F59E0B0D] p-4 text-left">
                    <div className="flex items-center gap-3">
                      <img src={googleLogo} alt="Google" className="h-5 w-5" />
                      <p className="text-sm font-semibold text-[#E8EDF2]">Google sign-in not configured yet</p>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#D5B17A]">
                      Add <code>VITE_GOOGLE_CLIENT_ID</code> in your frontend environment to enable sign-in.
                      You can continue using guest mode right now.
                    </p>
                  </div>
                )}
              </div>

              <p className="mt-4 text-xs text-[#60788F]">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AuthModal
