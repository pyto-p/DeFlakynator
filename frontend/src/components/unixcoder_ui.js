import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPaperPlane, FaCopy } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../../src/components/unixcoder_ui.scss";
import bgImage from "../components/bg-image.png";

function App() {
  const [code, setCode] = useState("");
  const [predictedCategory, setPredictedCategory] = useState("");
  const [generatedFix, setGeneratedFix] = useState("");
  const [peftPredictedCategory, setPeftPredictedCategory] = useState("");
  const [peftGeneratedFix, setPeftGeneratedFix] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPredictedCategory("");
    setGeneratedFix("");
    setPeftPredictedCategory("");
    setPeftGeneratedFix("");
    setError("");
    setLoading(true);
    setShowPrediction(true);

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

  // submit using enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent adding a new line
      handleSubmit(e); // Trigger form submission
    }
  };

  // copy code
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopySuccess("Copied!"); 
        setTimeout(() => setCopySuccess(""), 2000); // Hide message after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // adjust text area height
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
            <h1>Welcome to UnixCoder Fix Predictor</h1>
            <p>
              Enter your JavaScript code below, and we'll predict the fix
              category for you!
            </p>
          </div>
        ) : (
          <div className="prediction-container">
            <div className="header-container">
              <div className="text-container">
                <h1>UnixCoder Fix Predictor</h1>
                <p>
                  Enter your JavaScript code below to get the predicted fix
                  category and generated fix.
                </p>
              </div>
            </div>
            <div className="prediction-area">
              <div
                className={`prediction-section ${loading ? "loading" : ""}`}
                style={{ backgroundColor: "#212529", color: "#f0f0f0" }}
              >
                {/* {copySuccess && (
                  <span className="copy-message">{copySuccess}</span>
                )} */}
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
                      onClick={() => copyToClipboard(peftGeneratedFix)}
                    >
                      Copy Code <FaCopy />
                    </button>
                  </div>
                  <div className="code-content">
                    <SyntaxHighlighter
                      language="javascript"
                      style={nightOwl}
                      wrapLongLines={true}
                    >
                      {loading
                        ? "Generating fix..."
                        : peftGeneratedFix || "Generated fix will go here."}
                    </SyntaxHighlighter>
                  </div>
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
                      onClick={() => copyToClipboard(generatedFix)}
                    >
                      Copy Code <FaCopy />
                    </button>
                  </div>
                  <div className="code-content">
                    <SyntaxHighlighter
                      language="javascript"
                      style={nightOwl}
                      wrapLongLines={true}
                    >
                      {loading
                        ? "Generating fix..."
                        : generatedFix || "Generated fix will go here."}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
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

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default App;
