import React, { useState } from 'react';
import axios from 'axios';
import DEOList from './DEOList'; // Import the new component

const DEOInsertPage = () => {
  const [formData, setFormData] = useState({
    salutation: '',
    name: ''
  });
  const [viewDEOs, setViewDEOs] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8081/api/insert-deo', formData); // Ensure the URL matches your backend
      console.log(response.data);
      if (response.data.success) {
        alert('DEO inserted successfully!');
        setFormData({
          salutation: '',
          name: ''
        });
      } else {
        alert('Error inserting DEO.');
      }
    } catch (error) {
      console.error('Insert failed:', error);
      alert('Error inserting DEO.');
    }
  };

  const toggleViewDEOs = () => {
    setViewDEOs((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Insert DEO</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            {/* Salutation Input */}
            <div>
              <label htmlFor="salutation" className="block text-lg font-semibold text-gray-700 mb-2">
                Salutation:
              </label>
              <select
                id="salutation"
                name="salutation"
                value={formData.salutation}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Salutation</option>
                <option value="Mr.">Mr.</option>
                <option value="Miss.">Miss.</option>
                <option value="Mrs.">Mrs.</option>
              </select>
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Enter Name"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Submit
            </button>
            {/* View DEOs Button */}
            <button
              type="button"
              onClick={toggleViewDEOs}
              className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-300 mt-4"
            >
              {viewDEOs ? 'Hide DEOs' : 'View DEOs'}
            </button>
          </div>
        </form>
        {viewDEOs && <DEOList />} {/* Conditionally render the DEOList component */}
      </div>
    </div>
  );
};

export default DEOInsertPage;
