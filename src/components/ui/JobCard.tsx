import React from "react";

interface JobCardProps {
  title: string;
  company: string;
  status: string;
  date: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusStyles: Record<string, string> = {
  Applied: "bg-green-100 text-green-800",
  Interview: "bg-yellow-100 text-yellow-800",
  Offer: "bg-blue-100 text-blue-800",
  Rejected: "bg-red-100 text-red-700",
};

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  status,
  date,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white flex flex-col justify-between">
      <div>
        <div className="font-bold text-lg text-gray-700 mb-1">{title}</div>
        <div className="text-sm text-gray-500 mb-2">{company}</div>
        <div
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
            statusStyles[status] || "bg-gray-200 text-gray-700"
          }`}
        >
          {status}
        </div>
        <div className="text-xs text-gray-400 mb-4">Applied: {date}</div>
      </div>
      <div className="flex justify-end gap-2 mt-auto">
        <button
          className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="bg-red-500 cursor-pointer hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
