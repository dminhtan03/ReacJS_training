import React, { useState, useCallback } from "react";
import { Briefcase } from "lucide-react";
import { Header } from "@/components/Layout";
import Sidebar from "../../components/Layout/Sidebar";
import { JobFormData, JobStatus, ValidationErrors } from "@/types/job.types";
import { JobValidator } from "@/utils/jobValidator";
import { FormField, Input, Select, Textarea, Toast } from "@/components/ui";
import * as jobService from "../../service/jobService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";

// Main Add Job Form Component
const AddJobForm: React.FC = () => {
  // Get user info from Redux store
  const { firstName, isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );

  const isAdmin = role === "admin";
  const isUser = role === "user";
  const reduxState = JSON.parse(localStorage.getItem("reduxState") || "{}");
  const userId: string | undefined = reduxState?.auth?.id;

  const [formData, setFormData] = useState<Partial<JobFormData>>({
    company: "",
    position: "",
    status: isAdmin ? "Applied" : "Pending", // Default status based on role
    notes: "",
    employeeName: "",
    phoneNumber: "",
    email: "",
    userId: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Status options based on user role
  const adminStatusOptions = [
    { value: "Rejected", label: "❌ Rejected" },
    { value: "Pending", label: "⏳ Pending Approval" },
    { value: "Approved", label: "✅ Approved" },
  ];

  const userStatusOptions = [
    { value: "Pending", label: "⏳ Pending Approval" },
  ];

  // Real-time validation function
  const validateField = (field: keyof JobFormData, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'company':
        if (!value.trim()) {
          newErrors.company = "Company name is required";
        } else if (value.trim().length < 2) {
          newErrors.company = "Company name must be at least 2 characters";
        } else {
          delete newErrors.company;
        }
        break;
        
      case 'position':
        if (!value.trim()) {
          newErrors.position = "Job position is required";
        } else if (value.trim().length < 2) {
          newErrors.position = "Position must be at least 2 characters";
        } else {
          delete newErrors.position;
        }
        break;
        
      case 'employeeName':
        if (!value.trim()) {
          newErrors.employeeName = "Employee name is required";
        } else if (value.trim().length < 2) {
          newErrors.employeeName = "Name must be at least 2 characters";
        } else {
          delete newErrors.employeeName;
        }
        break;
        
      case 'phoneNumber':
        if (!value.trim()) {
          newErrors.phoneNumber = "Phone number is required";
        } else if (!/^[\+]?[0-9\s\-\(\)]{8,15}$/.test(value.trim())) {
          newErrors.phoneNumber = "Please enter a valid phone number";
        } else {
          delete newErrors.phoneNumber;
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          newErrors.email = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'notes':
        if (value.length > 1000) {
          newErrors.notes = "Notes cannot exceed 1000 characters";
        } else {
          delete newErrors.notes;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = useCallback(
    (field: keyof JobFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      
      // Real-time validation
      validateField(field, value);
    },
    [errors]
  );

  // Check if form is valid for submit button
  const isFormValid = () => {
    const hasErrors = Object.keys(errors).length > 0;
    const requiredFields = {
      company: formData.company?.trim(),
      position: formData.position?.trim(),
      employeeName: formData.employeeName?.trim(),
      phoneNumber: formData.phoneNumber?.trim(),
      email: formData.email?.trim(),
    };
    
    const hasRequiredFields = Object.values(requiredFields).every(field => field && field.length > 0);
    
    return !hasErrors && hasRequiredFields;
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      status: isAdmin ? "Applied" : "Pending", // Reset to default based on role
      notes: "",
      employeeName: "",
      phoneNumber: "",
      email: "",
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Double check validation before submit
      if (!isFormValid()) {
        setToast({ message: "Please fix all errors before submitting", type: "error" });
        setIsSubmitting(false);
        return;
      }
      
      const jobData: JobFormData = {
        company: formData.company!.trim(),
        position: formData.position!.trim(),
        status: isUser ? "Pending" : (formData.status as JobStatus), // Force PENDING for users
        notes: formData.notes?.trim() || "",
        employeeName: formData.employeeName?.trim() || "",
        phoneNumber: formData.phoneNumber?.trim() || "",
        email: formData.email?.trim() || "",
        dateAdded: new Date().toISOString(),
        approvedBy:
          isAdmin && formData.status === "Approved" ? userId : undefined, // Track who approved
        userId: userId || "", // Track the user ID
      };
      await jobService.createJob(jobData);
      setToast({
        message: isUser
          ? "Job application submitted for approval! 🎉"
          : "Job application added successfully! 🎉",
        type: "success",
      });
      resetForm();
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setToast({
        message: "Failed to save job. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey && isFormValid()) {
      handleSubmit();
    }
  };

  return (
    <>
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex min-h-[calc(100vh-64px)] pt-15 bg-gray-50 text-gray-900">
        {/* Sidebar: Hidden on mobile, visible on tablet/desktop */}
        <div
          className={`fixed inset-y-0 left-0 z-40 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:flex transition-transform duration-300 ease-in-out w-64 md:w-56 lg:w-64`}
        >
          <Sidebar />
        </div>
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <div className="flex-grow p-4 sm:p-6 md:p-8 mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-6">
         
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Add Job
          </h1>
          <p className="text-gray-600">
              Add new job to track
          </p>
          
        </div>
          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
            <div className="space-y-6" onKeyDown={handleKeyPress}>
              {/* Company and Position Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Company Name" error={errors.company} required>
                  <Input
                    type="text"
                    placeholder="e.g. Google, Microsoft, Apple..."
                    value={formData.company || ""}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    error={!!errors.company}
                    disabled={isSubmitting}
                    className="text-sm sm:text-base"
                  />
                </FormField>

                <FormField
                  label="Job Position"
                  error={errors.position}
                  required
                >
                  <Input
                    type="text"
                    placeholder="e.g. Frontend Developer, Software Engineer..."
                    value={formData.position || ""}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                    error={!!errors.position}
                    disabled={isSubmitting}
                    className="text-sm sm:text-base"
                  />
                </FormField>
              </div>

              {/* Employee Information Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Employee Name"
                    error={errors.employeeName}
                    required
                  >
                    <Input
                      type="text"
                      placeholder="e.g. Hung Le, Le Hung..."
                      value={formData.employeeName || ""}
                      onChange={(e) =>
                        handleInputChange("employeeName", e.target.value)
                      }
                      error={!!errors.employeeName}
                      disabled={isSubmitting}
                      className="text-sm sm:text-base"
                    />
                  </FormField>

                  <FormField
                    label="Phone Number"
                    error={errors.phoneNumber}
                    required
                  >
                    <Input
                      type="tel"
                      placeholder="e.g. +84 123 456 789"
                      value={formData.phoneNumber || ""}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      error={!!errors.phoneNumber}
                      disabled={isSubmitting}
                      className="text-sm sm:text-base"
                    />
                  </FormField>
                </div>

                <FormField
                  label="Email Address"
                  error={errors.email}
                  className="mt-6"
                  required
                >
                  <Input
                    type="email"
                    placeholder="e.g. hungle@mail.com"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    error={!!errors.email}
                    disabled={isSubmitting}
                    className="text-sm sm:text-base"
                  />
                </FormField>
              </div>

              {/* Application Status - Only visible to Admin */}
              {isAdmin && (
                <div className="border-t pt-6">
                  <FormField label="Application Status" error={errors.status}>
                    <Select
                      options={adminStatusOptions}
                      value={formData.status || "Applied"}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      error={!!errors.status}
                      disabled={isSubmitting}
                      className="text-sm sm:text-base"
                    />
                  </FormField>
                </div>
              )}

              {/* Notes Section */}
              <div className="border-t pt-6">
                <FormField label="Notes" error={errors.notes}>
                  <Textarea
                    rows={4}
                    placeholder="e.g. Interview scheduled for next Monday, Applied through LinkedIn, Salary range 30-40M VND..."
                    value={formData.notes || ""}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    error={!!errors.notes}
                    disabled={isSubmitting}
                    className="text-sm sm:text-base"
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-2">
                    <p className="text-xs text-gray-500">
                      💡 Tip: Press Ctrl + Enter to submit quickly {!isFormValid() && "(when form is valid)"}
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
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isFormValid()}
                  className={`flex-1 py-3 sm:py-4 cursor-pointer px-6 rounded-lg font-semibold text-white text-sm sm:text-base transition-all duration-200 ${
                    isSubmitting || !isFormValid()
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
                      {isUser ? "Submit for Approval" : "Submit Job"}
                    </div>
                  )}
                </button>

                {/* Reset Button */}
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-4 rounded-lg text-gray-600 hover:text-gray-800 bg-gray-200 text-sm sm:text-base transition-colors duration-200 ${
                    isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  Clear Form
                </button>
              </div>
            </div>
          </div>

          {/* Toast notification */}
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
    </>
  );
};

export default AddJobForm;