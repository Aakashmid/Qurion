
export const Question = ({ text }) => (
    <div className="  px-4">
        <div className="rounded-xl px-3 py-2 lg:py-3 lg:px-4  bg-gray-900 text-white w-fit">
            {text}
        </div>
    </div>
);






import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export const Response = ({ text }) => {
  // State to track copied status
  const [copied, setCopied] = useState(false);

  // Function to handle code copy
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
  };

  return (
    <div className="px-4">
      <div className="p-2 text-white whitespace-pre-wrap break-words">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <div className="relative">
                  {/* Copy Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent background color change
                      handleCopy(String(children));
                    }}
                    className="absolute right-2 top-2 bg-gray-950 hover:bg-gray-900 text-white px-2 py-1 rounded text-sm"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <SyntaxHighlighter
                    style={dracula}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md my-2"
                    wrapLines={true}
                    wrapLongLines={true}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={`${className} font-medium text-gray-300 px-1 rounded-md`} {...props}>
                  {children}
                </code>
              );
            },
            // Correctly render block math
            math: ({ value }) => (
              <div className="text-center my-2">
                <span dangerouslySetInnerHTML={{ __html: window.katex.renderToString(value) }} />
              </div>
            ),
            // Correctly render inline math
            inlineMath: ({ value }) => (
              <span className="px-1" dangerouslySetInnerHTML={{ __html: window.katex.renderToString(value) }} />
            ),
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
};
