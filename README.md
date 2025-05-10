# DeFlakynator

DeFlakynator is a tool designed to help identify and analyze flaky tests in software projects. It combines machine learning techniques with static code analysis to provide insights into potentially problematic test cases.

## Project Structure

The project is organized into two main components:

### Backend
- Python-based backend service
- Utilizes machine learning models for test analysis
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
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
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

1. Start the backend server:
   ```bash
   cd backend
   python app.py
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

The application should now be accessible at `http://localhost:3000`

## Features

- Test flakiness analysis
- Code quality assessment
- Interactive visualization of results
- Machine learning-based predictions
- RESTful API for integration with other tools

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license information here]

## Contact

[Add your contact information here]