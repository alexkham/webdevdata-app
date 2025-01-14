// import React from 'react'

// export default function HTMLEntitiesConverterPage() {
//   return (
//     <div>HTMLEntitiesConverterPage</div>
//   )
// }

import Head from 'next/head';
import HtmlEntityConverter from '@/app/components/converters/HTMLEntityConverter';
import '../../../pages.css'
import MyNavbar from '@/app/components/nav-bar/MyNavbar';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import styles from '../../coding-tools/javascript-minifier/JavaScriptMinifierPage.module.css'
import Layout from '@/pages/Layout';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';

export default function HtmlEntityConverterPage({ explanations }) {
  return (
    <Layout>
      <div className={styles.page}>
        <Head>
          <title>HTML Entities Converter Tool</title>
          <meta name="description" content="Convert text to HTML entities and vice versa with our free online tool. Encode special characters for web use and decode HTML entities back to text. Learn about HTML entities and their importance in web development." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <br />
        <br />
        <Breadcrumb />
         
        <h1 className='title' style={{marginBottom:'-40px',marginTop:'-40px'}}>HTML Entities Converter</h1>
        <main className={styles.main}>
          <div className={styles.minifierSection}>
            <HtmlEntityConverter />
          </div>
          <div className={styles.explanationSection}>
            <div className={styles.explanationContent}>
              <h2>HTML Entities Explained</h2>
              {explanations.map((section, index) => (
                <div key={index} className={styles.explanationBlock}>
                  <h3>{section.title}</h3>
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      
      <ScrollUpButton />
    </Layout>
  );
}

export async function getStaticProps() {
  const explanations = [
    {
      title: "What are HTML Entities?",
      content: [
        "HTML entities are special sequences of characters that represent symbols, characters, and other elements in HTML. They are used to display characters that have special meaning in HTML or characters that are difficult to type directly.",
        "HTML entities start with an ampersand (&) and end with a semicolon (;). They can be represented by their entity name or number."
      ]
    },
    {
      title: "Why Use HTML Entities?",
      content: [
        "1. To display reserved characters in HTML (like <, >, &).",
        "2. To represent characters not easily typed on a standard keyboard.",
        "3. To ensure proper rendering of special characters across different browsers and devices.",
        "4. To include symbols and characters from various languages and character sets.",
        "5. To improve accessibility and search engine optimization (SEO) by using semantic entities."
      ]
    },
    {
      title: "Types of HTML Entities",
      content: [
        "1. Named Entities: Easy to remember, like &amp; for &, &lt; for <, &gt; for >.",
        "2. Decimal Entities: Represented by &#[decimal number];, like &#38; for &.",
        "3. Hexadecimal Entities: Represented by &#x[hex number];, like &#x26; for &."
      ]
    },
    {
      title: "Common Use Cases",
      content: [
        "1. Displaying code snippets or XML in HTML without browser interpretation.",
        "2. Including copyright symbols, trademark symbols, and other special characters.",
        "3. Ensuring proper display of non-ASCII characters in different encoding environments.",
        "4. Creating clean, valid HTML that passes strict validation checks.",
        "5. Avoiding conflicts with JavaScript when embedding strings in HTML attributes."
      ]
    },
    {
      title: "Benefits of Using an HTML Entities Converter",
      content: [
        "1. Accuracy: Avoid manual errors in entity conversion.",
        "2. Time-saving: Quickly convert large blocks of text or complex characters.",
        "3. Flexibility: Convert between different entity representations (named, decimal, hexadecimal).",
        "4. Consistency: Ensure uniform use of entities across your website or application.",
        "5. Accessibility: Easily include a wide range of symbols and characters in your web content."
      ]
    },
    {
      title: "Best Practices for Using HTML Entities",
      content: [
        "1. Use named entities when possible for better readability.",
        "2. Always end entities with a semicolon to ensure proper rendering.",
        "3. Be consistent in your use of entities throughout your HTML documents.",
        "4. Use appropriate entities for language-specific characters in multilingual websites.",
        "5. Consider using CSS for purely presentational characters instead of HTML entities.",
        "6. Test your use of entities across different browsers and devices to ensure compatibility."
      ]
    },
    {
      title: "HTML Entities and SEO",
      content: [
        "While HTML entities are generally SEO-neutral, they can indirectly affect SEO:",
        "• Proper use of entities ensures correct rendering of content, which is important for user experience and SEO.",
        "• Using semantic entities (like &copy; for ©) can provide additional context to search engines.",
        "• Overuse of entities, especially numeric ones, can make content less readable for both users and search engines.",
        "Balance the use of entities with natural, readable text for the best SEO outcomes."
      ]
    }
  ];

  return {
    props: {
      explanations,
    },
  };
}