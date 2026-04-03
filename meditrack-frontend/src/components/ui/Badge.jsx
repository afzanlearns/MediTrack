import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    success: 'bg-success-light text-success border border-success/20',
    warning: 'bg-warning-light text-warning border border-warning/25',
    danger: 'bg-danger-light text-danger border border-danger/20',
    info: 'bg-accent-light text-[#4B7A4B] border border-accent/40',
    default: 'bg-gray-100 text-text-secondary border border-gray-200',
    secondary: 'bg-page-bg text-text-secondary border border-border',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
