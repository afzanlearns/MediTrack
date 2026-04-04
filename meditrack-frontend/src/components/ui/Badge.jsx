export function Badge({ variant = 'default', size = 'default', children }) {
  const baseClasses = 'inline-flex items-center font-semibold rounded-badge';
  
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    default: 'text-xs px-2 py-0.5',
  };

  const variantClasses = {
    success: 'bg-ok-bg text-ok',
    warning: 'bg-warn-bg text-warn',
    danger: 'bg-err-bg text-err',
    info: 'bg-info-bg text-info',
    sage: 'bg-sage-light text-sage',
    default: 'bg-bg-subtle text-ink-2',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
