import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-blue-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Page not found
        </h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist or has been deleted.
        </p>
        <Button type="primary" onClick={() => navigate("/dashboard")}>
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
