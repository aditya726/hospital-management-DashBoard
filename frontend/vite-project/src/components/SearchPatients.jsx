import React, { useState } from "react";

const SearchPatients = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:8000/search/patients?query=${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Search Patients</h2>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, contact, or address"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleSearch}
        className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {error && (
        <div className="bg-red-50 p-4 mt-4 rounded-md">
          <p className="text-red-500 font-medium">Error: {error}</p>
        </div>
      )}

      <ul className="mt-6 divide-y divide-gray-200">
        {results.length === 0 ? (
          <li className="text-gray-500 text-center py-4">No results found</li>
        ) : (
          results.map((patient) => (
            <li
              key={patient._id}
              className="py-4 flex items-center hover:bg-gray-50 rounded-md px-3 transition-colors"
            >
              <div className="ml-4">
                <p className="text-lg font-medium text-gray-900">{patient.name}</p>
                <p className="text-sm text-gray-500">{patient.contact}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SearchPatients;
