import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import React Query
import LandingPage from "./components/LandingPage";
import PatientLogin from "./pages/PatientLogin";
import PatientOptions from "./pages/PatientOptions";
import DoctorDashboard from "./components/DoctorDashboard";
import SpeechMonitoring from "./pages/SpeechMonitoring";
import DoctorLogin from "./pages/DoctorLogin";
import HandwritingAnalysis from "./pages/HandwritingAnalysis";
import MotorSkillsTest from "./pages/MotorSkillsTest"; // Import the new page

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    // Wrap the Router with QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/patient-options" element={<PatientOptions />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/speech-monitoring" element={<SpeechMonitoring />} />
          <Route
            path="/handwriting-analysis"
            element={<HandwritingAnalysis />}
          />
          <Route path="/motor-skills-test" element={<MotorSkillsTest />} />{" "}
          {/* Add new route */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
