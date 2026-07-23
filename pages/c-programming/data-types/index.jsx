import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import React from 'react';
import '../../pages.css'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
import MermaidDiagram2 from '@/app/components/mermaid-diagram/MermaidDiagram2';
import StyledList from '@/app/components/page-components/lists/StyledList';
import ContentBlock from '@/app/components/page-components/ContentBlock';
import NavigationButtons from '@/app/components/page-components/NavigationButtons';
import Head from 'next/head';

export default function DataTypesPage({ content, types }) {
 
  const keyWords=[
    'data types','data types in c', 'c language', 'c programming'
  ]

//   const types=[
//     {text:'Core Types',link:'#core'},
//     {text:'Memory Types',link:'#memory'},
//     {text:'Pointer Types',link:'#pointer'},
//     {text:'Special Types',link:'#special'},
    
//   ]

//   const content=[
//     `**Core Types**
// The Core Types are the fundamental building blocks of the C programming language. They consist of the primitive data types that most C programs rely on for general-purpose computation. These types define how data is stored and manipulated at the most basic level. Types like int, char, float, and double represent integral numbers, characters, and floating-point numbers, respectively. In addition, there are several variations of these types—such as long, short, unsigned, and void—which allow for more control over the size and behavior of the data. For example, unsigned int can store only non-negative numbers, while void represents an empty or undefined data type used for functions that do not return any value.

// The Core Types are essential for almost all applications written in C, from simple algorithms to complex systems-level programming. These types are directly supported by hardware, making them efficient in terms of both performance and memory usage. They also provide the foundation for more complex types and abstractions, such as arrays, structures, and unions.`,

//     `**Memory Types**
// Memory Types in C are specialized types designed to handle the allocation, addressing, and manipulation of memory. These types are often used in operations involving memory management, file handling, and pointer arithmetic. Memory Types such as size_t, ssize_t, ptrdiff_t, and fpos_t are defined to address specific needs related to system-level programming. For example, size_t is used to represent the size of objects in memory, ensuring that it can accommodate the addressable range of the system, whether it is a 32-bit or 64-bit architecture. Similarly, ptrdiff_t is used to calculate the difference between two pointers, which is essential in operations like traversing arrays or buffers.

// These types are critical for ensuring that C programs can manage memory effectively and safely, particularly when handling dynamic memory allocation, file I/O, or performing operations that involve complex data structures like linked lists or trees. Unlike Core Types, which deal with values and data representation, Memory Types directly deal with system architecture and memory layout, allowing programmers to write highly optimized and system-specific code.`,

// `**Pointer Types**
// Pointer Types are one of the most powerful and complex features in C. A pointer is a variable that  allows dynamic memory allocation, as well as the ability to create and manipulate data structures that require direct memory access, such as linked lists, trees, and graphs. Pointer Types in C, such as void*, char*, int*, and others, provide the flexibility to work with various data types indirectly by referring to their memory locations.

// What sets Pointer Types apart from the other categories is their ability to interact with memory directly. Pointers provide the means to pass data by reference, which is a fundamental concept in C. This can lead to more efficient programs, as passing large data structures (like arrays or structures) by reference avoids unnecessary copying of data. Additionally, pointers are crucial in managing dynamic memory, where the program allocates memory at runtime, as opposed to relying on static allocations made at compile-time.

// While Pointer Types share similarities with Memory Types in that they both deal with memory and system-level operations, pointers are more abstract, enabling a higher degree of flexibility and control over memory. However, with this flexibility comes complexity, as pointer arithmetic and pointer dereferencing can introduce bugs, such as segmentation faults, if not handled properly. `,
// `**Special Types**
// Special Types are a collection of types in C that are reserved for specific system-level operations or domain-specific tasks. These types are typically used in more specialized areas of C programming, such as time management, file handling, and variable argument lists. Types like time_t, clock_t, and FILE* are examples of Special Types, each catering to a specific requirement.

// For example, time_t is used to represent time values, enabling programs to perform time-based calculations or measurements. Similarly, FILE* is used to represent file streams, which are essential for reading from and writing to files in C. va_list is another example, providing the necessary mechanism for handling variable-length argument lists in functions like printf.

// Special Types are often abstractions that simplify complex system-level operations. They may not be as fundamental as the Core Types but are indispensable in certain contexts, such as system programming or writing programs that interface with hardware or the operating system. These types are typically defined in standard libraries and are optimized to handle specific tasks that would otherwise require more complicated manual memory and data management.`
//   ]
  return (
    <>
     <Head>
        <title>Data Types in C - WebDevData.net</title>
        <meta name="description" content="Learn about data types in C programming, including core types, memory types, pointer types, and special types. Comprehensive guide for beginners and advanced programmers." />
        <meta name="keywords" content="data types, data types in c, c language, c programming" />
        <meta property="og:title" content="Data Types in C - WebDevData.net" />
        <meta property="og:description" content="Learn about data types in C programming, including core types, memory types, pointer types, and special types." />
        <meta property="og:url" content="https://www.webdevdata.net/c-programming/data-types" />
        <meta property="og:type" content="article" />
        <link rel="canonical" href="https://www.webdevdata.net/c-programming/data-types" />
      </Head>
    
    <br/>
    <br/>
   
    <Breadcrumb/>
    <h1 className='title' style={{marginTop:'-30px',marginBottom:'-20px'}}>Data Types in C</h1>
    <br/>
    <br/>
    {/* <div style={{margin:'auto',marginLeft:'150px',transform:'scale(0.6)'}}>
    <MermaidDiagram2 chartDefinition={dataTypesDiagram4} />
    </div> */}
    <div style={{display:'flex',flexDirection:'row'}}>

<div style={{transform:'scale(0.9)',marginTop:'-50px',marginLeft:'50px',width:'800px'}}>
<svg aria-roledescription="flowchart-v2" role="graphics-document document" viewBox="0.00000762939453125 0 861.1458740234375 593" style={{maxWidth: '861.1458740234375px'}} className="flowchart" xmlns="http://www.w3.org/2000/svg" width="100%" id="export-svg"><style xmlns="http://www.w3.org/1999/xhtml" dangerouslySetInnerHTML={{__html: "@import url(\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css\"); p {margin: 0;}" }} /><style dangerouslySetInnerHTML={{__html: "#export-svg{font-family:\"trebuchet ms\",verdana,arial,sans-serif;font-size:14px;fill:#000000;}#export-svg .error-icon{fill:#552222;}#export-svg .error-text{fill:#552222;stroke:#552222;}#export-svg .edge-thickness-normal{stroke-width:1px;}#export-svg .edge-thickness-thick{stroke-width:3.5px;}#export-svg .edge-pattern-solid{stroke-dasharray:0;}#export-svg .edge-thickness-invisible{stroke-width:0;fill:none;}#export-svg .edge-pattern-dashed{stroke-dasharray:3;}#export-svg .edge-pattern-dotted{stroke-dasharray:2;}#export-svg .marker{fill:#666;stroke:#666;}#export-svg .marker.cross{stroke:#666;}#export-svg svg{font-family:\"trebuchet ms\",verdana,arial,sans-serif;font-size:14px;}#export-svg p{margin:0;}#export-svg .label{font-family:\"trebuchet ms\",verdana,arial,sans-serif;color:#000000;}#export-svg .cluster-label text{fill:#333;}#export-svg .cluster-label span{color:#333;}#export-svg .cluster-label span p{background-color:transparent;}#export-svg .label text,#export-svg span{fill:#000000;color:#000000;}#export-svg .node rect,#export-svg .node circle,#export-svg .node ellipse,#export-svg .node polygon,#export-svg .node path{fill:#eee;stroke:#999;stroke-width:1px;}#export-svg .rough-node .label text,#export-svg .node .label text,#export-svg .image-shape .label,#export-svg .icon-shape .label{text-anchor:middle;}#export-svg .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#export-svg .rough-node .label,#export-svg .node .label,#export-svg .image-shape .label,#export-svg .icon-shape .label{text-align:center;}#export-svg .node.clickable{cursor:pointer;}#export-svg .root .anchor path{fill:#666!important;stroke-width:0;stroke:#666;}#export-svg .arrowheadPath{fill:#333333;}#export-svg .edgePath .path{stroke:#666;stroke-width:2.0px;}#export-svg .flowchart-link{stroke:#666;fill:none;}#export-svg .edgeLabel{background-color:white;text-align:center;}#export-svg .edgeLabel p{background-color:white;}#export-svg .edgeLabel rect{opacity:0.5;background-color:white;fill:white;}#export-svg .labelBkg{background-color:rgba(255, 255, 255, 0.5);}#export-svg .cluster rect{fill:hsl(0, 0%, 98.9215686275%);stroke:#707070;stroke-width:1px;}#export-svg .cluster text{fill:#333;}#export-svg .cluster span{color:#333;}#export-svg div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:\"trebuchet ms\",verdana,arial,sans-serif;font-size:12px;background:hsl(-160, 0%, 93.3333333333%);border:1px solid #707070;border-radius:2px;pointer-events:none;z-index:100;}#export-svg .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#000000;}#export-svg rect.text{fill:none;stroke-width:0;}#export-svg .icon-shape,#export-svg .image-shape{background-color:white;text-align:center;}#export-svg .icon-shape p,#export-svg .image-shape p{background-color:white;padding:2px;}#export-svg .icon-shape rect,#export-svg .image-shape rect{opacity:0.5;background-color:white;fill:white;}#export-svg .node .neo-node{stroke:#999;}#export-svg [data-look=\"neo\"].node rect,#export-svg [data-look=\"neo\"].cluster rect,#export-svg [data-look=\"neo\"].node polygon{stroke:url(#export-svg-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#export-svg [data-look=\"neo\"].node rect,#export-svg [data-look=\"neo\"].node polygon,#export-svg [data-look=\"neo\"].node path{stroke:url(#export-svg-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#export-svg [data-look=\"neo\"].node .neo-line path{stroke:hsl(0, 0%, 83.3333333333%);filter:none;}#export-svg [data-look=\"neo\"].node circle{stroke:url(#export-svg-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#export-svg [data-look=\"neo\"].node circle .state-start{fill:#000000;}#export-svg [data-look=\"neo\"].statediagram-cluster rect{fill:#eee;stroke:url(#export-svg-gradient);stroke-width:1px;}#export-svg [data-look=\"neo\"].icon-shape .icon{fill:url(#export-svg-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#export-svg [data-look=\"neo\"].icon-shape .icon-neo path{stroke:url(#export-svg-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#export-svg :root{--mermaid-font-family:\"trebuchet ms\",verdana,arial,sans-serif;}#export-svg .default>*{fill:#f9f9f9!important;stroke:#333!important;}#export-svg .default span{fill:#f9f9f9!important;stroke:#333!important;}#export-svg .main>*{fill:#e1e8ff!important;stroke:#333!important;stroke-width:2px!important;}#export-svg .main span{fill:#e1e8ff!important;stroke:#333!important;stroke-width:2px!important;}#export-svg .category>*{fill:#e8f0ff!important;stroke:#333!important;}#export-svg .category span{fill:#e8f0ff!important;stroke:#333!important;}" }} /><g><marker orient="auto" markerHeight={8} markerWidth={8} markerUnits="userSpaceOnUse" refY={5} refX={5} viewBox="0 0 10 10" className="marker flowchart-v2" id="export-svg_flowchart-v2-pointEnd"><path style={{strokeWidth: 1, strokeDasharray: '1, 0'}} className="arrowMarkerPath" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker orient="auto" markerHeight={8} markerWidth={8} markerUnits="userSpaceOnUse" refY={5} refX="4.5" viewBox="0 0 10 10" className="marker flowchart-v2" id="export-svg_flowchart-v2-pointStart"><path style={{strokeWidth: 1, strokeDasharray: '1, 0'}} className="arrowMarkerPath" d="M 0 5 L 10 10 L 10 0 z" /></marker><marker orient="auto" markerHeight={11} markerWidth={11} markerUnits="userSpaceOnUse" refY={5} refX={11} viewBox="0 0 10 10" className="marker flowchart-v2" id="export-svg_flowchart-v2-circleEnd"><circle style={{strokeWidth: 1, strokeDasharray: '1, 0'}} className="arrowMarkerPath" r={5} cy={5} cx={5} /></marker><marker orient="auto" markerHeight={11} markerWidth={11} markerUnits="userSpaceOnUse" refY={5} refX={-1} viewBox="0 0 10 10" className="marker flowchart-v2" id="export-svg_flowchart-v2-circleStart"><circle style={{strokeWidth: 1, strokeDasharray: '1, 0'}} className="arrowMarkerPath" r={5} cy={5} cx={5} /></marker><marker orient="auto" markerHeight={11} markerWidth={11} markerUnits="userSpaceOnUse" refY="5.2" refX={12} viewBox="0 0 11 11" className="marker cross flowchart-v2" id="export-svg_flowchart-v2-crossEnd"><path style={{strokeWidth: 2, strokeDasharray: '1, 0'}} className="arrowMarkerPath" d="M 1,1 l 9,9 M 10,1 l -9,9" /></marker><marker orient="auto" markerHeight={11} markerWidth={11} markerUnits="userSpaceOnUse" refY="5.2" refX={-1} viewBox="0 0 11 11" className="marker cross flowchart-v2" id="export-svg_flowchart-v2-crossStart"><path style={{strokeWidth: 2, strokeDasharray: '1, 0'}} className="arrowMarkerPath" d="M 1,1 l 9,9 M 10,1 l -9,9" /></marker><g className="root"><g className="clusters" /><g className="edgePaths"><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6MzQ0LjA1NDY3OTg3MDYwNTQ3LCJ5Ijo1NC44NzE3MjcyNDgwNjAyMX0seyJ4Ijo4OC42NjY2NjQxMjM1MzUxNiwieSI6OTl9LHsieCI6ODguNjY2NjY0MTIzNTM1MTYsInkiOjEyNH1d" data-id="L_DT_CT_0" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_DT_CT_0" d="M344.05467987060547,54.87172724806021L94.82540239257804,97.93583697986325Q88.66666412353516,99 88.66666412353516,105.25L88.66666412353516,111.5L88.66666412353516,120" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6MzU5LjM0NDk1NDY1NTA4ODI2LCJ5Ijo3NH0seyJ4IjozMTAuMTA5MzY3MzcwNjA1NDcsInkiOjk5fSx7IngiOjMxMC4xMDkzNjczNzA2MDU0NywieSI6MTI0fV0=" data-id="L_DT_MT_1" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_DT_MT_1" d="M359.34495465508826,74L315.68212608535464,96.17036039270242Q310.10936737060547,99 310.10936737060547,105.25L310.10936737060547,111.5L310.10936737060547,120" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6NDg5LjMyNjkwNTA4NjEyMjcsInkiOjc0fSx7IngiOjUzOC41NjI0OTIzNzA2MDU1LCJ5Ijo5OX0seyJ4Ijo1MzguNTYyNDkyMzcwNjA1NSwieSI6MTI0fV0=" data-id="L_DT_PT_2" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_DT_PT_2" d="M489.3269050861227,74L532.9897336558563,96.17036039270242Q538.5624923706055,99 538.5624923706055,105.25L538.5624923706055,111.5L538.5624923706055,120" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6NTA0LjYxNzE3OTg3MDYwNTQ3LCJ5Ijo1NC42ODA2ODExNjgxOTc4OX0seyJ4Ijo3NjQuNjkyNzAzMjQ3MDcwMywieSI6OTl9LHsieCI6NzY0LjY5MjcwMzI0NzA3MDMsInkiOjEyNH1d" data-id="L_DT_ST_3" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_DT_ST_3" d="M504.61717987060547,54.68068116819789L758.5315214739819,97.95007659376337Q764.6927032470703,99 764.6927032470703,105.25L764.6927032470703,111.5L764.6927032470703,120" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6ODguNjY2NjY0MTIzNTM1MTYsInkiOjE5MH0seyJ4Ijo4OC42NjY2NjQxMjM1MzUxNiwieSI6MjE1fSx7IngiOjg4LjY2NjY2NDEyMzUzNTE2LCJ5IjoyNDB9XQ==" data-id="L_CT_CTL_4" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_CT_CTL_4" d="M88.66666412353516,190L88.66666412353516,215L88.66666412353516,227.5L88.66666412353516,236" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6MzEwLjEwOTM2NzM3MDYwNTQ3LCJ5IjoxOTB9LHsieCI6MzEwLjEwOTM2NzM3MDYwNTQ3LCJ5IjoyMTV9LHsieCI6MzEwLjEwOTM2NzM3MDYwNTQ3LCJ5IjozMzQuNX1d" data-id="L_MT_MTL_5" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_MT_MTL_5" d="M310.10936737060547,190L310.10936737060547,215L310.10936737060547,274.75L310.10936737060547,330.5" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6NTM4LjU2MjQ5MjM3MDYwNTUsInkiOjE5MH0seyJ4Ijo1MzguNTYyNDkyMzcwNjA1NSwieSI6MjE1fSx7IngiOjUzOC41NjI0OTIzNzA2MDU1LCJ5IjozMTMuNX1d" data-id="L_PT_PTL_6" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_PT_PTL_6" d="M538.5624923706055,190L538.5624923706055,215L538.5624923706055,264.25L538.5624923706055,309.5" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6NzY0LjY5MjcwMzI0NzA3MDMsInkiOjE5MH0seyJ4Ijo3NjQuNjkyNzAzMjQ3MDcwMywieSI6MjE1fSx7IngiOjc2NC42OTI3MDMyNDcwNzAzLCJ5IjozMjR9XQ==" data-id="L_ST_STL_7" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_ST_STL_7" d="M764.6927032470703,190L764.6927032470703,215L764.6927032470703,269.5L764.6927032470703,320" /></g><g className="edgeLabels"><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_DT_CT_0" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_DT_MT_1" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_DT_PT_2" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_DT_ST_3" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_CT_CTL_4" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_MT_MTL_5" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_PT_PTL_6" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_ST_STL_7" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g></g><g className="nodes"><g transform="translate(424.33592987060547, 41)" data-look="neo" data-et="node" data-node="true" data-id="DT" id="flowchart-DT-311" className="node default main"><rect height={66} width="160.5625" y={-33} x="-80.28125" ry={33} rx={33} style={{fill: '#e1e8ff !important', stroke: '#333 !important', strokeWidth: '2px !important'}} className="basic label-container" /><g transform="translate(-35.28125, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="70.5625"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>Data Types</p></span></div></foreignObject></g></g><g transform="translate(88.66666412353516, 157)" data-look="neo" data-et="node" data-node="true" data-id="CT" id="flowchart-CT-313" className="node default category"><rect height={66} width="161.33333587646484" y={-33} x="-80.66666793823242" ry={33} rx={33} style={{fill: '#e8f0ff !important', stroke: '#333 !important'}} className="basic label-container" /><g transform="translate(-35.66666793823242, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="71.33333587646484"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>Core Types</p></span></div></foreignObject></g></g><g transform="translate(310.10936737060547, 157)" data-look="neo" data-et="node" data-node="true" data-id="MT" id="flowchart-MT-315" className="node default category"><rect height={66} width="181.55208587646484" y={-33} x="-90.77604293823242" ry={33} rx={33} style={{fill: '#e8f0ff !important', stroke: '#333 !important'}} className="basic label-container" /><g transform="translate(-45.77604293823242, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="91.55208587646484"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>Memory Types</p></span></div></foreignObject></g></g><g transform="translate(538.5624923706055, 157)" data-look="neo" data-et="node" data-node="true" data-id="PT" id="flowchart-PT-317" className="node default category"><rect height={66} width="175.3541717529297" y={-33} x="-87.67708587646484" ry={33} rx={33} style={{fill: '#e8f0ff !important', stroke: '#333 !important'}} className="basic label-container" /><g transform="translate(-42.677085876464844, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="85.35417175292969"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>Pointer Types</p></span></div></foreignObject></g></g><g transform="translate(764.6927032470703, 157)" data-look="neo" data-et="node" data-node="true" data-id="ST" id="flowchart-ST-319" className="node default category"><rect height={66} width="176.90625" y={-33} x="-88.453125" ry={33} rx={33} style={{fill: '#e8f0ff !important', stroke: '#333 !important'}} className="basic label-container" /><g transform="translate(-43.453125, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="86.90625"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>Special Types</p></span></div></foreignObject></g></g><g transform="translate(88.66666412353516, 412.5)" data-look="neo" data-et="node" data-node="true" data-id="CTL" id="flowchart-CTL-321" className="node default default"><rect stroke="url(#gradient)" height={345} width="151.84375" y="-172.5" x="-75.921875" data-id="CTL" style={{fill: '#f9f9f9 !important', stroke: '#333 !important'}} className="basic label-container" /><g transform="translate(-45.921875, -157.5)" style={{}} className="label"><rect /><foreignObject height={315} width="91.84375"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>int<br />char<br />float<br />double<br />short<br />long<br />unsigned int<br />unsigned char<br />unsigned short<br />unsigned long<br />void<br />long double<br />_Decimal32<br />_Decimal64<br />_Decimal128</p></span></div></foreignObject></g></g><g transform="translate(310.10936737060547, 412.5)" data-look="neo" data-et="node" data-node="true" data-id="MTL" id="flowchart-MTL-323" className="node default default"><rect stroke="url(#gradient)" height={156} width="106.4375" y={-78} x="-53.21875" data-id="MTL" style={{fill: '#f9f9f9 !important', stroke: '#333 !important'}} className="basic label-container" /><g transform="translate(-23.21875, -63)" style={{}} className="label"><rect /><foreignObject height={126} width="46.4375"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>size_t<br />ssize_t<br />ptrdiff_t<br />fpos_t<br />div_t<br />ldiv_t</p></span></div></foreignObject></g></g><g transform="translate(538.5624923706055, 412.5)" data-look="neo" data-et="node" data-node="true" data-id="PTL" id="flowchart-PTL-325" className="node default default"><rect stroke="url(#gradient)" height={198} width="140.95833587646484" y={-99} x="-70.47916793823242" data-id="PTL" style={{fill: '#f9f9f9 !important', stroke: '#333 !important'}} className="basic label-container" /><g transform="translate(-40.47916793823242, -84)" style={{}} className="label"><rect /><foreignObject height={168} width="80.95833587646484"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>void*<br />char*<br />const char*<br />void**<br />int*<br />unsigned int*<br />const void*<br />char**</p></span></div></foreignObject></g></g><g transform="translate(764.6927032470703, 412.5)" data-look="neo" data-et="node" data-node="true" data-id="STL" id="flowchart-STL-327" className="node default default"><rect stroke="url(#gradient)" height={177} width="113.69791793823242" y="-88.5" x="-56.84895896911621" data-id="STL" style={{fill: '#f9f9f9 !important', stroke: '#333 !important'}} className="basic label-container" /><g transform="translate(-26.84895896911621, -73.5)" style={{}} className="label"><rect /><foreignObject height={147} width="53.69791793823242"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>time_t<br />clock_t<br />off_t<br />wchar_t<br />time64_t<br />va_list<br />FILE*</p></span></div></foreignObject></g></g></g></g></g><linearGradient y2="0%" x2="100%" y1="0%" x1="0%" gradientUnits="objectBoundingBox" id="export-svg-gradient"><stop stopOpacity={1} stopColor="hsl(0, 0%, 83.3333333333%)" offset="0%" /><stop stopOpacity={1} stopColor="hsl(0, 0%, 88.9215686275%)" offset="100%" /></linearGradient></svg>
</div>

<div>
<span style={{width:'50%'}}>In C programming, the data types available for use can be broadly categorized into four primary groups:</span>
<StyledList items={types}
title=''
width={'400px'}
textColor={' #3498db'}/>
</div>
</div>
    
    <br/>
    <br/>
    <div style={{width:'80%', margin:'auto'}}>
      
    <ContentBlock
    id={'core'}
    content={content[0]}
     boxed={true}
     color={'gray'}
    />
    <NavigationButtons nextLink={'#memory'}/>
    <br/>
    <br/>
    <ContentBlock
    id={'memory'}
    content={content[1]}
     boxed={true}
     color={'gray'}
    />
     <NavigationButtons nextLink={'#pointer'} prevLink={'#core'}/>
    <br/>
    <br/>
    <ContentBlock
    id={'pointer'}
    content={content[2]}
     boxed={true}
     color={'gray'}
    />
     <NavigationButtons nextLink={'#special'} prevLink={'#memory'}/>
    <br/>
    <br/>
    <ContentBlock
    id={'special'}
    content={content[3]}
     boxed={true}
     color={'gray'}
    />
     <NavigationButtons prevLink={'#pointer'}/>
    <br/>
    <br/>
    </div>
    <br/>
    <br/>
    <ScrollUpButton/>
    </>
  )
}

export async function getStaticProps(){

  const similarities=[
    `**Similarities and Differences**
At a high level, the four categories share a common goal: to represent and manipulate data efficiently in a C program. Core Types and Memory Types both provide the basic building blocks of data, but Memory Types go a step further by offering mechanisms to manage and measure memory in a system-dependent manner. Pointer Types, on the other hand, offer a more abstract approach to memory management by allowing direct references to memory locations, while Special Types are more niche, focused on specialized system-level operations like time handling or file I/O.

The key differences lie in the level of abstraction and specificity of each category. Core Types are general-purpose and can be used in virtually any part of a program. Memory Types are more specialized for low-level system operations, such as memory allocation and pointer arithmetic. Pointer Types provide a high level of control over memory and data, while Special Types are domain-specific, abstracting away the complexity of system-level operations.

**Usage in C Programming**
Each category of data types plays a vital role in C programming. Core Types are foundational and used for most basic operations. Memory Types are essential for system-level tasks like memory management and pointer arithmetic. Pointer Types offer flexibility and efficiency, enabling the creation of complex data structures and enabling memory operations to be performed dynamically. Finally, Special Types are critical when interacting with the operating system or managing specialized data such as time and file handling.

Together, these categories form a comprehensive set of tools that make C a powerful, flexible, and efficient language for both high-level application development and low-level system programming. Understanding the differences and similarities between these categories allows C programmers to write cleaner, more efficient, and more maintainable code.`
  ]

  const types=[
    {text:'Core Types',link:'#core'},
    {text:'Memory Types',link:'#memory'},
    {text:'Pointer Types',link:'#pointer'},
    {text:'Special Types',link:'#special'},
    
  ]

  const content=[
    `**Core (Basic) Types**
The Core Types are the fundamental building blocks of the C programming language. They include the primitive data types that most C programs rely on for general-purpose computation.
**The C language defines five basic data types. These are**:
\t•Integer **(int)**: Used for whole numbers, both positive and negative.
\t•Character **(char)**: Represents single characters (e.g., 'a', '1') and often used to handle ASCII values.
\t•Floating-point **(float)**: Represents single-precision decimal numbers.
\t•Double-precision floating-point **(double)**: Used for double-precision decimal numbers.
\t•Void **(void)**: Represents no type or a function that returns nothing.

These types define how data is stored and manipulated at the most basic level.

In addition, there are several type qualifiers like **short, long, signed, and unsigned** that are used to modify the properties of basic data types, particularly integers and floating-point numbers.They allow more control over the size and behavior of the data.

 **Length Qualifiers**:
 \t•**short**: Only applies to int. Defines a smaller integer type (usually 16 bits).
 \t•**long**: Applies to both int and double. Defines a larger integer type or higher precision for floating-point numbers.

**Sign Qualifiers**:
  \t \t•**signed**: Allows both positive and negative values. Default for integer types.
  \t•**unsigned**: Allows only non-negative values (positive and zero). Often doubles the positive range.

Length and Sign qualifiers may be combined between them and added to basic data types to create modified types which are still refered as variations of Core data types.
Need to notice that not every length qualifier may be paired with every sign qualifier and not every combination between qualifiers and basic types are possible.In addition, there are rules concerning default values for properties represented by qualifiers.
To delve deeper into different types of Core data types , visit the relevant page [here](!/c-programming/data-types/basic).

The Basic Types are essential for almost all applications written in C, from simple algorithms to complex systems-level programming. They are supported directly by hardware, making them efficient in terms of both performance and memory usage. They also provide the foundation for more complex types and abstractions, such as arrays, structures, and unions.


[Read More](!/c-programming/data-types/basic)
<span className='link'></span>
`,

    `**Memory Types**
Memory Types in C are specialized types designed to handle the allocation, addressing, and manipulation of memory. These types are often used in operations involving memory management, file handling, and pointer arithmetic. Memory Types such as size_t, ssize_t, ptrdiff_t, and fpos_t are defined to address specific needs related to system-level programming. For example, size_t is used to represent the size of objects in memory, ensuring that it can accommodate the addressable range of the system, whether it is a 32-bit or 64-bit architecture. Similarly, ptrdiff_t is used to calculate the difference between two pointers, which is essential in operations like traversing arrays or buffers.

These types are critical for ensuring that C programs can manage memory effectively and safely, particularly when handling dynamic memory allocation, file I/O, or performing operations that involve complex data structures like linked lists or trees. Unlike Core Types, which deal with values and data representation, Memory Types directly deal with system architecture and memory layout, allowing programmers to write highly optimized and system-specific code.`,

`**Pointer Types**
Pointer Types are one of the most powerful and complex features in C. A pointer is a variable that  allows dynamic memory allocation, as well as the ability to create and manipulate data structures that require direct memory access, such as linked lists, trees, and graphs. Pointer Types in C, such as void*, char*, int*, and others, provide the flexibility to work with various data types indirectly by referring to their memory locations.

What sets Pointer Types apart from the other categories is their ability to interact with memory directly. Pointers provide the means to pass data by reference, which is a fundamental concept in C. This can lead to more efficient programs, as passing large data structures (like arrays or structures) by reference avoids unnecessary copying of data. Additionally, pointers are crucial in managing dynamic memory, where the program allocates memory at runtime, as opposed to relying on static allocations made at compile-time.

While Pointer Types share similarities with Memory Types in that they both deal with memory and system-level operations, pointers are more abstract, enabling a higher degree of flexibility and control over memory. However, with this flexibility comes complexity, as pointer arithmetic and pointer dereferencing can introduce bugs, such as segmentation faults, if not handled properly. `,
`**Special Types**
Special Types are a collection of types in C that are reserved for specific system-level operations or domain-specific tasks. These types are typically used in more specialized areas of C programming, such as time management, file handling, and variable argument lists. Types like time_t, clock_t, and FILE* are examples of Special Types, each catering to a specific requirement.

For example, time_t is used to represent time values, enabling programs to perform time-based calculations or measurements. Similarly, FILE* is used to represent file streams, which are essential for reading from and writing to files in C. va_list is another example, providing the necessary mechanism for handling variable-length argument lists in functions like printf.

Special Types are often abstractions that simplify complex system-level operations. They may not be as fundamental as the Core Types but are indispensable in certain contexts, such as system programming or writing programs that interface with hardware or the operating system. These types are typically defined in standard libraries and are optimized to handle specific tasks that would otherwise require more complicated manual memory and data management.`
  ]

  


  return{
    props:{
      content,
      types,
    }
  }
}