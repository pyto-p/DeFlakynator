import React, { useState } from "react";
import bgImage from "../bg-image.png";
import FFTContent from "./fft-content/FFTContent";
import PEFTContent from "./peft-content/PEFTContent";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Codebleu.scss";

function Codebleu() {
  const [selectedButton, setSelectedButton] = useState("peft"); // Default button state
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/unixcoder"); // Redirect to login page
  };

  // Function to handle button clicks
  const handleButtonClick = (buttonType) => {
    console.log(`Clicked button: ${buttonType}`); // Debugging
    console.log("Selected button state:", selectedButton); // Add this line
    setSelectedButton(buttonType);
  };

  return (
    <div
      key={selectedButton}
      style={{
        height: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="codebleu-container">
        <button className="back-btn" onClick={handleBack}>
          <FaArrowLeft className="back-icon" />
          Back
        </button>
        <div className="codebleu-header-container">
          <div className="codebleu-text-container">
            <h1>CodeBLEU Computation</h1>
            <p>
              N-Gram Match Score, Weighted N-Gram Match Score, Syntax Match,
              Semantic Match, & CodeBLEU Score
            </p>
          </div>
          <div className="codebleu-choice-buttons">
            <button
              className={`codebleu-peft-button ${
                selectedButton === "peft" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("peft")}
            >
              <span>PEFT</span>
            </button>
            <button
              className={`codebleu-fft-button ${
                selectedButton === "fft" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("fft")}
            >
              <span>FFT</span>
            </button>
          </div>
        </div>
        <div className="codebleu-checker-area">
          {selectedButton === "peft" && <PEFTContent />}
          {selectedButton === "fft" && <FFTContent />}
        </div>
      </div>
    </div>
  );
}

export default Codebleu;
