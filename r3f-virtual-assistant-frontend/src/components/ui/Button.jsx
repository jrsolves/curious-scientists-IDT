import React from 'react';

/**
 * Simple Tailwind-styled Button component
 * Props:
 * - size: 'sm' | 'md' | 'lg'
 * - className: additional Tailwind classes
 * - onClick: click handler
 */
export function Button({ size = 'md', className = '', children, ...props }) {
  let sizeClasses;
  switch (size) {
    case 'sm':
      sizeClasses = 'px-3 py-1 text-sm';
      break;
    case 'lg':
      sizeClasses = 'px-8 py-4 text-lg';
      break;
    default:
      sizeClasses = 'px-5 py-2 text-base';
  }

  return (
    <button
      className={
        `inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition ${sizeClasses} ${className}`
      }
      {...props}
    >
      {children}
    </button>
  );
}
