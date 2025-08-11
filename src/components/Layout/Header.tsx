// ===== HEADER COMPONENT =====
import React from "react";

const Header: React.FC = () => {
  return (
    <div className="bg-indigo-600 text-white px-8 py-4 flex justify-between items-center">
      <div className="font-bold text-xl">JobTracker</div>
      <nav className="flex space-x-6">
        <a href="#" className="font-medium">
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
