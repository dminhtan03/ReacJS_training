import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Layout/Header";
import JobCard from "@/components/ui/JobCard";
import JobStorageService from "@/service/JobStorageService";
import Sidebar from "../../components/Layout/Sidebar";
interface JobFormData {
  id: string;
  company: string;
  position: string;
  status: string;
  notes: string;
  dateAdded: string;
}

const DashboardPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobFormData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  // Load jobs from localStorage when component mounts
  useEffect(() => {
    const loadedJobs = JobStorageService.getAllJobs();
    setJobs(loadedJobs);
  }, []);

  // Handle delete job
  const handleDelete = (id: string) => {
    const success = JobStorageService.deleteJob(id);
    if (success) {
      setJobs(jobs.filter((job) => job.id !== id));
    }
  };

  // Handle edit job
  const handleEdit = (id: string) => {
    navigate(`/edit-job/${id}`); // Chuyển hướng đến trang chỉnh sửa với ID
  };

  // Filter jobs based on search term and status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? job.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Header />

      <div className="flex min-h-[calc(100vh-64px)] bg-gray-50 text-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-grow p-8 bg-white">
          <h1 className="text-2xl font-bold mb-6">My Jobs</h1>

          {/* Search & Filter */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search jobs..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-base"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <Link
              to="/add-job"
              className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg font-semibold transition"
            >
              Add Job
            </Link>
          </div>

          {/* Job Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  title={job.position}
                  company={job.company}
                  status={job.status}
                  date={new Date(job.dateAdded).toLocaleDateString()}
                  onEdit={() => handleEdit(job.id)}
                  onDelete={() => handleDelete(job.id)}
                />
              ))
            ) : (
              <p className="text-gray-500">No jobs found.</p>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
