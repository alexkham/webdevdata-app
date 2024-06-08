// import React from 'react'
// import './CodeExample.css'
// import {code,mermaid,markdown} from '../../api/db/content/C/permutations'
// import AceEditorComponent from '../ace-editor/AceEditorComponent';
// import MermaidDiagram from '../mermaid-diagram/MermaidDiagram';
// import MarkdownComponent from '../markdown-component/MarkdownComponent';

// function CodeExample() {
    
//   return (
//     <>
//     <div className='outer-container'>
//       <div className='left'>
//       <AceEditorComponent
//         code={code}
//         fontSize={12}
//         mode={'python'}
//         theme={'twilight'}></AceEditorComponent>
//       </div>
//       <div className='right'>
//       <MermaidDiagram 
//       chartDefinition={mermaid}></MermaidDiagram>
//       </div>
    
//     </div>
//     <div>
//         <MarkdownComponent article={markdown}></MarkdownComponent>
//     </div>
//     </>
//   )
// }

// export default CodeExample
// 'use client'
// import React, { useState, useEffect } from 'react';
// import './CodeExample.css';
// import AceEditorComponent from '../ace-editor/AceEditorComponent';
// import MermaidDiagram from '../mermaid-diagram/MermaidDiagram';
// import MarkdownComponent from '../markdown-component/MarkdownComponent';

// function CodeExample({ fileName }) {
//   const [content, setContent] = useState({ code: '', mermaid: '', markdown: '' });

//   useEffect(() => {
//     async function fetchContent() {
//       try {
//         const module = await import(`../../api/db/content/C/${fileName}`);
//         setContent({ code: module.code, mermaid: module.mermaid, markdown: module.markdown });
//       } catch (error) {
//         console.error('Failed to load the content file:', error);
//       }
//     }
//     fetchContent();
//   }, [fileName]);

//   return (
//     <div>
//       <div className='outer-container'>
//         <div className='left'>
//           <AceEditorComponent
//             code={content.code}
//             fontSize={12}
//             mode={'python'}
//             theme={'twilight'} />
//         </div>
//         <div className='right'>
//           <MermaidDiagram 
//             chartDefinition={content.mermaid} />
//         </div>
//       </div>
//       <div>
//         <MarkdownComponent article={content.markdown} />
//       </div>
//       </div>
//   );
// }

// export default CodeExample;
// 'use client'
// import React, { useState, useEffect } from 'react';
// import './CodeExample.css';
// import AceEditorComponent from '../ace-editor/AceEditorComponent';
// import MermaidDiagram from '../mermaid-diagram/MermaidDiagram';
// import MarkdownComponent from '../markdown-component/MarkdownComponent';

// function CodeExample({ language,category,fileName }) {
//   const [content, setContent] = useState({title:'', code: '', mermaid: '', markdown: '' });

//   useEffect(() => {
//     async function fetchContent() {
//       try {
//         const module = await import(`../../api/db/content/${language}/${category}/${fileName}`);
//         setContent({title:module.title, code: module.code, mermaid: module.mermaid, markdown: module.markdown });
//       } catch (error) {
//         console.error('Failed to load the content file:', error);
//       }
//     }
//     fetchContent();
//   }, [fileName]);

//   // Function to handle scroll to markdown section
//   const scrollToMarkdown = () => {
//     const markdownSection = document.querySelector('.markdown');
//     markdownSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
// };

//   return (
   
//       <div className='outer-container'>
//        { content.title&&<div className='title-container'>
//         <h3>{content.title}</h3>
//         <div className='info' onClick={scrollToMarkdown}>
//                         ?
//                         <span className="tooltip">Click to read more</span>
//                     </div>
//         </div>}
//         <div className='upper-row'>
          
//         <div className='left'>
//           <AceEditorComponent
//             code={content.code}
//             fontSize={12}
//             mode={'python'}
//             theme={'twilight'} />
//         </div>
//         <div className='right'>
//           <MermaidDiagram 
//             chartDefinition={content.mermaid} />
//         </div>
        
//         </div>
     
//       <div className='markdown'>
//         <MarkdownComponent article={content.markdown} />
//       </div>
//       </div>
//   );
// }

// export default CodeExample;

'use client'
import React, { useState, useEffect } from 'react';
import './CodeExample.css';
import AceEditorComponent from '../ace-editor/AceEditorComponent';
import MermaidDiagram from '../mermaid-diagram/MermaidDiagram';
import MarkdownComponent from '../markdown-component/MarkdownComponent';

function CodeExample({ language, category, fileName }) {
  const [content, setContent] = useState({ title: '', code: '', mermaid: '', markdown: '' });

  useEffect(() => {
    async function fetchContent() {
      try {
        const contentModule = await import(`../../api/db/content/${language}/${category}/${fileName}`);
        setContent({
          title: contentModule.title,
          code: contentModule.code,
          mermaid: contentModule.mermaid,
          markdown: contentModule.markdown
        });
      } catch (error) {
        console.error('Failed to load the content file:', error);
      }
    }
    fetchContent();
  }, [fileName, language, category]);

  // Function to handle scroll to markdown section
  const scrollToMarkdown = () => {
    const markdownSection = document.querySelector('.markdown');
    markdownSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className='outer-container'>
      {content.title && (
        <div className='title-container'>
          <h3>{content.title}</h3>
          <div className='info' onClick={scrollToMarkdown}>
            ?
            <span className="tooltip">Click to read more</span>
          </div>
        </div>
      )}
      <div className='upper-row'>
        <div className='left'>
          <AceEditorComponent
            code={content.code}
            fontSize={12}
            mode={'python'}
            theme={'twilight'}
          />
        </div>
        <div className='right'>
          <MermaidDiagram chartDefinition={content.mermaid} />
        </div>
      </div>
      <div className='markdown'>
        <MarkdownComponent article={content.markdown} />
      </div>
    </div>
  );
}

export default CodeExample;

