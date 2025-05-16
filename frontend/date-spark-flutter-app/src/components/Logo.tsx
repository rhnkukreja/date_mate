
import React from 'react';

type LogoProps = {
  size?: 'small' | 'medium' | 'large';
  variant?: 'full' | 'icon';
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  variant = 'full', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl',
  };

  return (
    <div className={`font-montserrat font-bold flex items-center ${sizeClasses[size]} ${className}`}>
      <span className="text-datemate-red">Date</span>
      <span className="text-datemate-pink">Mate</span>
      {variant === 'full' && (
        <span className="text-xs ml-1 mt-1 bg-datemate-pink text-white px-1 rounded-sm">AI</span>
      )}
    </div>
  );
};

export default Logo;
