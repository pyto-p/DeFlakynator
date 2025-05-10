# DeFlakynator

DeFlakynator is a tool designed to identify, analyze, and fix flaky tests in JavaScript software projects. It combines machine learning techniques with Generative AI to not only detect problematic test cases but also provide automated fixes for them.

## Project Structure

The project is organized into two main components:

### Backend
- Python-based backend service with two main components:
  - UnixCoder-FFT: Fast Fine-Tuning model for test analysis
  - UnixCoder-PEFT: Parameter-Efficient Fine-Tuning model for test analysis
- Utilizes machine learning and Generative AI models for test analysis and fixes
- Provides REST API endpoints for test analysis
- Key dependencies:
  - PyTorch
  - Transformers
  - PEFT (Parameter-Efficient Fine-Tuning)
  - Flask
  - Tree-sitter for code parsing

### Frontend
- React-based web interface
- Provides visualization and interaction with the analysis results
- Modern UI for test analysis and reporting

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   source environment/thesis-env/bin/activate  # On Windows: environment\thesis-env\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

The application requires three separate terminal windows to run properly:

### Terminal 1 (UnixCoder-FFT)
```bash
source environment/thesis-env/bin/activate
cd backend/unixcoder-fft
python3 fft-rag.py
```

### Terminal 2 (UnixCoder-PEFT)
```bash
source environment/thesis-env/bin/activate
cd backend/unixcoder-peft
python3 peft-rag.py
```

### Terminal 3 (Frontend)
```bash
cd frontend
npm run start
```

The application should now be accessible at `http://localhost:3000`

## Features

- Test flakiness detection and analysis
- Automated fixes for flaky tests using Generative AI
- JavaScript-specific test analysis
- Code quality assessment
- Interactive visualization of results
- Machine learning-based predictions
- CodeBLEU score calculation for test fix quality assessment
- RESTful API for integration with other tools