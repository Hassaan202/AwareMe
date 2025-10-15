'use client';

import React from 'react';

export default function MarkdownRenderer({ content, isDarkBg = false }) {
  const textColor = isDarkBg ? 'text-white' : 'text-gray-800';

  const renderContent = () => {
    const lines = content.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBlockContent = [];
    let codeBlockLang = '';
    let listItems = [];
    let inList = false;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className={`list-disc list-inside space-y-1 my-2 ${textColor}`}>
            {listItems.map((item, idx) => (
              <li key={idx} className="ml-4">{parseInlineFormatting(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const parseInlineFormatting = (text) => {
      if (!text) return text;

      const parts = [];
      let currentText = text;
      let key = 0;

      // Handle bold (**text** or __text__)
      const boldRegex = /(\*\*|__)(.*?)\1/g;
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(currentText)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
          const beforeText = currentText.substring(lastIndex, match.index);
          parts.push(parseItalicAndCode(beforeText, key++));
        }
        // Add bold text
        parts.push(
          <strong key={`bold-${key++}`} className="font-bold">
            {parseItalicAndCode(match[2], key++)}
          </strong>
        );
        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < currentText.length) {
        parts.push(parseItalicAndCode(currentText.substring(lastIndex), key++));
      }

      return parts.length > 0 ? parts : currentText;
    };

    const parseItalicAndCode = (text, baseKey) => {
      const parts = [];
      let key = baseKey;

      // Handle inline code (`code`)
      const codeRegex = /`([^`]+)`/g;
      let lastIndex = 0;
      let match;

      while ((match = codeRegex.exec(text)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
          const beforeText = text.substring(lastIndex, match.index);
          parts.push(parseItalic(beforeText, key++));
        }
        // Add code
        parts.push(
          <code
            key={`code-${key++}`}
            className={`px-2 py-0.5 rounded font-mono text-sm ${
              isDarkBg ? 'bg-white/20 text-white' : 'bg-gray-200 text-red-600'
            }`}
          >
            {match[1]}
          </code>
        );
        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(parseItalic(text.substring(lastIndex), key++));
      }

      return parts.length > 0 ? parts : text;
    };

    const parseItalic = (text, baseKey) => {
      const parts = [];
      let key = baseKey;

      // Handle italic (*text* or _text_)
      const italicRegex = /([*_])(.*?)\1/g;
      let lastIndex = 0;
      let match;

      while ((match = italicRegex.exec(text)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
          parts.push(
            <span key={`text-${key++}`}>
              {text.substring(lastIndex, match.index)}
            </span>
          );
        }
        // Add italic text
        parts.push(
          <em key={`italic-${key++}`} className="italic">
            {match[2]}
          </em>
        );
        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(
          <span key={`text-${key++}`}>
            {text.substring(lastIndex)}
          </span>
        );
      }

      return parts.length > 0 ? parts : text;
    };

    lines.forEach((line) => {
      // Handle code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <div key={`code-${elements.length}`} className="my-3">
              <div className={`text-xs font-semibold mb-1 ${isDarkBg ? 'text-white/70' : 'text-gray-500'}`}>
                {codeBlockLang || 'Code'}
              </div>
              <pre className={`${isDarkBg ? 'bg-black/30' : 'bg-gray-900'} text-gray-100 p-4 rounded-lg overflow-x-auto`}>
                <code className="text-sm font-mono leading-relaxed">
                  {codeBlockContent.join('\n')}
                </code>
              </pre>
            </div>
          );
          codeBlockContent = [];
          codeBlockLang = '';
          inCodeBlock = false;
        } else {
          // Start code block
          flushList();
          codeBlockLang = line.trim().substring(3).trim();
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Handle headings
      if (line.startsWith('#### ')) {
        flushList();
        elements.push(
          <h4 key={`h4-${elements.length}`} className={`text-lg font-bold mt-3 mb-2 ${textColor}`}>
            {parseInlineFormatting(line.substring(5))}
          </h4>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${elements.length}`} className={`text-xl font-bold mt-3 mb-2 ${textColor}`}>
            {parseInlineFormatting(line.substring(4))}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${elements.length}`} className={`text-2xl font-bold mt-4 mb-2 ${textColor}`}>
            {parseInlineFormatting(line.substring(3))}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={`h1-${elements.length}`} className={`text-3xl font-bold mt-4 mb-3 ${textColor}`}>
            {parseInlineFormatting(line.substring(2))}
          </h1>
        );
      }
      // Handle bullet points (-, *, or numbered lists)
      else if (line.trim().match(/^[-*]\s/) || line.trim().match(/^\d+\.\s/)) {
        inList = true;
        const content = line.trim().replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '');
        listItems.push(content);
      }
      // Handle empty lines
      else if (line.trim() === '') {
        flushList();
        elements.push(<div key={`br-${elements.length}`} className="h-2" />);
      }
      // Regular text
      else {
        flushList();
        if (line.trim()) {
          elements.push(
            <p key={`p-${elements.length}`} className={`my-1 leading-relaxed ${textColor}`}>
              {parseInlineFormatting(line)}
            </p>
          );
        }
      }
    });

    // Flush any remaining list items
    flushList();

    return elements;
  };

  return <div className="markdown-content">{renderContent()}</div>;
}
