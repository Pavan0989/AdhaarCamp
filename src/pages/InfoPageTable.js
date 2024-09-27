import React, { useEffect, useState } from "react";
import axios from "axios";

const InfoPageTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
    axios.get("/api/info-page-data")
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Info Page Data</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Reference No</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Village Panchayat</th>
              <th className="border px-4 py-2">Taluka</th>
              <th className="border px-4 py-2">PIN</th>
              <th className="border px-4 py-2">Subject</th>
              <th className="border px-4 py-2">Order Reference No</th>
              <th className="border px-4 py-2">Dated</th>
              <th className="border px-4 py-2">DEO of ITG</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr key={index} className="bg-white hover:bg-gray-100">
                  <td className="border px-4 py-2">{row.referenceNo}</td>
                  <td className="border px-4 py-2">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{row.villagePanchayat}</td>
                  <td className="border px-4 py-2">{row.taluka}</td>
                  <td className="border px-4 py-2">{row.pin}</td>
                  <td className="border px-4 py-2">{row.subject}</td>
                  <td className="border px-4 py-2">{row.orderReferenceNo}</td>
                  <td className="border px-4 py-2">{new Date(row.dated).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">
                    {/* Assuming deoOfITG is a JSON object */}
                    {JSON.stringify(row.deoOfITG)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="border px-4 py-2 text-center">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfoPageTable;
