import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
import React from 'react';
import '../../pages.css';
import { Code, Database ,Brackets} from 'lucide-react'; 
import ExamplesPage from '@/app/components/accordion/code-example-accordion/ExamplePage';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';

export default function ExamplesPagePage() {
   
    const categoriesData = [
        {
          id: 'string-manipulation',
          category: "String Manipulation",
          explanation: "Techniques for modifying and working with strings",
          base_url: "/c-programming/examples/string",
          icon: <Code size={24} />,
          subcategories: [
            {
              id: 'substring-extraction',
              name: "Substring Extraction",
              description: "Methods to extract portions of strings"
            },
            {
              id: 'string-formatting',
              name: "String Formatting",
              description: "Techniques to format and style strings"
            },
            {
              id: 'string-manipulation',
              name: "String Manipulation",
              description: "General methods for manipulating strings"
            },
            {
              id: 'string-searching',
              name: "String Searching",
              description: "Techniques to find patterns within strings"
            },
            {
              id: 'string-compression/decompression',
              name: "String Compression/Decompression",
              description: "Techniques to compress and decompress strings"
            },
            {
              id: 'string-tokenization',
              name: "String Tokenization",
              description: "Breaking strings into tokens or smaller parts"
            },
            // {
            //   id: 'string-padding',
            //   name: "String Padding",
            //   description: "Adding characters to strings to achieve desired lengths"
            // }
          ]
        },
        {
            id: 'array-operations',
            category: "Array Operations",
            explanation: "Common operations performed on arrays",
            base_url: "/c-programming/examples/array",
            icon: <Brackets size={24} />,
            subcategories: [
              {
                id: 'array-basics',
                name: "Array Basics",
                description: "Fundamental array operations like initialization"
              },
              {
                id: 'array-iteration',
                name: "Array Iteration",
                description: "Techniques for traversing and searching arrays"
              },
              {
                id: 'array-manipulation',
                name: "Array Manipulation",
                description: "Operations that modify array contents like sorting, reversal, and rotation"
              },
              {
                id: 'multi-dimensional-arrays',
                name: "Multi-dimensional Arrays",
                description: "Operations on 2D and higher-dimensional arrays"
              },
              {
                id: 'dynamic-memory-management',
                name: "Dynamic Memory Management",
                description: "Dynamic allocation and resizing of arrays"
              }
            ]
          }
      ];

  return (
    <>
    <MyNavbar2></MyNavbar2>
    <br></br>
    <br></br>
    <br></br>
    <Breadcrumb></Breadcrumb>
    <h1 className='title' style={{marginBottom:'-30px',marginTop:'-40px', color:'#4f46e5'}}>Code Examples</h1>
    <ExamplesPage categories={categoriesData}></ExamplesPage>
    <ScrollUpButton></ScrollUpButton>
    </>
  )
}
