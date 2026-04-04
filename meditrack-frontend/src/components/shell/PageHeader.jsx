import React from 'react';

const PageHeader = ({ title, subtitle, right }) => {
  return (
    <header className="px-5 pt-6 pb-4 bg-surface-2 sticky top-0 z-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-ink-3 mt-0.5">{subtitle}</p>
          )}
        </div>
        {right && (
          <div className="flex items-center gap-2 mt-1">{right}</div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
