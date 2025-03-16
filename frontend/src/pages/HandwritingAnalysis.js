import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./HandwritingAnalysis.css";

const HandwritingAnalysis = () => {
  const [file, setFile] = useState(null);
  const [uploadDate, setUploadDate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      // Validate file format (only JPEG allowed)
      const fileType = selectedFile.type;
      if (fileType === "image/jpeg" || fileType === "image/jpg") {
        setFile(selectedFile);
        setMessage(""); // Clear previous error message
      } else {
        setFile(null);
        setMessage("Invalid file format. Please upload a JPEG image.");
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !uploadDate || !patientId) {
      setMessage("Please upload a JPEG file and select a date.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", patientId);
    formData.append("uploadDate", uploadDate);

    try {
      const response = await fetch(
        "http://localhost:5000/api/upload-handwriting",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setMessage("Upload successful!");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="handwriting-container">
      <h1>Handwriting Analysis</h1>
      <p>
        User ID: <span className="patient-id">{patientId}</span>
      </p>

      <div className="input-container">
        <label>Select Date:</label>
        <input
          type="date"
          value={uploadDate}
          onChange={(e) => setUploadDate(e.target.value)}
          className="input-date"
        />
      </div>

      <div className="file-upload">
        <input type="file" accept=".jpeg, .jpg" onChange={handleFileChange} />
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="upload-btn"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {message && (
        <p
          className={`status-message ${
            message.includes("successful") ? "success" : "error"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default HandwritingAnalysis;
