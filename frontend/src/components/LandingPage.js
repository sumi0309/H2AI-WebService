import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>Welcome to NeuroTrack.AI</h1>
      <p>Select your role to get started:</p>
      <div className="role-buttons">
        <button
          className="role-button"
          onClick={() => navigate("/patient-login")}
        >
          👩‍⚕️ Patient
        </button>
        <button
          className="role-button"
          onClick={() => navigate("/doctor-login")}
        >
          🩺 Doctor
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
