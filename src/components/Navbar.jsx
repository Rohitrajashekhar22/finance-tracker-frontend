import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setIsOpen(false);
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "text-white border-b-2 border-white"
      : "text-gray-300 hover:text-white";
  };

  if (!token) {
    return null;
  }

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition"
          >
            💰 Finance Tracker
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`font-medium transition pb-2 ${isActive("/")}`}
            >
              Dashboard
            </Link>
            <Link
              to="/transactions"
              className={`font-medium transition pb-2 ${isActive(
                "/transactions"
              )}`}
            >
              Transactions
            </Link>
            {(role === "analyst" || role === "admin") && (
              <Link
                to="/add"
                className={`font-medium transition pb-2 ${isActive("/add")}`}
              >
                + Add Transaction
              </Link>
            )}
            <div className="flex items-center gap-4 pl-4 border-l border-gray-600">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-semibold">
                  {role.toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-gray-200 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4 border-t border-gray-700 pt-4">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block font-medium py-2 transition ${isActive("/")}`}
            >
              Dashboard
            </Link>
            <Link
              to="/transactions"
              onClick={() => setIsOpen(false)}
              className={`block font-medium py-2 transition ${isActive(
                "/transactions"
              )}`}
            >
              Transactions
            </Link>
            {(role === "analyst" || role === "admin") && (
              <Link
                to="/add"
                onClick={() => setIsOpen(false)}
                className={`block font-medium py-2 transition ${isActive("/add")}`}
              >
                + Add Transaction
              </Link>
            )}
            <div className="border-t border-gray-700 pt-4 mt-4">
              <p className="text-sm text-gray-400 mb-3">
                Role: <span className="font-semibold text-white">{role}</span>
              </p>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}