import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, User, FileText, Activity, PieChart, Bell, Search } from 'lucide-react';

export default function MediSyncProDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [chartData, setChartData] = useState([]);
  
  // Sample data
  const upcomingAppointments = [
    { id: 1, patient: 'Sarah Johnson', doctor: 'Dr. Michael Chen', time: '10:00 AM', date: 'Today', type: 'Check-up', status: 'Confirmed', avatar: 'F' },
    { id: 2, patient: 'Robert Garcia', doctor: 'Dr. Emily Wong', time: '11:30 AM', date: 'Today', type: 'Follow-up', status: 'Pending', avatar: 'M' },
    { id: 3, patient: 'Maria Rodriguez', doctor: 'Dr. James Wilson', time: '2:15 PM', date: 'Today', type: 'Consultation', status: 'Confirmed', avatar: 'F' },
    { id: 4, patient: 'David Kim', doctor: 'Dr. Sarah Johnson', time: '9:00 AM', date: 'Tomorrow', type: 'New Patient', status: 'Confirmed', avatar: 'M' },
    { id: 5, patient: 'Jennifer Lee', doctor: 'Dr. Michael Chen', time: '3:45 PM', date: 'Tomorrow', type: 'Follow-up', status: 'Pending', avatar: 'F' },
  ];
  
  const doctors = [
    { name: 'Dr. Michael Chen', specialty: 'Cardiologist', patients: 42, appointments: 8 },
    { name: 'Dr. Emily Wong', specialty: 'Pediatrician', patients: 65, appointments: 12 },
    { name: 'Dr. James Wilson', specialty: 'Neurologist', patients: 38, appointments: 6 },
    { name: 'Dr. Sarah Johnson', specialty: 'Family Medicine', patients: 78, appointments: 15 },
  ];
  
  const stats = [
    { title: 'Total Patients', value: 1248, icon: Users, color: 'bg-blue-500', increase: '+12%' },
    { title: 'Today\'s Appointments', value: 42, icon: Calendar, color: 'bg-purple-500', increase: '+8%' },
    { title: 'New Patients', value: 28, icon: User, color: 'bg-green-500', increase: '+23%' },
    { title: 'Total Doctors', value: 32, icon: FileText, color: 'bg-yellow-500', increase: '+5%' },
  ];

  useEffect(() => {
    setAppointments(upcomingAppointments);
    
    // Trigger animation after component mounts
    setTimeout(() => {
      setAnimateStats(true);
    }, 300);
    
    // Set sample chart data
    setChartData([
      { name: 'Jan', consultations: 45, followUps: 33, checkUps: 22 },
      { name: 'Feb', consultations: 50, followUps: 38, checkUps: 29 },
      { name: 'Mar', consultations: 35, followUps: 30, checkUps: 25 },
      { name: 'Apr', consultations: 55, followUps: 42, checkUps: 31 },
      { name: 'May', consultations: 60, followUps: 45, checkUps: 35 },
      { name: 'Jun', consultations: 48, followUps: 38, checkUps: 28 }
    ]);
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
      
      dates.push({ 
        date: dayOfMonth, 
        day: dayOfWeek, 
        isToday: i === 0,
        appointments: Math.floor(Math.random() * 8) + 2 // Random number of appointments
      });
    }
    
    return dates;
  };
  
  const calendarDates = generateCalendarDates();
  
  // Animation classes for elements
  const fadeInUp = "transition-all duration-500 transform";

  return (
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
                {filteredAppointments.map((appointment, index) => (
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
                        appointment.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800' 
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
                {doctors.slice(0, 3).map((doctor, index) => (
                  <div key={index} className="flex items-center p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors border border-gray-100 hover:border-blue-200">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                      {doctor.name.split(' ')[1][0]}
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
          
          {/* Recent Activities */}
          <div className={`bg-white rounded-lg shadow-sm flex-1 ${fadeInUp} ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold">Recent Activities</h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="relative pl-6 pb-6 border-l-2 border-blue-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                  <p className="font-medium">New patient registered</p>
                  <p className="text-sm text-gray-500">James Wilson completed registration</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
                
                <div className="relative pl-6 pb-6 border-l-2 border-green-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500"></div>
                  <p className="font-medium">Appointment completed</p>
                  <p className="text-sm text-gray-500">Dr. Chen completed appointment with Sarah</p>
                  <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                </div>
                
                <div className="relative pl-6 pb-6 border-l-2 border-purple-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-500"></div>
                  <p className="font-medium">Medical record updated</p>
                  <p className="text-sm text-gray-500">Dr. Wong updated Robert's records</p>
                  <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                </div>
                
                <div className="relative pl-6 border-l-2 border-gray-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-gray-500"></div>
                  <p className="font-medium">New appointment scheduled</p>
                  <p className="text-sm text-gray-500">Maria booked an appointment for tomorrow</p>
                  <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className={`bg-white rounded-lg shadow-sm p-6 ${fadeInUp} ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '700ms' }}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Appointment Statistics</h3>
          <p className="text-sm text-gray-500">Appointments by type over the last 6 months</p>
        </div>
        
        <div className="h-64">
          {/* This is where a chart would normally go - simplified for this example */}
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
