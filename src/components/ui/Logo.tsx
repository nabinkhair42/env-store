import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'icon' | 'text' | 'full';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', variant = 'full', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 'h-6 w-6', text: 'text-lg', full: 'h-8' },
    md: { icon: 'h-8 w-8', text: 'text-xl', full: 'h-10' },
    lg: { icon: 'h-12 w-12', text: 'text-2xl', full: 'h-16' }
  };

  if (variant === 'icon') {
    return (
      <svg 
        className={`${sizes[size].icon} ${className}`} 
        viewBox="0 0 60 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#3B82F6", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#1E40AF", stopOpacity:1}} />
          </linearGradient>
        </defs>
        
        <rect x="4" y="4" width="52" height="52" rx="12" fill="url(#iconGradient)" />
        
        <g transform="translate(12, 12)">
          <ellipse cx="18" cy="8" rx="14" ry="4" fill="white" opacity="0.9"/>
          <rect x="4" y="8" width="28" height="20" fill="white" opacity="0.9"/>
          <ellipse cx="18" cy="28" rx="14" ry="4" fill="white" opacity="0.9"/>
          
          <rect x="8" y="12" width="8" height="2" rx="1" fill="#3B82F6"/>
          <rect x="18" y="12" width="12" height="2" rx="1" fill="#10B981"/>
          <rect x="8" y="16" width="6" height="2" rx="1" fill="#F59E0B"/>
          <rect x="16" y="16" width="10" height="2" rx="1" fill="#EF4444"/>
          <rect x="8" y="20" width="10" height="2" rx="1" fill="#8B5CF6"/>
          <rect x="20" y="20" width="8" height="2" rx="1" fill="#06B6D4"/>
          <rect x="8" y="24" width="12" height="2" rx="1" fill="#84CC16"/>
        </g>
        
        <g transform="translate(42, 8)">
          <rect x="0" y="4" width="8" height="6" rx="2" fill="#10B981" opacity="0.8"/>
          <path d="M2 4V2C2 0.9 2.9 0 4 0S6 0.9 6 2V4" stroke="white" strokeWidth="1.5" fill="none"/>
        </g>
      </svg>
    );
  }

}

export default Logo;
