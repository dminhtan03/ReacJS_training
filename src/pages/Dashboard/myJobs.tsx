import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Layout/Header";
import JobCard from "@/components/ui/JobCard";
import Sidebar from "../../components/Layout/Sidebar";
import ConfirmModal from "../../components/Layout/ConfirmModal";
import { 
  Check, 
  X, 
  Search, 
  Filter, 
  Calendar, 
  Plus, 
  Briefcase, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Grid3X3,
  List,
  ArrowUpDown,
  Users,
  Star
} from "lucide-react";
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

const MyJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobFormData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortByDate, setSortByDate] = useState("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editJobId, setEditJobId] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  
  const reduxState = JSON.parse(localStorage.getItem("reduxState") || "{}");
  const userId: string | undefined = reduxState?.auth?.id;
  const userRole: string | undefined = reduxState?.auth?.role;
  const userName: string | undefined = reduxState?.auth?.firstName;

  const statusOptions = [
    { value: "Pending", label: "Pending", icon: Clock, color: "amber" },
    { value: "Approved", label: "Approved", icon: CheckCircle, color: "green" },
    { value: "Rejected", label: "Rejected", icon: XCircle, color: "red" },
  ];

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const itemsPerPage = 9;

  // Enhanced Toast Component
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
      <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-right-full duration-300">
        <div className={`p-4 rounded-2xl shadow-2xl backdrop-blur-xl border max-w-sm ${
          type === "success"
            ? "bg-green-500/90 border-green-400/50 text-white"
            : "bg-red-500/90 border-red-400/50 text-white"
        }`}>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {type === "success" ? (
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{type === "success" ? "Thành công!" : "Lỗi!"}</p>
              <p className="text-xs opacity-90">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Load jobs from API
  useEffect(() => {
    setIsLoading(true);
    jobService
      .getJobs()
      .then((data) => {
        setJobs(data);
        setIsLoading(false);
      })
      .catch(() => {
        setToast({ message: "Không thể tải danh sách công việc!", type: "error" });
        setIsLoading(false);
      });
  }, []);

  // Delete job
  const handleDelete = (id: string) => {
    jobService
      .deleteJob(id)
      .then(() => {
        setJobs((prev) => prev.filter((job) => job.id !== id));
        setToast({ message: "Đã xóa công việc thành công!", type: "success" });
      })
      .catch(() => {
        setToast({ message: "Không thể xóa công việc!", type: "error" });
      });
  };

  // Edit job
  const handleEdit = async (id: string, userId: string) => {
    try {
      const job = await jobService.getJobById(id);
      setEditJobId(id);
      setEditUserId(userId);
      setEditModalOpen(true);
    } catch (error) {
      setToast({ message: "Không thể tải thông tin công việc!", type: "error" });
    }
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

  const visibleJobs = sortedJobs.filter(
    (job) => String(job.userId) === String(userId)
  );

  // Statistics
  const stats = {
    total: visibleJobs.length,
    pending: visibleJobs.filter(job => job.status === 'Pending').length,
    approved: visibleJobs.filter(job => job.status === 'Approved').length,
    rejected: visibleJobs.filter(job => job.status === 'Rejected').length,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex min-h-[calc(100vh-80px)]">
          <div className={`fixed inset-y-0 left-0 z-40 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:flex transition-transform duration-300 ease-in-out`}>
            <Sidebar />
          </div>
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Đang tải...</h2>
              <p className="text-gray-600 dark:text-gray-400">Vui lòng chờ trong giây lát</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex transition-transform duration-300 ease-in-out`}>
          <Sidebar />
        </div>
        
        {/* Sidebar Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-800 dark:from-gray-100 dark:via-blue-200 dark:to-violet-200 bg-clip-text text-transparent mb-2">
                  My jobs
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Hi {userName}!, follow and manage your job
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Link
                  to="/add-job"
                  className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add job</span>
                </Link>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Accepted</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="pl-12 pr-8 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 min-w-[160px]"
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Accepted</option>
                </select>
              </div>

              {/* Date Sort */}
              <div className="relative">
                <ArrowUpDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="pl-12 pr-8 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 min-w-[140px]"
                  value={sortByDate}
                  onChange={(e) => {
                    setSortByDate(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="desc">Latest</option>
                  <option value="asc">Newest</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 text-violet-600 dark:text-violet-400 shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 text-violet-600 dark:text-violet-400 shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Job Cards */}
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
          }`}>
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <div key={job.id} className="group">
                  <JobCard
                    title={job.position}
                    company={job.company}
                    status={job.status}
                    date={new Date(job.dateAdded).toLocaleDateString('vi-VN')}
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
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Chưa có công việc nào
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-6">
                    Hãy thêm công việc đầu tiên để bắt đầu theo dõi quá trình ứng tuyển
                  </p>
                  <Link
                    to="/add-job"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    Thêm công việc đầu tiên
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-8 gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Trước
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, filtered) => (
                    <React.Fragment key={page}>
                      {index > 0 && filtered[index - 1] !== page - 1 && page !== 1 && (
                        <span className="px-3 py-3 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => goToPage(page)}
                        className={`px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
                          page === currentPage
                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Sau
              </button>
            </div>
          )}

          {/* Modals */}
          <ConfirmModal
            isOpen={isModalOpen}
            message="Bạn có chắc chắn muốn xóa công việc này không?"
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
      </div>
      
      <ScrollToTopButton />
    </div>
  );
};

export default MyJobsPage;