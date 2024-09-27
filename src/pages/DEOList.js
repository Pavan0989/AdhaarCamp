import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DEOList = () => {
  const [deos, setDeos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDEOs = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/view-deos'); // Ensure the URL matches your backend
        setDeos(response.data.deos);
      } catch (err) {
        setError('Failed to load DEOs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDEOs();
  }, []);

  if (loading) return <p>Loading DEOs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">List of DEOs</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-3">Salutation</th>
            <th className="border border-gray-300 p-3">Name</th>
          </tr>
        </thead>
        <tbody>
          {deos.map((deo) => (
            <tr key={deo.id}>
              <td className="border border-gray-300 p-3">{deo.salutation}</td>
              <td className="border border-gray-300 p-3">{deo.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DEOList;
