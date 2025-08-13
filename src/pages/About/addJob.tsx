import React, { useState, useCallback } from "react";
import { Check, X, Briefcase } from "lucide-react";
import { Header } from "@/components/Layout";
import Sidebar from "../../components/Layout/Sidebar";
import { JobFormData, JobStatus, ValidationErrors } from "@/types/job.types";
import { JobValidator } from "@/utils/jobValidator";
import { FormField, Input, Select, Textarea, Toast } from "@/components/ui";
import * as jobService from "../../service/jobService";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar toggle

  const statusOptions = [
    { value: "Applied", label: "📝 Applied" },
    { value: "Interview", label: "🎯 Interview" },
    { value: "Offer", label: "✨ Offer" },
    { value: "Rejected", label: "❌ Rejected" },
  ];

  const handleInputChange = useCallback(
    (field: keyof JobFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
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
      const validationErrors = JobValidator.validateForm(formData);
      const hasErrors = Object.values(validationErrors).some((error) => error);
      if (hasErrors) {
        setErrors(validationErrors);
        setToast({ message: "Please fix the errors below", type: "error" });
        setIsSubmitting(false);
        return;
      }
      const jobData: JobFormData = {
        company: formData.company!.trim(),
        position: formData.position!.trim(),
        status: formData.status as JobStatus,
        notes: formData.notes?.trim() || "",
        dateAdded: new Date().toISOString(),
      };
      await jobService.createJob(jobData);
      setToast({
        message: "Job application added successfully! 🎉",
        type: "success",
      });
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      setToast({
        message: "Failed to save job. Please try again.",
        type: "error",
      });
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
    <>
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex min-h-[calc(100vh-64px)] bg-gray-50 text-gray-900">
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
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-4">
              <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Add New Job
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Track your job applications and manage your career journey
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
            <div className="space-y-6" onKeyDown={handleKeyPress}>
              <FormField label="Company Name" error={errors.company} required>
                <Input
                  type="text"
                  placeholder="e.g. Google, Microsoft, Apple..."
                  value={formData.company || ""}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  error={!!errors.company}
                  disabled={isSubmitting}
                  className="text-sm sm:text-base"
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
                  className="text-sm sm:text-base"
                />
              </FormField>

              <FormField label="Application Status" error={errors.status}>
                <Select
                  options={statusOptions}
                  value={formData.status || "Applied"}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  error={!!errors.status}
                  disabled={isSubmitting}
                  className="text-sm sm:text-base"
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
                  className="text-sm sm:text-base"
                />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-2">
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
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 sm:py-4 px-6 rounded-lg font-semibold text-white text-sm sm:text-base transition-all duration-200 ${
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
                      Add Job
                    </div>
                  )}
                </button>

                {/* Reset Button */}
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className={`w-full py-2 px-4 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm ${
                    !isSubmitting ? "cursor-pointer" : ""
                  } `}
                >
                  Clear Form
                </button>
              </div>
            </div>
          </div>

          {/* Toast notification */}
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
              className="max-w-[90%] sm:max-w-sm"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AddJobForm;