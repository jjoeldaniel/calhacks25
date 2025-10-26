import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
}

export function Button({ className = '', variant = 'default', ...props }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all disabled:pointer-events-none disabled:opacity-50 outline-none h-9 px-4 py-2";
  
  const variantClasses = {
    default: "bg-purple-600 text-white hover:bg-purple-700",
    outline: "border border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800",
    ghost: "hover:bg-zinc-800 text-white"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
