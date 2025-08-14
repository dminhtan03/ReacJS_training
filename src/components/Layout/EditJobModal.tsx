import React, { useState, useEffect } from "react";
import { Briefcase, X, Shield } from "lucide-react";
import { FormField, Input, Textarea, Toast } from "@/components/ui";
import * as jobService from "@/service/jobService";
import { JobValidator } from "@/utils/jobValidator";
import { JobFormData, ValidationErrors } from "@/types/job.types";

interface EditJobModalProps {
  isOpen: boolean;
  jobId: string | null;
  onClose: () => void;
  onUpdated: () => void;
  currentUserRole?: string; // Thêm prop userRole
}

const EditJobModal: React.FC<EditJobModalProps> = ({
  isOpen,
  jobId,
  onClose,
  onUpdated,
  currentUserRole = "USER", // Default là user
}) => {
  const [formData, setFormData] = useState<Partial<JobFormData>>({
    company: "",
    position: "",
    status: "Pending",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Kiểm tra xem user có phải admin không
  console.log("USER ROLE:", currentUserRole);
  
  const isAdmin = currentUserRole === "ADMIN";

  useEffect(() => {
    if (jobId && isOpen) {
      jobService.getJobById(jobId).then((data) => {
        setFormData({
          company: data.company,
          position: data.position,
          status: data.status,
          notes: data.notes,
        });
      });
      setToast(null);
    }
  }, [jobId, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Real-time validation chỉ cho các trường được phép edit
    const newErrors = { ...errors };
    
    // Validation cho user (không phải admin)
    if (!isAdmin) {
      if (field === 'company') {
        if (!value.trim()) {
          newErrors.company = "Company name is required";
        } else if (value.trim().length < 2) {
          newErrors.company = "Company name must be at least 2 characters";
        } else {
          delete newErrors.company;
        }
      }
      
      if (field === 'position') {
        if (!value.trim()) {
          newErrors.position = "Job position is required";
        } else if (value.trim().length < 2) {
          newErrors.position = "Position must be at least 2 characters";
        } else {
          delete newErrors.position;
        }
      }
      
      if (field === 'notes') {
        if (value.length > 500) {
          newErrors.notes = "Notes cannot exceed 500 characters";
        } else {
          delete newErrors.notes;
        }
      }
    }
    
    // Validation cho admin (chỉ status)
    if (isAdmin && field === 'status') {
      if (!value.trim()) {
        newErrors.status = "Status is required";
      } else {
        delete newErrors.status;
      }
    }
    
    setErrors(newErrors);
  };

  // Kiểm tra form có hợp lệ không
  const isFormValid = () => {
    const hasErrors = Object.keys(errors).length > 0;
    
    if (isAdmin) {
      // Admin chỉ cần status hợp lệ
      return !hasErrors && formData.status?.trim();
    } else {
      // User cần company và position hợp lệ
      const hasRequiredFields = formData.company?.trim() && formData.position?.trim();
      return !hasErrors && hasRequiredFields;
    }
  };

  const clearData = () => {
     setFormData({
      company: "",
      position: "",
      status: "Pending",
      notes: "",
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Double check validation trước khi submit
      if (!isFormValid()) {
        setToast({ message: "Please fix all errors before submitting", type: "error" });
        setIsSubmitting(false);
        return;
      }
      
      if (jobId) {
        let updateData: any;
        
        if (isAdmin) {
          // Admin chỉ update status
          updateData = {
            status: formData.status?.trim(),
          };
        } else {
          // User update tất cả trừ status
          updateData = {
            company: formData.company?.trim(),
            position: formData.position?.trim(),
            notes: formData.notes?.trim() || "",
          };
        }
        
        await jobService.updateJob(jobId, updateData);

        const successMessage = isAdmin 
          ? "Job status updated successfully! 🎉"
          : "Job application updated successfully! 🎉";

        setToast({
          message: successMessage,
          type: "success",
        });

        setTimeout(() => {
          onUpdated(); // reload job list
          onClose();
          clearData();
        }, 1000);
      }
    } catch (error) {
      console.error("Update failed", error);
      const errorMessage = isAdmin
        ? "Failed to update job status"
        : "Failed to update job application";
      setToast({ 
        message: errorMessage, 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    clearData();
    setErrors({});
    setToast(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-1001 flex items-center justify-center mt-14"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-2xl custom_desktop relative max-h-[90vh] overflow-y-auto border dark:border-gray-700">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute cursor-pointer top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5 cursor-pointer" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isAdmin ? 'bg-purple-100 dark:bg-purple-900' : 'bg-blue-100 dark:bg-blue-900'
          }`}>
            {isAdmin ? (
              <Shield className="w-8 h-8 text-purple-600 dark:text-purple-300" />
            ) : (
              <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {isAdmin ? "Update Job Status" : "Edit Job"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isAdmin 
              ? "Update the application status as an administrator"
              : "Update your job application details"
            }
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <FormField label="Company Name" error={errors.company} required={!isAdmin}>
            <Input
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              disabled={isSubmitting || isAdmin}
              readOnly={isAdmin}
              error={!!errors.company}
              className={`text-sm sm:text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-violet-600 dark:focus:ring-violet-400 ${isAdmin ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed" : ""}`}
            />
          </FormField>

          <FormField label="Job Position" error={errors.position} required={!isAdmin}>
            <Input
              type="text"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              disabled={isSubmitting || isAdmin}
              readOnly={isAdmin}
              error={!!errors.position}
              className={`text-sm sm:text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-violet-600 dark:focus:ring-violet-400 ${isAdmin ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed" : ""}`}
            />
          </FormField>

          <FormField label="Application Status" error={errors.status} required={isAdmin}>
            {isAdmin ? (
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            ) : (
              <div className="relative">
                <Input
                  type="text"
                  value={formData.status}
                  readOnly={true}
                  disabled={true}
                  className="bg-gray-100 dark:bg-gray-600 cursor-not-allowed text-sm sm:text-base border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
              </div>
            )}
            {!isAdmin && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Status can only be changed by administrators
              </p>
            )}
          </FormField>

          <FormField label="Notes" error={errors.notes}>
            <Textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              disabled={isSubmitting || isAdmin}
              readOnly={isAdmin}
              className={`text-sm sm:text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-violet-600 dark:focus:ring-violet-400 ${isAdmin ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed" : ""}`}
            />
          </FormField>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid()}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition text-sm sm:text-base ${
                isSubmitting || !isFormValid()
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : isAdmin
                  ? "bg-violet-600 cursor-pointer hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  : "bg-violet-600 cursor-pointer hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              }`}
            >
              {isSubmitting 
                ? (isAdmin ? "Updating Status..." : "Updating...") 
                : (isAdmin ? "Update Status" : "Update Job")
              }
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-6 rounded-lg cursor-pointer font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm sm:text-base focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
        {toast && (
          <div className="fixed top-4 right-4 z-[9999]">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
              className="max-w-[90%] sm:max-w-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditJobModal;