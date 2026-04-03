import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ label, error, hint, children, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
      <div className="relative">
        <select
          {...props}
          className={`w-full appearance-none border border-border rounded-md px-3 py-2 text-sm 
                    focus:outline-none focus:ring-2 focus:ring-accent/20 
                    focus:border-accent bg-white text-text-primary
                    placeholder:text-text-secondary disabled:bg-page-bg
                    ${props.className || ''}`}
        >
          {children}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </span>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
      {hint && <p className="text-xs text-text-secondary">{hint}</p>}
    </div>
  );
};

export default Select;
