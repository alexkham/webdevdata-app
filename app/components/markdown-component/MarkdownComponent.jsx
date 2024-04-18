import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';  // Ensure styles are applied

const MarkdownComponent = ({ article }) => {
  return (
    
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
    >
      {article}
    </ReactMarkdown>
    
  );
};

export default MarkdownComponent;
