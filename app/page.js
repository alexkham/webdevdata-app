
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
import Carousel from "./components/simple-carousel/Carousel";
import LanguageButtons from "./components/language-buttons/LanguageButtons";
import dynamic from 'next/dynamic';
import ClientCarousel from "./components/simple-carousel/ClientCarousel";
import GenericTable from "./components/generic-table/GenericTable";
import asciiData from './api/db/tables/ascii_data.json'
import AsciiConverter from "./components/converters/AsciiConverter";
import JsonConverter from "./components/converters/JsonConverter";
import CssUnitsConverter from "./components/converters/CssUnitsConverter";
import FunctionDetails from "./components/function-details/FunctionDetails";
import functionD from './api/db/developement/c/functions_new.json'

import pythonFunctionData from '../app/api/db/developement/python/functions_new.json'
import PythonFunctionDetails from "./components/function-details/PythonFunctionDetails";
import CSSBeautifier from "./components/css-minifier/CSSBeautifier";
import CaseConverter from "./components/case-converter/CaseConverter";
//import PythonFunctionDetails from "../app/components/function-details/PythonFunctionDetails";


// const Carousel = dynamic(() => import('./components/simple-carousel/Carousel'), {
//   loading: () => <p>Loading...</p>,
//   ssr: false
// });

// export async function getStaticProps() {
//   // Fetch your slides data here
//   const slidesData = [
//     {
//         image: "/explore.png",
//         title: "Functions Explorer",
//         text: "Explore C Standard Library Functions",
//         link: "/c-programming/functions"
//     },
//     {
//         image: "/prohibited.webp",
//         title: "Slide 2",
//         text: "This is the second slide",
//         link: "/c-programming/things-not-to-do"
//     },
    
//   ];


//   return {
//     props: {
//       slidesData,
//     },
//     // Revalidate every hour
//     revalidate: 3600,
//   };
// }

// async function getSlideData() {
//   // In a real application, you might fetch this data from an API
//   // For now, we'll just return the static data
//   return [
//     {
//       image: "/explore.png",
//       title: "Functions Explorer",
//       text: "Explore C Standard Library Functions",
//       link: "/c-programming/functions"
//   },
//   {
//       image: "/prohibited.webp",
//       title: "Slide 2",
//       text: "This is the second slide",
//       link: "/c-programming/things-not-to-do"
//   },
  
    
//   ];
// }
// This function acts similarly to getStaticProps
// export async function loader() {
//   const response = await fetch('https://api.example.com/slides');
//   const slides = await response.json();
  
//   return {
//       props: {
//           slides,
//       },
//   };
// }



export default async function Home({slides}) {
  
//  const asciiData=[
  
//     {
//       "DEC": 0,
//       "OCT": 0,
//       "HEX": "00",
//       "BIN": 0,
//       "Symbol": "\u2400",
//       "HTML Number": "&#00;",
//       "HTML Name": null,
//       "Description": "Null character"
//     },
//     {
//       "DEC": 1,
//       "OCT": 1,
//       "HEX": "01",
//       "BIN": 1,
//       "Symbol": "\u2401",
//       "HTML Number": "&#01;",
//       "HTML Name": null,
//       "Description": "Start of Heading"
//     },
    
  
  
//  ]
 
   
  const slidesData = [
    {
        image: "/pexels-element5-1370295.jpg",
        title: "C Standard Library Functions Explorer",
        text: "Explore C Standard Library Functions with comprehensive insights and detailed breakdowns.",
        link: "/c-programming/functions"
    },
    {
        image: "/do-not-enter2.jpg",
        title: "Things Not to Do in C Language",
        text: "Common pitfalls and mistakes that programmers often encounter when working with C .",
        link: "/c-programming/things-not-to-do"
    },
    
  ];


  const languages = [
    
    { title: 'Python', color: '#336a99', logo: '/python-logo.svg', url: '/python' },
    { title: 'C Programming', color: '#007bff', logo: '/32px-C_Programming_Language.svg.png', url: '/c-programming' },
    
  ];

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

    const pythonData=pythonFunctionData[1]
 
  return (
    <div className="main-page-container">
      
    
     
     {/* <DynamicAccordionCode
     data={arrays}></DynamicAccordionCode> */}
    
     <h1>Welcome to Webdevdata</h1>
     {/* <TwoDimListSplitVisualizer></TwoDimListSplitVisualizer> */}
     <br></br>
     <div className='carousel-container' style={{ width: '100%', margin: '0 auto', height: '400px', display: 'flex' }}>
        <Carousel
          slides={slidesData}
          classN="my-carousel"
          autoPlayInterval={10000}
          width={65}
        />

         {/* <div style={{ width: '65%', backgroundColor: 'lightgray', padding: '20px' }}>
          <h2>{slidesData[0].title}</h2>
          <p>{slidesData[0].text}</p>
          <img src={slidesData[0].image} alt={slidesData[0].title} style={{maxWidth: '100%', maxHeight: '200px'}} />
        </div> */}
        <div style={{ width: '35%', paddingLeft: '20px', border:'solid 1px gray', marginLeft:'10px' }}>
          <LanguageButtons languages={languages} />
        </div>
      </div>
     <br></br>
     {/* <div className='carousel-container' style={{ width: '100%', margin: '0 auto', height: '350px', display: 'flex' }}>
      <Carousel
        slides={slidesData}
        classN="my-carousel"
        autoPlayInterval={10000}
        width={65}
      />
      <div style={{ width: '35%', paddingLeft: '20px',
         border:'solid 1px gray',marginLeft:'10px' }}>
        <LanguageButtons languages={languages} />
      </div>
    </div> */}
     <br></br>
     <br></br>
     <br></br>
     {/* <FunctionList data={data}></FunctionList> */}
     <br></br>
     <br></br>
     <br></br>
     {/* <h1>JSON ⇄ XML Converter</h1>
     <JsonConverter></JsonConverter> */}
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     {/* <CssUnitsConverter></CssUnitsConverter> */}
     {/* <TwoDimArray  data={exampleData} 
     highlightedIndices={highlightedIndices} 
     shouldHighlight={true}></TwoDimArray> */}
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     {/* <p>----------------------------------------------------------</p>
     <br></br> */}
     <br></br>
     {/* <PythonFunctionsList data={pythonData}></PythonFunctionsList> */}
     <br></br>
     <br></br>
     {/* <FunctionDetails functionData={functionD[3]}></FunctionDetails> */}
     <br></br>
     <div >
     {/* <GenericTable data={asciiData}></GenericTable> */}
     </div>
     <br></br>
     {/* <TwoDimArray2  data={exampleData} 
     highlightedIndices={highlightedIndices} 
     shouldHighlight={true}></TwoDimArray2> */}



     <br></br>
     {/* <VisualizeLambda></VisualizeLambda> */}
     <br></br>
     {/* <PythonFunctionDetails functionData={pythonData}></PythonFunctionDetails> */}
     <br></br>
     {/* <TreeStructure></TreeStructure> */}
     <br></br>
     {/* <TwoDimArray2
     highlightedIndices={highlightedIndices} 
     shouldHighlight={true}
     ></TwoDimArray2> */}
     <br></br>
     {/* <PythonFunctionDetails functionData={pythonData}></PythonFunctionDetails> */}
     <br></br>
     <CSSBeautifier></CSSBeautifier>
     {/* <PythonFunctionDetails functionData={pythonData}></PythonFunctionDetails> */}
     <br></br>
     {/* <TwoDimSlicingInputs
                startRow={startRow} stopRow={stopRow} stepRow={stepRow}
                setStartRow={dummySetter} setStopRow={dummySetter} setStepRow={dummySetter}
                startCol={startCol} stopCol={stopCol} stepCol={stepCol}
                setStartCol={dummySetter} setStopCol={dummySetter} setStepCol={dummySetter}
            /> */}
     <br></br>
     {/* <AsciiConverter></AsciiConverter> */}
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
     <CaseConverter></CaseConverter>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     {/* <CollapsibleTree data={pandas}></CollapsibleTree> */}
     {/* <MermaidDiagram chartDefinition={pandas}></MermaidDiagram> */}
     <br></br>
    <ScrollUpButton ></ScrollUpButton>
    </div>
  )
}

