import { Pen, Trash, Calendar, Building2, FileText, Star, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import React from "react";

interface JobCardProps {
  title: string;
  company: string;
  status: string;
  date: string;
  notes: string;
  onEdit?: () => void;
  onDelete?: () => void;
  role: string;
  userId: string;
  employeeName: string;
}

const statusConfig: Record<string, { 
  bg: string; 
  text: string; 
  border: string; 
  icon: React.ReactNode;
  glow: string;
}> = {
  Approved: { 
    bg: "bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 dark:from-emerald-950/50 dark:via-green-950/30 dark:to-emerald-950/50", 
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200/60 dark:border-emerald-700/60",
    icon: <CheckCircle2 className="w-4 h-4" />,
    glow: "shadow-emerald-500/20 dark:shadow-emerald-400/10"
  },
  Rejected: { 
    bg: "bg-gradient-to-r from-red-50 via-rose-50 to-red-50 dark:from-red-950/50 dark:via-rose-950/30 dark:to-red-950/50", 
    text: "text-red-700 dark:text-red-300",
    border: "border-red-200/60 dark:border-red-700/60",
    icon: <XCircle className="w-4 h-4" />,
    glow: "shadow-red-500/20 dark:shadow-red-400/10"
  },
  Pending: { 
    bg: "bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-950/50 dark:via-yellow-950/30 dark:to-amber-950/50", 
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200/60 dark:border-amber-700/60",
    icon: <Clock className="w-4 h-4" />,
    glow: "shadow-amber-500/20 dark:shadow-amber-400/10"
  }
};

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  status,
  date,
  notes,
  onEdit,
  onDelete,
  role,
  userId,
  employeeName
}) => {
  const reduxState = JSON.parse(localStorage.getItem("reduxState") || "{}");
  const userIdStorage: string | undefined = reduxState?.auth?.id;
  
  const statusStyle = statusConfig[status] || {
    bg: "bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 dark:from-gray-800/50 dark:via-slate-800/30 dark:to-gray-800/50",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-200/60 dark:border-gray-600/60",
    icon: <AlertCircle className="w-4 h-4" />,
    glow: "shadow-gray-500/10 dark:shadow-gray-400/5"
  };

  return (
    <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/40 dark:border-gray-700/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 dark:from-gray-800 dark:via-blue-950/20 dark:to-purple-950/20 opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/20 dark:to-gray-800/20" />
      
      {/* Status indicator bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${
        status === 'Approved' ? 'from-emerald-400 via-green-500 to-emerald-600' :
        status === 'Rejected' ? 'from-red-400 via-rose-500 to-red-600' :
        status === 'Pending' ? 'from-amber-400 via-yellow-500 to-amber-600' :
        'from-gray-300 via-slate-400 to-gray-500'
      }`} />
      
      {/* Floating orb decoration */}
      <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-violet-200/30 to-purple-300/30 dark:from-violet-800/20 dark:to-purple-900/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
      
      <div className="relative p-6 space-y-4">
        {/* Header section */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-violet-100/80 dark:bg-violet-900/30 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                <Star className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300 leading-tight">
                {title}
              </h3>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <div className="p-1.5 bg-blue-100/80 dark:bg-blue-900/30 rounded-md">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-base">{company}</span>
              </div>
            </div>
          </div>
        </div>

      

        {/* Status badge */}
        <div className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} ${statusStyle.glow} shadow-lg`}>
          <div className="flex items-center justify-center">
            {statusStyle.icon}
          </div>
          <span className="font-bold">{status}</span>
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
        </div>

        {/* Date section */}
        <div className="flex items-center gap-2.5 p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600/50">
          <div className="p-2 bg-indigo-100/80 dark:bg-indigo-900/30 rounded-lg">
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applied Date</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{date}</p>
          </div>
          <p className="ml-2">- {employeeName}</p>
        </div>

        {/* Notes section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-100/80 dark:bg-teal-900/30 rounded-md">
              <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Notes</span>
            <div className="bg-gradient-to-r from-gray-50/80 via-white/50 to-gray-50/80 dark:from-gray-700/50 dark:via-gray-600/30 dark:to-gray-700/50 rounded-xl p-4 border border-gray-100/80 dark:border-gray-600/50 backdrop-blur-sm">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {notes || (
                <span className="italic text-gray-500 dark:text-gray-400">
                  No additional notes provided for this application
                </span>
              )}
            </p>
          </div>
          </div>
          
        </div>

        {/* Action buttons */}
        {userId === userIdStorage && (
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100/80 dark:border-gray-700/50">
            <button
              className="group/edit relative bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 overflow-hidden"
              onClick={onEdit}
              title="Edit job application"
              aria-label="Edit job"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/edit:opacity-100 transition-opacity duration-300" />
              <Pen className="w-4 h-4 transition-transform group-hover/edit:rotate-12 relative z-10" />
              <span className="hidden sm:inline relative z-10">Edit</span>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/50 to-indigo-500/50 opacity-0 group-hover/edit:opacity-100 transition-opacity duration-300 blur-sm" />
            </button>
            
            <button
              className="group/delete relative bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 overflow-hidden"
              onClick={onDelete}
              title="Delete job application"
              aria-label="Delete job"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/delete:opacity-100 transition-opacity duration-300" />
              <Trash className="w-4 h-4 transition-transform group-hover/delete:rotate-12 relative z-10" />
              <span className="hidden sm:inline relative z-10">Delete</span>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400/50 to-rose-500/50 opacity-0 group-hover/delete:opacity-100 transition-opacity duration-300 blur-sm" />
            </button>
          </div>
        )}
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-200/20 via-purple-200/20 to-pink-200/20 dark:from-violet-800/10 dark:via-purple-800/10 dark:to-pink-800/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
      
      {/* Interactive sparkles */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-ping" />
      <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse" />
    </div>
  );
};

export default JobCard;