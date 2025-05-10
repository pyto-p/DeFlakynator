import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPaperPlane, FaCopy, FaCode, FaSignOutAlt } from "react-icons/fa";
import CodeContent from "./code-content";
import "../../src/components/unixcoder_ui.scss";
import bgImage from "../components/bg-image.png";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [predictedCategory, setPredictedCategory] = useState("");
  const [generatedFix, setGeneratedFix] = useState("");
  const [peftPredictedCategory, setPeftPredictedCategory] = useState("");
  const [peftGeneratedFix, setPeftGeneratedFix] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [peftCopySuccess, setPeftCopySuccess] = useState(false);
  const [fftCopySuccess, setFftCopySuccess] = useState(false);
  const textareaRef = useRef(null);

  const handleLogout = () => {
    navigate("/login"); // Redirect to login page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPredictedCategory("");
    setGeneratedFix("");
    setPeftPredictedCategory("");
    setPeftGeneratedFix("");
    setError("");
    setLoading(true);
    setShowPrediction(true);

    // Async, await, and test case validation patterns
    const asyncPattern = /async/;
    const awaitPattern = /await/;
    const testPattern = /\b(test|it)\s*\(.*=>/;

    if (
      !asyncPattern.test(code) &&
      !awaitPattern.test(code) &&
      !testPattern.test(code)
    ) {
      setError("Please enter a valid JavaScript async test case.");
      setLoading(false);
      setShowPrediction(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5004/api/predict", {
        code,
      });

      const peftResponse = await axios.post(
        "http://localhost:5005/api/predict",
        {
          code,
        }
      );

      setPredictedCategory(response.data.predictedCategory);
      setGeneratedFix(response.data.generatedFix);
      setPeftPredictedCategory(peftResponse.data.predictedCategory);
      setPeftGeneratedFix(peftResponse.data.generatedFix);

      setShowPrediction(true);
    } catch (err) {
      setError(err.response ? err.response.data.error : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Submit using enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Copy code
  const copyToClipboard = (text, type) => {
    const codeMatches = text.match(/```(.*?)```/s);
    const codeToCopy = codeMatches
      ? codeMatches[1].replace(/^\S+\n/, "").trim()
      : "";

    navigator.clipboard
      .writeText(codeToCopy)
      .then(() => {
        if (type === "peft") {
          setPeftCopySuccess(true);
          setTimeout(() => setPeftCopySuccess(false), 2000);
        } else if (type === "fft") {
          setFftCopySuccess(true);
          setTimeout(() => setFftCopySuccess(false), 2000);
        }
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Adjust textarea height
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "60px";
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 60), 100);
    textarea.style.height = `${newHeight}px`;
    if (textarea.scrollHeight > 100) {
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.overflowY = "hidden";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  // Function to open /codebleu in a new tab
  function openCodebleuPage() {
    localStorage.setItem("generatedFix", generatedFix);
    localStorage.setItem("peftGeneratedFix", peftGeneratedFix);
    window.open("/codebleu", "_blank");
  }

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="app-container">
        {!showPrediction ? (
          <div className="welcome-message">
            <h1>Welcome to DeFlakynator</h1>
            <p className="welcome-caption">
              Having trouble with async await flaky JavaScript tests? <br />
              Enter your code below, and we’ll deflake it for you.
            </p>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt className="logout-icon" />
            </button>
          </div>
        ) : (
          <div className="prediction-container">
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt className="logout-icon" />
            </button>
            <div className="header-container">
              <div className="text-container">
                <h1>DeFlakynator</h1>
              </div>
              <button className="codebleu-btn" onClick={openCodebleuPage}>
                <span className="display-icon">
                  <FaCode />
                </span>
                <span className="full-text">CodeBLEU</span>
              </button>
            </div>
            <div className="prediction-area">
              <div
                className={`prediction-section ${loading ? "loading" : ""}`}
                style={{ backgroundColor: "#212529", color: "#f0f0f0" }}
              >
                <h2> PEFT-LoRA</h2>
                <div className="category-output-container">
                  <h3 className="category-text">Predicted Fix Category: </h3>
                  <p className="predicted-output">
                    {loading
                      ? "Predicting..."
                      : peftPredictedCategory ||
                        "Predicted fix category will go here."}
                  </p>
                </div>
                <h3>Generated Fix</h3>
                <div className="code-box">
                  <div className="code-header">
                    <span className="language-label">JavaScript</span>
                    <button
                      className="copy-button"
                      onClick={() => copyToClipboard(peftGeneratedFix, "peft")}
                    >
                      {peftCopySuccess ? "Copied!" : "Copy Code"}
                      <FaCopy />
                    </button>
                  </div>
                  <CodeContent
                    generatedFix={peftGeneratedFix}
                    loading={loading}
                  />
                </div>
              </div>

              <div
                className={`prediction-section ${loading ? "loading" : ""}`}
                style={{ backgroundColor: "#212529", color: "#f0f0f0" }}
              >
                <h2> FFT</h2>
                <div className="category-output-container">
                  <h3 className="category-text">Predicted Fix Category: </h3>
                  <p className="predicted-output">
                    {loading
                      ? "Predicting..."
                      : predictedCategory ||
                        "Predicted fix category will go here."}
                  </p>
                </div>
                <h3>Generated Fix</h3>
                <div className="code-box">
                  <div className="code-header">
                    <span className="language-label">JavaScript</span>
                    <button
                      className="copy-button"
                      onClick={() => copyToClipboard(generatedFix, "fft")}
                    >
                      {fftCopySuccess ? "Copied!" : "Copy Code"}
                      <FaCopy />
                    </button>
                  </div>
                  <CodeContent generatedFix={generatedFix} loading={loading} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        )}

        {/* Input form */}
        <form className="input-form" onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onInput={adjustTextareaHeight}
            style={{ height: "50px" }}
            onKeyDown={handleKeyDown}
            placeholder="Enter your JavaScript code here..."
            required
            className="input-textarea"
          />
          <button type="submit" className="submit-icon" disabled={loading}>
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
