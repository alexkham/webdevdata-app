
import AceEditorComponent from "./components/ace-editor/AceEditorComponent";
import GridGenerator from "./components/grid-generator/GridGenerator";
import MethodExplorer from "./components/method-explorer/MethodExplorer";
import {code,mermaid, markdown} from './api/db/content/C/first_content'
import ScrollUpButton from "./components/scroll-up-button/ScrollUpButton";
import MermaidDiagram from "./components/mermaid-diagram/MermaidDiagram";
import MarkdownComponent from "./components/markdown-component/MarkdownComponent";
import CodeExample from "./components/code-example/CodeExample";
import SimpleCodeExample from "./components/code-example/SimpleCodeExample";
import DynamicAccordionCode from "./components/accordion/DynamicAccordionCode";
import pointers from './api/db/content/C/do_not/pointers.json'
import arrays from './api/db/content/C/do_not/arrays.json'
import integers from './api/db/content/C/do_not/integers.json'
import './globals.css'
import Accordion from "./components/accordion/Accordion";
import AccordionCheckBox from "./components/accordion/AccordionCheckBox";
import AccordionToggle2 from "./components/accordion/AccordionToggle2";
import DynamicAccordionExampleCode from "./components/accordion/DynamicAccordionExampleCode";
import ListSplitVisualizer from "./components/python-list-slicing/ListSplitVisualizer";





export default function Home() {
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
  // const code=
  // `def add(a,b):
  //    return a-b
  
  
  // print(add(34,23))
  // `
 
  return (
    <div className="main-page-container">
      
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     {/* <CodeExample
     language={'c'}
     category={'do_not'}
     fileName={'arrays.json'}></CodeExample> */}
     <br></br>
     <br></br>
     {/* <DynamicAccordionCode
     data={arrays}></DynamicAccordionCode> */}
     <br></br>
     <br></br>
     <br></br>
    <ScrollUpButton ></ScrollUpButton>
    </div>
  )
}
