
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-brand-surface border border-brand-border rounded-lg shadow-lg ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-brand-border">
          <h3 className="text-base font-semibold text-brand-text-primary">{title}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
