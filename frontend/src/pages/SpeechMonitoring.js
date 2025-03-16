import React, { useState } from "react";
import { ReactMic } from "react-mic";
import { useSearchParams } from "react-router-dom";
import "./SpeechMonitoring.css"; // Import the CSS file
import axios from "axios";

const SpeechMonitoring = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [uploadDate, setUploadDate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");

  const startRecording = () => setRecording(true);
  const stopRecording = () => setRecording(false);

  const onData = (recordedBlob) => {
    console.log("Recording in progress:", recordedBlob);
  };

  const onStop = (recordedBlob) => {
    console.log("Recording stopped:", recordedBlob);
    setAudioBlob(recordedBlob.blob);
  };

  const handleUpload = async () => {
    if (!audioBlob || !uploadDate || !patientId) {
      setMessage("Please record a file and select a date.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", audioBlob, "speech.webm");
    formData.append("patientId", patientId);
    formData.append("uploadDate", uploadDate);

    try {
      const response = await fetch("http://localhost:5000/api/upload-speech", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setMessage("Upload successful!");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
      const fileName = `${patientId}-${uploadDate}.wav`;

      try {
        const response = await axios.post(
          "http://3.145.168.92:8001/sustained-phonation/predict",
          { audio_file: fileName }, // JSON body
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Prediction API Response:", response.data);
        return response.data;
      } catch (error) {
        console.error(
          "Prediction API Error:",
          error.response?.data || error.message
        );
        throw new Error(`Prediction API Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="speech-container">
      <h1>Speech Monitoring</h1>
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

      <div className="recorder">
        <ReactMic
          record={recording}
          onStop={onStop}
          onData={onData}
          className="react-mic"
        />
        <div className="buttons">
          <button
            onClick={startRecording}
            disabled={recording}
            className="record-btn start"
          >
            Start Recording
          </button>
          <button
            onClick={stopRecording}
            disabled={!recording}
            className="record-btn stop"
          >
            Stop Recording
          </button>
        </div>
      </div>

      {audioBlob && <p className="status-message">Recording Ready!</p>}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="upload-btn"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default SpeechMonitoring;
