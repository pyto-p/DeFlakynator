import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeContent = ({ generatedFix, loading }) => {
  return (
    <>
      <div className={`code-content ${loading ? "loading-active" : ""}`}>
        {loading ? (
          <p className="loading-text">Generating fix...</p>
        ) : (
          <>
            {generatedFix ? (
              <>
                {generatedFix
                  .split(
                    /(\/\/.*|\/\*[\s\S]*?\*\/|\*\*\*.*?\*\*\*|```[\s\S]*?```|`[^`]*`)/
                  )
                  .map((part, index) => {
                    // Comment handling
                    if (
                      part.trim().startsWith("//") ||
                      part.trim().startsWith("/*")
                    ) {
                      return (
                        <span
                          key={`comment-${index}`}
                          style={{
                            color: "gray",
                            fontStyle: "italic",
                          }}
                        >
                          {part}
                        </span>
                      );
                    }
                    // Code enclosed in triple backticks (```...```)
                    else if (
                      part.trim().startsWith("```") &&
                      part.trim().endsWith("```")
                    ) {
                      const codeText = part.slice(3, -3).trim(); // Remove the backticks
                      const codeWithoutLanguage = codeText.replace(
                        /^\S+\n/,
                        ""
                      ); // Remove the language identifier
                      return (
                        <SyntaxHighlighter
                          key={`code-${index}`}
                          language="javascript"
                          style={nightOwl}
                          wrapLongLines={true}
                        >
                          {codeWithoutLanguage}
                        </SyntaxHighlighter>
                      );
                    }
                  })}
              </>
            ) : (
              <p>Generated fix will go here.</p>
            )}
          </>
        )}
      </div>
      {/* Explanation outside code-content */}
      <div className="code-explanation">
        {generatedFix &&
          generatedFix
            .split(
              /(\/\/.*|\/\*[\s\S]*?\*\/|\*\*\*.*?\*\*\*|```[\s\S]*?```|`[^`]*`)/ // Handle comments, explanations, triple and single backticks
            )
            .map((part, index) => {
              // Explanation text (***...***)
              if (
                (part.trim().startsWith("***") &&
                  part.trim().endsWith("***")) ||
                part.trim().endsWith("**")
              ) {
                const explanationText = part.replace(/\*\*\*/g, ""); // Remove the *** markers
                return (
                  <span
                    key={`explanation-${index}`}
                    style={{ fontWeight: "bold", color: "white" }}
                  >
                    {explanationText}
                  </span>
                );
              }
              // Ignore text enclosed with triple backticks (```...```)
              else if (
                part.trim().startsWith("```") &&
                part.trim().endsWith("```")
              ) {
                return null;
              }
              // Inline code (`...`)
              else if (
                part.trim().startsWith("`") &&
                part.trim().endsWith("`") &&
                !part.trim().startsWith("```")
              ) {
                const codeText = part.slice(1, -1).trim(); // Remove single backticks
                return (
                  <span
                    key={`inline-code-${index}`}
                    style={{ fontWeight: "bold", color: "white" }}
                  >
                    {codeText}
                  </span>
                );
              }
              // Render all other plain text
              else {
                return <span key={`plain-text-${index}`}>{part}</span>;
              }
            })}
      </div>
    </>
  );
};

export default CodeContent;
