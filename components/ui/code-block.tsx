"use client";
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageLabel = (lang: string) => {
    const labels: { [key: string]: string } = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'csharp': 'C#',
      'php': 'PHP',
      'ruby': 'Ruby',
      'go': 'Go',
      'rust': 'Rust',
      'swift': 'Swift',
      'kotlin': 'Kotlin',
      'html': 'HTML',
      'css': 'CSS',
      'scss': 'SCSS',
      'json': 'JSON',
      'xml': 'XML',
      'yaml': 'YAML',
      'markdown': 'Markdown',
      'bash': 'Bash',
      'shell': 'Shell',
      'sql': 'SQL',
      'text': 'Text'
    };
    return labels[lang.toLowerCase()] || lang.toUpperCase();
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden my-4 border border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <span className="text-sm text-gray-300 font-medium">
          {getLanguageLabel(language)}
        </span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-all duration-200 border border-gray-600 hover:border-gray-500"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: '#000000',
            fontSize: '14px',
            lineHeight: '1.5',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
          }}
          showLineNumbers={code.split('\n').length > 10}
          lineNumberStyle={{
            color: '#6b7280',
            paddingRight: '1rem',
            minWidth: '3rem'
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
