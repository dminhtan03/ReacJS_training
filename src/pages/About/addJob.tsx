import React, { useState, useCallback } from "react";
import { Check, X, Briefcase } from "lucide-react";

// Types
interface JobFormData {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  notes: string;
  dateAdded: string;
}

type JobStatus = "Applied" | "Interview" | "Offer" | "Rejected";

interface ValidationErrors {
  company?: string;
  position?: string;
  status?: string;
  notes?: string;
}

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

// Validation Class
class JobValidator {
  static validateCompany(company: string): string | undefined {
    if (!company.trim()) {
      return "Company name is required";
    }
    if (company.trim().length < 2) {
      return "Company name must be at least 2 characters";
    }
    if (company.trim().length > 100) {
      return "Company name cannot exceed 100 characters";
    }
    return undefined;
  }

  static validatePosition(position: string): string | undefined {
    if (!position.trim()) {
      return "Position is required";
    }
    if (position.trim().length < 2) {
      return "Position must be at least 2 characters";
    }
    if (position.trim().length > 100) {
      return "Position cannot exceed 100 characters";
    }
    return undefined;
  }

  static validateStatus(status: string): string | undefined {
    const validStatuses: JobStatus[] = [
      "Applied",
      "Interview",
      "Offer",
      "Rejected",
    ];
    if (!validStatuses.includes(status as JobStatus)) {
      return "Please select a valid status";
    }
    return undefined;
  }

  static validateNotes(notes: string): string | undefined {
    if (notes.length > 1000) {
      return "Notes cannot exceed 1000 characters";
    }
    return undefined;
  }

  static validateForm(data: Partial<JobFormData>): ValidationErrors {
    return {
      company: this.validateCompany(data.company || ""),
      position: this.validatePosition(data.position || ""),
      status: this.validateStatus(data.status || ""),
      notes: this.validateNotes(data.notes || ""),
    };
  }
}

// Storage Service
class JobStorageService {
  private static STORAGE_KEY = "jobs";

  static saveJob(job: JobFormData): boolean {
    try {
      const existingJobs = JSON.parse(
        localStorage.getItem(this.STORAGE_KEY) || "[]"
      );
      existingJobs.push(job);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingJobs));

      console.log("✅ Job saved successfully:", job);
      return true;
    } catch (error) {
      console.error("❌ Error saving job:", error);
      return false;
    }
  }

  static getAllJobs(): JobFormData[] {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
    } catch (error) {
      console.error("❌ Error retrieving jobs:", error);
      return [];
    }
  }

  static deleteJob(id: string): boolean {
    try {
      const existingJobs = JSON.parse(
        localStorage.getItem(this.STORAGE_KEY) || "[]"
      );
      const updatedJobs = existingJobs.filter(
        (job: JobFormData) => job.id !== id
      );
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedJobs));

      console.log("✅ Job deleted successfully:", id);
      return true;
    } catch (error) {
      console.error("❌ Error deleting job:", error);
      return false;
    }
  }

  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

// Form Field Component
const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  children,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
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
  );
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input: React.FC<InputProps> = ({ error, className, ...props }) => {
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

// Select Component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({
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

// Textarea Component
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({ error, className, ...props }) => {
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

// Success/Error Toast Component
interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      <div className="flex items-center">
        {type === "success" ? (
          <Check className="w-5 h-5 mr-2 flex-shrink-0" />
        ) : (
          <X className="w-5 h-5 mr-2 flex-shrink-0" />
        )}
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-3 hover:opacity-75 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Main Add Job Form Component
const AddJobForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<JobFormData>>({
    company: "",
    position: "",
    status: "Applied",
    notes: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const statusOptions = [
    { value: "Applied", label: "📝 Applied" },
    { value: "Interview", label: "🎯 Interview" },
    { value: "Offer", label: "✨ Offer" },
    { value: "Rejected", label: "❌ Rejected" },
  ];

  const handleInputChange = useCallback(
    (field: keyof JobFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      status: "Applied",
      notes: "",
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Validate form
      const validationErrors = JobValidator.validateForm(formData);
      const hasErrors = Object.values(validationErrors).some((error) => error);

      if (hasErrors) {
        setErrors(validationErrors);
        setToast({ message: "Please fix the errors below", type: "error" });
        return;
      }

      // Prepare job data
      const jobData: JobFormData = {
        id: JobStorageService.generateId(),
        company: formData.company!.trim(),
        position: formData.position!.trim(),
        status: formData.status as JobStatus,
        notes: formData.notes?.trim() || "",
        dateAdded: new Date().toISOString(),
      };

      // Save job
      const success = JobStorageService.saveJob(jobData);

      if (success) {
        setToast({
          message: "Job application added successfully! 🎉",
          type: "success",
        });
        resetForm();
      } else {
        setToast({
          message: "Failed to save job. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setToast({ message: "An unexpected error occurred", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Briefcase className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Add New Job Application
        </h1>
        <p className="text-gray-600">
          Track your job applications and manage your career journey
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="space-y-6" onKeyDown={handleKeyPress}>
          <FormField label="Company Name" error={errors.company} required>
            <Input
              type="text"
              placeholder="e.g. Google, Microsoft, Apple..."
              value={formData.company || ""}
              onChange={(e) => handleInputChange("company", e.target.value)}
              error={!!errors.company}
              disabled={isSubmitting}
            />
          </FormField>

          <FormField label="Job Position" error={errors.position} required>
            <Input
              type="text"
              placeholder="e.g. Frontend Developer, Software Engineer..."
              value={formData.position || ""}
              onChange={(e) => handleInputChange("position", e.target.value)}
              error={!!errors.position}
              disabled={isSubmitting}
            />
          </FormField>

          <FormField label="Application Status" error={errors.status}>
            <Select
              options={statusOptions}
              value={formData.status || "Applied"}
              onChange={(e) => handleInputChange("status", e.target.value)}
              error={!!errors.status}
              disabled={isSubmitting}
            />
          </FormField>

          <FormField label="Notes" error={errors.notes}>
            <Textarea
              rows={4}
              placeholder="e.g. Interview scheduled for next Monday, Applied through LinkedIn, Salary range 30-40M VND..."
              value={formData.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              error={!!errors.notes}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                💡 Tip: Press Ctrl + Enter to submit quickly
              </p>
              <div
                className={`text-xs ${
                  (formData.notes || "").length > 900
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {(formData.notes || "").length}/1000 characters
              </div>
            </div>
          </FormField>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transform hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving Job Application...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Add Job Application
              </div>
            )}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
            className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm"
          >
            Clear Form
          </button>
        </div>
      </div>

      {/* Demo: Show saved jobs count */}
      {JobStorageService.getAllJobs().length > 0 && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full">
            <Check className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-green-700 text-sm font-medium">
              {JobStorageService.getAllJobs().length} job
              {JobStorageService.getAllJobs().length > 1 ? "s" : ""} saved
              successfully
            </span>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AddJobForm;
