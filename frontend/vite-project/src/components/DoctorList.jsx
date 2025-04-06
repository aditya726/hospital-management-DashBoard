import React, { useEffect, useState } from "react";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/doctors/");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Doctor List</h2>
      
      {doctors.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No doctors found</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {doctors.map((doctor) => (
            <li 
              key={doctor._id}
              className="py-4 flex items-center hover:bg-gray-50 rounded-md px-3 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="bg-blue-100 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-lg font-medium text-gray-900">{doctor.name}</p>
                <p className="text-sm text-gray-500">{doctor.specialization}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorList;