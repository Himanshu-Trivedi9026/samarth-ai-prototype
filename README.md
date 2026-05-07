SAMARTH AI — UBID Active Business Intelligence System
Overview

SAMARTH AI is an AI-powered business intelligence and duplicate detection platform designed for government and enterprise datasets.

The system performs:

UBID (Unified Business Identity) generation
Duplicate business detection
AI-based similarity scoring
Explainable AI analysis
Human review workflows
Activity intelligence analysis
CSV ingestion from departments
Analytics visualization dashboard

The project uses:

React.js frontend
FastAPI backend
Machine learning-based entity matching
Interactive analytics dashboard
Features
1. Duplicate Business Detection

Detects duplicate or highly similar businesses using:

Semantic name matching
Semantic address matching
Fuzzy matching
Confidence scoring
Threshold-based AI decisions
2. UBID Generation

Automatically generates a unique UBID for new businesses.

Example:

c8ad05e2-1094-5d36-92cc-5672497b6c38
3. Explainable AI Engine

Displays:

Similarity confidence
Semantic scores
Fuzzy scores
Final matching scores
AI reasoning
GST intelligence
4. Human Review Workflow

Supports:

Accept
Reject
Review Later

for medium-confidence matches.

5. Activity Intelligence

Analyzes business activity using:

Payments
Inspections
Renewals
Event history
Recent activity

Business states:

ACTIVE
DORMANT
HIGH RISK
6. Department CSV Upload

Upload datasets from departments for intelligence processing.

Supported:

CSV ingestion
Dataset parsing
Business analytics generation
7. Analytics Dashboard

Includes:

Total businesses
Duplicate analysis
Activity distribution
Relationship graph
Charts and statistics
Tech Stack
Frontend
React.js
Vite
Recharts
React Flow
Axios
Backend
FastAPI
Python
Uvicorn
Pydantic
Pandas
Project Structure
project_root/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── utils/
│   │
│   ├── requirements.txt
│   └── uploads/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
Backend Setup
1. Open Backend Folder
cd backend
2. Create Virtual Environment
Windows
python -m venv venv
3. Activate Virtual Environment
Windows
venv\Scripts\activate
4. Install Dependencies
pip install -r requirements.txt
5. Run FastAPI Server
uvicorn app.main:app --reload

Backend runs on:

http://127.0.0.1:8000
Swagger API Documentation

Open:

http://127.0.0.1:8000/docs

Available APIs:

/analyze
/explain
/upload
/analytics
Frontend Setup
1. Open Frontend Folder
cd frontend
2. Install Dependencies
npm install
3. Start Frontend
npm run dev

Frontend runs on:

http://localhost:5173
Environment Requirements
Required Software
Python 3.10+
Node.js 18+
npm
Git
API Workflow
Duplicate Detection

Frontend sends:

{
  "name": "ABC Pvt Ltd",
  "address": "Delhi India"
}

Backend returns:

{
  "similarity_score": 0.75,
  "is_duplicate": true,
  "ubid": "generated-uuid"
}
Explainability Workflow

Displays:

Semantic similarity
Fuzzy matching
Confidence level
AI reasoning
CSV Upload Workflow

Upload CSV containing:

consumer_id,name,address,electricity_usage
1,ABC Pvt Ltd,Delhi,1200

System generates analytics automatically.

Testing Guide
1. Duplicate Detection Test

Input:

ABC Pvt Ltd
Connaught Place Delhi

Expected:

Confidence score
UBID
Duplicate result
2. Human Review Test

Use medium-confidence matches.

Verify:

Accept
Reject
Review Later
3. CSV Upload Test

Upload department CSV.

Verify:

Upload complete
Analytics updated
4. Analytics Dashboard Test

Verify:

Charts render
Counts update
Relationship graph loads
Mobile Responsiveness

The frontend supports:

Desktop
Tablet
Mobile devices

Test using browser DevTools.

Current Capabilities

✅ AI duplicate detection
✅ Explainable AI
✅ Human review workflow
✅ Analytics dashboard
✅ CSV ingestion
✅ UBID generation
✅ Responsive UI
✅ FastAPI backend
✅ Swagger API testing

Future Improvements
Real database integration
Authentication system
Live department APIs
AI model optimization
Graph database integration
Cloud deployment
Real-time streaming analytics
Author

SAMARTH AI — UBID Active Business Intelligence System

Built using React + FastAPI + AI Explainability + Analytics Dashboard