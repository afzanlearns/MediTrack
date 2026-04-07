import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'
import { useRegisterSW } from 'virtual:pwa-register/react'

const googleClientId = '1052240755199-mf2k20ah0dtv9vdmav9629apensh763j.apps.googleusercontent.com'

function ServiceWorkerRegistration() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('MediTrack service worker registered')
    },
    onRegisterError(error) {
      console.log('Service worker registration error:', error)
    },
  })

  return needRefresh ? (
    <div style={{
      position: 'fixed', bottom: '80px', left: '16px', right: '16px',
      background: '#00C896', color: '#080B0F', borderRadius: '12px',
      padding: '12px 16px', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <span style={{ fontSize: '14px', fontWeight: 600 }}>
        New version available
      </span>
      <button
        onClick={() => updateServiceWorker(true)}
        style={{
          background: 'white', color: '#00C896', border: 'none',
          borderRadius: '8px', padding: '6px 14px',
          fontSize: '13px', fontWeight: 700, cursor: 'pointer'
        }}
      >
        Update
      </button>
    </div>
  ) : null
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
      <ServiceWorkerRegistration />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
