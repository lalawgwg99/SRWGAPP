import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`
      relative overflow-hidden
      bg-white/80 backdrop-blur-xl
      border border-white/40
      shadow-[0_4px_24px_rgba(0,0,0,0.06)]
      rounded-[1.5rem]
      ${className}
    `}>
      {/* Glossy reflection effect */}
      {/* Glossy reflection effect - Removed for cleaner iOS look */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};