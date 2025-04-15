import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import PatientList from "./pages/PatientList";
import DoctorList from "./pages/DoctorList";
import AppointmentList from "./pages/AppointmentList";
import SearchPatients from "./pages/SearchPatients";
import CreatePatient from "./pages/CreatePatient";
import CreateDoctor from "./pages/CreateDoctor";
import CreateAppointment from "./pages/CreateAppointment";
import PatientDetails from "./pages/PatientDetails";
import Navbar from "./components/Navbar";
import AppointmentDetails from "./pages/AppointmentDetails";
import UpdateStatus from "./pages/UpdateStatus";
import MediSyncProDashboard from "./pages/dashboard";
import LoginForm from "./components/login";
import SignupForm from "./components/signup";
import ProtectedRoute from "./components/ProtectedRoutes";
import HealthAssistant from "./pages/AI_assistant";
import DoctorDetails from "./pages/DoctorDetails";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header - Full width, outside the main content */}
        <header className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md z-30 fixed top-0 left-0 right-0">
          <div className="px-4">
            <div className="flex justify-between items-center py-3">
              {/* Left section - Toggle button and logo */}
              <div className="flex items-center">
                {/* Toggle button for sidebar */}
                <button 
                  onClick={toggleSidebar}
                  className="p-2 rounded-md text-white hover:text-gray-100 hover:bg-blue-700 transition-colors"
                  aria-label="Toggle sidebar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Center section - Logo */}
              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h1 className="ml-2 text-2xl font-bold text-white">
                    MediSync<span className="text-yellow-300">Pro</span>
                  </h1>
                </div>
              </div>

              {/* Right section - Actions */}
              <div className="flex items-center space-x-3">
                <NavLink 
                  to="/ai-assistant" 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm flex items-center space-x-1 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.352-.035-.696-.1-1.028A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  <span>Health Assistant</span>
                </NavLink>

                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    isActive 
                      ? "bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm" 
                      : "bg-white hover:bg-gray-100 text-blue-600 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors"
                  }
                >
                  Login
                </NavLink>

                <NavLink 
                  to="/signup" 
                  className={({ isActive }) => 
                    isActive 
                      ? "bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm" 
                      : "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors"
                  }
                >
                  Signup
                </NavLink>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area - Add padding-top to account for fixed header */}
        <div className="flex flex-1 pt-14 relative">
          {/* Sidebar - now fixed and positioned correctly */}
          <div 
            className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-white shadow-lg z-20 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <Navbar />
          </div>

          {/* Main content with dynamic margin to adjust for sidebar */}
          <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
            {/* Page Content */}
            <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                {/* Define routes for different views */}
                <Route path="/" element={<ProtectedRoute><MediSyncProDashboard/></ProtectedRoute>} />
                <Route path="/patients" element={<ProtectedRoute><PatientList /></ProtectedRoute>} />
                <Route path="/patients/:patientId" element={<PatientDetails />} />
                <Route path="/doctors" element={<ProtectedRoute><DoctorList /></ProtectedRoute>} />
                <Route path ='/doctors/:doctorId' element={<DoctorDetails />} />
                <Route path="/appointments" element={<ProtectedRoute><AppointmentList /></ProtectedRoute>} />
                <Route path="/search-patients" element={<ProtectedRoute><SearchPatients /></ProtectedRoute>} />
                <Route path="/create-patient" element={<ProtectedRoute><CreatePatient /></ProtectedRoute>} />
                <Route path="/create-doctor" element={<ProtectedRoute><CreateDoctor /></ProtectedRoute>} />
                <Route path="/create-appointment" element={<ProtectedRoute><CreateAppointment /></ProtectedRoute>} />
                <Route path="/view-appoinemtmentDetails/:appointmentId" element={<AppointmentDetails />} />
                <Route path="/updateStatus/:appointmentId" element={<UpdateStatus />} />
                <Route path="/ai-assistant" element={<HealthAssistant />} />
                <Route path='/login' element={<LoginForm />}/>
                <Route path='/signup' element={<SignupForm />}/>
              </Routes>
            </div>
          </div>
        </div>

        {/* Footer - Full width */}
        <footer className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 border-t border-blue-700">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-white">
              © 2025 MediSyncPro. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;