import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Layout/Header";
import JobCard from "@/components/ui/JobCard";
import Sidebar from "../../components/Layout/Sidebar";
import ConfirmModal from "../../components/Layout/ConfirmModal";
import { Check, X } from "lucide-react";

import * as jobService from "../../service/jobService"; // Import API service

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // số job mỗi trang
  const navigate = useNavigate();

  // Toast component giữ nguyên
  const Toast: React.FC<{
    message: string;
    type: "success" | "error";
    onClose: () => void;
  }> = ({ message, type, onClose }) => {
    React.useEffect(() => {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }, [onClose]);

    return (
      <div
        className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
          type === "success"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        <div className="flex items-center">
          {type === "success" ? (
            <Check className="w-5 h-5 mr-2 flex-shrink-0" />
          ) : (
            <X className="w-5 h-5 mr-2 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={onClose}
            className="ml-3 hover:opacity-75 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Load jobs từ API khi component mount
  useEffect(() => {
    jobService
      .getJobs()
      .then((data) => setJobs(data))
      .catch(() =>
        setToast({ message: "Failed to load jobs!", type: "error" })
      );
  }, []);

  // Xóa job qua API
  const handleDelete = (id: string) => {
    jobService
      .deleteJob(id)
      .then(() => {
        setJobs((prev) => prev.filter((job) => job.id !== id));
        setToast({ message: "Job deleted successfully!", type: "success" });
      })
      .catch(() => {
        setToast({ message: "Failed to delete job!", type: "error" });
      });
  };

  // Chỉnh sửa job => điều hướng sang trang edit
  const handleEdit = (id: string) => {
    navigate(`/edit-job/${id}`);
  };

  // Lọc theo search và status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? job.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Tính tổng trang
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  // Jobs trang hiện tại
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hàm chuyển trang
  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  return (
    <>
      <Header />

      <div className="flex min-h-[calc(100vh-64px)] bg-gray-50 text-gray-900">
        <Sidebar />

        <main className="flex-grow p-8 bg-white">
          <h1 className="text-2xl font-bold mb-6">My Jobs</h1>

          {/* Search & Filter */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search jobs..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-base"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset trang khi search
              }}
            />
            <select
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-base"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1); // reset trang khi filter
              }}
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
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <JobCard
                  key={job.id}
                  title={job.position}
                  company={job.company}
                  status={job.status}
                  date={new Date(job.dateAdded).toLocaleDateString()}
                  onEdit={() => handleEdit(job.id)}
                  onDelete={() => {
                    setSelectedJobId(job.id);
                    setIsModalOpen(true);
                  }}
                />
              ))
            ) : (
              <p className="text-gray-500">No jobs found.</p>
            )}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border cursor-pointer border-gray-300 disabled:opacity-50"
              >
                Prev
              </button>

              {/* Hiển thị các số trang (giới hạn hiển thị nếu nhiều trang) */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Hiển thị đầy đủ hoặc rút gọn (bạn có thể tùy biến)
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 rounded border ${
                          page === currentPage
                            ? "bg-blue-600 cursor-pointer text-white border-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  // Hiển thị dấu "..." nếu có trang bị ẩn
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page}>...</span>;
                  }
                  return null;
                }
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border cursor-pointer border-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Confirm modal */}
          <ConfirmModal
            isOpen={isModalOpen}
            message="Do you wanna delete this job?"
            onCancel={() => setIsModalOpen(false)}
            onConfirm={() => {
              if (selectedJobId !== null) {
                handleDelete(selectedJobId);
              }
              setIsModalOpen(false);
            }}
          />

          {/* Toast */}
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
