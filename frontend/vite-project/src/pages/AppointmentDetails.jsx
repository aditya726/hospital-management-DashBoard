import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AppointmentDetails = () => {
  const { appointmentId } = useParams(); // Extract appointmentId from the URL
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/appointments/${appointmentId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch appointment details");
        }
        const data = await response.json();
        setAppointment(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId]);

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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Appointment Details</h2>
      <p className="text-lg font-medium text-gray-900">Appointment ID: {appointment.AppointmentId}</p>
      <p className="text-sm text-gray-500">Patient ID: {appointment.PatientId}</p>
      <p className="text-sm text-gray-500">Doctor ID: {appointment.DoctorId}</p>
      <p className="text-sm text-gray-500">
        Date: {new Date(appointment.date).toLocaleString()}
      </p>
      <p className="text-sm text-gray-500">Status: {appointment.status}</p>
      <p className="text-sm text-gray-500">Notes: {appointment.notes || "None"}</p>
    </div>
  );
};

export default AppointmentDetails;