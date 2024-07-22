// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// import MarkdownEditor from '@/app/components/markdown-editor/MarkdownEditor'
// import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// import React from 'react'
// import '../../../pages.css'
// import Layout from '@/pages/Layout'

// export default function MarkdownEditorPage() {
//   return (
//     <Layout>
//     <br></br>
//     <br></br>
//     <br></br>
//     <Breadcrumb></Breadcrumb>
//     <h1 className='title' style={{marginTop:'-40px',marginBottom:'-40px'}} >Markdown Editor</h1>
//     <MarkdownEditor></MarkdownEditor>
//     <br></br>
//     <br></br>
//     <br></br>
//     <br></br>
//     <br></br>
//     <br></br>
//     <br></br>
//     <br></br>
//     <br></br>
//     <br></br>
//     <br></br>
//     <br></br>
//     <br></br>
//     <ScrollUpButton></ScrollUpButton>
//     </Layout>
//   )
// }
import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import MarkdownEditor from '@/app/components/markdown-editor/MarkdownEditor';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
import Layout from '@/pages/Layout';
import styles from './MarkdownEditorPage.module.css';


export default function MarkdownEditorPage({ explanations = [] }) { // Added default value here
  return (
    <Layout>
      <Head>
        <title>Markdown Editor | Create and Preview Markdown</title>
        <meta name="description" content="Free online Markdown editor with live preview. Create, edit, and visualize Markdown content easily. Perfect for developers, writers, and content creators." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://webdevdata.net/tools/markdown-editor" />
      </Head>
      <br></br>
        <br></br>
        <br></br>
       
        <Breadcrumb />
      
      <div id="page" className={styles.page}>
       
        
        <h1 className={styles.title}>Markdown Editor</h1>
        <a href="#explanations" className={styles.explanationLink}>Jump to Explanations</a>
        
        <div className={styles.editorSection}>
          <MarkdownEditor />
        </div>
        <br id="explanations"></br>
        <br></br>

        <div  className={styles.explanationSection}>
          <h2 className={styles.explanationTitle}>Markdown Explained</h2>
          {explanations.map((section, index) => (
            <div key={index} className={styles.explanationBlock}>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
              <pre className={styles.codeBlock}>
                <code>{section.code}</code>
              </pre>
              <button 
                className={styles.copyButton}
                onClick={() => navigator.clipboard.writeText(section.code)}
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <ScrollUpButton />
    </Layout>
  );
}

export async function getStaticProps() {
  const explanations = [
    {
      title: "Headers",
      description: "Create headers using '#' symbols. More '#' symbols mean smaller headers.",
      code: "# Header 1\n## Header 2\n### Header 3"
    },
    {
      title: "Emphasis",
      description: "Use asterisks or underscores for emphasis.",
      code: "*italic* or _italic_\n**bold** or __bold__\n***bold italic*** or ___bold italic___"
    },
    {
      title: "Lists",
      description: "Create ordered and unordered lists.",
      code: "1. First item\n2. Second item\n\n- Unordered item\n- Another item"
    },
    {
      title: "Links",
      description: "Create links with square brackets for text and parentheses for URL.",
      code: "[Visit Google](https://www.google.com)"
    },
    {
      title: "Images",
      description: "Similar to links, but with an exclamation mark at the start.",
      code: "![Alt text](https://example.com/image.jpg)"
    },
    {
      title: "Code",
      description: "Use backticks for inline code and triple backticks for code blocks.",
      code: "`inline code`\n\n```\ncode block\n```"
    }
  ];

  return {
    props: {
      explanations,
    },
  };
}
