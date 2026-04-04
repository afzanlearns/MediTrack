import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, variant = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const variants = {
    success: {
      bg: 'bg-bg-surface border-success/20 shadow-success/10',
      icon: <CheckCircle className="w-5 h-5 text-success" />,
      text: 'text-text-primary',
    },
    danger: {
      bg: 'bg-bg-surface border-danger/20 shadow-danger/10',
      icon: <AlertCircle className="w-5 h-5 text-danger" />,
      text: 'text-text-primary',
    },
    info: {
      bg: 'bg-bg-surface border-accent/20 shadow-accent/10',
      icon: <Info className="w-5 h-5 text-accent" />,
      text: 'text-text-primary',
    },
  };

  const style = variants[variant] || variants.success;

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 p-4 border rounded-xl glow-accent transition-all duration-300 animate-in slide-in-from-right fade-in ${style.bg}`}>
      {style.icon}
      <p className={`text-sm font-medium ${style.text}`}>{message}</p>
      <button 
        onClick={onClose}
        className="ml-2 text-text-secondary hover:text-text-primary transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
