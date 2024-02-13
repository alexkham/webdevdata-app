// 'use client'
// import React, { useEffect, useState } from 'react';
// import './Tabs.css'; 
// import CodeWidget from '../code-widget/CodeWidget';
// import ConsoleComponentProps5 from '../code-widget/ConsoleComponentProps5';
// import ConsoleComponentProps4 from '../code-widget/ConsoleComponentProps4';
// import ConsoleComponentProps6 from '../code-widget/ConsoleComponentProps6';

// function CodeTabs({ tabs }) {
//   const [activeTab, setActiveTab] = useState(0);
//   const [codeString,setCodeString]=useState('')

//   useEffect(()=>{
//     const code=(tabs[activeTab].code).toString()
//     setCodeString(code)
//   },[])
//   console.log(tabs[activeTab].code)

//   const code=(tabs[activeTab].code).toString()
//   console.log(code)
//   console.log(codeString)
//   return (<>
//     <div className="code-tabs">
      
      
//       <ul className="code-tab-links">
//         {tabs.map((tab, index) => (
//           <li
//             key={index}
//             className={activeTab === index ? 'active' : ''}
//             onClick={() => setActiveTab(index)}
//           >
//             {tab.title}
//           </li>
//         ))}
//       </ul>

//       <div className="code-tab-content">
//         {tabs.map((tab, index) => (
//           <div
//             key={index}
//             id={`tab-${index}`}
//             className={`tab ${activeTab === index ? 'active' : ''}`}>
                    
            
//            <CodeWidget message={tabs[activeTab].code}></CodeWidget>
//            <ConsoleComponentProps5 code={tabs[activeTab].code}></ConsoleComponentProps5>
           
//            {<h3>Hel,lo</h3>}
//           </div>
         
//         ))}

//       <h3>Hello {codeString}</h3>
//       <span>{codeString}</span>
//       </div>
//       {<ConsoleComponentProps5 code={tabs[activeTab].code}></ConsoleComponentProps5>}
     
//     </div>
//     <ConsoleComponentProps5 code={tabs[activeTab].code}></ConsoleComponentProps5>
//     <div>Hello
//     <ConsoleComponentProps5 code={tabs[activeTab].code}></ConsoleComponentProps5>
//     </div>
//     <div>
        
//     <ConsoleComponentProps5 code={"2+5"}></ConsoleComponentProps5>
//     <ConsoleComponentProps5 code={{code}}></ConsoleComponentProps5>
//     <ConsoleComponentProps5 code={tabs[activeTab].code.code}></ConsoleComponentProps5>
//     <ConsoleComponentProps5 code={codeString}></ConsoleComponentProps5>
//     <ConsoleComponentProps4 code={"console.log('Hello')"}></ConsoleComponentProps4>
//     <ConsoleComponentProps4 code={tabs[activeTab].code.toString()}></ConsoleComponentProps4>
//     // Example of how you might be setting the code prop in the parent component
//     <ConsoleComponentProps4 code={tabs[activeTab].code} />
//     <ConsoleComponentProps6 code={tabs[activeTab].code} ></ConsoleComponentProps6>

//     </div>
// </>
// )}

// export default CodeTabs;
'use client'
import React, { useEffect, useState } from 'react';
import './Tabs.css'; 
import CodeWidget from '../code-widget/CodeWidget';
import ConsoleComponentProps5 from '../code-widget/ConsoleComponentProps5';
import ConsoleComponentProps4 from '../code-widget/ConsoleComponentProps4';
import ConsoleComponentProps6 from '../code-widget/ConsoleComponentProps6';

function CodeTabs({ tabs }) {
    const [activeTab, setActiveTab] = useState(0);
    const [codeString, setCodeString] = useState('');
  
    // Update codeString when activeTab changes
    useEffect(() => {
      const code = tabs[activeTab].code;
      console.log(code)
      setCodeString(code);
    }, [activeTab, tabs]); // Ensures codeString updates when activeTab or tabs change
  
    return (
      <>
       <h3>Code Examples</h3>
        <div className="code-tabs">
          <ul className="code-tab-links">
            {tabs.map((tab, index) => (
              <li key={index} className={activeTab === index ? 'active' : ''} onClick={() => setActiveTab(index)}>
                {tab.title}
              </li>
            ))}
          </ul>
  
          <div className="code-tab-content">
            {tabs.map((tab, index) => (
              <div key={index} id={`tab-${index}`} className={`code-tab ${activeTab === index ? 'active' : ''}`}>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div className='code-container'>
                    <div>
                <CodeWidget message={tabs[activeTab].code} />
                </div>
                <div className='code-explanation' style={{minHeight:'200px',minWidth:'400px'}}>Explanation</div>
                </div>
              </div>
            ))}
          </div>
         
          <div className='console-container'>
           
          <ConsoleComponentProps5 code={codeString}></ConsoleComponentProps5>
          </div>
        </div>
        
      </>
    );
  }
  export default CodeTabs