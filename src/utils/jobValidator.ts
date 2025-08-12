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
            "Rejected"
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

    static validateForm(data: Partial<JobFormData>) : ValidationErrors {
        return {
            company: this.validateCompany(data.company || ""),
            position: this.validatePosition(data.position || ""),
            status: this.validateStatus(data.status || ""),
            notes: this.validateNotes(data.notes || ""),
        };
    }
}