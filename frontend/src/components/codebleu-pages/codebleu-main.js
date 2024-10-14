import React, { useEffect, useState } from "react";
import bgImage from "../../components/bg-image.png";
import FFTContent from "./FFT Content/FFTContent";
import PEFTContent from "./PEFT Content/PEFTContent";
import "../../components/codebleu page/Codebleu.scss";

function Codebleu() {
  const [generatedFix, setGeneratedFix] = useState(""); // state for FFT
  const [peftGeneratedFix, setPeftGeneratedFix] = useState(""); //state for PEFT
  const [selectedButton, setSelectedButton] = useState("peft"); // Default button state

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
        <div className="codebleu-header-container">
          <div className="codebleu-text-container">
            <h1>Codeblue Computation</h1>
            <p>
              Ngram Match Score, Weighted Ngram Match Score, Syntax Match,
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
