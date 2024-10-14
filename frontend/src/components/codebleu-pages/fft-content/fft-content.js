import React, { useEffect, useState } from "react";
import CodeFormat from "../CodeFormat";
import "./FFTContent.scss";

function FFTContent() {
  const [generatedFix, setGeneratedFix] = useState("");
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
    const storedGeneratedFix = localStorage.getItem("generatedFix");
    if (storedGeneratedFix) {
      setGeneratedFix(storedGeneratedFix);
    }

    const storedReferenceCode = localStorage.getItem("fftReferenceCode");
    if (storedReferenceCode) {
      setReferenceCode(storedReferenceCode);
    }

    const storedResults = localStorage.getItem("fftResults");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }

    const handleStorageChange = (event) => {
      if (event.key === "generatedFix") {
        setGeneratedFix(event.newValue);
      }
      if (event.key === "fftReferenceCode") {
        setReferenceCode(event.newValue);
      }
      if (event.key === "fftResults") {
        setResults(JSON.parse(event.newValue));
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
    localStorage.setItem("fftReferenceCode", newValue);
  };

  const extractCodeFromFix = (generatedFix) => {
    const codeParts = generatedFix.match(/```(.*?)```/gs);
    if (codeParts) {
      return codeParts
        .map((part) => part.replace(/```/g, "").trim())
        .join("\n");
    }
    return "";
  };

  const computeCodebleu = async () => {
    setLoading(true);
    localStorage.setItem("fftLoading", true);

    try {
      const codeForComputation = extractCodeFromFix(generatedFix);

      const response = await fetch("http://localhost:5004/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: codeForComputation,
          reference_code: referenceCode,
        }),
      });

      if (!response.ok) {
        console.error("Fetch Error:", response.statusText);
        throw new Error("Failed to compute CodeBLEU");
      }

      const data = await response.json();
      setResults(data); // Update results state
      localStorage.setItem("fftResults", JSON.stringify(data)); // Update local storage
    } catch (error) {
      console.error(error);
      alert("Error computing CodeBLEU. Please try again.");
    } finally {
      setLoading(false);
      localStorage.setItem("fftLoading", false);
    }
  };

  return (
    <div className="fft-content">
      <div className="fft-layout">
        <div className="generated-fix">
          <h2>Generated Fix</h2>
          <CodeFormat generatedFix={generatedFix} />
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
        <h2>Results:</h2>
        {results.codebleu ? (
          <>
            <p>
              Ngram Match Score:{" "}
              {(results.codebleu.ngram_match_score * 100).toFixed(2)}%
            </p>
            <p>
              Weighted Ngram Match Score:{" "}
              {(results.codebleu.weighted_ngram_match_score * 100).toFixed(2)}%
            </p>
            <p>
              Syntax Match: {(results.codebleu.syntax_match * 100).toFixed(2)}%
            </p>
            <p>
              Semantic Match:{" "}
              {(results.codebleu.semantic_match * 100).toFixed(2)}%
            </p>
            <p>
              CodeBLEU Score:{" "}
              {(results.codebleu.codebleu_score * 100).toFixed(2)}%
            </p>
          </>
        ) : (
          <p>No results yet. Please compute CodeBLEU to see the results.</p>
        )}
      </div>
    </div>
  );
}

export default FFTContent;
