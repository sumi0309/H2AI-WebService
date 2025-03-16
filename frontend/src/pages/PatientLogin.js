import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientLogin.css"; // Import the updated CSS

const PatientLogin = () => {
  const [patientId, setPatientId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/check-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid Patient ID");
      }

      navigate(`/patient-options?patientId=${patientId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <label>Enter Your ID:</label> <br />
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="e.g. P123456"
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Checking..." : "Proceed"}
        </button>
      </form>
    </div>
  );
};

export default PatientLogin;
