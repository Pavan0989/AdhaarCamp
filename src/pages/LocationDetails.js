import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddLocation = () => {
  const [formData, setFormData] = useState({
    villagePanchayat: "",
    taluka: "",
    pin: "",
  });

  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST request to your Express server
      const response = await axios.post("http://localhost:8081/api/add-location", formData);

      if (response.status === 200) {
        alert("Location added successfully!");
        setFormData({
          villagePanchayat: "",
          taluka: "",
          pin: "",
        });
        
        // Navigate to the previous page or a specific page
        navigate(-1); // This will navigate to the previous page in history
      } else {
        alert("Failed to add location");
      }
    } catch (err) {
      console.error("Error adding location:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add Location</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="villagePanchayat"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              Village Panchayat:
            </label>
            <input
              type="text"
              id="villagePanchayat"
              name="villagePanchayat"
              value={formData.villagePanchayat}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="taluka" className="block text-lg font-semibold text-gray-700 mb-2">
              Taluka:
            </label>
            <input
              type="text"
              id="taluka"
              name="taluka"
              value={formData.taluka}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="pin" className="block text-lg font-semibold text-gray-700 mb-2">
              Pin:
            </label>
            <input
              type="text"
              id="pin"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Add Location
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLocation;
