import React from 'react';

const PageHeader = ({ title, subtitle, action, actions }) => {
  const resolvedActions = actions || action;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5 mb-6">
      <div className="flex flex-col">
        <h1 className="text-[28px] leading-[1.2] font-semibold text-text-primary tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
      </div>
      {resolvedActions && (
        <div className="flex items-center gap-3">
          {resolvedActions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
