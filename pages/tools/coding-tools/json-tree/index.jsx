// // import Head from 'next/head';
// // import JSONTreeViewer from '@/app/components/json/JsonTreeViewer';
// // import '../../../pages.css'
// // import MyNavbar from '@/app/components/nav-bar/MyNavbar';
// // import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
// // import styles from './JSONTreeViewerPage.module.css'
// // import Layout from '@/pages/Layout';
// // import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';

// // export default function JSONTreeViewerPage({ explanations }) {
// //   return (
// //     <Layout>
// //       <div className={styles.page}>
// //         <Head>
// //           <title>JSON Tree Viewer Tool</title>
// //           <meta name="description" content="Visualize and explore your JSON data with our free online JSON Tree Viewer. Easy-to-use tool for developers and data analysts." />
// //           <meta name="viewport" content="width=device-width, initial-scale=1" />
// //           <link rel="icon" href="/favicon.ico" />
// //         </Head>
        
// //         <br />
// //         <br />
// //         <Breadcrumb />
         
// //         <h1 className='title' style={{marginBottom:'20px',marginTop:'20px'}}>JSON Tree Viewer</h1>
        
// //         <div className={styles.viewerSection}>
// //           <JSONTreeViewer />
// //         </div>

// //         <div className={styles.explanationSection}>
// //           <h2>JSON Tree Viewer Explained</h2>
// //           {explanations.map((section, index) => (
// //             <div key={index} className={styles.explanationBlock}>
// //               <h3>{section.title}</h3>
// //               {section.content.map((paragraph, pIndex) => (
// //                 <p key={pIndex}>{paragraph}</p>
// //               ))}
// //             </div>
// //           ))}
// //         </div>
// //       </div>
      
// //       <ScrollUpButton />
// //     </Layout>
// //   );
// // }

// // // export async function getStaticProps() {
// // //   const explanations = [
// // //     {
// // //       title: "What is a JSON Tree Viewer?",
// // //       content: [
// // //         "A JSON Tree Viewer is a tool that visually represents JSON (JavaScript Object Notation) data in a hierarchical, tree-like structure. It allows users to easily navigate and explore complex JSON structures, making it invaluable for developers, data analysts, and anyone working with JSON data."
// // //       ]
// // //     },
// // //     // ... (rest of the explanations remain the same)
// // //   ];

// // //   return {
// // //     props: {
// // //       explanations,
// // //     },
// // //   };
// // // }

// // export async function getStaticProps() {
// //   const explanations = [
// //     {
// //       title: "What is a JSON Tree Viewer?",
// //       content: [
// //         "A JSON Tree Viewer is a tool that visually represents JSON (JavaScript Object Notation) data in a hierarchical, tree-like structure. It allows users to easily navigate and explore complex JSON structures, making it invaluable for developers, data analysts, and anyone working with JSON data."
// //       ]
// //     },
// //     {
// //       title: "Why Use a JSON Tree Viewer?",
// //       content: [
// //         "1. Improved Readability: Transforms raw JSON text into an easy-to-read visual format.",
// //         "2. Easy Navigation: Allows collapsing and expanding of nested objects and arrays.",
// //         "3. Data Exploration: Helps in understanding the structure of complex JSON data.",
// //         "4. Debugging Aid: Useful for identifying issues in JSON data structures.",
// //         "5. Time-Saving: Quickly locate specific data points within large JSON objects."
// //       ]
// //     },
// //     {
// //       title: "Features of Our JSON Tree Viewer",
// //       content: [
// //         "1. Collapsible Nodes: Expand or collapse nested objects and arrays.",
// //         "2. Syntax Highlighting: Different colors for keys, strings, numbers, and booleans.",
// //         "3. Copy Functionality: Easily copy entire JSON or specific nodes.",
// //         "4. Error Detection: Identifies and highlights JSON syntax errors.",
// //         "5. Responsive Design: Works well on both desktop and mobile devices."
// //       ]
// //     },
// //     {
// //       title: "How to Use This JSON Tree Viewer",
// //       content: [
// //         "1. Paste or type your JSON data into the input area.",
// //         "2. Click 'View Tree' to generate the tree view.",
// //         "3. Use the expand/collapse icons to navigate through the JSON structure.",
// //         "4. Copy data as needed using the copy functionality.",
// //         "5. Use the 'Reset' button to clear the viewer and start over."
// //       ]
// //     },
// //     {
// //       title: "Common Use Cases",
// //       content: [
// //         "1. API Response Analysis: Examine the structure of API responses.",
// //         "2. Configuration File Inspection: Review complex configuration files in JSON format.",
// //         "3. Data Validation: Quickly verify the structure of JSON data.",
// //         "4. Educational Tool: Learn about JSON structure and formatting.",
// //         "5. Debugging: Identify issues in JSON-based data transfers or storage."
// //       ]
// //     },
// //     {
// //       title: "Best Practices When Working with JSON",
// //       content: [
// //         "1. Validate JSON Structure: Always ensure your JSON is well-formed.",
// //         "2. Use Consistent Formatting: Maintain a consistent style in your JSON data.",
// //         "3. Limit Nesting: Avoid overly deep nesting for better readability.",
// //         "4. Use Descriptive Keys: Choose clear and meaningful names for JSON keys.",
// //         "5. Handle Large Files Carefully: Be aware of performance implications with very large JSON files.",
// //         "6. Regular Backups: Always keep backups of important JSON data before making changes."
// //       ]
// //     }
// //   ];

// //   return {
// //     props: {
// //       explanations,
// //     },
// //   };
// // }
// import Head from 'next/head';
// import JSONTreeViewer from '@/app/components/json/JsonTreeViewer';
// import '../../../pages.css'
// import MyNavbar from '@/app/components/nav-bar/MyNavbar';
// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
// import styles from './JSONTreeViewerPage.module.css'
// import Layout from '@/pages/Layout';
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';

// export default function JSONTreeViewerPage({ explanations }) {
//   return (
//     <Layout>
//       <div className={styles.page}>
//         <Head>
//           <title>JSON Tree Viewer Tool</title>
//           <meta name="description" content="Visualize and explore your JSON data with our free online JSON Tree Viewer. Easy-to-use tool for developers and data analysts." />
//           <meta name="viewport" content="width=device-width, initial-scale=1" />
//           <link rel="icon" href="/favicon.ico" />
//         </Head>
        
//         <br />
//         <br />
//         <Breadcrumb />
         
//         <h1 className='title' style={{marginBottom:'-60px',marginTop:'-50px'}}>JSON Tree Viewer</h1>
        
//         <div className={styles.viewerSection}>
//           <JSONTreeViewer />
//         </div>

//         <div className={styles.explanationSection}>
//           <h2>JSON Tree Viewer Explained</h2>
//           {explanations && explanations.map((section, index) => (
//             <div key={index} className={styles.explanationBlock}>
//               <h3>{section.title}</h3>
//               {section.content.map((paragraph, pIndex) => (
//                 <p key={pIndex}>{paragraph}</p>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
      
//       <ScrollUpButton />
//     </Layout>
//   );
// }

// export async function getStaticProps() {
//   const explanations = [
//     {
//       title: "What is a JSON Tree Viewer?",
//       content: [
//         "A JSON Tree Viewer is a tool that visually represents JSON (JavaScript Object Notation) data in a hierarchical, tree-like structure. It allows users to easily navigate and explore complex JSON structures, making it invaluable for developers, data analysts, and anyone working with JSON data."
//       ]
//     },
//     {
//       title: "Why Use a JSON Tree Viewer?",
//       content: [
//         "1. Improved Readability: Transforms raw JSON text into an easy-to-read visual format.",
//         "2. Easy Navigation: Allows collapsing and expanding of nested objects and arrays.",
//         "3. Data Exploration: Helps in understanding the structure of complex JSON data.",
//         "4. Debugging Aid: Useful for identifying issues in JSON data structures.",
//         "5. Time-Saving: Quickly locate specific data points within large JSON objects."
//       ]
//     },
//     {
//       title: "Features of Our JSON Tree Viewer",
//       content: [
//         "1. Collapsible Nodes: Expand or collapse nested objects and arrays.",
//         "2. Syntax Highlighting: Different colors for keys, strings, numbers, and booleans.",
//         "3. Copy Functionality: Easily copy entire JSON or specific nodes.",
//         "4. Error Detection: Identifies and highlights JSON syntax errors.",
//         "5. Responsive Design: Works well on both desktop and mobile devices."
//       ]
//     },
//     {
//       title: "How to Use This JSON Tree Viewer",
//       content: [
//         "1. Paste or type your JSON data into the input area.",
//         "2. Click 'View Tree' to generate the tree view.",
//         "3. Use the expand/collapse icons to navigate through the JSON structure.",
//         "4. Copy data as needed using the copy functionality.",
//         "5. Use the 'Reset' button to clear the viewer and start over."
//       ]
//     },
//     {
//       title: "Common Use Cases",
//       content: [
//         "1. API Response Analysis: Examine the structure of API responses.",
//         "2. Configuration File Inspection: Review complex configuration files in JSON format.",
//         "3. Data Validation: Quickly verify the structure of JSON data.",
//         "4. Educational Tool: Learn about JSON structure and formatting.",
//         "5. Debugging: Identify issues in JSON-based data transfers or storage."
//       ]
//     },
//     {
//       title: "Best Practices When Working with JSON",
//       content: [
//         "1. Validate JSON Structure: Always ensure your JSON is well-formed.",
//         "2. Use Consistent Formatting: Maintain a consistent style in your JSON data.",
//         "3. Limit Nesting: Avoid overly deep nesting for better readability.",
//         "4. Use Descriptive Keys: Choose clear and meaningful names for JSON keys.",
//         "5. Handle Large Files Carefully: Be aware of performance implications with very large JSON files.",
//         "6. Regular Backups: Always keep backups of important JSON data before making changes."
//       ]
//     }
//   ];

//   return {
//     props: {
//       explanations,
//     },
//   };
// }

import Head from 'next/head';
import JSONTreeViewer from '@/app/components/json/JsonTreeViewer';
import '../../../pages.css'
import MyNavbar from '@/app/components/nav-bar/MyNavbar';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import styles from './JSONTreeViewerPage.module.css'
import Layout from '@/pages/Layout';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';

export default function JSONTreeViewerPage({ explanations }) {
  return (
    <Layout>
      <div className={styles.page}>
        {/* <Head>
          <title>JSON Tree Viewer Tool</title>
          <meta name="description" content="Visualize and explore your JSON data with our free online JSON Tree Viewer. Easy-to-use tool for developers and data analysts." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head> */}
        <Head>
        <title>JSON Tree Viewer | Visualize and Explore JSON Data</title>
        <meta name="description" content="Free online JSON Tree Viewer. Visualize, navigate, and explore complex JSON structures easily. Essential tool for developers, data analysts, and API testing." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https:/webdevdata.net/tools/coding-tools/json-tree" />
        <meta property="og:title" content="JSON Tree Viewer | Visualize and Explore JSON Data" />
        <meta property="og:description" content="Free online JSON Tree Viewer. Visualize and explore complex JSON structures easily. Essential for developers and data analysts." />
        <meta property="og:url" content="https:/webdevdata.net/tools/coding-tools/json-tree" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="JSON Tree Viewer | Visualize and Explore JSON Data" />
        <meta name="twitter:description" content="Free online JSON Tree Viewer. Visualize and explore complex JSON structures easily. Essential for developers and data analysts." />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
        <br />
        <br />
        <Breadcrumb />
         
        <h1 className='title' style={{marginBottom:'-60px',marginTop:'-50px'}}>JSON Tree Viewer</h1>
        
        <div className={styles.viewerSection}>
          <JSONTreeViewer />
        </div>

        {explanations && explanations.length > 0 ? (
          <div className={styles.explanationSection}>
            <h2>JSON Tree Viewer Explained</h2>
            {explanations.map((section, index) => (
              <div key={index} className={styles.explanationBlock}>
                <h3>{section.title}</h3>
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p>No explanations available at the moment.</p>
        )}
      </div>
      
      <ScrollUpButton />
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const explanations = [
      {
        title: "What is a JSON Tree Viewer?",
        content: [
          "A JSON Tree Viewer is a tool that visually represents JSON (JavaScript Object Notation) data in a hierarchical, tree-like structure. It allows users to easily navigate and explore complex JSON structures, making it invaluable for developers, data analysts, and anyone working with JSON data."
        ]
      },
      {
        title: "Why Use a JSON Tree Viewer?",
        content: [
          "1. Improved Readability: Transforms raw JSON text into an easy-to-read visual format.",
          "2. Easy Navigation: Allows collapsing and expanding of nested objects and arrays.",
          "3. Data Exploration: Helps in understanding the structure of complex JSON data.",
          "4. Debugging Aid: Useful for identifying issues in JSON data structures.",
          "5. Time-Saving: Quickly locate specific data points within large JSON objects."
        ]
      },
      {
        title: "Features of Our JSON Tree Viewer",
        content: [
          "1. Collapsible Nodes: Expand or collapse nested objects and arrays.",
          "2. Syntax Highlighting: Different colors for keys, strings, numbers, and booleans.",
          "3. Copy Functionality: Easily copy entire JSON or specific nodes.",
          "4. Error Detection: Identifies and highlights JSON syntax errors.",
          "5. Responsive Design: Works well on both desktop and mobile devices."
        ]
      },
      {
        title: "How to Use This JSON Tree Viewer",
        content: [
          "1. Paste or type your JSON data into the input area.",
          "2. Click 'View Tree' to generate the tree view.",
          "3. Use the expand/collapse icons to navigate through the JSON structure.",
          "4. Copy data as needed using the copy functionality.",
          "5. Use the 'Reset' button to clear the viewer and start over."
        ]
      },
      {
        title: "Common Use Cases",
        content: [
          "1. API Response Analysis: Examine the structure of API responses.",
          "2. Configuration File Inspection: Review complex configuration files in JSON format.",
          "3. Data Validation: Quickly verify the structure of JSON data.",
          "4. Educational Tool: Learn about JSON structure and formatting.",
          "5. Debugging: Identify issues in JSON-based data transfers or storage."
        ]
      },
      {
        title: "Best Practices When Working with JSON",
        content: [
          "1. Validate JSON Structure: Always ensure your JSON is well-formed.",
          "2. Use Consistent Formatting: Maintain a consistent style in your JSON data.",
          "3. Limit Nesting: Avoid overly deep nesting for better readability.",
          "4. Use Descriptive Keys: Choose clear and meaningful names for JSON keys.",
          "5. Handle Large Files Carefully: Be aware of performance implications with very large JSON files.",
          "6. Regular Backups: Always keep backups of important JSON data before making changes."
        ]
      }
    ];

    return {
      props: {
        explanations,
      },
    };
  } catch (error) {
    console.error("Error fetching explanations:", error);
    return {
      props: {
        explanations: [],
      },
    };
  }
}