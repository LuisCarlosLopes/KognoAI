import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-[100dvh] w-full bg-gray-100 flex justify-center items-center md:p-6 font-sans">
      {/* 
        Mobile First Strategy: 
        - Default: w-full h-[100dvh] (Full screen app feel)
        - Medium Screens+: max-w-6xl h-[90vh] rounded-3xl (Card feel)
      */}
      <div className={`w-full bg-white h-[100dvh] flex flex-col overflow-hidden relative shadow-2xl md:max-w-6xl md:h-[90vh] md:rounded-[2rem] transition-all duration-300 ${className}`}>
        {children}
      </div>
    </div>
  );
};