import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const location = useLocation();
  const ogPatientData = location.state?.patientData || [];
  const patientData = [ogPatientData[ogPatientData.length - 1]];
  const patientId = patientData[0]?.patient_id;

  const [handwritingData, setHandwritingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch handwriting analysis data from API
  useEffect(() => {
    if (patientId) {
      axios
        .post(
          `http://52.87.183.12:8000/fetch_analysis/?patient_id=${patientId}`,
          null,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setHandwritingData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Error fetching handwriting analysis data");
          setLoading(false);
        });
    }
  }, [patientId]);

  return (
    <div className="doctor-dashboard-container">
      <h2 className="doctor-dashboard-header">Doctor's Dashboard</h2>

      {/* Speech Monitoring Data (unchanged) */}
      <h3>🗣 Speech Monitoring Analysis</h3>
      {patientData.length > 0 ? (
        <table className="patient-data">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient ID</th>
              <th>Timestamp</th>
              <th>Result</th>
              <th>Result Description</th>
            </tr>
          </thead>
          <tbody>
            {patientData.map((record, index) => (
              <tr key={index}>
                <td>{record.id}</td>
                <td>{record.patient_id}</td>
                <td>{new Date(record.timestamp).toLocaleString()}</td>
                <td>
                  <pre>{JSON.stringify(record.result, null, 2)}</pre>
                </td>
                <td>
                  <pre>
                    {JSON.stringify(record.result_description, null, 2)}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data-message">No speech monitoring data found.</p>
      )}

      {/* Handwriting Analysis Data */}
      <h3>✍ Handwriting Analysis</h3>
      {loading ? (
        <p className="loading-message">Loading handwriting analysis...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : handwritingData ? (
        <div className="handwriting-analysis">
          {/* Displaying sorted results */}
          <h4>Sorted Results:</h4>
          {handwritingData.sorted_results.length > 0 ? (
            <ul>
              {handwritingData.sorted_results.map((item, index) => (
                <li key={index}>
                  <strong>{item.created_at}:</strong> {item.image_path} → Hu
                  Distance: {item.hu_distance.toFixed(6)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No sorted results available</p>
          )}

          {/* Displaying summary */}
          <h4>Summary:</h4>
          <pre>{handwritingData.summary}</pre>
        </div>
      ) : (
        <p className="no-data-message">
          No handwriting analysis data available.
        </p>
      )}

      {/* Fetch Analysis Data */}
      <h3>📊 Analysis Results</h3>
      {/* Additional code for displaying other analysis data */}
    </div>
  );
};

export default DoctorDashboard;
