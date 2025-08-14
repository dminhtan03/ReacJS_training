import { JobFormData, JobStatus, ValidationErrors } from "@/types/job.types";

export class JobValidator {
    static validateCompany(company : string) : string | undefined {
        if(!company.trim()) {
            return "Company is required";
        }
        if(company.trim().length < 2) {
            return "Company name must be at least 2 characters";
        }
        if(company.trim().length > 100) {
            return "Company name cannot exceed 100 characters";
        }
        return undefined
    }

    static validatePosition(position : string) : string | undefined {
        if(!position.trim()) {
            return "Position is required";
        }
        if(position.trim().length < 2) {
            return "Position name must be at least 2 characters";
        }
        if(position.trim().length > 100) {
            return "Position name cannot exceed 100 characters";
        }
        return undefined
    }

    static validateStatus(status : string) : string | undefined {
        const validStatuses : JobStatus[] = [
            "Applied",
            "Interview",
            "Offer",
            "Rejected",
            "Pending"
        ]
        if(!validStatuses.includes(status as JobStatus)) {
            return "Please select a valid status";
        }
        return undefined;
    }

    static validateNotes(notes : string) : string | undefined {
        if(notes.length > 1000) {
            return "Notes cannot exceed 1000 characters";
        }
        return undefined;
    }

    static validateEmployeeName(employeeName : string) : string | undefined {
        if(!employeeName.trim()) {
            return "Employee name is required";
        }
        if(employeeName.trim().length < 2) {
            return "Employee name must be at least 2 characters";
        }
        if(employeeName.trim().length > 100) {
            return "Employee name cannot exceed 100 characters";
        }
        return undefined
    }

    static validatePhoneNumber(phoneNumber : string) : string | undefined {
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return "Must be 10 digits and start with 0";
        }
        return undefined
    }

    static validateEmail(email : string) : string | undefined {
        if(!email.trim()) {
            return "Email is required";
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return "Invalid email format";
        }
        return undefined
    }


    static validateForm(data: Partial<JobFormData>) : ValidationErrors {
        return {
            company: this.validateCompany(data.company || ""),
            position: this.validatePosition(data.position || ""),
            notes: this.validateNotes(data.notes || ""),
            email: this.validateEmail(data.email || ""),
            phoneNumber: this.validatePhoneNumber(data.phoneNumber || ""),
            employeeName: this.validateEmployeeName(data.employeeName || ""),
        };
    }
}