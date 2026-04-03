import React from 'react';

const Card = ({ children, className = '', padding = 'p-6' }) => {
  return (
    <div className={`bg-card rounded-xl border border-border shadow-soft ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
