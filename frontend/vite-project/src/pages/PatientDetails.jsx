import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PatientDetails = () => {
  const { patientId } = useParams(); // Extract patientId from the URL
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/patients/${patientId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch patient details");
        }
        const data = await response.json();
        setPatient(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [patientId]);

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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Details</h2>
      <p className="text-lg font-medium text-gray-900">Name: {patient.name}</p>
      <p className="text-sm text-gray-500">Age: {patient.age} years old</p>
      <p className="text-sm text-gray-500">Gender: {patient.gender}</p>
      <p className="text-sm text-gray-500">Patient ID: {patient.PatientId}</p>
      <p className="text-sm text-gray-500">Contact: {patient.contact}</p>
      <p className="text-sm text-gray-500">Address: {patient.address}</p>
      <p className="text-sm text-gray-500">Blood Type: {patient.blood_type}</p>
      <p className="text-sm text-gray-500">Medical History: {patient.medical_history}</p>
      <p className="text-sm text-gray-500">Admission Date: {new Date(patient.admission_date).toLocaleDateString()}</p>
    </div>
  );
};

export default PatientDetails;