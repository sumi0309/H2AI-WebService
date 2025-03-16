import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const patientId = "P123456"; // This would be dynamic

  return (
    <div>
      <h1>Patient Dashboard</h1>
      <p>Your Patient ID: {patientId}</p>
      <button onClick={() => navigate("/patient-options")}>Proceed</button>
    </div>
  );
};

export default PatientDashboard;
