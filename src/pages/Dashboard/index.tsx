import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Layout/Header";
import JobCard from "@/components/ui/JobCard";
import Sidebar from "../../components/Layout/Sidebar";
import ConfirmModal from "../../components/Layout/ConfirmModal";
import { Check, X } from "lucide-react";
import * as jobService from "../../service/jobService";
import EditJobModal from "../../components/Layout/EditJobModal";
import ScrollToTopButton from "@/components/Layout/ScrollToTop";

interface JobFormData {
  id: string;
  company: string;
  position: string;
  status: string;
  notes: string;
  dateAdded: string;
  userId: string;
  role: string;
}

const DashboardPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobFormData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortByDate, setSortByDate] = useState("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editJobId, setEditJobId] = useState<string | null>(null);
  const reduxState = JSON.parse(localStorage.getItem("reduxState") || "{}");
  const userId: string | undefined = reduxState?.auth?.id;
  const userRole: string | undefined = reduxState?.auth?.role;
  const statusOptions = [
    { value: "Pending", label: "✨ Pending" },
    { value: "Approved", label: "📝 Approved" },
    { value: "Rejected", label: "❌ Rejected" },
  ];
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const itemsPerPage = 9;

  // Toast component
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
        className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-[90%] sm:max-w-sm ${
          type === "success"
            ? "bg-green-500 text-white dark:bg-green-600"
            : "bg-red-500 text-white dark:bg-red-600"
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

  // Load jobs from API
  useEffect(() => {
    jobService
      .getJobs()
      .then((data) => setJobs(data))
      .catch(() =>
        setToast({ message: "Failed to load jobs!", type: "error" })
      );
  }, []);

  // Delete job
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

  // Edit job
  const handleEdit = async (id: string) => {
    try {
      const job = await jobService.getJobById(id);
      setEditJobId(id);
      setEditModalOpen(true);
    } catch (error) {}
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? job.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Sort by date
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortByDate === "asc") {
      return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
    } else if (sortByDate === "desc") {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
    return 0;
  });

  const visibleJobs =
    userRole === "ADMIN"
      ? sortedJobs
      : sortedJobs.filter((job) => String(job.userId) === String(userId));

  // Pagination
  const totalPages = Math.ceil(visibleJobs.length / itemsPerPage);
  const currentJobs = visibleJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  return (
    <div className="w-full dark:bg-gray-900" style={{height: "100vh"}}>
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex min-h-[calc(100vh-64px)] pt-16 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <div
          className={`fixed inset-y-0 left-0 z-40 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:flex transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 border-r dark:border-gray-700`}
        >
          <Sidebar />
        </div>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <main className="flex-grow p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-900">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 dark:text-white">
            My Jobs
          </h1>
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search jobs..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <select
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Status</option>
              <option className="custom_option_mobile" value="Pending">
                Pending
              </option>
              <option className="custom_option_mobile" value="Approved">
                Approved
              </option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={sortByDate}
              onChange={(e) => {
                setSortByDate(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Applied date</option>
              <option value="asc">Increase</option>
              <option value="desc">Decrease</option>
            </select>
            <Link
              to="/add-job"
              className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white px-4 py-2 rounded-lg font-semibold text-sm sm:text-base text-center transition"
            >
              Add Job
            </Link>
          </div>
          {/* Job Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <JobCard
                  key={job.id}
                  title={job.position}
                  company={job.company}
                  status={job.status}
                  date={new Date(job.dateAdded).toLocaleDateString()}
                  notes={job.notes}
                  role={userRole}
                  userId={job.userId}
                  onEdit={() => handleEdit(job.id)}
                  onDelete={() => {
                    setSelectedJobId(job.id);
                    setIsModalOpen(true);
                  }}
                />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
                No jobs found.
              </p>
            )}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 text-sm sm:text-base ${
                  currentPage > 1 ? "cursor-pointer" : ""
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, index, filtered) => (
                  <React.Fragment key={page}>
                    {index > 0 &&
                      filtered[index - 1] !== page - 1 &&
                      page !== 1 && <span className="px-2 dark:text-gray-100">...</span>}
                    <button
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 rounded cursor-pointer border text-sm sm:text-base ${
                        page === currentPage
                          ? "bg-violet-600 text-white border-violet-600 dark:bg-violet-500 dark:border-violet-500"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 cursor-pointer rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                Next
              </button>
            </div>
          )}
          {/* Confirm Modal */}
          <ConfirmModal
            isOpen={isModalOpen}
            message="Do you want to delete this job?"
            onCancel={() => setIsModalOpen(false)}
            onConfirm={() => {
              if (selectedJobId !== null) {
                handleDelete(selectedJobId);
              }
              setIsModalOpen(false);
            }}
          />
          <EditJobModal
            isOpen={editModalOpen}
            jobId={editJobId}
            onClose={() => setEditModalOpen(false)}
            onUpdated={() => {
              jobService.getJobs().then((data) => setJobs(data));
            }}
            currentUserRole={userRole}
          />
          {/* Toast */}
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
        </main>
        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default DashboardPage;