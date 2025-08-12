import React from "react";
import { InputProps } from "../../types/job.types";

// Input Component
export const Input: React.FC<InputProps> = ({ error, className, ...props }) => {
  const baseClasses =
    "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const errorClasses = error
    ? "border-red-500 bg-red-50 focus:ring-red-200"
    : "border-gray-300 hover:border-gray-400";

  return (
    <input
      className={`${baseClasses} ${errorClasses} ${className || ""}`}
      {...props}
    />
  );
};