import React, { useState } from 'react';
import axios from 'axios';

const AddParticipant = () => {
  const [name, setName] = useState('');
  const [center, setCenter] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset error and success messages
    setError(null);
    setSuccess(null);

    // Basic form validation
    if (!name || !center) {
      setError('All fields are required.');
      return;
    }

    // Post the data to the server
    axios.post('http://localhost:8081/api/add-participant', { name, center })
      .then((response) => {
        setSuccess('Participant added successfully.');
        // Clear the form
        setName('');
        setCenter('');
      })
      .catch((err) => {
        setError('Failed to add participant.');
        console.error('Error:', err.message);
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Add Participant</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter participant's name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Center:</label>
          <input
            type="text"
            value={center}
            onChange={(e) => setCenter(e.target.value)}
            placeholder="Enter center name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        <div className="flex justify-center">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Participant
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddParticipant;
