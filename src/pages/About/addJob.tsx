import React, { FormEvent } from "react";
import Header from "../../components/Layout/Header";
import "./addJob.css";
import { Link } from "react-router-dom";
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

      <div className="container">
        <aside>
          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/add-job">Add Job</Link>
            <a href="#">Settings</a>
          </nav>
        </aside>
        <div className="form-container">
          <div className="form-wrapper">
            <form id="jobForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  placeholder="e.g. Google"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status">
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="e.g. Interview scheduled next Monday..."
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
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
