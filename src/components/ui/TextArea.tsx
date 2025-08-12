import React from "react";
import { TextareaProps } from "../../types/job.types";

// Textarea Component
export const Textarea: React.FC<TextareaProps> = ({ error, className, ...props }) => {
  const baseClasses =
    "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical";
  const errorClasses = error
    ? "border-red-500 bg-red-50 focus:ring-red-200"
    : "border-gray-300 hover:border-gray-400";

  return (
    <textarea
      className={`${baseClasses} ${errorClasses} ${className || ""}`}
      {...props}
    />
  );
};