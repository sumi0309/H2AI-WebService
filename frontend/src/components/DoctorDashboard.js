import { useLocation } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import "./DoctorDashboard.css";

// API functions
const fetchHandwritingData = async ({ queryKey }) => {
  const [_, patientId] = queryKey;
  const { data } = await axios.post(
    "http://127.0.0.1:8000/handwriting-analysis/predict",
    { patientID: patientId }
  );
  return data;
};

const fetchCognitiveData = async ({ queryKey }) => {
  const [_, patientId] = queryKey;
  const { data } = await axios.post(
    "http://127.0.0.1:8000/cognitive-tests/predict",
    { patientID: patientId }
  );
  return data;
};

const DoctorDashboard = () => {
  const location = useLocation();
  const ogPatientData = location.state?.patientData || [];
  const patientData = [ogPatientData[ogPatientData.length - 1]]; 
  const patientId = patientData[0]?.patient_id; 

  // Using useQueries for parallel queries
  const results = useQueries({
    queries: [
      {
        queryKey: ["handwriting", patientId],
        queryFn: fetchHandwritingData,
        enabled: !!patientId,
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
      },
      {
        queryKey: ["cognitive", patientId],
        queryFn: fetchCognitiveData,
        enabled: !!patientId,
        staleTime: 5 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
      },
    ],
  });

  const [handwritingQuery, cognitiveQuery] = results;
  const { data: handwritingData, isError: handwritingError } = handwritingQuery;
  const { data: cognitiveData, isError: cognitiveError } = cognitiveQuery;

  return (
    <div className="doctor-dashboard-container">
      <h2 className="doctor-dashboard-header">Doctor's Dashboard</h2>

      {/* Speech Monitoring Data */}
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
      {handwritingError ? (
        <p className="error-message">Error fetching handwriting data</p>
      ) : handwritingData ? (
        <div className="analysis-section">
          <pre>{JSON.stringify(handwritingData, null, 2)}</pre>
        </div>
      ) : (
        <p className="no-data-message">Loading handwriting analysis...</p>
      )}

      {/* Cognitive Skill Tests Data */}
      <h3>🖐 Cognitive Skill Tests</h3>
      {cognitiveError ? (
        <p className="error-message">Error fetching cognitive data</p>
      ) : cognitiveData ? (
        <div className="analysis-section">
          <pre>{JSON.stringify(cognitiveData, null, 2)}</pre>
        </div>
      ) : (
        <p className="no-data-message">Loading cognitive tests data...</p>
      )}
    </div>
  );
};

export default DoctorDashboard;
