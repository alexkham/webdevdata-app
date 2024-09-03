'use client'
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const MermaidDiagram2 = ({ chartDefinition, width = '70%', height = 'auto' }) => {
  const mermaidRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      flowchart: {
        nodeSpacing: 150,
        rankSpacing: 150,
        curve: 'basis'
      },
      themeVariables: {
        fontSize: '98px',
        nodeTextSize: '168px',
        textColor:'blue',
       
        nodePadding: 20,
        fontFamily: 'Arial, sans-serif',
        primaryColor: '#e1e1e1',
        primaryTextColor: '#11111b',
        primaryBorderColor: '#7a7a7a',
        lineColor: 'black',
        secondaryColor: '#f4f4f4',
        tertiaryColor: '#d8d8d8',
        // mainBkg: '#ffffff',
        nodeBorder: '#999999',
        clusterBkg: '#f8f8f8',
        clusterBorder: '#888888',
        edgeLabelBackground: '#ffffff',
        edgeColor: 'black'
        
      }
    });

    mermaid.render('mermaid-diagram', chartDefinition).then(({ svg }) => {
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = svg;
      }
    });
  }, [chartDefinition]);

  return <div ref={mermaidRef} style={{ width, height }} />;
};

export default MermaidDiagram2;