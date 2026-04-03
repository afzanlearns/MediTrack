import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-full">
      <div className="w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center mb-4 border border-accent/25">
        {Icon && <Icon className="w-8 h-8 text-[#4B7A4B]" />}
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary max-w-xs">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
