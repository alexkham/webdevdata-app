'use client'
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
import VisualizeLambda from "./components/lambda-visualization/VisualizeLambda";
import TwoDimArray from "./components/python-list-slicing/TwoDimArray";
import TwoDimArray2 from "./components/python-list-slicing/TwoDimArray2";
import TwoDimSlicingInputs from "./components/python-list-slicing/TwoDimSlicingInputs";
import TwoDimListSplitVisualizer from "./components/python-list-slicing/TwoDimSplitVisualizer";
import data from './api/db/developement/c/functions.json'
import FunctionList from "./components/function-list/FunctionList";
import pythonData from './api/db/developement/python/functions.json'
import PythonFunctionsList from "./components/function-list/PythonFunctionsList";





export default function Home() {



  const exampleData = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [7, 8, 9],
    [7, 8, 9],
    [7, 8, 9],
    
    
  ];
  
  const highlightedIndices = ['0-1', '1-1', '2-1'];
  
    const startRow = 0;
    const stopRow = 10;
    const stepRow = 2;
    const startCol = 1;
    const stopCol = 5;
    const stepCol = 1;

    const dummySetter = () => {};

  
 
  return (
    <div className="main-page-container">
      
    
     <br></br>
     {/* <DynamicAccordionCode
     data={arrays}></DynamicAccordionCode> */}
     <br></br>
     <h1>Welcome to Webdevdata</h1>
     {/* <TwoDimListSplitVisualizer></TwoDimListSplitVisualizer> */}
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     {/* <FunctionList data={data}></FunctionList> */}
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     {/* <TwoDimArray  data={exampleData} 
     highlightedIndices={highlightedIndices} 
     shouldHighlight={true}></TwoDimArray> */}
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <p>----------------------------------------------------------</p>
     <br></br>
     <br></br>
     {/* <PythonFunctionsList data={pythonData}></PythonFunctionsList> */}
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     {/* <TwoDimArray2  data={exampleData} 
     highlightedIndices={highlightedIndices} 
     shouldHighlight={true}></TwoDimArray2> */}



     <br></br>
     {/* <VisualizeLambda></VisualizeLambda> */}
     <br></br>
     <br></br>
     {/* <TreeStructure></TreeStructure> */}
     <br></br>
     {/* <TwoDimArray2
     highlightedIndices={highlightedIndices} 
     shouldHighlight={true}
     ></TwoDimArray2> */}
     <br></br>
     <br></br>
     <br></br>
     {/* <TwoDimSlicingInputs
                startRow={startRow} stopRow={stopRow} stepRow={stepRow}
                setStartRow={dummySetter} setStopRow={dummySetter} setStepRow={dummySetter}
                startCol={startCol} stopCol={stopCol} stepCol={stepCol}
                setStartCol={dummySetter} setStopCol={dummySetter} setStepCol={dummySetter}
            /> */}
     <br></br>
     <br></br>
     {/* <CollapsibleTree data={pandas}></CollapsibleTree> */}
     {/* <MermaidDiagram chartDefinition={pandas}></MermaidDiagram> */}
     <br></br>
    <ScrollUpButton ></ScrollUpButton>
    </div>
  )
}
