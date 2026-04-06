import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ title, onClose, children, size = 'md' }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-app',
    lg: 'max-w-2xl',
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-5"
      onClick={onClose}
    >
      <div
        className={`bg-[#0E1318] border border-[#1C2530] rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[85vh] overflow-y-auto relative`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C2530]">
          <h2 className="font-sans text-lg font-semibold text-[#F0F4F8]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#3D5166] hover:text-[#8A9BAE] transition-colors press"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 font-sans">{children}</div>
      </div>
    </div>
  )
}
