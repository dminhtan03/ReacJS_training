// src/services/jobService.ts
import axios from "axios";

interface JobFormData {
  // id: string;
  company: string;
  position: string;
  status: JobStatus;
  notes: string;
  dateAdded: string;
}
type JobStatus = "Applied" | "Interview" | "Offer" | "Rejected";

const API_URL = "https://689aba7fe727e9657f6266b8.mockapi.io/api/v1/jobs";

// Lấy tất cả job
export const getJobs = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

// Lấy job theo ID
export const getJobById = async (id: string) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
};

// Tạo job mới
export const createJob = async (job: JobFormData): Promise<JobFormData> => {
  const response = await axios.post(API_URL, job);
  return response.data;
};

// Cập nhật job
export const updateJob = async (id: string, jobData: JobFormData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, jobData);
    return res.data;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

// Xóa job
export const deleteJob = async (id: string) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
