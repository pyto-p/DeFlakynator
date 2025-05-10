import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UnixcoderUI from "./components/UnixcoderUI";
import Codebleu from "./components/codebleu-pages/CodebleuMain";
import LoginPage from "./components/LoginPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/codebleu" element={<Codebleu />} />
        <Route path="/unixcoder" element={<UnixcoderUI />} />
      </Routes>
    </Router>
  );
}

export default App;
