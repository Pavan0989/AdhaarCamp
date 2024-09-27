import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white py-4 shadow-lg relative z-20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-8">
          {/* Aadhar Camp */}
          <div className="relative group">
            <button className="text-lg font-semibold py-2 px-4 rounded transition-colors duration-300 hover:bg-blue-700">
              Aadhar Camp
            </button>
            {/* Dropdown for Aadhar Camp */}
            <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg transition-all duration-300 ease-in-out opacity-0 invisible group-hover:opacity-100 group-hover:visible">
              <Link to="/info" className="block px-4 py-2 hover:bg-blue-100">
                Create Order
              </Link>
              <div className="relative group">
                <Link to="/order" className="block px-4 py-2 hover:bg-blue-100">
                  Camp Order Details
                </Link>
                <div className="absolute left-full top-0 mt-0 ml-1 w-48 bg-white text-gray-800 shadow-lg rounded-lg transition-all duration-300 ease-in-out opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                  <Link to="/deo" className="block px-4 py-2 hover:bg-blue-100">
                    DEO Details
                  </Link>
                  <Link to="/infot" className="block px-4 py-2 hover:bg-blue-100">
                    View Camp Order Details
                  </Link>
                  <Link to="/location" className="block px-4 py-2 hover:bg-blue-100">
                    Add Location
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance System */}
          <div className="relative group">
            <button className="text-lg font-semibold py-2 px-4 rounded transition-colors duration-300 hover:bg-blue-700">
              Attendance System
            </button>
            {/* Dropdown for Attendance System */}
            <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg transition-all duration-300 ease-in-out opacity-0 invisible group-hover:opacity-100 group-hover:visible">
              <Link to="/mark" className="block px-4 py-2 hover:bg-blue-100">
                Mark Attendance
              </Link>
              <Link to="/view" className="block px-4 py-2 hover:bg-blue-100">
                View Attendance
              </Link>
              <Link to="/add" className="block px-4 py-2 hover:bg-blue-100">
                Add Participant
              </Link>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
