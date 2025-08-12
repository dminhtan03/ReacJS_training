import React, { FormEvent } from "react";
import Header from "../../components/Layout/Header";
import Sidebar from "../../components/Layout/Sidebar";
const AddJobForm: React.FC = () => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      company: formData.get("company"),
      position: formData.get("position"),
      status: formData.get("status"),
      notes: formData.get("notes"),
    };
    console.log("Form Data:", data);
  };

  return (
    <>
      <Header />

      <div className="flex min-h-[calc(100vh-64px)] bg-gray-50 text-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Form Container */}
        <div className="flex flex-1 justify-center items-center h-[90vh]">
          <div className="w-[600px] min-h-[700px] bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Add Job
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company */}
              <div>
                <label
                  htmlFor="company"
                  className="block mb-2 font-semibold text-gray-700"
                >
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  placeholder="e.g. Google"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-base"
                />
              </div>

              {/* Position */}
              <div>
                <label
                  htmlFor="position"
                  className="block mb-2 font-semibold text-gray-700"
                >
                  Position
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  placeholder="e.g. Frontend Developer"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-base"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block mb-2 font-semibold text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-base"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="block mb-2 font-semibold text-gray-700"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="e.g. Interview scheduled next Monday..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-base resize-y"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-md transition"
              >
                Submit Job
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddJobForm;
