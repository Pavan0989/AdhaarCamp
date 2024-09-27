import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ViewAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [year, setYear] = useState(new Date().getFullYear());    // Default to current year
  const [error, setError] = useState(null);

  // Initialize toastify
  useEffect(() => {
    // No need to call toast.configure() in the latest versions
  }, []);

  // Function to fetch attendance data based on selected month and year
  const fetchAttendanceData = useCallback(() => {
    axios.get(`http://localhost:8081/attendance/${month}/${year}`)
      .then((response) => {
        setAttendanceData(response.data);
        setError(null);  // Clear error if data is fetched successfully
      })
      .catch((err) => {
        setError(err.message);
        console.error('Error fetching attendance:', err);
        toast.error('Error fetching attendance: ' + err.message);
      });
  }, [month, year]); // Include month and year in the dependency array

  // Fetch attendance data when the component mounts or month/year changes
  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]); // Include fetchAttendanceData in the dependency array

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAttendanceData();
  };

  // Function to get the number of days in the selected month
  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

  // Transform attendance data into a column-wise format
  const transformData = () => {
    const daysInMonth = getDaysInMonth(month, year);
    return Array.from({ length: daysInMonth }, (_, day) => ({
      date: day + 1, // Show only the day of the month
      records: attendanceData.filter(record => new Date(record.date).getDate() === day + 1)
    }));
  };

  // Get unique participants
  const getUniqueParticipants = () => {
    const uniqueRecords = new Map();
    attendanceData.forEach(record => {
      const key = `${record.id}-${record.name}`;
      if (!uniqueRecords.has(key)) {
        uniqueRecords.set(key, record);
      }
    });
    return Array.from(uniqueRecords.values());
  };

  const data = transformData();
  const uniqueParticipants = getUniqueParticipants();

  // Function to export table as PDF
  const exportToPDF = () => {
    const input = document.getElementById('attendanceTable');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape orientation
      const imgWidth = 297; // A4 width in mm for landscape orientation
      const pageHeight = 210; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('attendance.pdf');
    });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">View Attendance</h2>

        {/* Form to select month and year */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <label className="flex flex-col">
              Select Month:
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value, 10))}
                className="mt-2 p-2 border border-gray-300 rounded-md"
              >
                {[...Array(12).keys()].map(i => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col">
              Select Year:
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                min="2000"
                max={new Date().getFullYear()}
                className="mt-2 p-2 border border-gray-300 rounded-md"
              />
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
          >
            View Attendance
          </button>
        </form>

        {/* Export to PDF Button */}
        <button
          onClick={exportToPDF}
          className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 mb-6"
        >
          Export to PDF
        </button>

        {/* Displaying fetched attendance data */}
        {error ? (
          <p className="text-red-500 mb-4">Error: {error}</p>
        ) : null}

        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <table id="attendanceTable" className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 border-b border-gray-300">Name</th>
                  <th className="p-4 border-b border-gray-300">Center</th>
                  {data.map((day, index) => (
                    <th key={index} className="p-4 border-b border-gray-300">{day.date}</th> // Show only day of the month
                  ))}
                </tr>
              </thead>
              <tbody>
                {uniqueParticipants.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 border-b border-gray-300">{record.name}</td>
                    <td className="p-4 border-b border-gray-300">{record.center}</td>
                    {data.map((day, dayIndex) => (
                      <td key={dayIndex} className="p-4 border-b border-gray-300">
                        {day.records.find(r => r.name === record.name) ? day.records.find(r => r.name === record.name).status : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">
            No attendance records found for {new Date(0, month - 1).toLocaleString('default', { month: 'long' })} {year}
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewAttendance;
