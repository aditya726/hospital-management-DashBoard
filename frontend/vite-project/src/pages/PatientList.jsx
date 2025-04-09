import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/patients/");
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-500 font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Patient List</h2>
      
      {patients.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No patients found</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {patients.map((patient) => (
            <li 
              key={patient._id}
              className="py-4 flex items-center hover:bg-gray-50 rounded-md px-3 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="bg-green-100 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20m10-10H2" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-lg font-medium text-gray-900">{patient.name}</p>
                <p className="text-sm text-gray-500">{patient.age} years old</p>
                <p className="text-sm text-gray-500">Patient ID: {patient.PatientId}</p> {/* Display patient ID */}
              </div>
              <button
              onClick={() => navigate(`/patients/${patient.PatientId}`)} // Use an arrow function
              className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
              View Details
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientList;