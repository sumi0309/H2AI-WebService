import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import "./DoctorLogin.css";

// API client functions with axios
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const authenticateDoctor = async ({ doctorId, patientId }) => {
  const { data } = await api.post("/doctor-patient-data", {
    doctorId,
    patientId,
  });

  if (!data.success) {
    throw new Error(data.error || "Failed to authenticate");
  }
  return data;
};

const predictionApi = axios.create({
  baseURL: process.env.REACT_APP_PD_SPEECH_MICROSERVICE,
  headers: {
    "Content-Type": "application/json",
  },
});

const fetchPrediction = async (patientId) => {
  try {
    const { data } = await predictionApi.post("/sustained-phonation/analyze", {
      patient_id: patientId,
    });
    return data;
  } catch (error) {
    console.error("Prediction error:", error);
    throw new Error("Failed to fetch prediction results");
  }
};

const DoctorLogin = () => {
  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const authMutation = useMutation({
    mutationFn: authenticateDoctor,
    onMutate: async (variables) => {
      setError("");

      await queryClient.cancelQueries({
        queryKey: ["patientData", variables.patientId],
      });

      await queryClient.prefetchQuery({
        queryKey: ["patientData", variables.patientId],
        queryFn: () => variables.patientId,
        staleTime: 5 * 60 * 1000,
      });

      return { variables };
    },
    onSuccess: async (data) => {
      // Trigger prediction in background and cache result
      queryClient.prefetchQuery({
        queryKey: ["prediction", patientId],
        queryFn: () => fetchPrediction(patientId),
        staleTime: 5 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
      });

      navigate("/doctor-dashboard", {
        state: { patientData: data.patientData },
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Network error occurred");
      } else {
        setError(error.message || "An error occurred during authentication");
      }
    },
    retry: 1, // Only retry once
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!doctorId.trim() || !patientId.trim()) {
      setError("Doctor ID and Patient ID are required");
      return;
    }

    authMutation.mutate({ doctorId, patientId });
  };

  return (
    <div className="doctor-login-container">
      <div className="doctor-login-card">
        <h2 className="doctor-login-header">Doctor Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Doctor ID"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            disabled={authMutation.isPending}
            className="doctor-login-input"
          />
          <input
            type="text"
            placeholder="Enter Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            disabled={authMutation.isPending}
            className="doctor-login-input"
          />
          <button
            type="submit"
            className="doctor-login-button"
            disabled={authMutation.isPending}
          >
            {authMutation.isPending ? "Processing..." : "Access Patient Data"}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}

        {authMutation.isPending && (
          <div className="transition-state">
            <div className="dot-dot-effect">
              {authMutation.isPending ? "Fetching Reports" : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorLogin;
