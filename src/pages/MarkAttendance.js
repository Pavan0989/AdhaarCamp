import React, { useState, useEffect } from "react";
import axios from "axios";

const MarkAttendance = () => {
  const [participants, setParticipants] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch participants
  useEffect(() => {
    axios.get('http://localhost:8081/participants') // Ensure this URL matches your backend route
      .then(response => {
        setParticipants(response.data);
        // Initialize attendance state
        const initialAttendance = response.data.reduce((acc, participant) => {
          acc[participant.id] = { status: 'P', reason: '' }; // Default to Present
          return acc;
        }, {});
        setAttendance(initialAttendance);
      })
      .catch(error => {
        console.error('Error fetching participants:', error);
      });
  }, []);

  // Handle changes in attendance status or reason
  const handleAttendanceChange = (id, field, value) => {
    setAttendance(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Ensure the data format is correct
    const updates = Object.keys(attendance).map(id => ({
      participant_id: id,
      date: date,
      status: attendance[id].status === 'O' ? attendance[id].reason : attendance[id].status
    }));
  
    axios.put('http://localhost:8081/attendance', updates)
      .then(response => {
        alert('Attendance updated successfully!');
      })
      .catch(error => {
        console.error('Error updating attendance:', error);
      });
  };
  
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Mark Attendance</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="date" className="block text-lg text-gray-600 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-400 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          {/* Display participants in a table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 border-b border-gray-300">Name</th>
                  <th className="p-4 border-b border-gray-300">Center</th>
                  <th className="p-4 border-b border-gray-300">Status</th>
                  <th className="p-4 border-b border-gray-300">Reason</th>
                </tr>
              </thead>
              <tbody>
                {participants.map(participant => (
                  <tr key={participant.id}>
                    <td className="p-4 border-b border-gray-300">{participant.name}</td>
                    <td className="p-4 border-b border-gray-300">{participant.center}</td>
                    <td className="p-4 border-b border-gray-300">
                      <select
                        value={attendance[participant.id]?.status}
                        onChange={(e) => handleAttendanceChange(participant.id, 'status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-400 focus:border-blue-500 outline-none transition-all"
                      >
                        <option value="P">Present</option>
                        <option value="A">Absent</option>
                        <option value="O">Others</option>
                      </select>
                    </td>
                    <td className="p-4 border-b border-gray-300">
                      {attendance[participant.id]?.status === 'O' && (
                        <input
                          type="text"
                          value={attendance[participant.id]?.reason}
                          onChange={(e) => handleAttendanceChange(participant.id, 'reason', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-400 focus:border-blue-500 outline-none transition-all"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-bold text-lg hover:bg-blue-700 transition-colors mt-6"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarkAttendance;
