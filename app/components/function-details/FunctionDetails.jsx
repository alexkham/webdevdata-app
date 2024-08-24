
'use client'
import React, { useState, useRef } from 'react';
import AceEditorComponent from '../ace-editor/AceEditorComponent';
import styles from './FunctionDetails.module.css';
import Link from 'next/link';
///import functionsD from '../../api/db/developement/c/functions_new.json'

const FunctionDetails = ({functionData}) => {
  const [activeTab, setActiveTab] = useState('description');
  const [activeExampleTab, setActiveExampleTab] = useState(0);
  const [codeOutput, setCodeOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const tabRefs = {
    description: useRef(null),
    prototype: useRef(null),
    parameters: useRef(null),
    return: useRef(null),
    examples: useRef(null),
  };

const simulateCodeExecution = (exampleIndex) => {
    setIsRunning(true);
    setCodeOutput('Compiling and running...');
    
    setTimeout(() => {
      setCodeOutput(functionData.examples[exampleIndex].expectedOutput);
      setIsRunning(false);
    }, 1500);
  };

  const renderExampleContent = (example, index) => (
    <div className={styles.exampleContent}>
      <div className={styles.codeExplanationContainer}>
        <div className={styles.codeContainer}>
          <AceEditorComponent
            code={example.code}
            fontSize={14}
            mode={'c_cpp'}
            theme={'twilight'}
            onChange={() => {}}
            width="100%"
          />
          <button 
            onClick={() => simulateCodeExecution(index)} 
            disabled={isRunning}
            className={styles.runButton}
          >
            {isRunning ? 'Running...' : 'Run Code'}

          </button>
          <h3>Output</h3>
          <pre className={styles.outputBox}>{codeOutput}</pre>
        </div>
        <div className={styles.explanationContainer}>
          <h3>Explanation</h3>
          <p>{example.explanation}</p>
          {/* <h3>Output</h3>
          <pre className={styles.outputBox}>{codeOutput}</pre> */}
        </div>
      </div>
    </div>
  );

  const scrollToContent = (ref) => {
    if (ref && ref.current) {
      const yOffset = -150;
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    scrollToContent(tabRefs[tab]);
  };

  return (
    <div className={styles.container}>
      {/* <h1 className={styles.title}>{functionData.function_name}</h1> */}
      
      <div className={styles.tabContainer}>
        {Object.keys(tabRefs).map((tab) => (
          <button 
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
  
      <div className={styles.content}>
        <div ref={tabRefs.description} className={`${styles.tabContent} ${activeTab === 'description' ? styles.active : ''}`}>
          <h2>Description</h2>
          <br></br>
          <p>{functionData.extended_description}</p>
          <br></br>
          {functionData.link&&<Link href={`${functionData.link}`}>Read More</Link>}
        </div>

        <div ref={tabRefs.prototype} className={`${styles.tabContent} ${activeTab === 'prototype' ? styles.active : ''}`}>
          <h2>Function Prototype</h2>
          <br></br>
          <pre className={styles.prototypeBox}>{functionData.function_prototype}</pre>
        </div>

        <div ref={tabRefs.parameters} className={`${styles.tabContent} ${activeTab === 'parameters' ? styles.active : ''}`}>
          <h2>Parameters</h2>
          <br></br>
          <p>{functionData.parameter_values}</p>
          <br></br>
          <h3>Parameter Types</h3>
          <br></br>
          <p>{functionData.parameter_types?.length > 0 ? functionData.parameter_types.join(', ') : 'None'}</p>
        </div>

        <div ref={tabRefs.return} className={`${styles.tabContent} ${activeTab === 'return' ? styles.active : ''}`}>
          <h2>Return</h2>
          <br></br>
          <p>{functionData.return_value}</p>
          <br></br>
          <h3>Return Type</h3>
          <br></br>
          <p>{functionData.return_type}</p>
        </div>
  
        <div ref={tabRefs.examples} className={`${styles.tabContent} ${activeTab === 'examples' ? styles.active : ''}`}>
          {/* <h2>Examples</h2> */}
          <div className={styles.innerTabContainer}>
            {functionData?.examples?.map((example, index) => (
              <button 
                key={index}
                className={`${styles.tabButton} ${activeExampleTab === index ? styles.active : ''}`}
                onClick={() => {
                  setActiveExampleTab(index);
                  setCodeOutput('');
                }}
              >
                {example.title}
              </button>
            ))}
          </div>
          {/* {renderExampleContent(functionData?.examples[activeExampleTab], activeExampleTab)} */}
          {functionData?.examples?.length > 0 ?
          renderExampleContent(functionData.examples[activeExampleTab], activeExampleTab) :
          <p>No examples found.</p>
        }
        </div>
      </div>
    </div>
  );
};

export default FunctionDetails;