import React from 'react';

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  darker?: boolean; // In light theme, "darker" means a slightly darker gray/stone background
}

export const Section: React.FC<SectionProps> = ({ 
  id, 
  title, 
  subtitle,
  children, 
  className = "",
  darker = false
}) => {
  return (
    <section 
      id={id} 
      className={`py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${darker ? 'bg-stone-100' : 'bg-white'} ${className}`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {(title || subtitle) && (
          <div className="mb-16 text-center">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-brand-900 mb-4 tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed font-light">
                {subtitle}
              </p>
            )}
            <div className="mt-8 w-16 h-1 bg-brand-500/30 mx-auto rounded-full"></div>
          </div>
        )}
        {children}
      </div>
    </section>
  );
};