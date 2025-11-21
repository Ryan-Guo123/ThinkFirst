import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white";
  
  const variants = {
    primary: "bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow-md focus:ring-brand-500",
    secondary: "bg-stone-200 hover:bg-stone-300 text-stone-800 focus:ring-stone-400",
    outline: "border-2 border-stone-300 text-stone-600 hover:border-brand-600 hover:text-brand-700 bg-transparent focus:ring-brand-500",
    ghost: "text-stone-500 hover:text-brand-700 hover:bg-stone-100 focus:ring-stone-400",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};