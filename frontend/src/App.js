import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Unixcoder_ui from "./components/unixcoder_ui";
import Codebleu from "../src/components/codebleu-pages/codebleu-main";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Unixcoder_ui />} />
        <Route path="/codebleu" element={<Codebleu />} />
      </Routes>
    </Router>
  );
}

export default App;