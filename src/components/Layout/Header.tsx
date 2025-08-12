// ===== HEADER COMPONENT =====
import React from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-indigo-600 text-white px-8 py-4 flex justify-between items-center">
      <div className="font-bold text-xl">JobTracker</div>
      <nav className="flex space-x-6">
        <a onClick={() => navigate("/")} className="font-medium">
          Home
        </a>
        <a href="#" className="font-medium">
          About
        </a>
        <a href="#" className="font-medium">
          Profile
        </a>
      </nav>
    </div>
  );
};

export default Header;
