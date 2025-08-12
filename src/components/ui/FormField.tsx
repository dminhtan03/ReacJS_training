import { FormFieldProps } from "@/types/job.types";
import { X } from "lucide-react";

export const FormField: React.FC<FormFieldProps> = ({
    label,
    error,
    required,
    children,
}) => {
    return (
        <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {children}
            {error && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                    <X className="w-4 h-4 mr-1 flex-shrink-0" />
                    {error}
                </div>
            )}
        </div>
    )
}