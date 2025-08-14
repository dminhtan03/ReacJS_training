import { Pen, Trash } from "lucide-react";
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
}

const statusStyles: Record<string, string> = {
  Approved: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100",
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
}) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800 flex flex-col justify-between transition-transform duration-200 hover:shadow-md dark:hover:shadow-gray-600">
      <div>
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{company}</p>
        <span
          className={`inline-block px-3 py-2 rounded-full text-xs font-medium mb-3 ${
            statusStyles[status] || "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          }`}
          aria-label={`Status: ${status}`}
        >
          {status}
        </span>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Applied: {date}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          {notes ? notes : "No notes available"}
        </p>
      </div>
      <div className="flex justify-end gap-2 mt-auto">
        <button
          className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 cursor-pointer focus:bg-violet-700 dark:focus:bg-violet-600 text-white px-3 py-1 rounded text-sm font-medium flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          onClick={onEdit}
          title="Edit"
          aria-label="Edit job"
        >
          <Pen className="w-4 h-4" />
          <span className="hidden sm:inline">Edit</span>
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 cursor-pointer focus:bg-red-700 dark:focus:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          onClick={onDelete}
          title="Delete"
          aria-label="Delete job"
        >
          <Trash className="w-4 h-4" />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default JobCard;
