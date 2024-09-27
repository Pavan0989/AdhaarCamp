import React from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
      <div className="bg-white p-10 rounded-lg shadow-xl text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
        <p className="text-gray-600">Choose an option to proceed:</p>
        <div className="space-y-4">
          <button
            className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 w-full"
            onClick={() => navigate('/deo')}
          >
            DEOs
          </button>
          <button
            className="bg-green-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-green-700 transition duration-300 w-full"
            onClick={() => navigate('/infot')}
          >
            View Camp Order Details
          </button>
          <button
            className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-green-700 transition duration-300 w-full"
            onClick={() => navigate('/location')}
          >
            Location Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
