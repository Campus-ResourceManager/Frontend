import React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = ({ variant = "default", size = "default", className }) => {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#90243A] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-[#90243A] text-white hover:bg-[#7a1e30] shadow-lg shadow-[#90243A]/20",
    secondary: "bg-white text-[#90243A] border border-[#90243A] hover:bg-gray-50",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    ghost: "hover:bg-gray-100",
    link: "text-[#90243A] underline-offset-4 hover:underline",
  };
  
  const sizes = {
    default: "h-11 px-8 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-14 rounded-full px-10 text-base",
    icon: "h-10 w-10",
  };
  
  return cn(base, variants[variant], sizes[size], className);
};

export function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}