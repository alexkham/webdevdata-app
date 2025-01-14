// DynamicAccordion.js
// 'use client';
// import React from 'react';
// import './AccordionToggle2.css';
// import './Accordion.css';
// import CodeExample from '../code-example/CodeExample'; 

// function DynamicAccordionExampleCode({ data,width }) {
//     const toggleSection = (sectionId) => {
//         const section = document.getElementById(sectionId);
//         if (section) {
//             section.classList.toggle('open');
//             if (section.classList.contains('open')) {
//                 section.scrollIntoView({ behavior: 'smooth', block: 'start' });
//             }
//         }
//     };

//     return (
//         <div className="accordion" style={{width:`${width}`}}>
//             {data.map((fileName, index) => {
//                 const sectionId = `section${index}`;
//                 return (
//                     <div key={index} id={sectionId} className="accordion__section" onClick={() => toggleSection(sectionId)}>
//                         <div className="accordion__label">{fileName}</div>
//                         <div className="accordion__content" onClick={e => e.stopPropagation()}>
//                             <CodeExample fileName={fileName} />
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// export default DynamicAccordionExampleCode;

// DynamicAccordion.js
// 'use client';
// import React, { useState, useEffect } from 'react';
// import './AccordionToggle2.css';
// import './Accordion.css';
// import '../code-example/CodeExample.css'
// import AceEditorComponent from '../ace-editor/AceEditorComponent';
// import MermaidDiagram from '../mermaid-diagram/MermaidDiagram';
// import MarkdownComponent from '../markdown-component/MarkdownComponent';

// function DynamicAccordionExampleCode({ data,width }) {
//     const [contents, setContents] = useState(data.map(() => ({ code: '', mermaid:'', markdown: '' })));

//     useEffect(() => {
//         data.forEach((fileName, index) => {
//             async function fetchContent() {
//                 try {
//                     const module = await import(`../../api/db/content/C/${fileName}`);
//                     setContents(prevContents => {
//                         const newContents = [...prevContents];
//                         newContents[index] = {
//                             code: module.code,
//                             mermaid: module.mermaid,
//                             markdown: module.markdown
//                         };
//                         return newContents;
//                     });
//                 } catch (error) {
//                     console.error('Failed to load the content file:', error);
//                 }
//             }
//             fetchContent();
//         });
//     }, [data]);

//     const toggleSection = (sectionId) => {
//         const section = document.getElementById(sectionId);
//         if (section) {
//             section.classList.toggle('open');
//             if (section.classList.contains('open')) {
//                 section.scrollIntoView({ behavior: 'smooth', block: 'start' });
//             }
//         }
//     };

//     return (
//         <div className="accordion" style={{width:`${width}`}}>
//             {data.map((fileName, index) => {
//                 const sectionId = `section${index}`;
//                 return (
//                     <div key={index} id={sectionId} className="accordion__section" onClick={() => toggleSection(sectionId)}>
//                         <div className="accordion__label">{fileName}</div>
//                         <div className="accordion__content">
//                             <div className='outer-container'>
//                                 <div className='upper-row'>
//                                     <div className='left'>
//                                         <AceEditorComponent
//                                             code={contents[index].code}
//                                             fontSize={12}
//                                             mode={'python'}
//                                             theme={'twilight'} />
//                                     </div>
//                                     <div className='right'>
//                                         <MermaidDiagram
//                                             chartDefinition={contents[index].mermaid} />
//                                     </div>
//                                 </div>
//                                 <div className='markdown'>
//                                     <MarkdownComponent article={contents[index].markdown} />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// export default DynamicAccordionExampleCode;

// 'use client'
// import React, { useState, useEffect } from 'react';
// import './AccordionToggle2.css';
// import './Accordion.css';
// import '../code-example/CodeExample.css';
// import AceEditorComponent from '../ace-editor/AceEditorComponent';
// import MermaidDiagram from '../mermaid-diagram/MermaidDiagram';
// import MarkdownComponent from '../markdown-component/MarkdownComponent';

// function DynamicAccordionExampleCode({ data, width }) {
//     const [contents, setContents] = useState(data.map(() => ({ code: '', mermaid:'', markdown: '' })));

//     useEffect(() => {
//         data.forEach((fileName, index) => {
//             async function fetchContent() {
//                 try {
//                     const module = await import(`../../api/db/content/C/${fileName}`);
//                     setContents(prevContents => {
//                         const newContents = [...prevContents];
//                         newContents[index] = {
//                             code: module.code,
//                             mermaid: module.mermaid,
//                             markdown: module.markdown
//                         };
//                         return newContents;
//                     });
//                 } catch (error) {
//                     console.error('Failed to load the content file:', error);
//                 }
//             }
//             fetchContent();
//         });
//     }, [data]);

//     const toggleSection = (sectionId) => {
//         const section = document.getElementById(sectionId);
//         if (section) {
//             section.classList.toggle('open');
//             if (section.classList.contains('open')) {
//                 section.scrollIntoView({ behavior: 'smooth', block: 'start' });
//             }
//         }
//     };

//     return (
//         <div className="accordion" style={{width: width}}>
//             {data.map((fileName, index) => {
//                 const sectionId = `section${index}`;
//                 return (
//                     <div key={index} id={sectionId} className="accordion__section" onClick={() => toggleSection(sectionId)}>
//                         <div className="accordion__label">{fileName}</div>
//                         <div className="accordion__content">
//                             <div className='outer-container'>
//                                 <div className='upper-row'>
//                                     <div className='left'>
//                                         <AceEditorComponent
//                                             code={contents[index].code}
//                                             fontSize={12}
//                                             mode={'python'}
//                                             theme={'twilight'} />
//                                     </div>
//                                     <div className='right'>
//                                         <MermaidDiagram
//                                             key={contents[index].mermaid} // Ensure Mermaid diagrams are re-rendered when content changes
//                                             chartDefinition={contents[index].mermaid} />
//                                     </div>
//                                 </div>
//                                 <div className='markdown'>
//                                     <MarkdownComponent article={contents[index].markdown} />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// export default DynamicAccordionExampleCode;
// 'use client'
// import React, { useState, useEffect } from 'react';
// import AceEditorComponent from '../ace-editor/AceEditorComponent';
// import MermaidDiagram from '../mermaid-diagram/MermaidDiagram';
// import MarkdownComponent from '../markdown-component/MarkdownComponent';
// import '../code-example/CodeExample.css';

// function DynamicAccordionExampleCode({ data, width }) {
//     // Initialize state with placeholders based on the incoming data array
//     const [contents, setContents] = useState(data.map(() => ({ code: '', markdown: '' })));
//     const [mermaidContents, setMermaidContents] = useState(data.map(() => ''));

//     useEffect(() => {
//         data.forEach((fileName, index) => {
//             async function fetchContent() {
//                 try {
//                     const module = await import(`../../api/db/content/C/${fileName}`);
//                     setContents(prevContents => {
//                         const newContents = [...prevContents];
//                         newContents[index] = {
//                             code: module.code,
//                             markdown: module.markdown
//                         };
//                         return newContents;
//                     });
//                     setMermaidContents(prevMermaids => {
//                         const newMermaids = [...prevMermaids];
//                         newMermaids[index] = module.mermaid;
//                         return newMermaids;
//                     });
//                 } catch (error) {
//                     console.error('Failed to load the content file:', error);
//                 }
//             }
//             fetchContent();
//         });
//     }, [data]);

//     // Handler to toggle the visibility of sections
//     const toggleSection = (sectionId) => {
//         const section = document.getElementById(sectionId);
//         if (section) {
//             section.classList.toggle('open');
//             if (section.classList.contains('open')) {
//                 section.scrollIntoView({ behavior: 'smooth', block: 'start' });
//             }
//         }
//     };

//     return (
//         <div className="accordion" style={{width: width}}>
//             {data.map((fileName, index) => {
//                 const sectionId = `section${index}`;
//                 return (
//                     <div key={index} id={sectionId} className="accordion__section" onClick={() => toggleSection(sectionId)}>
//                         <div className="accordion__label">{fileName}</div>
//                         <div className="accordion__content">
//                             <div className='outer-container'>
//                                 <div className='upper-row'>
//                                     <div className='left'>
//                                         <AceEditorComponent
//                                             code={contents[index].code}
//                                             fontSize={12}
//                                             mode={'python'}
//                                             theme={'twilight'} />
//                                     </div>
//                                     <div className='right'>
//                                         <MermaidDiagram
//                                             chartDefinition={mermaidContents[index]} />
//                                     </div>
//                                 </div>
//                                 <div className='markdown'>
//                                     <MarkdownComponent article={contents[index].markdown} />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// export default DynamicAccordionExampleCode;
// 'use client'
// import React, { useState, useEffect } from 'react';
// import './AccordionToggle2.css';
// import './Accordion.css';
// import AceEditorComponent from '../ace-editor/AceEditorComponent';
// import MermaidDiagram from '../mermaid-diagram/MermaidDiagram';
// import MarkdownComponent from '../markdown-component/MarkdownComponent';
// import '../code-example/CodeExample.css';

// function DynamicAccordionExampleCode({ data, width }) {
//     const [contents, setContents] = useState(data.map(() => ({ code: '', mermaid: '', markdown: '' })));

//     // useEffect(() => {
//     //     data.forEach((fileName, index) => {
//     //         async function fetchContent() {
//     //             try {
//     //                 const module = await import(`../../api/db/content/C/${fileName}`);
//     //                 setContents(prevContents => {
//     //                     const newContents = [...prevContents];
//     //                     newContents[index] = {
//     //                         code: module.code,
//     //                         mermaid: module.mermaid,
//     //                         markdown: module.markdown
//     //                     };
//     //                     return newContents;
//     //                 });
//     //             } catch (error) {
//     //                 console.error('Failed to load the content file:', error);
//     //             }
//     //         }
//     //         fetchContent();
//     //     });
//     // }, [data]);

//         useEffect(() => {
//         data.forEach((fileName, index) => {
//             async function fetchContent() {
//                 try {
//                     const module = await import(`../../api/db/content/C/${fileName}`);
//                     setContents(prevContents => {
//                         const newContents = [...prevContents];
//                         newContents[index] = {
//                             code: module.code,
//                             markdown: module.markdown
//                         };
//                         return newContents;
//                     });
//                     setMermaidContents(prevMermaids => {
//                         const newMermaids = [...prevMermaids];
//                         newMermaids[index] = module.mermaid;
//                         return newMermaids;
//                     });
//                 } catch (error) {
//                     console.error('Failed to load the content file:', error);
//                 }
//             }
//             fetchContent();
//         });
//     }, [data]);

//     const toggleSection = (sectionId) => {
//         const section = document.getElementById(sectionId);
//         if (section) {
//             section.classList.toggle('open');
//             if (section.classList.contains('open')) {
//                 section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//             }
//         }
//     };

//     return (
//         <div className="accordion" style={{ width }}>
//             {data.map((fileName, index) => {
//                 const sectionId = `section${index}`;
//                 return (
//                     <div key={index} id={sectionId} className="accordion__section" onClick={() => toggleSection(sectionId)}>
//                         <div className="accordion__label">{fileName}</div>
//                         <div className="accordion__content">
//                             <div className='outer-container'>
//                                 <div className='upper-row'>
//                                     <div className='left'>
//                                         <AceEditorComponent
//                                             code={contents[index].code}
//                                             fontSize={12}
//                                             mode={'python'}
//                                             theme={'twilight'} />
//                                     </div>
//                                     <div className='right'>
//                                         <MermaidDiagram
//                                             chartDefinition={contents[index].mermaid} />
//                                     </div>
//                                 </div>
//                                 <div className='markdown'>
//                                     <MarkdownComponent article={contents[index].markdown} />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// export default DynamicAccordionExampleCode;
// 'use client'
// import React, { useState, useEffect } from 'react';
// import AceEditorComponent from '../ace-editor/AceEditorComponent';
// import MermaidDiagram from '../mermaid-diagram/MermaidDiagram';
// import MarkdownComponent from '../markdown-component/MarkdownComponent';
// import '../code-example/CodeExample.css';
// import './AccordionToggle2.css';
// import './Accordion.css'
// import SimpleCodeExample from '../code-example/SimpleCodeExample';

// function DynamicAccordionExampleCode({ data, width,link }) {
//     // Initialize state with placeholders based on the incoming data array
//     const [contents, setContents] = useState(data.map(() => ({ code: '', markdown: '' })));
//     const [mermaidContents, setMermaidContents] = useState(data.map(() => ''));

    
//     useEffect(() => {
//         console.log("Initial data:", data);
//         data.forEach((fileName, index) => {
//             async function fetchContent() {
//                 console.log(`Fetching content for: ${fileName}`);
//                 try {
//                     const module = await import(`../../api/db/content/C/${fileName}`);
//                     console.log("Fetched module:", module);
//                     setContents(prevContents => {
//                         const newContents = [...prevContents];
//                         newContents[index] = {
//                             code: module.code,
//                             markdown: module.markdown
//                         };
//                         console.log("Updated contents:", newContents);
//                         return newContents;
//                     });
//                     setMermaidContents(prevMermaids => {
//                         const newMermaids = [...prevMermaids];
//                         newMermaids[index] = module.mermaid;
//                         console.log("Updated Mermaid contents:", newMermaids);
//                         return newMermaids;
//                     });
//                 } catch (error) {
//                     console.error('Failed to load the content file:', error);
//                 }
//             }
//             fetchContent();
//         });
//     }, [data]);
    

    

//     const toggleSection = (sectionId) => {
//         console.log(`Toggling section: ${sectionId}`); // Debug output to ensure function is called
//         const section = document.getElementById(sectionId);
//         if (section) {
//             section.classList.toggle('open');
//             if (section.classList.contains('open')) {
//                 section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//             }
//         } else {
//             console.error(`No section found with ID: ${sectionId}`); // Error output if no section found
//         }
//     };
//     const preventClose = (event) => {
//         event.stopPropagation();
//     };
  

//     return (
//         <div className="accordion" style={{width: width}}>
//             {data.map((fileName, index) => {
//                 const sectionId = `section${index}`;
//                 return (
//                     <div key={index} id={sectionId} className="accordion__section" onClick={() => toggleSection(sectionId)}>
//                         <div className="accordion__label">{fileName}</div>
//                         <div className="accordion__content" onClick={preventClose}>
//                             <div className='outer-container'>
//                                 <div className='upper-row'>
//                                     <div className='left'>
//                                         <AceEditorComponent
//                                             code={contents[index].code}
//                                             fontSize={12}
//                                             mode={'python'}
//                                             theme={'twilight'} />
//                                     </div>
//                                     <div className='right'>
//                                         <MermaidDiagram
//                                             chartDefinition={mermaidContents[index]} />
//                                     </div>
//                                 </div>
//                                 <div className='markdown'>
//                                     <MarkdownComponent article={contents[index].markdown} />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
   
    
// }

// export default DynamicAccordionExampleCode;
// 'use client'
// import React, { useState, useEffect } from 'react';
// import './AccordionToggle2.css';
// import './Accordion.css';
// import '../code-example/CodeExample.css'; // Correctly including this CSS import
// import AceEditorComponent from '../ace-editor/AceEditorComponent';
// import MermaidDiagram from '../mermaid-diagram/MermaidDiagram';
// import MarkdownComponent from '../markdown-component/MarkdownComponent';
// import Link from 'next/link'; // Assuming this is a Next.js project

// function DynamicAccordionExampleCode({ data, width, link }) {
//     const [contents, setContents] = useState(data.map(() => ({ code: '', markdown: '', mermaid: '' })));
//     const [openIndex, setOpenIndex] = useState(null); // State to track the open section

//     useEffect(() => {
//         data.forEach((fileName, index) => {
//             async function fetchContent() {
//                 try {
//                     const module = await import(`../../api/db/content/C/${fileName}`);
//                     setContents(prevContents => {
//                         const newContents = [...prevContents];
//                         newContents[index] = {
//                             code: module.code,
//                             markdown: module.markdown,
//                             mermaid: module.mermaid
//                         };
//                         return newContents;
//                     });
//                 } catch (error) {
//                     console.error('Failed to load the content file:', error);
//                 }
//             }
//             fetchContent();
//         });
//     }, [data]);

//     const toggleSection = (index) => {
//         setOpenIndex(openIndex === index ? null : index);
//     };

//     const preventClose = (event) => {
//         event.stopPropagation();
//     };

//     return (
//         <div className="accordion" style={{ width: width }}>
//             {contents.map((content, index) => {
//                 const sectionId = `section${index}`;
//                 return (
//                     <div key={index} id={sectionId} className="accordion__section" onClick={() => toggleSection(index)}>
//                         <div className="accordion__label">{data[index]}</div>
//                         <div className="accordion__content" style={{ display: openIndex === index ? 'block' : 'none' }} onClick={preventClose}>
//                             <div className='outer-container'>
//                                 <div className='upper-row'>
//                                     <div className='left'>
//                                         <AceEditorComponent
//                                             code={content.code}
//                                             fontSize={12}
//                                             mode={'python'}
//                                             theme={'twilight'} />
//                                     </div>
//                                     <div className='right'>
//                                         <MermaidDiagram
//                                             chartDefinition={content.mermaid} />
//                                     </div>
//                                 </div>
//                                 <div className='markdown'>
//                                     <MarkdownComponent article={content.markdown} />
//                                 </div>
//                                 {link && content.function && (
//                                     <Link href={`${link}${encodeURIComponent(content.function.split('(')[0])}`} className='link'>
//                                         Go to Page
//                                     </Link>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// export default DynamicAccordionExampleCode;
// 'use client'
// import React, { useState, useEffect } from 'react';
// import './AccordionToggle2.css';
// import './Accordion.css';
// import '../code-example/CodeExample.css';
// import AceEditorComponent from '../ace-editor/AceEditorComponent';
// import MermaidDiagram from '../mermaid-diagram/MermaidDiagram';
// import MarkdownComponent from '../markdown-component/MarkdownComponent';

// function DynamicAccordionExampleCode({ data, width }) {
//     const [contents, setContents] = useState(data.map(() => ({ code: '', markdown: '' })));
//     const [mermaidContents, setMermaidContents] = useState(data.map(() => ''));

//     useEffect(() => {
//         data.forEach((fileName, index) => {
//             async function fetchContent() {
//                 try {
//                     const module = await import(`../../api/db/content/C/${fileName}`);
//                     setContents(prev => {
//                         const updatedContents = [...prev];
//                         updatedContents[index] = {
//                             code: module.code,
//                             markdown: module.markdown
//                         };
//                         return updatedContents;
//                     });
//                     setMermaidContents(prev => {
//                         const updatedMermaids = [...prev];
//                         updatedMermaids[index] = module.mermaid;
//                         return updatedMermaids;
//                     });
//                 } catch (error) {
//                     console.error(`Failed to load the content file ${fileName}:`, error);
//                 }
//             }
//             fetchContent();
//         });
//     }, [data]);

//     const toggleSection = (sectionId) => {
//         const section = document.getElementById(sectionId);
//         if (section) {
//             section.classList.toggle('open');
//             if (section.classList.contains('open')) {
//                 section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//             }
//         }
//     };

//     const preventClose = (event) => {
//         event.stopPropagation();
//     };

//     return (
//         <div className="accordion" style={{ width }}>
//             {data.map((fileName, index) => {
//                 const sectionId = `section${index}`;
//                 return (
//                     <div key={index} id={sectionId} className="accordion__section" onClick={() => toggleSection(sectionId)}>
//                         <div className="accordion__label">{fileName}</div>
//                         <div className="accordion__content" onClick={preventClose}>
//                             <div className='outer-container'>
//                                 <div className='upper-row'>
//                                     <div className='left'>
//                                         <AceEditorComponent
//                                             code={contents[index].code}
//                                             fontSize={12}
//                                             mode={'python'}
//                                             theme={'twilight'} />
//                                     </div>
//                                     <div className='right'>
//                                         <MermaidDiagram
//                                             chartDefinition={mermaidContents[index]} />
//                                     </div>
//                                 </div>
//                                 <div className='markdown'>
//                                     <MarkdownComponent article={contents[index].markdown} />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// export default DynamicAccordionExampleCode;

'use client'
import React, { useState, useEffect } from 'react';
import './AccordionToggle2.css';
import './Accordion.css';
import '../code-example/CodeExample.css';
import AceEditorComponent from '../ace-editor/AceEditorComponent';
import MermaidDiagram from '../mermaid-diagram/MermaidDiagram';
import MarkdownComponent from '../markdown-component/MarkdownComponent';

function DynamicAccordionExampleCode({ data, width }) {
    const [contents, setContents] = useState(data.map(() => ({ code: '', markdown: '' })));
    const [mermaidContents, setMermaidContents] = useState(data.map(() => ''));

    useEffect(() => {
        data.forEach((fileName, index) => {
            async function fetchContent() {
                try {
                    const contentModule = await import(`../../api/db/content/C/${fileName}`);
                    setContents(prev => {
                        const updatedContents = [...prev];
                        updatedContents[index] = {
                            code: contentModule.code,
                            markdown: contentModule.markdown
                        };
                        return updatedContents;
                    });
                    setMermaidContents(prev => {
                        const updatedMermaids = [...prev];
                        updatedMermaids[index] = contentModule.mermaid;
                        return updatedMermaids;
                    });
                } catch (error) {
                    console.error(`Failed to load the content file ${fileName}:`, error);
                }
            }
            fetchContent();
        });
    }, [data]);

    const toggleSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.toggle('open');
            if (section.classList.contains('open')) {
                section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    };

    const preventClose = (event) => {
        event.stopPropagation();
    };

    return (
        <div className="accordion" style={{ width }}>
            {data.map((fileName, index) => {
                const sectionId = `section${index}`;
                return (
                    <div key={index} id={sectionId} className="accordion__section" onClick={() => toggleSection(sectionId)}>
                        <div className="accordion__label">{fileName}</div>
                        <div className="accordion__content" onClick={preventClose}>
                            <div className='outer-container'>
                                <div className='upper-row'>
                                    <div className='left'>
                                        <AceEditorComponent
                                            code={contents[index].code}
                                            fontSize={12}
                                            mode={'python'}
                                            theme={'twilight'} />
                                    </div>
                                    <div className='right'>
                                        <MermaidDiagram
                                            chartDefinition={mermaidContents[index]} />
                                    </div>
                                </div>
                                <div className='markdown'>
                                    <MarkdownComponent article={contents[index].markdown} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default DynamicAccordionExampleCode;



