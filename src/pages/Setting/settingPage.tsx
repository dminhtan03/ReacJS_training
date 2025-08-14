import React, { useState, useContext } from "react";
import Header from "../../components/Layout/Header";
import Sidebar from "../../components/Layout/Sidebar";
import { ThemeContext } from "../../context/ThemeContext";

const SettingsPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-16">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:flex transition-transform duration-300 ease-in-out w-64 md:w-56 lg:w-64 bg-white dark:bg-gray-800`}
        >
          <Sidebar />
        </div>

        {/* Overlay cho mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-grow p-6 mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">Theme Settings</h2>
          <div className="flex items-center gap-4">
            <span>Light</span>
            <button
              onClick={toggleTheme}
              className="relative w-14 h-8 rounded-full transition-colors duration-300 bg-gray-300 dark:bg-gray-700"
            >
              <span
                className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                  theme === "dark" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span>Dark</span>
          </div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Toggle this switch to change the theme of the app.
          </p>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
