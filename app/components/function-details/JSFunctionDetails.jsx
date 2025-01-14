import React, { useState, useRef, useEffect } from 'react';
import AceEditorComponent from '../ace-editor/AceEditorComponent';
import styles from './FunctionDetails.module.css';
import Link from 'next/link';

const JSFunctionDetails = ({ functionData,linkData }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [activeExampleTab, setActiveExampleTab] = useState(0);
  const [codeOutput, setCodeOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [editorContent, setEditorContent] = useState('');

  const tabRefs = {
    description: useRef(null),
    signature: useRef(null),
    parameters: useRef(null),
    return: useRef(null),
    examples: useRef(null),
  };

  useEffect(() => {
    if (functionData.use_cases && functionData.use_cases.length > 0) {
      setEditorContent(functionData.use_cases[activeExampleTab].code);
    }
  }, [functionData, activeExampleTab]);

  const executeCode = () => {
    setIsRunning(true);
    setCodeOutput('Executing...');
    
    let capturedOutput = '';
    const originalConsoleLog = console.log;

    console.log = (...args) => {
      capturedOutput += args.map(arg => {
        if (arg instanceof Set) {
          return `{${JSON.stringify(Array.from(arg)).replace('[', '').replace(']', '')}}`;
        } else if (typeof arg === 'object') {
          return JSON.stringify(arg, null, 2);
        } else {
          return arg;
        }
      }).join(' ') + '\n';
      originalConsoleLog.apply(console, args);
    };

    try {
      let result = eval(editorContent);
      if (result !== undefined && capturedOutput.trim() === '') {
        capturedOutput += typeof result === 'object' ? JSON.stringify(result, null, 2) : result.toString();
      }
    } catch (err) {
      capturedOutput = `Error: ${err.message}`;
    } finally {
      console.log = originalConsoleLog;
    }

    setCodeOutput(capturedOutput.trim() || 'No output');
    setIsRunning(false);
  };

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

  const renderExampleContent = (example, index) => (
    <div className={styles.exampleContent}>
      <div className={styles.codeExplanationContainer}>
        <div className={styles.codeContainer}>
          <AceEditorComponent
            code={editorContent}
            fontSize={14}
            mode="javascript"
            theme="twilight"
            onChange={setEditorContent}
            width="100%"
          />
           <div className={styles.outputContainer}>
          <button 
            onClick={executeCode} 
            disabled={isRunning}
            className={styles.runButton}
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
         
          <h3 className={styles.outputTitle}>Output :</h3>
          <pre className={styles.outputBox}>{codeOutput}</pre>
        </div>
        </div>
        <div className={styles.explanationContainer}>
          <h3>Explanation</h3>
          <p>{example.explanation}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
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
          <p>{functionData.description}</p>
          <br></br>
          <br></br>

          {linkData && (
            <Link
              className={styles.link}
              href={linkData}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read More about {functionData.function} from JS Documentation
            </Link>
          )}
         
          {/* {functionData.link && (
            <Link
              className={styles.link}
              href={functionData.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read More about {functionData.function} from JS Documentation
            </Link>
          )} */}
        </div>

        <div ref={tabRefs.signature} className={`${styles.tabContent} ${activeTab === 'signature' ? styles.active : ''}`}>
          <h2>Function Signature</h2>
          <pre className={styles.prototypeBox}>{functionData.signature}</pre>
        </div>

        <div ref={tabRefs.parameters} className={`${styles.tabContent} ${activeTab === 'parameters' ? styles.active : ''}`}>
          <h2>Parameters</h2>
          {functionData.parameters.map((param, index) => (
            <div key={index}>
              <h3>{param.parameter}</h3>
              <p>{param.description}</p>
            </div>
          ))}
        </div>

        <div ref={tabRefs.return} className={`${styles.tabContent} ${activeTab === 'return' ? styles.active : ''}`}>
          <h2>Return</h2>
          <h3>Type</h3>
          <p>{functionData.return.type}</p>
          <h3>Value</h3>
          <p>{functionData.return.value}</p>
        </div>
  
        <div ref={tabRefs.examples} className={`${styles.tabContent} ${activeTab === 'examples' ? styles.active : ''}`}>
          <div className={styles.innerTabContainer}>
            {functionData.use_cases.map((example, index) => (
              <button 
                key={index}
                className={`${styles.tabButton} ${activeExampleTab === index ? styles.active : ''}`}
                onClick={() => {
                  setActiveExampleTab(index);
                  setEditorContent(example.code);
                  setCodeOutput('');
                }}
              >
                {example.title}
              </button>
            ))}
          </div>
          {functionData.use_cases.length > 0 ?
            renderExampleContent(functionData.use_cases[activeExampleTab], activeExampleTab) :
            <p>No examples found.</p>
          }
        </div>
      </div>
    </div>
  );
};

export default JSFunctionDetails;