
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

  const pandas=`
  graph LR
    style root fill:#f9f,stroke:#333,stroke-width:4px,font-size:20px
    style A fill:#f9f,stroke:#333,stroke-width:4px,font-size:16px
    style A1 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style A2 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style A3 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    
    style B fill:#f9f,stroke:#333,stroke-width:4px,font-size:16px
    style B1 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style B2 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style B3 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style B4 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px

    style C fill:#f9f,stroke:#333,stroke-width:4px,font-size:16px
    style C1 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style C2 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style C3 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px

    style D fill:#f9f,stroke:#333,stroke-width:4px,font-size:16px
    style D1 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style D2 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style D3 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style D4 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px

    style E fill:#f9f,stroke:#333,stroke-width:4px,font-size:16px
    style E1 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style E2 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style E3 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style E4 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px

    style F fill:#f9f,stroke:#333,stroke-width:4px,font-size:16px
    style F1 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px

    style G fill:#f9f,stroke:#333,stroke-width:4px,font-size:16px
    style G1 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style G2 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px

    style H fill:#f9f,stroke:#333,stroke-width:4px,font-size:16px
    style H1 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style H2 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style H3 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px

    style I fill:#f9f,stroke:#333,stroke-width:4px,font-size:16px
    style I1 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style I2 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px

    style J fill:#f9f,stroke:#333,stroke-width:4px,font-size:16px
    style J1 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px

    style K fill:#f9f,stroke:#333,stroke-width:4px,font-size:16px
    style K1 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style K2 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style K3 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style K4 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px
    style K5 fill:#f9f,stroke:#333,stroke-width:4px,font-size:14px

    root[Pandas Operations]

    A[DataFrame Operations]
    A1[Loading Data]
    A2[Saving Data]
    A3[Data Inspection]
    
    B[Column Operations]
    B1[Index and Labels]
    B2[Selection]
    B3[Modification]
    B4[Arithmetic and Functions]

    C[Row Operations]
    C1[Index and Labels]
    C2[Selection]
    C3[Modification]

    D[Combining DataFrames]
    D1[Merge]
    D2[Join]
    D3[Concatenate]
    D4[Combine]

    E[Groupby]
    E1[Grouping]
    E2[Aggregation]
    E3[Transformation]
    E4[Filtering]

    F[Pivot Tables]
    F1[Pivoting]

    G[String Operations]
    G1[Manipulation]
    G2[Regular Expressions]

    H[Statistics]
    H1[Summary and Descriptive Stats]
    H2[Counts and Binning]
    H3[Advanced Analysis]

    I[Handling Missing Data]
    I1[Missing Data]
    I2[Non-finite Numbers]

    J[Categorical Data]
    J1[Handling Categorical Data]

    K[Dates, Times and Indexes]
    K1[Creating and Converting]
    K2[Indexing]
    K3[Manipulation]
    K4[Operations]
    K5[Accessor Attributes]

    root --> A
    root --> B
    root --> C
    root --> D
    root --> E
    root --> F
    root --> G
    root --> H
    root --> I
    root --> J
    root --> K

    A --> A1
    A --> A2
    A --> A3
    
    B --> B1
    B --> B2
    B --> B3
    B --> B4

    C --> C1
    C --> C2
    C --> C3

    D --> D1
    D --> D2
    D --> D3
    D --> D4

    E --> E1
    E --> E2
    E --> E3
    E --> E4

    F --> F1

    G --> G1
    G --> G2

    H --> H1
    H --> H2
    H --> H3

    I --> I1
    I --> I2

    J --> J1

    K --> K1
    K --> K2
    K --> K3
    K --> K4
    K --> K5

  
  `
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
  console.log(pandas)
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
     <h2>Nothing on this page</h2>
     <br></br>
     <br></br>
     <TreeStructure></TreeStructure>
     <br></br>
     <br></br>
     {/* <CollapsibleTree data={pandas}></CollapsibleTree> */}
     {/* <MermaidDiagram chartDefinition={pandas}></MermaidDiagram> */}
     <br></br>
    <ScrollUpButton ></ScrollUpButton>
    </div>
  )
}
