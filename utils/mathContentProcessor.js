// utils/contentProcessor.js
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export const processMathContent = (content) => {
  if (!content) return null;

  const svgs = [];
  const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
    svgs.push(match);
    return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
  });

  const lines = contentWithPlaceholders.split('\n');
  let inList = false;
  let currentListItem = [];
  const elements = [];

  const processPart = (part, index) => {
    if (part.startsWith('__SVG_PLACEHOLDER_')) {
      const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
      return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
    } else if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
    } else if (part.startsWith('$$') && part.endsWith('$$')) {
      return <BlockMath key={`block-math-${index}`} math={part.slice(2, -2)} />;
    } else if (part.startsWith('$') && part.endsWith('$')) {
      return <InlineMath key={`inline-math-${index}`} math={part.slice(1, -1)} />;
    } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
      if (linkMatch) {
        const [, text, url] = linkMatch;
        return <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
      }
    } else if (part.trim().startsWith('<') && part.trim().endsWith('>')) {
      return <div key={`html-${index}`} dangerouslySetInnerHTML={{ __html: part }} />;
    }
    return part;
  };

  lines.forEach((line, lineIndex) => {
    const tabCount = line.match(/^\t*/)[0].length;
    const trimmedLine = line.replace(/^\t+/, '');
    
    const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\))/);
    const processedParts = parts.map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

    if (trimmedLine.startsWith('- ')) {
      if (inList && currentListItem.length > 0) {
        elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
        currentListItem = [];
      }
      inList = true;
      currentListItem.push(
        <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
          {processedParts.slice(1)}
        </span>
      );
    } else if (inList) {
      if (trimmedLine === '') {
        elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
        currentListItem = [];
        inList = false;
        elements.push(<br key={`br-${elements.length}`} />);
      } else {
        currentListItem.push(<br key={`br-${currentListItem.length}`} />);
        currentListItem.push(
          <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
            {processedParts}
          </span>
        );
      }
    } else {
      elements.push(
        <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
          {processedParts}
        </span>
      );
      if (lineIndex < lines.length - 1) {
        elements.push(<br key={`br-${elements.length}`} />);
      }
    }
  });

  if (inList && currentListItem.length > 0) {
    elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
  }

  const hasListItems = elements.some(el => el.type === 'li');
  return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
};