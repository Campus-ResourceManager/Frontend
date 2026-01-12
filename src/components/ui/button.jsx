import React from "react";

export function Button({ className, children, ...props }) {
  return (
    <button
      className={`px-4 py-2 bg-[#90243A] text-white rounded-lg hover:bg-[#7a1e30] ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}