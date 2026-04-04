import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

const VARIANT_STYLES = {
  success: {
    icon: CheckCircle2,
    accent: 'text-[#00D4AA]',
    ring: 'border-[#00D4AA33]',
    glow: 'shadow-[0_0_24px_rgba(0,212,170,0.18)]',
    title: 'Success',
  },
  danger: {
    icon: AlertCircle,
    accent: 'text-[#EF4444]',
    ring: 'border-[#EF444433]',
    glow: 'shadow-[0_0_24px_rgba(239,68,68,0.16)]',
    title: 'Error',
  },
  info: {
    icon: Info,
    accent: 'text-[#3B82F6]',
    ring: 'border-[#3B82F633]',
    glow: 'shadow-[0_0_24px_rgba(59,130,246,0.18)]',
    title: 'Info',
  },
}

export default function Toast() {
  const [state, setState] = useState(null)

  useEffect(() => {
    const onApiError = (event) => {
      setState({
        message: event.detail,
        variant: 'danger',
        title: 'Error',
      })
    }

    const onAppToast = (event) => {
      const payload = event.detail || {}
      setState({
        message: payload.message || 'Action completed',
        variant: payload.variant || 'info',
        title: payload.title,
      })
    }

    window.addEventListener('api-error', onApiError)
    window.addEventListener('app-toast', onAppToast)
    return () => {
      window.removeEventListener('api-error', onApiError)
      window.removeEventListener('app-toast', onAppToast)
    }
  }, [])

  useEffect(() => {
    if (!state) return
    const timer = window.setTimeout(() => setState(null), 3600)
    return () => window.clearTimeout(timer)
  }, [state])

  if (!state) return null

  const variant = VARIANT_STYLES[state.variant] || VARIANT_STYLES.info
  const Icon = variant.icon

  return (
    <div className="fixed right-4 top-4 z-[80] max-w-sm animate-[fadeIn_.2s_ease-out]">
      <div className={`rounded-2xl border bg-[#0F1722] ${variant.ring} ${variant.glow} px-4 py-3`}>
        <div className="flex items-start gap-3">
          <Icon className={`mt-0.5 h-5 w-5 ${variant.accent}`} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#E8EDF2]">{state.title || variant.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-[#8BA3BA]">{state.message}</p>
          </div>
          <button
            onClick={() => setState(null)}
            className="rounded-full p-1 text-[#5F7488] transition-colors hover:text-[#E8EDF2]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
