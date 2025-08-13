import React, { useState, useEffect } from "react";
import { Briefcase, X } from "lucide-react";
import { FormField, Input, Select, Textarea, Toast } from "@/components/ui";

import * as jobService from "@/service/jobService";
import { JobValidator } from "@/utils/jobValidator";
import { JobFormData, ValidationErrors } from "@/types/job.types";

interface EditJobModalProps {
  isOpen: boolean;
  jobId: string | null;
  onClose: () => void;
  onUpdated: () => void; // callback reload jobs
}

const statusOptions = [
  { value: "Applied", label: "Applied" },
  { value: "Interview", label: "Interview" },
  { value: "Offer", label: "Offer" },
  { value: "Rejected", label: "Rejected" },
];

const EditJobModal: React.FC<EditJobModalProps> = ({
  isOpen,
  jobId,
  onClose,
  onUpdated,
}) => {
  const [formData, setFormData] = useState<Partial<JobFormData>>({
      company: "",
      position: "",
      status: "Applied",
      notes: "",
    });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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
  };

  const clearData = () => {
    setFormData({
      company: "",
      position: "",
      status: "Applied",
      notes: "",
    })
  }

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
      if (jobId) {
        await jobService.updateJob(jobId, formData);

        setToast({
          message: "Job application added successfully! 🎉",
          type: "success",
        });

        setTimeout(() => {
          onUpdated(); // reload job list
          onClose();
          clearData();
        }, 2000);
      }
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    clearData();
    setErrors({});
    setToast(null);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center " style={{backgroundColor: "rgba(0,0,0,0.5)"}}>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl custom_desktop relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5 cursor-pointer" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Job</h1>
          <p className="text-gray-600">Update your job application details</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <FormField label="Company Name" error={errors.company} required>
            <Input
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              disabled={isSubmitting}
              error={!!errors.company}
            />
          </FormField>

          <FormField label="Job Position" error={errors.position} required>
            <Input
              type="text"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              disabled={isSubmitting}
              error={!!errors.position}
            />
          </FormField>

          <FormField label="Application Status">
            <Select
              options={statusOptions}
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              disabled={isSubmitting}
            />
          </FormField>

          <FormField label="Notes">
            <Textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              disabled={isSubmitting}
            />
          </FormField>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 cursor-pointer hover:bg-indigo-700"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Job"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-6 rounded-lg cursor-pointer font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default EditJobModal;
