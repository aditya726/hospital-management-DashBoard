import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg">
      {/* Logo */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <span className="ml-2 font-bold text-gray-700 text-lg">MSP</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="py-4">
        {/* Dashboard Button */}
        <NavItem 
          to="/" 
          label="Dashboard"
          isActive={isActive('/dashboard')}
          color="cyan"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          }
        />

        <div className="px-4 mb-3 mt-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main Menu
          </h3>
        </div>

        <NavItem 
          to="/patients" 
          label="Patients"
          isActive={isActive('/patients')}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          }
        />

        <NavItem 
          to="/doctors" 
          label="Doctors"
          isActive={isActive('/doctors')}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          }
        />

        <NavItem 
          to="/appointments" 
          label="Appointments"
          isActive={isActive('/appointments')}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          }
        />

        <div className="px-4 mt-8 mb-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Create New
          </h3>
        </div>

        <NavItem 
          to="/create-patient" 
          label="Add Patient"
          isActive={isActive('/create-patient')}
          color="green"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          }
        />

        <NavItem 
          to="/create-doctor" 
          label="Add Doctor"
          isActive={isActive('/create-doctor')}
          color="indigo"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 006 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          }
        />

        <NavItem 
          to="/create-appointment" 
          label="Add Appointment"
          isActive={isActive('/create-appointment')}
          color="purple"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          }
        />
      </div>
    </div>
  );
};

const NavItem = ({ to, label, isActive, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 border-blue-600",
    green: "text-green-600 bg-green-50 border-green-600",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-600",
    purple: "text-purple-600 bg-purple-50 border-purple-600",
    cyan: "text-cyan-600 bg-cyan-50 border-cyan-600"
  };
  
  const activeClass = colorClasses[color];
  
  return (
    <Link
      to={to}
      className={`flex items-center py-3 px-4 ${
        isActive
          ? `${activeClass} border-l-4`
          : "text-gray-600 hover:bg-gray-100 border-l-4 border-transparent"
      }`}
    >
      <span className="inline-flex">{icon}</span>
      <span className="ml-3">{label}</span>
    </Link>
  );
};

export default Navbar;