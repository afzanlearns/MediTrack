import { useState, useEffect } from 'react'

/**
 * Global toast notification component.
 * Listens for the 'api-error' custom event dispatched by the Axios interceptor.
 * Auto-dismisses after 4 seconds.
 */
export default function Toast() {
  const [message, setMessage] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      setMessage(e.detail)
      setVisible(true)
    }
    window.addEventListener('api-error', handler)
    return () => window.removeEventListener('api-error', handler)
  }, [])

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => setVisible(false), 4000)
    return () => clearTimeout(timer)
  }, [visible, message])

  if (!visible) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-start gap-3 max-w-sm
                    bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg animate-bounce-in">
      <span className="text-lg mt-0.5">⚠️</span>
      <div className="flex-1">
        <p className="text-sm font-semibold">Error</p>
        <p className="text-xs opacity-90">{message}</p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="ml-2 text-white opacity-70 hover:opacity-100 text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}
