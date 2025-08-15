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
  currentUserRole?: string;
  userId: string; // owner id of the job
}

const EditJobModal: React.FC<EditJobModalProps> = ({
  isOpen,
  jobId,
  onClose,
  onUpdated,
  currentUserRole = "USER",
  userId,
}) => {
  const [formData, setFormData] = useState<Partial<JobFormData>>({
    company: "",
    position: "",
    status: "Pending",
    notes: "",
    employeeName: "",
    phoneNumber: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const reduxState = JSON.parse(localStorage.getItem("reduxState") || "{}");
  const userIdStorage: string | undefined = reduxState?.auth?.id;
  const isAdmin = currentUserRole === "ADMIN";
  const isOwner = String(userId) === String(userIdStorage);

  // Quyền
  const canEditFull = isAdmin && isOwner; // admin sửa bài của mình
  const canEditStatusOnly = isAdmin && !isOwner; // admin sửa bài người khác
  const canEditWithoutStatus = !isAdmin && isOwner; // user sửa bài của mình
  const noPermission = !isOwner && !isAdmin; // user sửa bài người khác => không cho phép
  useEffect(() => {
    if (jobId && isOpen) {
      jobService.getJobById(jobId).then((data) => {
        setFormData({
          company: data.company,
          position: data.position,
          status: data.status,
          notes: data.notes,
          email: data.email,
          employeeName: data.employeeName,
          phoneNumber: data.phoneNumber
        });
      });
      setToast(null);
    }
  }, [jobId, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    const newErrors = { ...errors };

    // Validation cơ bản cho các trường được phép chỉnh
    if (
      (canEditFull || canEditWithoutStatus) &&
      ["company", "position", "employeeName", "phoneNumber", "email", "notes"].includes(field)
    ) {
      if (!value.trim()) {
        newErrors[field] = `${field} is required`;
      } else if (value.trim().length < 2) {
        newErrors[field] = `${field} must be at least 2 characters`;
      } else {
        delete newErrors[field];
      }
    }

    if ((canEditFull || canEditWithoutStatus) && field === "email") {
      if (!value.trim()) {
          newErrors.email = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
    }

    if ((canEditFull || canEditWithoutStatus) && field === "phoneNumber") {
     if (!value.trim()) {
          newErrors.phoneNumber = "Phone number is required";
        } else if (!/^[\+]?[0-9\s\-\(\)]{8,15}$/.test(value.trim())) {
          newErrors.phoneNumber = "Please enter a valid phone number";
        } else {
          delete newErrors.phoneNumber;
        }
    }

    if ((canEditFull || canEditStatusOnly) && field === "status") {
      if (!value.trim()) {
        newErrors.status = "Status is required";
      } else {
        delete newErrors.status;
      }
    }

    

    if ((canEditFull || canEditWithoutStatus) && field === "notes") {
      if (value.length > 500) {
        newErrors.notes = "Notes cannot exceed 500 characters";
      } else {
        delete newErrors.notes;
      }
    }

    setErrors(newErrors);
  };

  const isFormValid = () => {
    if (noPermission) return false;
    const hasErrors = Object.keys(errors).length > 0;

    if (canEditFull) {
      return (
        !hasErrors &&
        formData.company?.trim() &&
        formData.position?.trim() &&
        formData.status?.trim()
      );
    }
    if (canEditStatusOnly) {
      return !hasErrors && formData.status?.trim();
    }
    if (canEditWithoutStatus) {
      return (
        !hasErrors && formData.company?.trim() && formData.position?.trim()
      );
    }
    return false;
  };

  const clearData = () => {
    setFormData({ company: "", position: "", status: "Pending", notes: "" });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!isFormValid()) {
        setToast({
          message: "Please fix all errors before submitting",
          type: "error",
        });
        setIsSubmitting(false);
        return;
      }

      if (jobId) {
        let updateData: any = {};

        if (canEditFull) {
          updateData = {
            company: formData.company?.trim(),
            position: formData.position?.trim(),
            status: formData.status?.trim(),
            notes: formData.notes?.trim() || "",
            employeeName: formData.employeeName?.trim(),
            phoneNumber: formData.phoneNumber?.trim(),
            email: formData.email?.trim(),
          };
        } else if (canEditStatusOnly) {
          updateData = { status: formData.status?.trim() };
        } else if (canEditWithoutStatus) {
          updateData = {
            company: formData.company?.trim(),
            position: formData.position?.trim(),
            notes: formData.notes?.trim() || "",
          };
        }

        await jobService.updateJob(jobId, updateData);

        setToast({
          message: "Job updated successfully! 🎉",
          type: "success",
        });

        setTimeout(() => {
          onUpdated();
          onClose();
          clearData();
        }, 1000);
      }
    } catch (error) {
      setToast({ message: "Failed to update job", type: "error" });
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
  if (noPermission) {
    return (
      <div
        className="fixed inset-0 z-1001 flex items-center justify-center mt-14"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
          <p className="text-red-500 font-semibold text-center">
            You do not have permission to edit this job.
          </p>
          <button
            onClick={handleClose}
            className="mt-4 w-full py-2 bg-gray-300 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-1001 flex items-center justify-center "
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isAdmin ? "bg-purple-100" : "bg-blue-100"
            }`}
          >
            {isAdmin ? (
              <Shield className="w-8 h-8 text-purple-600" />
            ) : (
              <Briefcase className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold">
            {isAdmin ? "Edit Job (Admin)" : "Edit Job"}
          </h1>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Company Name"
              error={errors.company}
              required={canEditFull || canEditWithoutStatus}
            >
              <Input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                disabled={!(canEditFull || canEditWithoutStatus) || isSubmitting}
              />
            </FormField>

            <FormField
              label="Job Position"
              error={errors.position}
              required={canEditFull || canEditWithoutStatus}
            >
              <Input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                disabled={!(canEditFull || canEditWithoutStatus) || isSubmitting}
              />
            </FormField>
          </div>
          
          {/* Employee Information Section */}
                        <div className="border-t dark:border-gray-700 pt-6">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Contact Information
                          </h3>
          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              label="Employee Name"
                              error={errors.employeeName}
                              required={canEditFull || canEditWithoutStatus}

                            >
                              <Input
                                type="text"
                                value={formData.employeeName}
                                onChange={(e) =>
                                  handleInputChange("employeeName", e.target.value)
                                }
                                disabled={!(canEditFull || canEditWithoutStatus) || isSubmitting}
                                className="text-sm sm:text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-violet-600 dark:focus:ring-violet-400"
                              />
                            </FormField>
          
                            <FormField
                              label="Phone Number"
                              error={errors.phoneNumber}
                              required={canEditFull || canEditWithoutStatus}
                            >
                              <Input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) =>
                                  handleInputChange("phoneNumber", e.target.value)
                                }
                                disabled={!(canEditFull || canEditWithoutStatus) || isSubmitting}
                                className="text-sm sm:text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-violet-600 dark:focus:ring-violet-400"
                              />
                            </FormField>
                          </div>
          
                          <FormField
                            label="Email Address"
                            error={errors.email}
                            className="mt-6"
                            required={canEditFull || canEditWithoutStatus}
                          >
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              disabled={!(canEditFull || canEditWithoutStatus) || isSubmitting}
                              className="text-sm sm:text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-violet-600 dark:focus:ring-violet-400"
                            />
                          </FormField>
                        </div>

          <FormField
            label="Application Status"
            error={errors.status}
            required={canEditFull || canEditStatusOnly}
          >
            {canEditFull || canEditStatusOnly ? (
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            ) : (
              <Input type="text" value={formData.status} readOnly disabled />
            )}
          </FormField>
            <div className="border-t dark:border-gray-700 pt-6">
            <FormField label="Notes" error={errors.notes}>
              <Textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                disabled={!(canEditFull || canEditWithoutStatus) || isSubmitting}
              />
            </FormField>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid()}
              className="flex-1 py-3 px-6 rounded-lg font-semibold text-white bg-violet-600 hover:bg-violet-700"
            >
              {isSubmitting ? "Updating..." : "Update Job"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-6 rounded-lg border"
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
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditJobModal;
