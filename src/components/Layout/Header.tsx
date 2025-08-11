// ===== HEADER COMPONENT =====

import React from "react";
import { Layout, Button, Typography, Space, Dropdown, Avatar } from "antd";
import "./header.css";
// Header component
const Header: React.FC<HeaderProps> = () => {
  return (
    <header>
      <div className="logo">JobTracker</div>
      <nav>
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Profile</a>
      </nav>
    </header>
  );
};

export default Header;
