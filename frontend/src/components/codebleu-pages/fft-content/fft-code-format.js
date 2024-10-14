import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeContent = ({ generatedFix, loading }) => {
  return (
    <div className={`code-content ${loading ? "loading-active" : ""}`}>
      {loading ? (
        <p className="loading-text">Generating fix...</p>
      ) : (
        <>
          {generatedFix ? (
            <>
              {generatedFix
                .split(
                  /(\/\/.*|\/\*[\s\S]*?\*\/|```[\s\S]*?```|`[^`]*`)/ // Removed explanation handling regex
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
                    const codeWithoutLanguage = codeText.replace(/^\S+\n/, ""); // Remove the language identifier
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
                  // Render code inline (single backticks `...`)
                  else if (
                    part.trim().startsWith("`") &&
                    part.trim().endsWith("`")
                  ) {
                    const inlineCode = part.slice(1, -1).trim(); // Remove single backticks
                  }
                  // Ignore other parts (explanations or plain text)
                  return null;
                })}
            </>
          ) : (
            <p>Generated fix will go here.</p>
          )}
        </>
      )}
    </div>
  );
};

export default CodeContent;
