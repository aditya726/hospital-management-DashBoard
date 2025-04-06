import React, { useState } from "react";
import PatientList from "./components/PatientList";
import DoctorList from "./components/DoctorList";
import AppointmentList from "./components/AppointmentList";
import SearchPatients from "./components/SearchPatients";
import CreatePatient from "./components/CreatePatient";
import CreateDoctor from "./components/CreateDoctor";
import CreateAppointment from "./components/CreateAppointment";

const App = () => {
  const [view, setView] = useState("patients");

  const renderContent = () => {
    switch (view) {
      case "patients":
        return <PatientList />;
      case "doctors":
        return <DoctorList />;
      case "appointments":
        return <AppointmentList />;
      case "searchPatients":
        return <SearchPatients />;
      case "createPatient":
        return <CreatePatient />;
      case "createDoctor":
        return <CreateDoctor />;
      case "createAppointment":
        return <CreateAppointment />;
      default:
        return <PatientList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-800">Hospital Management System</h1>
            </div>
            <div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm">Admin Portal</button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="border-b border-gray-200">
            <div className="flex -mb-px space-x-8 overflow-x-auto">
              <button
                onClick={() => setView("patients")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  view === "patients" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Patients
              </button>
              <button
                onClick={() => setView("doctors")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  view === "doctors" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Doctors
              </button>
              <button
                onClick={() => setView("appointments")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  view === "appointments" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Appointments
              </button>
              <button
                onClick={() => setView("searchPatients")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  view === "searchPatients" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Search Patients
              </button>
            </div>
          </div>
        </nav>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={() => setView("createPatient")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Patient
          </button>
          <button
            onClick={() => setView("createDoctor")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Doctor
          </button>
          <button
            onClick={() => setView("createAppointment")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Appointment
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">© 2025 Hospital Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;