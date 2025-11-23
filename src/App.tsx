import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// ✅ FIXED correct path
import AppLayout from "./components/layout/AppLayout";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/Doctordashboard.tsx";
import DoctorList from "./pages/DoctorList";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/Myappointments.tsx";
import DoctorAppointments from "./pages/DoctorAppointments";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes (wrapped in AppLayout because they use the header + hamburger UI) */}
          <Route
            path="/"
            element={
              <AppLayout>
                <HomePage />
              </AppLayout>
            }
          />

          {/* Public: Login + Register (NO layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Doctors List (YES layout) */}
          <Route
            path="/doctors"
            element={
              <AppLayout>
                <DoctorList />
              </AppLayout>
            }
          />

          {/* Patient routes */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <AppLayout>
                  <PatientDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <AppLayout>
                  <MyAppointments />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/book-appointment/:doctorId"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <AppLayout>
                  <BookAppointment />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Doctor routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <AppLayout>
                  <DoctorDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <AppLayout>
                  <DoctorAppointments />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
