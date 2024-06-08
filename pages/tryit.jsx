import DynamicAccordionExampleCode from '@/app/components/accordion/DynamicAccordionExampleCode'
import MermaidDiagram from '@/app/components/mermaid-diagram/MermaidDiagram'
import React from 'react'
import {code,mermaid,markdown} from '../app/api/db/content/C/general/permutations'

export default function tryit() {
   
    const mindMap=`
 mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectivness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
 `

 const mindMap2=`
 mindmap
    Root
        A[A]
        :::urgent large
        B(B)
        C((C))
 `

  return (
     <div>
     {/* <DynamicAccordionExampleCode
      data={['permutations','combinations']}
      width={'1200px'}></DynamicAccordionExampleCode> */}
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <MermaidDiagram chartDefinition={mindMap}></MermaidDiagram>
      <MermaidDiagram chartDefinition={mermaid}></MermaidDiagram>
      <br></br>
      <br></br>
     </div>
  )
}
