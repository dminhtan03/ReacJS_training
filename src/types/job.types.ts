export interface JobFormData {
    id: string;
    company : string | undefined;
    position: string;
    status: JobStatus;
    notes: string;
    dateAdded: string;
    employeeName: string;
    email: string;
    phoneNumber: string;
    submittedBy: string;
    approvedBy: string;
}
export type JobStatus = "Applied" | "Interview" | "Offer" | "Rejected" | "Pending" | "Approved";

export interface ValidationErrors {
    company?: string;
    position?: string;
    status?: string;
    notes?: string;
    email?: string;
    phoneNumber?: string;
    employeeName?: string;

}

export interface FormFieldProps {
    label: string;
    error?: string;
    required?: boolean,
    children: React.ReactNode;
}

export interface InputProps extends React.InsHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
    options: {value: string, label: string}[];
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export interface ToastProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
}