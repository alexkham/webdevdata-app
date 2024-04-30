import React from 'react'
//import {code,mermaid,markdown} from '../../api/db/content/C/permutations'
import {code,mermaid, markdown} from '../../api/db/content/C/first_content'
import AceEditorComponent from '../ace-editor/AceEditorComponent';
import MermaidDiagram from '../mermaid-diagram/MermaidDiagram';
import MarkdownComponent from '../markdown-component/MarkdownComponent';
import './CodeExample.css'

function SimpleCodeExample({code, article, width}) {
  return (
    <div className='general-block' style={{width:`${width}`}}>
        <div className='code-block'>
      <AceEditorComponent
        code={code}
        fontSize={14}
        mode={'python'}
        theme={'twilight'}></AceEditorComponent>
        </div>
       <div className='text-block'>
        <br></br>
        <br></br>
        <br></br>
        <MarkdownComponent article={article}></MarkdownComponent>
       </div>
    </div>
  )
}

export default SimpleCodeExample