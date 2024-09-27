import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import InfoPage from './pages/InfoPage';
import RegisterPage from './pages/RegisterPage';
import DocumentPage from './pages/DocumentPage';
import AttendPage from './pages/AttendPage'; // Import the Attend page
import MainPage from './pages/MainPage';
import AadharPage from './pages/AadharPage';
import DEOInsertPage from './pages/DEOInsertPage';
import OrderPage from './pages/OrderPage';
import MarkAttendance from './pages/MarkAttendance';
import ViewAttendance from './pages/ViewAttendance';
import AddParticipant from './pages/Addparticipant';
import AddLocation from './pages/LocationDetails';
import Navbar from './pages/Navbar'; // Import the Navbar component
import InfoPageTable from './pages/InfoPageTable';

const App = () => {
  return (
    <Router>
      {/* Conditionally render Navbar only on pages where it is needed */}
      <Routes>
        {/* Pages where Navbar should not be shown */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/document" element={<DocumentPage />} />


        {/* Pages where Navbar should be shown */}
        <Route 
          path="*" 
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} /> {/* Default route */}
                <Route path="/info" element={<InfoPage />} />
                <Route path="/attend" element={<AttendPage />} /> 
                <Route path="/main" element={<MainPage />} />
                <Route path="/aadhar" element={<AadharPage />} /> 
                <Route path="/deo" element={<DEOInsertPage />} />
                <Route path="/order" element={<OrderPage />} /> 
                <Route path="/mark" element={<MarkAttendance />} />
                <Route path="/view" element={<ViewAttendance />} />
                <Route path="/add" element={<AddParticipant />} />
                <Route path="/location" element={<AddLocation />} />
                <Route path="/infot" element={<InfoPageTable />}/>
                <Route path="*" element={<Navigate to="/login" />} /> {/* Fallback route */}
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
