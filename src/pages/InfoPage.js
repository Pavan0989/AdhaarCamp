import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const InfoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    referenceNo: "ITG-IT/SW/0926/DPSE-EA-ITG/2022/",
    date: "",
    villagePanchayat: "",
    taluka: "",
    pin: "",
    orderReferenceNo: "VP/COR/F.Reply/2024-25/346",
    dated: "",
    fromDate: "",
    toDate: "",
    fromTime: "",
    toTime: "",
    deoOfITG: [], // Array of DEO IDs
  });

  const [deoOptions, setDeoOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);

  useEffect(() => {
    const fetchDEOOptions = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/deo-options");
        setDeoOptions(response.data.deoOptions);
      } catch (err) {
        console.error("Failed to fetch DEO options", err);
      }
    };

    fetchDEOOptions();
  }, []);

  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/villages");
        const options = response.data.map((village) => ({
          value: village.village_panchayat,
          label: village.village_panchayat,
          taluka: village.taluka,
          pin: village.pin,
        }));
        setVillageOptions(options);
      } catch (error) {
        console.error("Error fetching village data:", error);
      }
    };

    fetchVillages();
  }, []);

  const handleVillageChange = (selectedOption) => {
    setFormData({
      ...formData,
      villagePanchayat: selectedOption.value,
      taluka: selectedOption.taluka,
      pin: selectedOption.pin,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDEOChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      deoOfITG: selectedOptions.map((option) => option.value),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Generate subject dynamically
    const subject = `Conduct of Aadhaar Enrolment/Up-dation/Correction Camp in ${formData.villagePanchayat} Village Panchayat ${formData.taluka}-Goa`;
    const updatedFormData = { ...formData, subject };
  
    console.log("Form Data to Submit:", updatedFormData);
  
    try {
      // Submit data to the backend
      const submitResponse = await axios.post("http://localhost:8081/api/submit-info", updatedFormData);
  
      if (submitResponse.status === 200) {
        // Navigate to DocumentPage and pass data as state
        navigate("/document", { state: updatedFormData });
      } else {
        console.error("Submission failed:", submitResponse.statusText);
        alert("Failed to submit data. Please try again.");
      }
    } catch (err) {
      console.error("Failed to submit data", err.response ? err.response.data : err.message);
      alert("An error occurred while submitting the data. Please try again.");
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Information Page
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label
                htmlFor="referenceNo"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
                Reference No.:
              </label>
              <input
                type="text"
                id="referenceNo"
                name="referenceNo"
                value={formData.referenceNo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
                Date:
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label
                htmlFor="villagePanchayat"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
                Village Panchayat:
              </label>
              <Select
                options={villageOptions}
                onChange={handleVillageChange}
                placeholder="Select a Village Panchayat"
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="taluka"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
                Taluka:
              </label>
              <input
                type="text"
                id="taluka"
                name="taluka"
                value={formData.taluka}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label
                htmlFor="pin"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
                Pin:
              </label>
              <input
                type="text"
                id="pin"
                name="pin"
                value={formData.pin}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Timings and Date:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fromDate"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    From Date:
                  </label>
                  <input
                    type="date"
                    id="fromDate"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="toDate"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    To Date:
                  </label>
                  <input
                    type="date"
                    id="toDate"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label
                    htmlFor="fromTime"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    From Time:
                  </label>
                  <input
                    type="time"
                    id="fromTime"
                    name="fromTime"
                    value={formData.fromTime}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="toTime"
                    className="block text-sm font-medium text-gray-600 mb-2"
                  >
                    To Time:
                  </label>
                  <input
                    type="time"
                    id="toTime"
                    name="toTime"
                    value={formData.toTime}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="deoOfITG"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
                DEOs:
              </label>
              <Select
                id="deoOfITG"
                name="deoOfITG"
                isMulti
                options={deoOptions}
                onChange={handleDEOChange}
                value={deoOptions.filter((option) =>
                  formData.deoOfITG.includes(option.value)
                )}
                placeholder="Select DEOs"
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="dated"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
                Dated:
              </label>
              <input
                type="date"
                id="dated"
                name="dated"
                value={formData.dated}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label
                htmlFor="orderReferenceNo"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
                Order Reference No.:
              </label>
              <input
                type="text"
                id="orderReferenceNo"
                name="orderReferenceNo"
                value={formData.orderReferenceNo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="text-center mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InfoPage;
