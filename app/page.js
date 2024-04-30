
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
import pointers from './api/db/content/C/do_not/pointers.js'



export default function Home() {

  // const code=
  // `def add(a,b):
  //    return a-b
  
  
  // print(add(34,23))
  // `
 
  return (
    <div className="main-page-container">
      
      <h3>Methods Explorer</h3>
      {/* <h4>Deployed on Amplify</h4>
      <h5>Version 4 </h5> */}
     <MethodExplorer></MethodExplorer>
     
     
    <ScrollUpButton></ScrollUpButton>
    </div>
  )
}
