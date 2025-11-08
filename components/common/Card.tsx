
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-gray-900/50 border border-gray-700/50 rounded-2xl shadow-2xl p-6 md:p-8 w-full ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
