import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No access</h2>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page. Please return to the
          homepage or log in with a different account.
        </p>
        <Button type="primary" onClick={() => navigate("/dashboard")}>
          Back to Home
        </Button>
 
      </div>
    </div>
  );
};

export default ForbiddenPage;
