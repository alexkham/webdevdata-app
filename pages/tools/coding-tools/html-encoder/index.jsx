import Head from 'next/head';
import HTMLEncoder from '@/app/components/html-encoder/HTMLEncoder';
import styles from './HTMLEncoderPage.module.css';
import '../../../pages.css'
import MyNavbar from '@/app/components/nav-bar/MyNavbar';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';

export default function HTMLEncoderPage({ explanations }) {
  return (
    <div className={styles.page}>
      <Head>
        <title>HTML Encoder and Decoder Tool</title>
        <meta name="description" content="Encode and decode HTML easily with our free online tool. Convert special characters to HTML entities and vice versa. Learn about HTML encoding importance and use cases." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MyNavbar></MyNavbar>
      <br></br>
      <br></br>
      <Breadcrumb></Breadcrumb>
       
       
       <h1 className='title' style={{marginBottom:'-40px',marginTop:'-40px'}}>HTML Encoder/Decoder</h1>
      <main className={styles.main}>
        <div className={styles.encoderSection}>
          <HTMLEncoder />
        </div>
        <div className={styles.explanationSection}>
          <div className={styles.explanationContent}>
            <h2>HTML Encoding/Decoding Explained</h2>
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
  );
}

export async function getStaticProps() {
    const explanations = [
      {
        title: "What is HTML Encoding?",
        content: [
          "HTML encoding is the process of converting special characters into their corresponding HTML entities. This ensures that text is displayed correctly in web browsers and prevents potential security issues.",
          "For example, the '<' symbol is encoded as '&lt;', and '>' is encoded as '&gt;'. This process is crucial for maintaining the integrity of HTML structure and content."
        ]
      },
      {
        title: "Why is HTML Encoding Important?",
        content: [
          "1. Security: HTML encoding helps prevent cross-site scripting (XSS) attacks by ensuring that user-supplied content is displayed as text rather than executed as code.",
          "2. Data Integrity: When storing or transmitting HTML content, encoding special characters helps maintain the integrity of the data, preventing unintended parsing or rendering issues.",
          "3. Compatibility: Some systems or databases may have restrictions on certain characters. Encoding HTML ensures that the content can be safely stored and retrieved without losing information.",
          "4. Proper Rendering: Encoding ensures that special characters are displayed correctly in different browsers and devices.",
          "5. SEO: Properly encoded content can improve how search engines interpret and index your pages."
        ]
      },
      {
        title: "Common HTML Entities",
        content: [
          "Some frequently used HTML entities include:",
          "• &lt; for <",
          "• &gt; for >",
          "• &amp; for &",
          "• &quot; for \"",
          "• &#039; for '",
          "• &nbsp; for a non-breaking space"
        ]
      },
      {
        title: "Use Cases for HTML Encoding/Decoding",
        content: [
          "1. Web Development: When dynamically inserting user-generated content into HTML pages.",
          "2. Content Management Systems: For safely storing and displaying user-submitted content.",
          "3. API Integration: When sending or receiving data through APIs, ensuring content is properly escaped.",
          "4. Email Templates: For creating HTML email templates that render correctly across different email clients.",
          "5. Data Migration: When moving content between different systems or databases.",
          "6. Scraping and Parsing: When extracting data from HTML documents, decoding may be necessary to retrieve the original content."
        ]
      },
      {
        title: "Benefits of Using an HTML Encoder/Decoder Tool",
        content: [
          "1. Efficiency: Quickly convert between raw and encoded versions of HTML content.",
          "2. Accuracy: Eliminate manual errors in encoding or decoding.",
          "3. Debugging: Easily identify issues related to improper encoding in HTML content.",
          "4. Learning: Understand how special characters are represented in HTML.",
          "5. Accessibility: Ensure that encoded content is properly interpreted by screen readers and other assistive technologies.",
          "6. Cross-platform Compatibility: Ensure content displays correctly across different operating systems and devices."
        ]
      },
      {
        title: "Best Practices for HTML Encoding",
        content: [
          "1. Always encode user-generated content before displaying it on a webpage.",
          "2. Use appropriate encoding based on the context (HTML, XML, URL, etc.).",
          "3. Be cautious when decoding content from untrusted sources.",
          "4. Regularly audit your codebase for proper encoding practices.",
          "5. Use server-side encoding when possible for better security.",
          "6. Don't forget to encode content in attributes, not just in HTML body text.",
          "7. Be aware of double-encoding issues, which can occur when content is encoded multiple times."
        ]
      },
      {
        title: "HTML Encoding vs URL Encoding",
        content: [
          "While HTML encoding and URL encoding serve similar purposes, they are used in different contexts:",
          "• HTML encoding is used within HTML documents to represent special characters.",
          "• URL encoding is used in URLs to ensure that special characters are properly transmitted in web requests.",
          "It's important to use the correct type of encoding for each situation to avoid issues with content display or data transmission."
        ]
      }
    ];
  
    return {
      props: {
        explanations,
      },
    };
  }