import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  icon: Icon, 
  children, 
  onClick, 
  disabled, 
  type = 'button',
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-md disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-hover border border-transparent',
    secondary: 'bg-white text-text-primary border border-border hover:bg-page-bg',
    outline: 'bg-white text-text-primary border border-border hover:bg-accent-light',
    danger: 'bg-danger text-white hover:bg-red-700',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-page-bg border border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs h-9',
    md: 'px-4 py-2.5 text-sm h-10',
    lg: 'px-6 py-3 text-base h-11',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <div className="flex items-center gap-2 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}
        <div className={`flex items-center gap-2 ${loading ? 'invisible' : 'visible'}`}>
          {Icon}
          {children}
        </div>
      </div>
    </button>
  );
};

export default Button;
