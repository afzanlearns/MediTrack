/*
 GOOGLE OAUTH SETUP (do once):
 1. Go to https://console.cloud.google.com
 2. Create a new project called "MediTrack"
 3. Go to APIs & Services → Credentials
 4. Click "Create Credentials" → "OAuth 2.0 Client ID"
 5. Application type: Web application
 6. Add Authorized JavaScript origins: http://localhost:5173
 7. Add Authorized redirect URIs: http://localhost:5173
 8. Copy the Client ID
 9. In main.jsx, replace YOUR_GOOGLE_CLIENT_ID with the copied ID
10. In application.properties, set app.google.client-id=<same ID>
*/

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Shield, Activity, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    const success = await authLogin(credentialResponse.credential);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-page-bg font-sans">
      {/* Left Panel */}
      <div className="hidden md:flex md:w-[45%] bg-sidebar flex-col justify-center p-12 text-white">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">MediTrack</h1>
          <p className="text-sidebar-text text-lg mt-2">Personal Health Record System</p>
        </div>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-sidebar-hover flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Your data stays private</h3>
              <p className="text-sidebar-text text-sm">Secure HIPAA-compliant storage for your medical records.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-sidebar-hover flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Track vitals & medications</h3>
              <p className="text-sidebar-text text-sm">Comprehensive monitoring of your daily health metrics.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-sidebar-hover flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Emergency access anywhere</h3>
              <p className="text-sidebar-text text-sm">Instant access to critical health info when it matters most.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-bg-surface p-8">
        <div className="max-w-sm w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Welcome back</h2>
            <p className="text-sm text-text-secondary mt-1">Sign in to your health dashboard</p>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {}}
              useOneTap={false}
            />
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-bg-surface px-2 text-text-secondary">or</span>
            </div>
          </div>

          <p className="text-xs text-text-secondary text-center leading-relaxed">
            New to MediTrack? Your account is created automatically on first sign in.
          </p>

          <div className="mt-12 pt-8 border-t border-border flex flex-col items-center">
            <p className="text-[10px] text-text-secondary text-center">
              By continuing, you agree to our <br />
              <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
