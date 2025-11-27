import React from 'react';
import './Logo.css';

const Logo = ({ size = 'medium', showText = true, variant = 'color' }) => {
  const sizes = {
    small: { icon: 32, text: 14 },
    medium: { icon: 48, text: 20 },
    large: { icon: 64, text: 24 }
  };

  const currentSize = sizes[size];

  return (
    <div className={`mega-power-logo ${size} ${variant}`}>
      {/* Modern Geometric Logo Icon */}
      <svg 
        className="logo-svg"
        width={currentSize.icon} 
        height={currentSize.icon} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle with Gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f093fb" />
            <stop offset="100%" stopColor="#f5576c" />
          </linearGradient>
          
          {/* Glow Effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          stroke="url(#logoGradient)" 
          strokeWidth="3" 
          fill="none"
          opacity="0.3"
        />

        {/* Inner Circle Background */}
        <circle 
          cx="50" 
          cy="50" 
          r="42" 
          fill="url(#logoGradient)" 
          opacity="0.15"
        />

        {/* Stylized "M" and "P" - Modern Geometric Design */}
        {/* Left Lightning Bolt - "M" */}
        <path
          d="M 30 25 L 35 50 L 30 50 L 35 75 L 40 50 L 35 50 Z"
          fill="url(#logoGradient)"
          filter="url(#glow)"
        />

        {/* Right Lightning Bolt - "P" */}
        <path
          d="M 60 25 L 65 50 L 60 50 L 65 75 L 70 50 L 65 50 Z"
          fill="url(#accentGradient)"
          filter="url(#glow)"
        />

        {/* Central Power Symbol */}
        <g transform="translate(50, 50)">
          {/* Dumbbell Shape */}
          <rect x="-3" y="-12" width="6" height="24" fill="url(#logoGradient)" rx="1"/>
          
          {/* Left Weight Plate */}
          <circle cx="-10" cy="-10" r="6" fill="url(#logoGradient)"/>
          <circle cx="-10" cy="10" r="6" fill="url(#logoGradient)"/>
          
          {/* Right Weight Plate */}
          <circle cx="10" cy="-10" r="6" fill="url(#accentGradient)"/>
          <circle cx="10" cy="10" r="6" fill="url(#accentGradient)"/>
          
          {/* Center Grip */}
          <rect x="-4" y="-3" width="8" height="6" fill="#fff" opacity="0.9" rx="1"/>
        </g>

        {/* Accent Dots */}
        <circle cx="50" cy="15" r="2" fill="url(#accentGradient)"/>
        <circle cx="85" cy="50" r="2" fill="url(#accentGradient)"/>
        <circle cx="50" cy="85" r="2" fill="url(#accentGradient)"/>
        <circle cx="15" cy="50" r="2" fill="url(#logoGradient)"/>
      </svg>

      {/* Text */}
      {showText && (
        <div className="logo-text-container">
          <span className="logo-text" style={{ fontSize: `${currentSize.text}px` }}>
            MEGA
            <span className="logo-text-highlight"> POWER</span>
          </span>
          <span className="logo-tagline">GYM & FITNESS</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
