'use client'
import React, { useState, useEffect } from 'react';
import AceEditorComponent from './AceEditorComponent';
import { useRouter } from 'next/router';
import styles from './FunctionDetailsPage.module.css';

const FunctionDetailsPage = () => {
  const [functionData, setFunctionData] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const router = useRouter();
  const { functionName } = router.query;

  useEffect(() => {
    // Fetch function data based on functionName
    // This is where you'd make an API call or fetch from your JSON structure
    // For now, we'll use a mock function
    const fetchFunctionData = async () => {
      // Mock data - replace this with actual data fetching
      const mockData = {
        function_name: "nextafter",
        include_file: "math.h",
        return_type: "double",
        parameter_types: ["double", "double"],
        main_category: "Mathematical Operations",
        sub_category: "Advanced Computation",
        data_type_manipulated: "floating-point numbers",
        description: "Returns the next representable value of the first argument in the direction of the second argument.",
        examples: [
          {
            code: `#include <stdio.h>
#include <math.h>

int main() {
    double x = 3.14;
    double y = 3.15;
    double result = nextafter(x, y);
    printf("Next representable value after %f towards %f is %f\\n", x, y, result);
    return 0;
}`,
            explanation: "This example demonstrates how to use the nextafter function to find the next representable value."
          }
        ]
      };
      setFunctionData(mockData);
    };

    if (functionName) {
      fetchFunctionData();
    }
  }, [functionName]);

  if (!functionData) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{functionData.function_name}</h1>
      
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'description' ? styles.active : ''}`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'examples' ? styles.active : ''}`}
          onClick={() => setActiveTab('examples')}
        >
          Examples
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'description' && (
          <div>
            <h2>Description</h2>
            <p>{functionData.description}</p>
            <h3>Details</h3>
            <ul>
              <li><strong>Include File:</strong> {functionData.include_file}</li>
              <li><strong>Return Type:</strong> {functionData.return_type}</li>
              <li><strong>Parameter Types:</strong> {functionData.parameter_types.join(', ')}</li>
              <li><strong>Main Category:</strong> {functionData.main_category}</li>
              <li><strong>Sub Category:</strong> {functionData.sub_category}</li>
              <li><strong>Data Type Manipulated:</strong> {functionData.data_type_manipulated}</li>
            </ul>
          </div>
        )}

        {activeTab === 'examples' && (
          <div>
            <h2>Examples</h2>
            {functionData.examples.map((example, index) => (
              <div key={index} className={styles.exampleContainer}>
                <AceEditorComponent
                  code={example.code}
                  fontSize={14}
                  theme="monokai"
                  mode="c_cpp"
                  onChange={() => {}}
                  width="100%"
                />
                <div className={styles.explanation}>
                  <h3>Explanation</h3>
                  <p>{example.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FunctionDetailsPage;