import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const Response = ({ text }) => {
    // State for tracking copied status for each code block
    const [copiedMap, setCopiedMap] = useState({});

    // Function to handle code copy with identifier
    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        console.log("Copied to clipboard");
        setCopiedMap((prev) => ({ ...prev, [id]: true }));
        setTimeout(() => {
            setCopiedMap((prev) => ({ ...prev, [id]: false }));
        }, 1500); // Reset after 1.5s
    };

    const processText = (inputText) => {
        if (!inputText) return "";

        // Replace \[ and \] with proper math delimiters for block math
        let processedText = inputText.replace(/\\?\\\[(.*?)\\?\\\]/gs, (match, formula) => {
            return `$$${formula.trim()}$$`;
        });

        // Replace \( and \) with proper math delimiters for inline math
        processedText = processedText.replace(/\\?\\\((.*?)\\?\\\)/gs, (match, formula) => {
            return `$${formula.trim()}$`;
        });

        return processedText;
    };

    const processedText = processText(text);

    return (
        <div className="response-container">
            <div className="px-4 my-4 text-white whitespace-pre-wrap break-words">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                        // Handle code blocks and inline code
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            const code = String(children).replace(/\n$/, "");
                            const id = `code-${Math.random().toString(36).substring(2, 9)}`;

                            return !inline && match ? (
                                <div className="relative my-4 rounded-md overflow-hidden">
                                    {/* Copy Button */}
                                    <button
                                        onClick={() => handleCopy(code, id)}
                                        className="absolute right-2 top-2 bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded text-sm transition-colors"
                                    >
                                        {copiedMap[id] ? "Copied!" : "Copy"}
                                    </button>
                                    <SyntaxHighlighter
                                        style={dracula}
                                        language={match[1]}
                                        PreTag="div"
                                        className="rounded-md"
                                        showLineNumbers={true}
                                        wrapLines={true}
                                        wrapLongLines={true}
                                        customStyle={{ margin: "0" }}
                                    >
                                        {code}
                                    </SyntaxHighlighter>
                                </div>
                            ) : (
                                <code
                                    className={`bg-gray-800 font-medium text-gray-200 px-1 py-0.5 rounded-md`}
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        },

                        // Handle paragraphs with consistent spacing
                        p: ({ node, ...props }) => <p className="my-2 leading-relaxed" {...props} />,

                        // Handle headings with consistent spacing
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-2" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold my-1" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold my-1" {...props} />,

                        // Handle lists with consistent spacing
                        ul: ({ node, ...props }) => <ul className="list-disc ml-6 my-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal ml-6 my-2" {...props} />,
                        li: ({ node, ...props }) => <li className="my-1" {...props} />,

                        // Handle block quotes with consistent spacing
                        blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-4 border-gray-500 pl-4 italic my-4 text-gray-300" {...props} />
                        ),

                        // Handle tables with consistent spacing
                        table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-3">
                                <table className="min-w-full border-collapse border border-gray-700" {...props} />
                            </div>
                        ),
                        thead: ({ node, ...props }) => <thead className="bg-gray-800" {...props} />,
                        tbody: ({ node, ...props }) => <tbody className="bg-gray-900" {...props} />,
                        tr: ({ node, ...props }) => <tr className="border-b border-gray-700" {...props} />,
                        th: ({ node, ...props }) => <th className="px-4 py-2 text-left" {...props} />,
                        td: ({ node, ...props }) => <td className="px-4 py-2" {...props} />,

                        // Handle links with minimal styling
                        a: ({ node, ...props }) => (
                            <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                        ),

                        // Handle images with consistent spacing
                        img: ({ node, ...props }) => (
                            <img className="max-w-full w-auto h-auto my-4 rounded-xl" {...props} alt={props.alt || "Image"} />
                        ),
                    }}
                >
                    {processedText}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default Response;