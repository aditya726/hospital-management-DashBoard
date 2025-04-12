import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function HealthAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const chatEndRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        type: 'assistant',
        content: "Hello! I'm your health assistant. I can provide general health information and guidance. Remember that I'm not a replacement for professional medical advice. How can I help you today?",
        sources: null
      }
    ]);
    
    // Fetch patients
    fetchPatients();
  }, []);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch patients from the backend
  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:8000/patients/');
      // Make sure response.data is an array
      setPatients(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      // Add sample patients for demonstration
      setPatients([
        { PatientId: 'P12345', name: 'John Doe' },
        { PatientId: 'P67890', name: 'Jane Smith' }
      ]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    
    // Clear input field
    setInput('');
    
    // Show loading indicator
    setIsLoading(true);

    try {
      let endpoint = 'http://localhost:8000/ai/query';
      let requestData = { query: input };

      // If a patient is selected, use patient-specific endpoint
      if (selectedPatient) {
        endpoint = `http://localhost:8000/ai/patient/${selectedPatient}/query`;
        requestData.patient_id = selectedPatient;
      }

      // Send query to backend
      const response = await axios.post(endpoint, requestData);
      
      // Add assistant response to chat
      setMessages(prev => [
        ...prev, 
        { 
          type: 'assistant', 
          content: response.data.response, 
          sources: response.data.sources 
        }
      ]);
    } catch (error) {
      console.error('Error sending query:', error);
      setMessages(prev => [
        ...prev, 
        { 
          type: 'assistant', 
          content: 'I apologize, but I encountered an error while processing your request. Please try again later or contact support if the issue persists.',
          sources: ['Error']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white rounded-t-lg shadow-md p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">Health Assistant</h1>
            <p className="text-gray-600">Your AI health information companion</p>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <label htmlFor="patientSelect" className="text-gray-700 font-medium">Patient:</label>
              <select 
                id="patientSelect" 
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 cursor-pointer transition-all duration-300 hover:bg-blue-100"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="">General Query</option>
                {patients.map(patient => (
                  <option key={patient.PatientId} value={patient.PatientId}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="bg-white flex-grow shadow-md flex flex-col overflow-hidden">
        <div className="flex-grow overflow-y-auto p-6 space-y-6" style={{ minHeight: "500px" }}>
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex items-start ${message.type === 'user' ? 'justify-end' : ''} animate-fadeIn`}
            >
              {message.type === 'assistant' && (
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              )}
              
              <div 
                className={`${
                  message.type === 'assistant' 
                    ? 'ml-4 bg-blue-50 text-gray-800 border-blue-100' 
                    : 'mr-4 bg-blue-600 text-white border-blue-500'
                } p-4 rounded-2xl ${
                  message.type === 'assistant' ? 'rounded-tl-none' : 'rounded-tr-none'
                } max-w-3xl border shadow-sm transform transition-all duration-200 hover:shadow-md`}
              >
                <p className="leading-relaxed">
                  {message.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < message.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
                    <span className="font-semibold">Source:</span> {message.sources[0]}
                  </div>
                )}
              </div>
              
              {message.type === 'user' && (
                <div className="flex-shrink-0 bg-blue-500 rounded-full p-3 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start animate-fadeIn">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4 bg-blue-50 p-4 rounded-2xl rounded-tl-none border border-blue-100 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t p-4 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your health question here..." 
              className="flex-grow border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-300"
              disabled={isLoading}
              required
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 shadow-sm hover:shadow-md font-medium"
              disabled={isLoading}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                Send
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Information Panel */}
      <div className="bg-white rounded-b-lg shadow-md p-5 mt-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          About Health Assistant
        </h2>
        <ul className="text-gray-600 space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Ask general health questions
          </li>
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Get information about hospital services
          </li>
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Learn about common medical conditions and symptoms
          </li>
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Always consult with healthcare professionals for personal medical advice
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HealthAssistant;