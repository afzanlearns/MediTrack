import React from 'react';

const Input = ({ label, error, hint, icon, ...inputProps }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4 flex items-center justify-center">
            {icon}
          </span>
        )}
        <input
          {...inputProps}
          className={`w-full border border-border rounded-md px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-accent/20
                    focus:border-accent bg-white text-text-primary
                    placeholder:text-text-secondary/85 disabled:bg-page-bg
                    ${icon ? 'pl-9' : ''} ${inputProps.className || ''}`}
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
      {hint && <p className="text-xs text-text-secondary">{hint}</p>}
    </div>
  );
};

export default Input;
