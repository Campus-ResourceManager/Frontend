import React from "react";

export function Form({ children, ...props }) {
  return <form {...props}>{children}</form>;
}

export function FormField({ name, register, error, render }) {
  return render({
    field: {
      name,
      ...register(name),
    },
    fieldState: {
      error,
    },
  });
}

export function FormItem({ children }) {
  return <div className="space-y-2">{children}</div>;
}

export function FormLabel({ children, className }) {
  return (
    <label className={`text-sm font-medium leading-none ${className}`}>
      {children}
    </label>
  );
}

export function FormControl({ children }) {
  return <div>{children}</div>;
}

export function FormMessage({ children }) {
  if (!children) return null;
  
  return (
    <p className="text-sm text-red-600 mt-1">
      {children}
    </p>
  );
}