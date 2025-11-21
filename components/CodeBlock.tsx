import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  label?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, label = "PROMPT" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl bg-stone-100 border border-stone-200 overflow-hidden my-4 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-stone-200/50 border-b border-stone-200">
        <span className="text-xs font-bold font-mono text-stone-500 tracking-wider">{label}</span>
        <button 
          onClick={handleCopy}
          className="text-xs flex items-center gap-1.5 text-stone-500 hover:text-brand-600 transition-colors focus:outline-none font-medium"
        >
          {copied ? (
            <>
              <span className="text-green-600">✓</span> Copied
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className="p-5 overflow-x-auto bg-white">
        <pre className="text-sm font-mono text-stone-700 whitespace-pre-wrap leading-relaxed">
          {code}
        </pre>
      </div>
    </div>
  );
};