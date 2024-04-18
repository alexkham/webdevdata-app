
import AceEditorComponent from "./components/ace-editor/AceEditorComponent";
import GridGenerator from "./components/grid-generator/GridGenerator";
import MethodExplorer from "./components/method-explorer/MethodExplorer";
import {code} from './api/db/content/C/first_content'
import ScrollUpButton from "./components/scroll-up-button/ScrollUpButton";



export default function Home() {

  // const code=
  // `def add(a,b):
  //    return a-b
  
  
  // print(add(34,23))
  // `
 
  return (
    <div className="main-container">
      
      <h3>Methods Explorer</h3>
      <h4>Deployed on Amplify</h4>
      <h5>Version 4 </h5>
     <MethodExplorer></MethodExplorer>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <br></br>
     <AceEditorComponent
        code={code}
        fontSize={16}
        mode={'c_cpp'}
        theme={'terminal'}></AceEditorComponent>
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
     {/* <GridGenerator></GridGenerator>
     <br></br> */}
    <ScrollUpButton></ScrollUpButton>
    </div>
  )
}
