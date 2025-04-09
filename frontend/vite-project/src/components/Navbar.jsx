import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-all ${collapsed ? "w-20" : "w-64"}`}>
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
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
        )}
        {collapsed && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600 mx-auto"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-700"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Navigation Links */}
      <div className="py-4">
        <div className="px-4 mb-3">
          <h3 className={`text-xs font-semibold text-gray-400 uppercase tracking-wider ${collapsed ? "text-center" : ""}`}>
            {collapsed ? "Main" : "Main Menu"}
          </h3>
        </div>
        
        <NavItem 
          to="/patients" 
          label="Patients"
          isActive={isActive('/patients')}
          collapsed={collapsed}
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
          collapsed={collapsed}
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
          collapsed={collapsed}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          }
        />

        <div className="px-4 mt-8 mb-3">
          <h3 className={`text-xs font-semibold text-gray-400 uppercase tracking-wider ${collapsed ? "text-center" : ""}`}>
            {collapsed ? "Add" : "Create New"}
          </h3>
        </div>
        
        <NavItem 
          to="/create-patient" 
          label="Add Patient"
          isActive={isActive('/create-patient')}
          collapsed={collapsed}
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
          collapsed={collapsed}
          color="indigo"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          }
        />
        
        <NavItem 
          to="/create-appointment" 
          label="Add Appointment"
          isActive={isActive('/create-appointment')}
          collapsed={collapsed}
          color="purple"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          }
        />
        
        <NavItem 
          to="/search-patients" 
          label="Search Patients"
          isActive={isActive('/search-patients')}
          collapsed={collapsed}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          }
        />
      </div>
    </div>
  );
};

const NavItem = ({ to, label, isActive, collapsed, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 border-blue-600",
    green: "text-green-600 bg-green-50 border-green-600",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-600",
    purple: "text-purple-600 bg-purple-50 border-purple-600"
  };
  
  const activeClass = colorClasses[color];
  
  return (
    <Link
      to={to}
      className={`flex items-center py-3 px-4 ${
        collapsed ? "justify-center" : ""
      } ${
        isActive
          ? `${activeClass} border-l-4`
          : "text-gray-600 hover:bg-gray-100 border-l-4 border-transparent"
      }`}
    >
      <span className="inline-flex">{icon}</span>
      {!collapsed && <span className="ml-3">{label}</span>}
    </Link>
  );
};

export default Navbar;