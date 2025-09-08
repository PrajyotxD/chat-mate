"use client";
import { CodeBlock } from './code-block';

interface MessageContentProps {
  content: string;
}

export function MessageContent({ content }: MessageContentProps) {
  const parseContent = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'text',
        content: match[2].trim()
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }

    return parts;
  };

  const parts = parseContent(content);

  return (
    <div>
      {parts.map((part, index) => (
        <div key={index}>
          {part.type === 'text' ? (
            <p className="whitespace-pre-wrap leading-relaxed">
              {part.content}
            </p>
          ) : (
            <CodeBlock code={part.content} language={part.language} />
          )}
        </div>
      ))}
    </div>
  );
}
