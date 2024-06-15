
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
import TreeStructure from "./components/tree-structure/TreeItem";





export default function Home() {

  
 
  return (
    <div className="main-page-container">
      
    
     <br></br>
     {/* <DynamicAccordionCode
     data={arrays}></DynamicAccordionCode> */}
     <br></br>
     <h1>Welcome to Webdevdata</h1>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     {/* <TreeStructure></TreeStructure> */}
     <br></br>
     <br></br>
     {/* <CollapsibleTree data={pandas}></CollapsibleTree> */}
     {/* <MermaidDiagram chartDefinition={pandas}></MermaidDiagram> */}
     <br></br>
    <ScrollUpButton ></ScrollUpButton>
    </div>
  )
}
