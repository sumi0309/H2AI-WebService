require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors()); // Ensure CORS is enabled

// Connect to Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Multer Storage for Audio Files
const storage = multer.memoryStorage();
const upload = multer({ storage });

// API: Check if Patient ID Exists
app.post("/api/check-patient", async (req, res) => {
  const { patientId } = req.body;

  if (!patientId) {
    return res.status(400).json({ error: "Patient ID is required" });
  }

  // Query Supabase for the patient ID
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", patientId)
    .eq("role", "patient")
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Patient not found" });
  }

  res.json({ success: true, patient: data });
});

// API: Upload Speech Recording
app.post("/api/upload-speech", upload.single("file"), async (req, res) => {
  const { patientId, uploadDate } = req.body;
  const file = req.file;

  if (!patientId || !file) {
    return res.status(400).json({ error: "Patient ID and file are required" });
  }

  try {
    // Upload the file to Supabase Storage
    const fileName = `${patientId}-${uploadDate}.wav`;
    const { data, error } = await supabase.storage
      .from("speech-files")
      .upload(fileName, file.buffer, { contentType: "audio/wav" });

    if (error) {
      throw error;
    }

    // Get the public URL of the file
    const { publicURL, error: urlError } = supabase.storage
      .from("speech-files")
      .getPublicUrl(data.path);

    if (urlError) {
      throw urlError;
    }

    // Save the record in the database (without providing an id since it's auto-increment)
    const estTime = new Date().toLocaleTimeString("en-US", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const { data: insertData, error: insertError } = await supabase
      .from("speech_records")
      .insert([
        {
          patient_id: patientId,
          file_url: publicURL,
          upload_date: uploadDate,
          created_at: estTime,
        },
      ]);

    if (insertError) {
      throw insertError;
    }

    res.json({ success: true, fileUrl: publicURL });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/doctor-patient-data", async (req, res) => {
  const { doctorId, patientId } = req.body;

  if (!doctorId || !patientId) {
    return res
      .status(400)
      .json({ error: "Doctor ID and Patient ID are required" });
  }

  try {
    // Verify Doctor ID
    const { data: doctor, error: doctorError } = await supabase
      .from("users")
      .select("*")
      .eq("id", doctorId)
      .eq("role", "doctor")
      .single();

    if (doctorError || !doctor) {
      return res.status(403).json({ error: "Invalid Doctor ID" });
    }

    // Fetch Patient Data
    const { data: patientData, error: patientError } = await supabase
      .from("sp_analysis")
      .select("*")
      .eq("patient_id", patientId);

    if (patientError) {
      throw patientError;
    }

    res.json({ success: true, patientData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Multer Storage for Image Files
const imageStorage = multer.memoryStorage();
const uploadImage = multer({ storage: imageStorage });

// API: Upload Handwriting Image
app.post(
  "/api/upload-handwriting",
  uploadImage.single("file"),
  async (req, res) => {
    const { patientId, uploadDate } = req.body;
    const file = req.file;

    if (!patientId || !file) {
      return res
        .status(400)
        .json({ error: "Patient ID and file are required" });
    }

    try {
      // Upload the file to Supabase Storage
      const fileName = `${patientId}-${uploadDate}.jpg`;
      const { data, error } = await supabase.storage
        .from("shape-files")
        .upload(fileName, file.buffer, { contentType: "image/jpg" });

      if (error) {
        throw error;
      }

      // Get the public URL of the file
      const { publicURL, error: urlError } = supabase.storage
        .from("shape-files")
        .getPublicUrl(data.path);

      if (urlError) {
        throw urlError;
      }

      // Save the record in the database
      const { data: insertData, error: insertError } = await supabase
        .from("shape_analysis")
        .insert([
          {
            patient_id: patientId,
            created_at: new Date().toISOString(),
            result: JSON.stringify({ image_url: publicURL }),
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      res.json({ success: true, fileUrl: publicURL });
    } catch (err) {
      res.status(500).json({ error: err.message });
    } finally {
      var fileName = `${patientId}-${uploadDate}.jpg`;

      try {
        console.log("Filename", fileName);
        console.log("patientID", patientId);

        const url = `http://52.87.183.12:8000/analyze_shape/?image_path=${fileName}&patient_id=${patientId}`;

        const response = await axios.post(url, null, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Analyze Shape API Response:", response.data);
        return response.data;
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    }
  }
);

app.get("/api/fetch-pdf-files", async (req, res) => {
  const { patientId } = req.query; // Get patientId from query params

  if (!patientId) {
    return res.status(400).json({ error: "Patient ID is required" });
  }

  try {
    // Query files in the "moca-test-files" bucket for the patientId
    const { data, error } = await supabase.storage
      .from("moca-test-files")
      .list("", {
        search: `${patientId}-`, // Search for files that start with the patientId
        limit: 100, // Limit the number of files returned
        offset: 0,
      });

    if (error) {
      throw error;
    }

    // Get the file URLs for each PDF file
    const pdfFilesWithUrls = await Promise.all(
      data.map(async (file) => {
        const { publicURL, error } = await supabase.storage
          .from("moca-test-files")
          .getPublicUrl(file.name);

        if (error) {
          throw error;
        }

        return { fileName: file.name, fileUrl: publicURL };
      })
    );

    res.json(pdfFilesWithUrls); // Send the file URLs as the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching PDF files from Supabase" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
