import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PatientOptions.css";

const PatientOptions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("patientId");
    if (id) setPatientId(id);
  }, [location]);

  const handleSpeechMonitoringClick = () => {
    navigate(`/speech-monitoring?patientId=${patientId}`);
  };

  const handleHandwritingAnalysisClick = () => {
    navigate(`/handwriting-analysis?patientId=${patientId}`);
  };

  const handleMotorSkillsTestClick = () => {
    navigate(`/motor-skills-test?patientId=${patientId}`);
  };

  return (
    <div className="patient-options-container">
      <div className="form-container">
        <h1>Welcome Back!</h1>
        <h2>Choose an option:</h2>
        <ul>
          <li>
            <button
              onClick={handleSpeechMonitoringClick}
              className="option-btn"
            >
              🗣️ Speech Monitoring
            </button>
          </li>
          <li>
            <button
              onClick={handleHandwritingAnalysisClick}
              className="option-btn"
            >
              ✍️ Handwriting Analysis
            </button>
          </li>
          <li>
            <button onClick={handleMotorSkillsTestClick} className="option-btn">
              🖐️ Motor Skill Tests
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PatientOptions;
