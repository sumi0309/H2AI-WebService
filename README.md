# NeuroTrack.io

## Overview
H2AI-WebService is a web-based application designed to facilitate AI-driven analysis and processing. This project leverages advanced AI/ML models for speech and image recognition, integrating a scalable and secure architecture for efficient deployment.

## Features
- AI/ML-powered analysis using PRAT algorithms and SpeechBrain  
- Audio processing using PyTorch for tensor conversion  
- Image processing with OpenCV (cv2) for Hu distance computation  
- Secure and scalable architecture deployed on AWS Elastic Compute  
- Object storage and PostgreSQL relational database on Supabase  

## Technologies Used
- **Backend**: Express.js, FastAPI  
- **Frontend**: React.js  
- **Database**: Supabase (PostgreSQL, Object Storage)  
- **AI/ML**: PRAT Algorithms, SpeechBrain, PyTorch, OpenCV (cv2)  
- **Deployment**: AWS Elastic Compute (Frontend, Backend, Microservices)  

## Installation

### Prerequisites
Ensure you have the following installed on your system:
- Node.js  
- Python  

### Steps to Run Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/sumi0309/H2AI-WebService.git
   cd H2AI-WebService
   ```
2. Open two terminals side by side.

#### Terminal 1: Start Backend
3. Navigate to the backend directory:
   ```sh
   cd backend
   ```
4. Install dependencies:
   ```sh
   npm install
   ```
5. Start the backend development server:
   ```sh
   npm start
   ```

#### Terminal 2: Start Frontend
6. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
7. Install dependencies:
   ```sh
   npm install
   ```
8. Start the frontend development server:
   ```sh
   npm run start
   ```

## Usage
- The system currently contains one doctor ID: `DocSumiran`  
- The patient analysis is being done for: `Alice123`  
