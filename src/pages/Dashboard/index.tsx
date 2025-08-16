import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Layout/Header";
import JobCard from "@/components/ui/JobCard";
import Sidebar from "../../components/Layout/Sidebar";
import ConfirmModal from "../../components/Layout/ConfirmModal";
import { Check, X, Search, Filter, Plus, Calendar, TrendingDown, TrendingUp, Briefcase, Users } from "lucide-react";
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
  employeeName: string;
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
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const reduxState = JSON.parse(localStorage.getItem("reduxState") || "{}");
  const userId: string | undefined = reduxState?.auth?.id;
  const userRole: string | undefined = reduxState?.auth?.role;
  const statusOptions = [
    { value: "Pending", label: "⏳ Pending", color: "bg-amber-100 text-amber-700" },
    { value: "Approved", label: "✅ Approved", color: "bg-green-100 text-green-700" },
    { value: "Rejected", label: "❌ Rejected", color: "bg-red-100 text-red-700" },
  ];
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const itemsPerPage = 9;

  // Enhanced Toast component
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
        className={`fixed top-6 right-6 p-4 rounded-xl shadow-2xl z-[9999] max-w-[90%] sm:max-w-sm backdrop-blur-sm border transition-all duration-300 transform ${
          type === "success"
            ? "bg-emerald-50/95 dark:bg-emerald-900/95 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-100"
            : "bg-red-50/95 dark:bg-red-900/95 border-red-200 dark:border-red-700 text-red-800 dark:text-red-100"
        }`}
      >
        <div className="flex items-center">
          <div className={`p-1 rounded-full mr-3 ${type === "success" ? "bg-emerald-100 dark:bg-emerald-800" : "bg-red-100 dark:bg-red-800"}`}>
            {type === "success" ? (
              <Check className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </div>
          <span className="text-sm font-medium flex-1">{message}</span>
          <button
            onClick={onClose}
            className={`ml-3 p-1 rounded-full hover:bg-opacity-20 transition-all duration-200 ${
              type === "success" ? "hover:bg-emerald-600" : "hover:bg-red-600"
            }`}
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
  const handleEdit = async (id: string, userId: string) => {
    try {
      const job = await jobService.getJobById(id);
      setEditJobId(id);
      setEditUserId(userId);
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

  // Statistics
  const stats = {
    total: visibleJobs.length,
    pending: visibleJobs.filter(job => job.status === "Pending").length,
    approved: visibleJobs.filter(job => job.status === "Approved").length,
    rejected: visibleJobs.filter(job => job.status === "Rejected").length,
  };

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
    <div className="w-full dark:bg-gray-900 min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30">
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex min-h-[calc(100vh-64px)] ">
        <div
          className={`fixed inset-y-0 left-0 z-40 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:flex transition-transform duration-300 ease-in-out bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-r border-gray-200/80 dark:border-gray-700/80`}
        >
          <Sidebar />
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden transition-all duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-grow p-4 sm:p-6 md:p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-800 dark:from-gray-100 dark:via-blue-200 dark:to-violet-200 bg-clip-text text-transparent mb-2">
                  Job Tracker Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Track and manage your job applications efficiently
                </p>
              </div>

              <Link
                to="/add-job"
                className="group mt-4 sm:mt-0 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold text-sm sm:text-base inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                Add New Job
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Jobs</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{stats.pending}</p>
                  </div>
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{stats.approved}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.rejected}</p>
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Search & Filter */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by company or position..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 transition-all duration-200 appearance-none cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">All Status</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 transition-all duration-200 appearance-none cursor-pointer"
                    value={sortByDate}
                    onChange={(e) => {
                      setSortByDate(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">Sort by Date</option>
                    <option value="desc">🔽 Newest First</option>
                    <option value="asc">🔼 Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
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
                  employeeName={job.employeeName}
                  onEdit={() => handleEdit(job.id, job.userId)}
                  onDelete={() => {
                    setSelectedJobId(job.id);
                    setIsModalOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-sm text-center max-w-md">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {searchTerm || filterStatus
                      ? "Try adjusting your search or filter criteria"
                      : "Start by adding your first job application"
                    }
                  </p>
                  {!searchTerm && !filterStatus && (
                    <Link
                      to="/add-job"
                      className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Job
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, visibleJobs.length)} of {visibleJobs.length} jobs
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
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
                          page !== 1 && (
                            <span className="px-2 text-gray-400 dark:text-gray-500">...</span>
                          )}
                        <button
                          onClick={() => goToPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            page === currentPage
                              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transform scale-105"
                              : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Confirm Modal */}
          <ConfirmModal
            isOpen={isModalOpen}
            message="Are you sure you want to delete this job application? This action cannot be undone."
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
            userId={editUserId}
            onClose={() => setEditModalOpen(false)}
            onUpdated={() => {
              jobService.getJobs().then((data) => setJobs(data));
            }}
            currentUserRole={userRole}
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

        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default DashboardPage;