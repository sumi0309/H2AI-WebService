import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./MotorSkillsTest.css";

const MotorSkillsTest = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get("patientId");

  const [file, setFile] = useState(null);
  const [uploadDate, setUploadDate] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDateChange = (event) => {
    setUploadDate(event.target.value);
  };

  const handleUpload = async () => {
    if (!file || !uploadDate) {
      alert("Please select a file and a date.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", patientId);
    formData.append("uploadDate", uploadDate);

    try {
      const response = await fetch("http://localhost:5000/api/upload-moca", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert("File uploaded successfully!");
      } else {
        alert("Upload failed: " + result.error);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="motor-skills-container">
      <h1>Motor Skills Test</h1>
      <p>
        Please take the{" "}
        <a
          href="https://portal-us.mocacognition.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          XpressO Montreal Cognitive Assessment (MoCA) Test
        </a>
        .
      </p>
      <div className="upload-section">
        <label>Select Date:</label>
        <input type="date" value={uploadDate} onChange={handleDateChange} />

        <label>Upload MoCA Test Result (PDF):</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />

        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
};

export default MotorSkillsTest;
