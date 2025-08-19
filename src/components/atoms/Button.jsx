import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({
  className,
  variant = "primary",
  size = "default",
  children,
  ...props
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-md hover:shadow-lg focus:ring-primary/50",
    secondary: "bg-surface border border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-300",
    accent: "bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white shadow-md hover:shadow-lg focus:ring-accent/50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-12 px-6 py-3 text-lg",
    icon: "h-10 w-10"
  };
  
  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;