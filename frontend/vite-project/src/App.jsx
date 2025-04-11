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
import  LoginForm  from "./components/login";
import SignupForm from "./components/signup";


const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header - Full width, outside the main content */}
        <header className="w-full bg-white shadow-sm z-10">
          <div className="px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                {/* Toggle button for sidebar */}
                <button 
                  onClick={toggleSidebar}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="ml-2 text-2xl font-bold text-gray-800">
                  MediSync<span className="text-blue-600">Pro</span>
                </h1>
              </div>
              <div className="flex items-center space-x-3">
              <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    isActive 
                      ? "bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium shadow-sm" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium shadow-sm"
                  }
                >
                  Login
              </NavLink>

              <NavLink 
                  to="/signup" 
                  className={({ isActive }) => 
                    isActive 
                      ? "bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm" 
                      : "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
                  }
                >
                  Signup
            </NavLink>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex flex-1 relative">
          {/* Fixed position sidebar */}
          <div className={`fixed top-16 left-0 h-full transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'} z-20 bg-white shadow-lg`} style={{ width: '16rem' }}>
            <Navbar />
          </div>

          {/* Main content with dynamic margin to adjust for sidebar */}
          <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
            {/* Page Content */}
            <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                {/* Define routes for different views */}
                {/* <Route path="/" element={<PatientList />} /> */}
                <Route path = '/' element = {<MediSyncProDashboard/>}></Route>
                <Route path="/patients" element={<PatientList />} />
                <Route path="/patients/:patientId" element={<PatientDetails />} />
                <Route path="/doctors" element={<DoctorList />} />
                <Route path="/appointments" element={<AppointmentList />} />
                <Route path="/search-patients" element={<SearchPatients />} />
                <Route path="/create-patient" element={<CreatePatient />} />
                <Route path="/create-doctor" element={<CreateDoctor />} />
                <Route path="/create-appointment" element={<CreateAppointment />} />
                <Route path="/view-appoinemtmentDetails/:appointmentId" element={<AppointmentDetails />} />
                <Route path="/updateStatus/:appointmentId" element={<UpdateStatus />} />
                <Route path='/login' element={<LoginForm />}/>
                <Route path='/signup' element={<SignupForm />}/>
              </Routes>
            </div>
          </div>
        </div>

        {/* Footer - Full width */}
        <footer className="w-full bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © 2025 MediSyncPro. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;