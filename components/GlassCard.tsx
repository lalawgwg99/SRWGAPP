import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`
      relative overflow-hidden
      bg-white/95 backdrop-blur-xl
      border border-black/5
      shadow-lg shadow-black/5
      rounded-2xl
      ${className}
    `}>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};