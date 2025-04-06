# NeuroTrack.io

## Overview
This project focuses on leveraging artificial intelligence (AI) to track the progression of Parkinson's disease (PD) in patients over time. By utilizing advanced AI models, the system aims to objectively measure changes in motor abilities and other symptoms associated with PD, enabling clinicians to assess disease severity and progression more accurately. The application is designed to provide insights into subtle variations in patients' abilities, which are often challenging to detect through traditional methods. The ultimate goal is to improve patient care, optimize treatment plans, and reduce the burden on healthcare providers by enabling remote and automated assessments.

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
