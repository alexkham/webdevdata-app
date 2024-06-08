'use client'
import React, { useState, useEffect } from 'react';
import './CodeExample.css';
import AceEditorComponent from '../ace-editor/AceEditorComponent';
import MermaidDiagram from '../mermaid-diagram/MermaidDiagram';
import MarkdownComponent from '../markdown-component/MarkdownComponent';

function CodeExample2({ language, fileName, desiredTitle }) {
  const [content, setContent] = useState({ title: '', code: '', mermaid: '', markdown: '' });

  useEffect(() => {
    async function fetchContent() {
      try {
        // Dynamic import to fetch the JSON data array
        const module = await import(`../../api/db/content/${language}/examples/${fileName}.json`);
        const data = module.default; // Assuming the JSON is exported as default
        // Find the specific item by title
        const specificItem = data.find(item => item.title === desiredTitle);
        if (specificItem) {
          setContent(specificItem); // Set the found item to state
        } else {
          console.error('No item found with the specified title:', desiredTitle);
        }
      } catch (error) {
        console.error('Failed to load the content JSON:', error);
      }
    }
    fetchContent();
  }, [language, fileName, desiredTitle]); // Dependency array includes desiredTitle
  

  // Function to handle scroll to markdown section
  const scrollToMarkdown = () => {
    const markdownSection = document.querySelector('.markdown');
    markdownSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

  return (
    <div className='outer-container'>
      { content.title&&<div className='title-container'>
        <h3>{content.title}</h3>
        <div className='info' onClick={scrollToMarkdown}>
                        ?
                        <span className="tooltip">Click to read more</span>
                    </div>
        </div>}
      <div className='upper-row'>
        <div className='left'>
          <AceEditorComponent
            code={content.code}
            fontSize={12}
            mode={'python'}
            theme={'twilight'} />
        </div>
        <div className='right'>
          <MermaidDiagram
            chartDefinition={content.mermaid} />
        </div>
      </div>
      <div className='markdown'>
        <MarkdownComponent article={content.markdown} />
      </div>
    </div>
  );
}

export default CodeExample2;
