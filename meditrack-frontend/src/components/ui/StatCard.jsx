import React from 'react';
import Card from './Card';

const StatCard = ({ label, value, change, changeType = 'neutral', icon: Icon }) => {
  const getChangeStyles = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-danger';
    return 'text-text-secondary';
  };

  return (
    <Card padding="p-5" className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center text-accent">
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      <div className="flex-1 flex flex-col">
        <span className="text-sm font-medium text-text-secondary uppercase tracking-tight">{label}</span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold text-text-primary leading-none">{value}</span>
          {change && (
            <span className={`text-xs font-semibold ${getChangeStyles()}`}>
              {change}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
