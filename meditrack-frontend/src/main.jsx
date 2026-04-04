import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'

const rawGoogleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim()
const googleClientId = rawGoogleClientId || 'YOUR_GOOGLE_CLIENT_ID'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
