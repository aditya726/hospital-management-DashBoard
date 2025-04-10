import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, User, FileText, Activity, PieChart, Bell, Search } from 'lucide-react';
import axios from 'axios'; // You'll need to install axios: npm install axios

// API base URL
const API_BASE_URL = 'http://localhost:8000'; // Change this if your backend is on a different URL

export default function MediSyncProDashboard() {
  // State variables
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState([
    { title: 'Total Patients', value: 0, icon: Users, color: 'bg-blue-500', increase: '0%' },
    { title: 'Today\'s Appointments', value: 0, icon: Calendar, color: 'bg-purple-500', increase: '0%' },
    { title: 'New Patients', value: 0, icon: User, color: 'bg-green-500', increase: '0%' },
    { title: 'Total Doctors', value: 0, icon: FileText, color: 'bg-yellow-500', increase: '0%' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        const statsResponse = await axios.get(`${API_BASE_URL}/dashboard/stats`);
        
        // Fetch all doctors
        const doctorsResponse = await axios.get(`${API_BASE_URL}/doctors/`);
        
        // Fetch all appointments
        const appointmentsResponse = await axios.get(`${API_BASE_URL}/appointments/`);
        
        // Update stats
        const dashboardStats = statsResponse.data;
        setStats([
          { 
            title: 'Total Patients', 
            value: dashboardStats.total_patients, 
            icon: Users, 
            color: 'bg-blue-500', 
            increase: '+12%' // Consider calculating this dynamically if you have historical data
          },
          { 
            title: 'Today\'s Appointments', 
            value: dashboardStats.todays_appointments.length, 
            icon: Calendar, 
            color: 'bg-purple-500', 
            increase: '+8%' 
          },
          { 
            title: 'New Patients', 
            value: dashboardStats.recent_patients.length, 
            icon: User, 
            color: 'bg-green-500', 
            increase: '+23%' 
          },
          { 
            title: 'Total Doctors', 
            value: dashboardStats.total_doctors, 
            icon: FileText, 
            color: 'bg-yellow-500', 
            increase: '+5%' 
          },
        ]);
        
        // Format doctors data
        const formattedDoctors = doctorsResponse.data.map(doctor => ({
          name: doctor.name,
          specialty: doctor.specialization,
          patients: 0, // You might need an additional endpoint to get this count
          appointments: 0, // You could count this from appointments data
          id: doctor._id
        }));
        setDoctors(formattedDoctors);
        
        // Format appointments data
        const formattedAppointments = appointmentsResponse.data.map(appointment => {
          // Get patient and doctor details
          const patient = dashboardStats.recent_patients.find(p => p.PatientId === appointment.PatientId) || {};
          const doctor = doctorsResponse.data.find(d => d.DoctorId === appointment.DoctorId) || {};
          
          // Format date
          const appointmentDate = new Date(appointment.date);
          const today = new Date();
          const isToday = 
            appointmentDate.getDate() === today.getDate() &&
            appointmentDate.getMonth() === today.getMonth() &&
            appointmentDate.getFullYear() === today.getFullYear();
          
          const dateLabel = isToday ? 'Today' : 'Tomorrow';
          
          return {
            id: appointment._id,
            patient: patient.name || appointment.PatientId,
            doctor: doctor.name || appointment.DoctorId,
            time: appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: dateLabel,
            type: appointment.notes || 'Appointment',
            status: appointment.status,
            avatar: patient.gender === 'Female' ? 'F' : 'M'
          };
        });
        setAppointments(formattedAppointments);
        
        // Set chart data based on appointment types
        // You would need to modify this based on your actual data
        const appointmentTypes = {};
        
        // Get the last 6 months
        const months = [];
        const currentDate = new Date();
        for (let i = 5; i >= 0; i--) {
          const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          months.push(month.toLocaleString('default', { month: 'short' }));
        }
        
        // Create chart data structure
        const chartDataPoints = months.map(month => ({
          name: month,
          consultations: 0,
          followUps: 0,
          checkUps: 0
        }));
        
        // Count appointments by type for each month
        appointmentsResponse.data.forEach(appointment => {
          const appointmentDate = new Date(appointment.date);
          const monthName = appointmentDate.toLocaleString('default', { month: 'short' });
          const monthIndex = months.indexOf(monthName);
          
          if (monthIndex !== -1) {
            // Determine type
            const type = appointment.notes?.toLowerCase() || '';
            
            if (type.includes('consult')) {
              chartDataPoints[monthIndex].consultations++;
            } else if (type.includes('follow')) {
              chartDataPoints[monthIndex].followUps++;
            } else {
              chartDataPoints[monthIndex].checkUps++;
            }
          }
        });
        
        setChartData(chartDataPoints);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Trigger animation after component mounts
    setTimeout(() => {
      setAnimateStats(true);
    }, 300);
    
  }, []);
  
  const filteredAppointments = appointments.filter(app => 
    app.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };
  
  // Generate calendar dates for the upcoming appointments widget
  const generateCalendarDates = () => {
    const today = new Date();
    const dates = [];
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayOfMonth = date.getDate();
      
      // Count appointments for this date
      const appointmentsForDate = appointments.filter(app => {
        const appDate = new Date(app.date);
        return (
          appDate.getDate() === date.getDate() &&
          appDate.getMonth() === date.getMonth() &&
          appDate.getFullYear() === date.getFullYear()
        );
      }).length;
      
      dates.push({ 
        date: dayOfMonth, 
        day: dayOfWeek, 
        isToday: i === 0,
        appointments: appointmentsForDate
      });
    }
    
    return dates;
  };
  
  const calendarDates = generateCalendarDates();
  
  // Animation classes for elements
  const fadeInUp = "transition-all duration-500 transform";

  // Show loading or error states
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading dashboard data...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    // ... The rest of your component remains mostly the same, but now uses real data
    <div className="flex flex-col p-6 bg-gray-50">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className={`bg-white rounded-lg shadow-sm p-6 ${fadeInUp} ${
              animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                <span className="text-green-500 text-sm font-medium">{stat.increase}</span>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Upcoming Appointments */}
        <div className={`lg:col-span-2 bg-white rounded-lg shadow-sm ${fadeInUp} ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Today's Appointments</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="text-blue-500 text-sm font-medium hover:underline">View All</button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex space-x-3 mb-6 overflow-x-auto pb-2">
              {calendarDates.map((date, index) => (
                <div 
                  key={index}
                  className={`flex flex-col items-center p-3 min-w-16 border rounded-lg cursor-pointer transition-colors ${
                    date.isToday 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                  }`}
                >
                  <span className="text-xs font-medium">{date.day}</span>
                  <span className="text-xl font-bold my-1">{date.date}</span>
                  <span className={`text-xs ${date.isToday ? 'text-blue-100' : 'text-gray-500'}`}>
                    {date.appointments} appts
                  </span>
                </div>
              ))}
            </div>
            
            {filteredAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No appointments found</p>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div 
                    key={appointment.id}
                    className="flex items-center p-4 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors border border-gray-100 hover:border-blue-200"
                    onClick={() => handleAppointmentClick(appointment)}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${appointment.avatar === 'M' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                      {appointment.patient.charAt(0)}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium">{appointment.patient}</h4>
                      <div className="flex text-sm text-gray-500">
                        <span>{appointment.time}</span>
                        <span className="mx-2">•</span>
                        <span>{appointment.type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                        appointment.status === 'Confirmed' || appointment.status === 'completed'
                          ? 'bg-green-100 text-green-800' 
                          : appointment.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">{appointment.doctor}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column */}
        <div className="flex flex-col space-y-6">
          {/* Doctor Summary */}
          <div className={`bg-white rounded-lg shadow-sm ${fadeInUp} ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Active Doctors</h3>
                <button className="text-blue-500 text-sm font-medium hover:underline">View All</button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {doctors.slice(0, 3).map((doctor) => (
                  <div key={doctor.id} className="flex items-center p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors border border-gray-100 hover:border-blue-200">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                      {doctor.name.split(' ')[0][0]}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium">{doctor.name}</h4>
                      <div className="text-sm text-gray-500">{doctor.specialty}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-sm font-medium">{doctor.appointments} Today</div>
                    </div>
                  </div>
                ))}
                
                <button className="w-full mt-2 p-2 text-blue-500 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                  Add New Doctor
                </button>
              </div>
            </div>
          </div>
          
          {/* Recent Activities section - you would need to create an endpoint for this or fabricate from other data */}
          {/* ... Rest of your component ... */}
        </div>
      </div>
      
      {/* Bottom Section - Chart */}
      <div className={`bg-white rounded-lg shadow-sm p-6 ${fadeInUp} ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '700ms' }}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Appointment Statistics</h3>
          <p className="text-sm text-gray-500">Appointments by type over the last 6 months</p>
        </div>
        
        <div className="h-64">
          {/* Simple chart visualization */}
          <div className="h-full flex">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col justify-end items-center space-y-2">
                <div className="relative w-full max-w-16 flex flex-col items-center">
                  <div 
                    className="bg-blue-500 w-8 rounded-t"
                    style={{ height: `${data.consultations * 2}px` }}
                  ></div>
                  <div 
                    className="bg-purple-500 w-8 rounded-t mt-1"
                    style={{ height: `${data.followUps * 2}px` }}
                  ></div>
                  <div 
                    className="bg-green-500 w-8 rounded-t mt-1"
                    style={{ height: `${data.checkUps * 2}px` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-500">{data.name}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-10 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs text-gray-500">Consultations</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-xs text-gray-500">Follow-ups</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs text-gray-500">Check-ups</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}