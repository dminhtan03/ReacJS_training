import React from "react";
import { SelectProps } from "../../types/job.types";

// Select Component
export const Select: React.FC<SelectProps> = ({
  error,
  options,
  className,
  ...props
}) => {
  const baseClasses =
    "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white";
  const errorClasses = error
    ? "border-red-500 bg-red-50 focus:ring-red-200"
    : "border-gray-300 hover:border-gray-400";

  return (
    <select
      className={`${baseClasses} ${errorClasses} ${className || ""}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};