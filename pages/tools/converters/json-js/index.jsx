// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
// import React from 'react'
// import '../../../pages.css'
// import JsonToJsConverter from '@/app/components/converters/JsonToJsConverter'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'

// export default function JsonJsConverterPage() {

//     const keyWords=['javascript object notation json','json converter','json to object',
//         'online format json'
//     ]
//   return (
//     <>
//     <MyNavbar2/>
//     <br/>
//     <br/>
   
//     <Breadcrumb/>
//     <h1 className='title' style={{marginTop:'-40px', marginBottom:'-30px'}}>JSON to JS object converter</h1>
//     <JsonToJsConverter/>
//     <br/>
//     <br/>
//     <ScrollUpButton/>
    
//     </>
//   )
// }

import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
import React from 'react'
import '../../../pages.css'
import JsonToJsConverter from '@/app/components/converters/JsonToJsConverter'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import Head from 'next/head'
import styles from './page.module.css'

export async function getStaticProps() {
  const metadata = {
    title: 'JSON to JavaScript Object Converter | WebDevData',
    description: 'Free online tool to convert JSON to JavaScript objects. Format, validate and transform JSON data to JS objects instantly.',
    keywords: [
      'javascript object notation json',
      'json converter', 
      'json to object',
      'online format json'
    ],
    canonicalUrl: 'https://www.webdevdata.net/tools/converters/json-js',
    ogTitle: 'JSON to JavaScript Object Converter',
    ogDescription: 'Free online tool to convert JSON to JavaScript objects'
  }

  const explanations = {
    sections: [
      {
        title: 'What is JSON?',
        content: "JSON (JavaScript Object Notation) is a lightweight, language-independent data format. It was derived from JavaScript but has become a universal standard for data exchange between different systems and programming languages. JSON uses a strict text format with specific rules: property names must be in double quotes, strings use double quotes, and the available data types are limited to strings, numbers, booleans, null, arrays, and objects."
      },
      {
        title: 'What is JavaScript Object Notation?',
        content: "JavaScript object notation refers to how objects are written in JavaScript code. JavaScript objects are more flexible than JSON - they can include methods (functions), use single or double quotes for strings, accept variable names as property names without quotes, and handle a wider range of data types including undefined, Date objects, and functions."
      },
      {
        title: 'Key Differences',
        listItems: [
          "Syntax Requirements: JSON requires double quotes for strings and property names, JavaScript objects accept unquoted property names and single/double quotes for strings",
          "Data Types: JSON only supports strings, numbers, booleans, null, arrays, objects. JavaScript objects support all JSON types plus functions, dates, undefined, Maps, Sets, etc.",
          "Methods: JSON cannot contain functions, while JavaScript objects can include methods and computed properties",
          "Comments: JSON doesn't support comments, JavaScript objects have full support for comments"
        ]
      },
      {
        title: 'Why Convert JSON to JavaScript Objects?',
        listItems: [
          "Functionality: To utilize JavaScript's full feature set including methods and additional data types",
          "Data Manipulation: JavaScript objects provide direct access to powerful array methods and object operations",
          "API Integration: Most APIs return JSON data that needs to be converted to JavaScript objects for client-side processing",
          "Dynamic Operations: To add methods, computed properties, or perform complex operations that JSON doesn't support",
          "Type Compatibility: Some JavaScript frameworks and libraries require native JavaScript objects rather than JSON strings"
        ]
      }
    ]
  }
  
  return {
    props: {
      metadata,
      explanations
    }
  }
}

export default function JsonJsConverterPage({ metadata, explanations }) {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={metadata.canonicalUrl} />
        <meta property="og:title" content={metadata.ogTitle} />
        <meta property="og:description" content={metadata.ogDescription} />
        <meta property="og:url" content={metadata.canonicalUrl} />
        <meta name="robots" content="index, follow" />
      </Head>
      <MyNavbar2/>
      <br/>
      <br/>
      <Breadcrumb/>
      <h1 className='title' style={{marginTop:'-40px', marginBottom:'-30px'}}>
        JSON to JS object converter
      </h1>
      <JsonToJsConverter/>
      
      <div className={styles.explanationContainer}>
        {explanations.sections.map((section, index) => (
          <section key={index} className={styles.section}>
            <h2>{section.title}</h2>
            {section.content && <p>{section.content}</p>}
            {section.listItems && (
              <ul>
                {section.listItems.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <br/>
      <br/>
      <ScrollUpButton/>
    </>
  )
}