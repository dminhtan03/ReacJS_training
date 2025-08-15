import React, { useState, useEffect } from "react";
import { Search, Filter, SortDesc, Grid3X3, List, ChevronLeft, ChevronRight, Briefcase, Calendar, Building2, CheckCircle, Clock, XCircle, Eye, MoreHorizontal } from "lucide-react";
import Header from "../../components/Layout/Header";
import Sidebar from "../../components/Layout/Sidebar";
import JobCard from "@/components/ui/JobCard";
import ScrollToTopButton from "@/components/Layout/ScrollToTop";
import * as jobService from "../../service/jobService";
import { Check, X } from "lucide-react";
import EditJobModal from "@/components/Layout/EditJobModal";
import ConfirmModal from "@/components/Layout/ConfirmModal";

interface JobFormData {
  id: string;
  company: string;
  position: string;
  status: string;
  notes: string;
  dateAdded: string;
  role: string;
  userId: string;
}

const GetAllJobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobFormData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortByDate, setSortByDate] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const itemsPerPage = 9;
  const reduxState = JSON.parse(localStorage.getItem("reduxState") || "{}");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editJobId, setEditJobId] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const userRole: string | undefined = reduxState?.auth?.role;
  const userId: string | undefined = reduxState?.auth?.id;
  const name: string | undefined = reduxState?.auth?.name;
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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
      <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-right-full">
        <div className={`
          p-4 rounded-2xl shadow-2xl border backdrop-blur-xl max-w-md
          ${type === "success" 
            ? "bg-green-50/90 dark:bg-green-950/90 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200" 
            : "bg-red-50/90 dark:bg-red-950/90 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
          }
        `}>
          <div className="flex items-center gap-3">
            {type === "success" ? (
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <p className="font-medium">{message}</p>
            <button 
              onClick={onClose}
              className="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    jobService
      .getJobs()
      .then((data) => setJobs(data))
      .catch(() =>
        setToast({ message: "Failed to load jobs!", type: "error" })
      );
  }, []);

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

  // Pagination
  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);
  const currentJobs = sortedJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );  

  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Get status stats
  const getStatusStats = () => {
    const stats = {
      total: jobs.length,
      pending: jobs.filter(job => job.status === 'Pending').length,
      approved: jobs.filter(job => job.status === 'Approved').length,
      rejected: jobs.filter(job => job.status === 'Rejected').length,
    };
    return stats;
  };

  const stats = getStatusStats();

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
      switch (status.toLowerCase()) {
        case 'approved':
          return {
            icon: CheckCircle,
            className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
          };
        case 'pending':
          return {
            icon: Clock,
            className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
          };
        case 'rejected':
          return {
            icon: XCircle,
            className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
          };
        default:
          return {
            icon: Eye,
            className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700',
          };
      }
    };

    const config = getStatusConfig(status);
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        <IconComponent className="w-3 h-3" />
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex min-h-[calc(100vh-64px)] pt-16 mt-4">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:flex transition-transform duration-300 ease-in-out`}
        >
          <Sidebar />
        </div>
        
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 max-w-full md:p-8 ">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-800 dark:from-gray-100 dark:via-blue-200 dark:to-violet-200 bg-clip-text text-transparent mb-2">
                  All Jobs
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Manage and track all job applications
                </p>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl p-1 border border-gray-200/50 dark:border-gray-700/50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-violet-500 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-violet-500 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.approved}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pending}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.rejected}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-gray-700/20 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Search & Filters</h2>
              <button
                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>

            <div className={`space-y-4 ${isFiltersExpanded ? 'block' : 'hidden md:block'}`}>
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by company or position..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-violet-400 dark:focus:border-violet-500 focus:outline-none transition-colors"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-violet-400 dark:focus:border-violet-500 focus:outline-none transition-colors appearance-none"
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="relative">
                  <SortDesc className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-violet-400 dark:focus:border-violet-500 focus:outline-none transition-colors appearance-none"
                    value={sortByDate}
                    onChange={(e) => {
                      setSortByDate(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">Sort by Date</option>
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm || filterStatus) && (
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 rounded-full text-xs">
                      Search: "{searchTerm}"
                      <button onClick={() => setSearchTerm("")} className="hover:bg-violet-200 dark:hover:bg-violet-800 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filterStatus && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 rounded-full text-xs">
                      Status: {filterStatus}
                      <button onClick={() => setFilterStatus("")} className="hover:bg-violet-200 dark:hover:bg-violet-800 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="font-medium">{sortedJobs.length}</span>
              <span>jobs found</span>
              {(searchTerm || filterStatus) && (
                <span>• Filtered results</span>
              )}
            </div>
          </div>

          {/* Job Cards */}
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }
            mb-8
          `}>
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <div
                  key={job.id}
                  className={`
                    bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300 
                    ${viewMode === 'list' ? 'p-6' : 'p-6'}
                    hover:scale-[1.02] hover:border-violet-300 dark:hover:border-violet-700
                  `}
                >
                  {viewMode === 'grid' ? (
                    <JobCard
                      title={job.position}
                      company={job.company}
                      status={job.status}
                      date={new Date(job.dateAdded).toLocaleDateString()}
                      notes={job.notes}
                      userId={job.userId}
                      role={userRole}
                      employeeName={job.employeeName}
                      onEdit={() => handleEdit(job.id, job.userId)}
                      onDelete={() => {
                        setSelectedJobId(job.id);
                        setIsModalOpen(true);
                      }}
                    />
                  ) : (
                    // List View Layout
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {job.position}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">{job.company}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(job.dateAdded).toLocaleDateString()}
                            </span>
                            <StatusBadge status={job.status} />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(job.id, job.userId)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Briefcase className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm || filterStatus 
                    ? "Try adjusting your search or filters" 
                    : "Start by adding your first job application"
                  }
                </p>
                {(searchTerm || filterStatus) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("");
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedJobs.length)} of {sortedJobs.length} results
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
                      ${currentPage === 1 
                        ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed" 
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-violet-300 dark:hover:border-violet-600"
                      }
                    `}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
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
                              <span className="px-2 text-gray-400 dark:text-gray-600">...</span>
                            )}
                          <button
                            onClick={() => goToPage(page)}
                            className={`
                              w-10 h-10 rounded-lg border transition-all duration-200 font-medium
                              ${page === currentPage
                                ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/25"
                                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-violet-300 dark:hover:border-violet-600"
                              }
                            `}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
                      ${currentPage === totalPages 
                        ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed" 
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-violet-300 dark:hover:border-violet-600"
                      }
                    `}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modals */}
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
            userId={editUserId}

            onClose={() => setEditModalOpen(false)}
            onUpdated={() => {
              jobService.getJobs().then((data) => setJobs(data));
            }}
            currentUserRole={userRole}
          />

        </main>
        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default GetAllJobs;
