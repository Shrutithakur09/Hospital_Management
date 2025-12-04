// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";

// Core pages
import Home from "./Pages/Home/Home/Home";
import Footer from "./Pages/Shared/Footer/Footer";
import Staffs from "./Pages/Staffs/Staffs";
import Appointment from "./Pages/Appointments/Appointment";
import Dashboard from "./Pages/Dashboard/Dashboard";

// Doctors
import AddDoctor from "./Pages/Doctors/AddDoctor/AddDoctor";
import PatientViewDoctor from "./Pages/Doctors/Doctors/PatientViewDoctor";
import DeleteDoctor from "./Pages/Doctors/DeleteDoctor/DeleteDoctor";
import FindDoctor from "./Pages/Doctors/UpdateDoctor/FindDoctor";
import ApproveDoctor from "./Pages/Doctors/ApproveDoctor/ApproveDoctor";

// Patients
import AddPatient from "./Pages/Patients/AddPatients/AddPatient";
import Patients from "./Pages/Patients/Patients/Patients";
import PatientDetails from "./Pages/Patients/PatientsDetails/PatientDetails";
import ViewDoctors from "./Pages/Patients/ViewDoctors/ViewDoctors";

// Auth
import Login from "./Pages/Login/Login";
//import Registration from "./Pages/Login/Registration/Registration";
import Register from "./Pages/Login/Register/Register";  // ✅ correct file
import PageNotFound from "./Pages/PageNotFound/PageNotFound";

// 🚑 Ambulance pages
import AmbulanceDashboard from "./Pages/Ambulance/AmbulanceDashboard";
import AmbulanceList from "./Pages/Ambulance/AmbulanceList";
import NearestHospitals from "./Pages/Ambulance/NearestHospitals";
import AmbulanceETA from "./Pages/Ambulance/AmbulanceETA";
import AmbulanceMap from "./Pages/Ambulance/AmbulanceMap";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* NESTED ROUTING APPLIED */}
          <Route path="/" element={<Dashboard />}>
            {/* Main dashboard content */}
            <Route index element={<Home />} />

            {/* Doctors */}
            <Route path="doctors" element={<PatientViewDoctor />} />
            <Route path="addDoctor" element={<AddDoctor />} />
            <Route path="approveDoctor" element={<ApproveDoctor />} />
            <Route path="deleteDoctor" element={<DeleteDoctor />} />
            <Route path="updateDoctor" element={<FindDoctor />} />

            {/* Patients */}
            <Route path="patients" element={<Patients />} />
            <Route path="addPatient" element={<AddPatient />}>
              <Route path=":email" element={<AddPatient />} />
            </Route>
            <Route path="viewDoctors" element={<ViewDoctors />} />
            <Route path="patientDetails/:id" element={<PatientDetails />} />

            {/* Staffs / Appointment */}
            <Route path="staffs" element={<Staffs />} />
            <Route path="appointment" element={<Appointment />}>
              <Route path=":email" element={<Appointment />} />
            </Route>

            {/* 🚑 Ambulance routes */}
            <Route
              path="ambulance-dashboard"
              element={<AmbulanceDashboard />}
            />
            <Route path="ambulance-list" element={<AmbulanceList />} />
            <Route
              path="nearest-hospitals"
              element={<NearestHospitals />}
            />
            <Route path="ambulance-eta" element={<AmbulanceETA />} />
            <Route path="ambulance-map" element={<AmbulanceMap />} />

            {/* Auth */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />


            {/* 404 inside dashboard layout */}
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>

        {/* Global footer */}
        <Footer />
      </Router>
    </div>
  );
}

export default App;
