import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-[400px]',
    md: 'max-w-[560px]',
    lg: 'max-w-[720px]',
    xl: 'max-w-[900px]',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" 
        onClick={onClose} 
      />
      <div 
        ref={modalRef}
        className={`relative w-full bg-[#0E1318] rounded-xl border border-[#1C2530] shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 ${sizes[size]}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1C2530]">
          <h3 className="font-sans text-lg font-semibold text-[#F0F4F8]">{title}</h3>
          <button 
            onClick={onClose}
            className="text-[#8A9BAE] hover:text-[#F0F4F8] transition-colors p-1.5 rounded-lg hover:bg-[#141B23]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 text-[#F0F4F8] custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
