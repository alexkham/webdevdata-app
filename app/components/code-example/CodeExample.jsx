import React from 'react'
import './CodeExample.css'
import {code,mermaid,markdown} from '../../api/db/content/C/permutations'
import AceEditorComponent from '../ace-editor/AceEditorComponent';
import MermaidDiagram from '../mermaid-diagram/MermaidDiagram';
import MarkdownComponent from '../markdown-component/MarkdownComponent';

function CodeExample() {
    
  return (
    <>
    <div className='outer-container'>
      <div className='left'>
      <AceEditorComponent
        code={code}
        fontSize={12}
        mode={'python'}
        theme={'twilight'}></AceEditorComponent>
      </div>
      <div className='right'>
      <MermaidDiagram 
      chartDefinition={mermaid}></MermaidDiagram>
      </div>
    
    </div>
    <div>
        <MarkdownComponent article={markdown}></MarkdownComponent>
    </div>
    </>
  )
}

export default CodeExample