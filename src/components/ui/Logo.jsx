import React from 'react';

export default function Logo({ className = 'w-9 h-9' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
    >
      <defs>
        <linearGradient id="logo-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#0F172A' }} />
          <stop offset="100%" style={{ stopColor: '#020617' }} />
        </linearGradient>
        <linearGradient id="logo-bar1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3B82F6' }} />
          <stop offset="100%" style={{ stopColor: '#2563EB' }} />
        </linearGradient>
        <linearGradient id="logo-bar2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#8B5CF6' }} />
          <stop offset="100%" style={{ stopColor: '#7C3AED' }} />
        </linearGradient>
        <linearGradient id="logo-bar3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#06B6D4' }} />
          <stop offset="100%" style={{ stopColor: '#0891B2' }} />
        </linearGradient>
        <linearGradient id="logo-bar4" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#10B981' }} />
          <stop offset="100%" style={{ stopColor: '#059669' }} />
        </linearGradient>
        <linearGradient id="logo-bar5" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#F59E0B' }} />
          <stop offset="100%" style={{ stopColor: '#D97706' }} />
        </linearGradient>
      </defs>
      {/* Rounded background */}
      <rect width="512" height="512" rx="96" fill="url(#logo-bg)" />
      {/* Subtle border */}
      <rect
        width="508"
        height="508"
        x="2"
        y="2"
        rx="94"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="4"
      />
      {/* Sorting bars (ascending pattern) */}
      <rect x="72" y="340" width="52" height="80" rx="8" fill="url(#logo-bar5)" />
      <rect x="144" y="280" width="52" height="140" rx="8" fill="url(#logo-bar3)" />
      <rect x="216" y="220" width="52" height="200" rx="8" fill="url(#logo-bar1)" />
      <rect x="288" y="160" width="52" height="260" rx="8" fill="url(#logo-bar2)" />
      <rect x="360" y="92" width="52" height="328" rx="8" fill="url(#logo-bar4)" />
      {/* Small node connections (graph hint) */}
      <circle cx="98" cy="80" r="10" fill="#3B82F6" opacity="0.5" />
      <circle cx="170" cy="68" r="8"  fill="#8B5CF6" opacity="0.4" />
      <circle cx="400" cy="65" r="9"  fill="#06B6D4" opacity="0.4" />
      <line x1="98" y1="80" x2="170" y2="68" stroke="#3B82F6" strokeWidth="2" opacity="0.3" />
      <line x1="170" y1="68" x2="400" y2="65" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.2" />
    </svg>
  );
}
