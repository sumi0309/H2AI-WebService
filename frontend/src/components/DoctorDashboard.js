import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const location = useLocation();
  const ogPatientData = location.state?.patientData || [];
  const patientData = [ogPatientData[ogPatientData.length - 1]]; // Latest entry only
  const patientId = patientData[0]?.patient_id;

  const [handwritingData, setHandwritingData] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch handwriting analysis data
  useEffect(() => {
    if (patientId) {
      axios
        .post(
          `http://52.87.183.12:8000/fetch_analysis/?patient_id=${patientId}`,
          null,
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          setHandwritingData(response.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Error fetching handwriting analysis data");
          setLoading(false);
        });
    }
  }, [patientId]);

  // Fetch PDF files
  useEffect(() => {
    if (patientId) {
      axios
        .get(`http://localhost:5000/api/fetch-pdf-files?patientId=${patientId}`)
        .then((response) => setPdfFiles(response.data))
        .catch(() => setError("Error fetching PDF files"));
    }
  }, [patientId]);

  // Extract graph data from patientData
  const graphData = patientData
    .map((record) => ({
      timestamp: new Date(record.timestamp).toLocaleString(),
      hnr: record.result?.hnr || null,
      mpt: record.result?.mpt || null,
    }))
    .filter((entry) => entry.hnr !== null && entry.mpt !== null); // Remove missing values

  return (
    <div className="doctor-dashboard-container">
      <h2 className="doctor-dashboard-header">Doctor's Dashboard</h2>

      {/* Speech Monitoring Data Table */}
      <h3>🗣 Speech Monitoring Analysis</h3>
      {patientData.length > 0 ? (
        <>
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

          {/* Speech Analysis Graphs */}
          {graphData.length > 0 ? (
            <div className="graph-container">
              <h3>📊 Speech Analysis Graphs</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="hnr"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="HNR"
                  />
                  <Line
                    type="monotone"
                    dataKey="mpt"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="MPT"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p>No graph data available.</p>
          )}
        </>
      ) : (
        <p className="no-data-message">No speech monitoring data found.</p>
      )}

      {/* Handwriting Analysis */}
      <h3>✍ Handwriting Analysis</h3>
      {loading ? (
        <p className="loading-message">Loading handwriting analysis...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : handwritingData ? (
        <div className="handwriting-analysis">
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
      {pdfFiles.length > 0 ? (
        <ul>
          {pdfFiles.map((file, index) => (
            <li key={index}>
              <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                {file.fileName}
              </a>{" "}
              - {new Date(file.fileName.split("-")[1]).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No analysis results available.</p>
      )}
    </div>
  );
};

export default DoctorDashboard;
