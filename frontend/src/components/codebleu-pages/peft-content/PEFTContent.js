import React, { useEffect, useState } from "react";
import CodeFormat from "./PEFTCodeFormat";
import "../CodebleuPage.scss";

function PEFTContent() {
  const [peftGeneratedFix, setPeftGeneratedFix] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [results, setResults] = useState({
    codebleu: {
      ngram_match_score: 0,
      weighted_ngram_match_score: 0,
      syntax_match: 0,
      semantic_match: 0,
      codebleu_score: 0,
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedGeneratedFix = localStorage.getItem("peftGeneratedFix");
    if (storedGeneratedFix) {
      setPeftGeneratedFix(storedGeneratedFix);
    }

    const storedReferenceCode = localStorage.getItem("peftReferenceCode");
    if (storedReferenceCode) {
      setReferenceCode(storedReferenceCode);
    }

    const storedResults = localStorage.getItem("peftResults");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }

    const handleStorageChange = (event) => {
      if (event.key === "peftGeneratedFix") {
        setPeftGeneratedFix(event.newValue);
      }
      if (event.key === "peftReferenceCode") {
        setReferenceCode(event.newValue);
      }
      if (event.key === "peftResults") {
        setResults(JSON.parse(event.newValue));
      }
      if (event.key === "peftLoading") {
        setLoading(event.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleReferenceCodeChange = (event) => {
    const newValue = event.target.value;
    setReferenceCode(newValue);
    localStorage.setItem("peftReferenceCode", newValue);
  };

  const extractCodeFromFix = (peftGeneratedFix) => {
    const codeParts = peftGeneratedFix.match(/```(.*?)```/gs);
    if (codeParts) {
      return codeParts
        .map((part) => part.replace(/```/g, "").trim())
        .join("\n");
    }
    return "";
  };

  const computeCodebleu = async () => {
    setLoading(true);
    localStorage.setItem("peftLoading", true);
  
    try {
      const codeForComputation = extractCodeFromFix(peftGeneratedFix);
  
      // Send the generated fix and reference code to compute CodeBLEU
      const response = await fetch("http://localhost:5005/api/compute_codebleu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          predicted_code: codeForComputation,  // Use the already generated fix
          reference_code: referenceCode,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Fetch Error:", response.statusText, errorData);
        throw new Error(errorData.error || "Failed to compute CodeBLEU");
      }
  
      const data = await response.json();
      console.log("New CodeBLEU Results:", data);
  
      setResults(data);
      localStorage.setItem("peftResults", JSON.stringify(data));
  
    } catch (error) {
      console.error(error);
      alert("Error computing CodeBLEU. Please try again.");
    } finally {
      setLoading(false);
      localStorage.setItem("peftLoading", false);
    }
  };  

  return (
    <div className="fft-content">
      <div className="fft-layout">
        <div className="generated-fix">
          <h2>Generated Fix</h2>
          <CodeFormat peftGeneratedFix={peftGeneratedFix} />
        </div>
        <div className="reference-input">
          <h2>Reference Code</h2>
          <textarea
            value={referenceCode}
            onChange={handleReferenceCodeChange}
            rows={10}
            placeholder="Enter your reference code here..."
          />
          <button onClick={computeCodebleu} disabled={loading}>
            {loading ? "Computing..." : "Compute CodeBLEU"}
          </button>
        </div>
      </div>

      <div className="results">
        <h2>CodeBLEU Score: 
        {" "}
        {(results.codebleu.codebleu_score * 100).toFixed(2)}%
        </h2>
        {results.codebleu ? (
          <>
            <p>
              N-Gram Match Score:{" "}
              {(results.codebleu.ngram_match_score * 100).toFixed(2)}%
            </p>
            <p>
              Weighted N-Gram Match Score:{" "}
              {(results.codebleu.weighted_ngram_match_score * 100).toFixed(2)}%
            </p>
            <p>
              Syntax Match: {(results.codebleu.syntax_match * 100).toFixed(2)}%
            </p>
            <p>
              Semantic Match:{" "}
              {(results.codebleu.semantic_match * 100).toFixed(2)}%
            </p>
          </>
        ) : (
          <p>No results yet. Please compute CodeBLEU to see the results.</p>
        )}
      </div>
    </div>
  );
}

export default PEFTContent;
