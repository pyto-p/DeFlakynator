import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Unixcoder_ui from "./components/unixcoder_ui";
import Codebleu from "../src/components/codebleu-pages/codebleu-main";
import LoginPage from "./components/loginpage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/codebleu" element={<Codebleu />} />
        <Route path="/unixcoder" element={<Unixcoder_ui />} />
      </Routes>
    </Router>
  );
}

export default App;
