import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "py-3 px-6 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-brand-600 text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none",
    secondary: "bg-accent-500 text-white shadow-lg shadow-accent-500/20 hover:bg-accent-600 disabled:bg-gray-300",
    outline: "border-2 border-brand-600 text-brand-600 bg-transparent hover:bg-brand-50 disabled:border-gray-300 disabled:text-gray-400",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};