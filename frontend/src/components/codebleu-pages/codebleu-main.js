import React, { useEffect, useState } from "react";
import bgImage from "../../components/bg-image.png";
import FFTContent from "./fft-content/fft-content";
import PEFTContent from "./peft-content/peft-content";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./codebleu.scss";

function Codebleu() {
  const [generatedFix, setGeneratedFix] = useState(""); // state for FFT
  const [peftGeneratedFix, setPeftGeneratedFix] = useState(""); //state for PEFT
  const [selectedButton, setSelectedButton] = useState("peft"); // Default button state
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/unixcoder"); // Redirect to login page
  };

  useEffect(() => {
    const storedGeneratedFix = localStorage.getItem("generatedFix");
    const storedPeftGeneratedFix = localStorage.getItem("peftGeneratedFix");
    if (storedGeneratedFix) {
      setGeneratedFix(storedGeneratedFix);
    }
    if (storedPeftGeneratedFix) {
      setPeftGeneratedFix(storedPeftGeneratedFix); // Set PEFT fix
    }

    const handleStorageChange = (event) => {
      if (event.key === "generatedFix") {
        setGeneratedFix(event.newValue);
      } else if (event.key === "peftGeneratedFix") {
        setPeftGeneratedFix(event.newValue); // Update PEFT fix on storage change
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
