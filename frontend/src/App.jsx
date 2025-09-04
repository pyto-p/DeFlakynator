import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";

import "./App.css";
import CodebleuPage from "./pages/CodebleuPage/CodebleuPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/codebleu" element={<CodebleuPage />} />
      </Routes>
    </Router>
  );
}

export default App;
