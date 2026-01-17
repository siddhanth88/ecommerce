import React from 'react';

/**
 * Reusable Button Component
 * @param {Object} props
 * @param {string} props.variant - Button variant: 'primary', 'secondary', 'outline', 'ghost'
 * @param {string} props.size - Button size: 'sm', 'md', 'lg'
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {React.ReactNode} props.children - Button content
 * @param {React.ReactNode} props.icon - Optional icon
 * @param {string} props.className - Additional classes
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  children,
  icon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800 focus:ring-black disabled:bg-gray-300',
    secondary: 'bg-white text-black border border-gray-300 hover:bg-gray-50 focus:ring-gray-300 disabled:bg-gray-100',
    outline: 'bg-transparent text-black border border-black hover:bg-black hover:text-white focus:ring-black disabled:border-gray-300 disabled:text-gray-300',
    ghost: 'bg-transparent text-black hover:bg-gray-100 focus:ring-gray-300 disabled:text-gray-300'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
    disabled || loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
  }`;

  return (
    <button 
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
