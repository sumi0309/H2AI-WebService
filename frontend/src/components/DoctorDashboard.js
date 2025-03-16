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
      <h3>🗣 Speech Monitoring Analysis</h3>
      {patientData.length > 0 ? (
        <div className="speech-monitoring-analysis">
          <h4>Weekly Analysis</h4>
          {patientData[0]?.result_description && (
            <div className="analysis-list-container">
              <ul className="analysis-list">
                {patientData[0].result_description.map((item, index) => (
                  <li key={index} className="analysis-item">
                    <div className="analysis-header">
                      <h5>
                        {item.name} ({item.full_form})
                      </h5>
                    </div>
                    <div className="analysis-content">
                      <p className="description">{item.description}</p>
                      <div className="analysis-metrics">
                        <span className="metric normal-range">
                          <strong>Normal Range:</strong> {item.normal_range}
                        </span>
                        <span className="metric patient-value">
                          <strong>Patient Value:</strong> {item.patient_value}
                        </span>
                      </div>
                      <p className="pd-description">
                        <strong>In Parkinson's Patients:</strong>{" "}
                        {item.parkinson_patient_description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p className="no-data-message">No speech monitoring data found.</p>
      )}

      {/* Handwriting Analysis Data */}
      <h3>✍ Shape Drawing Analysis</h3>
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
      <h3>📊 Moca Test Reports</h3>
      {/* Add Button to View MOCA Test Report */}
      <button
        className="view-report-button"
        onClick={() =>
          window.open(
            "https://nnlhwoslxwdcxzctfokm.supabase.co/storage/v1/object/public/moca-test-files//j123-2025-03-15.pdf",
            "_blank"
          )
        }
      >
        View MOCA Test Report
      </button>
    </div>
  );
};

export default DoctorDashboard;
