// import React from 'react'

// export default function JavaScriptMinifierPage() {
//   return (
//     <div>JavaScriptMinifierPage</div>
//   )
// }
import Head from 'next/head';
import JavaScriptMinifier from '@/app/components/js-minifier/JavaScriptMinifier';
import styles from './JavaScriptMinifierPage.module.css';
import '../../../pages.css'
import MyNavbar from '@/app/components/nav-bar/MyNavbar';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import Layout from '@/pages/Layout';

export default function JavaScriptMinifierPage({ explanations }) {
  return (
    <Layout>
    <div className={styles.page}>
      <Head>
        <title>JavaScript Minifier Tool</title>
        <meta name="description" content="Minify your JavaScript code easily with our free online tool. Reduce file size, improve load times, and optimize your JavaScript. Learn about JavaScript minification importance and use cases." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
      <br></br>
      <br></br>
      <Breadcrumb></Breadcrumb>
       
      <h1 className='title' style={{marginBottom:'-40px',marginTop:'-40px'}}>JavaScript Minifier</h1>
      <main className={styles.main}>
        <div className={styles.minifierSection}>
          <JavaScriptMinifier />
        </div>
        <div className={styles.explanationSection}>
          <div className={styles.explanationContent}>
            <h2>JavaScript Minification Explained</h2>
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
    </Layout>
  );
}

export async function getStaticProps() {
    const explanations = [
      {
        title: "What is JavaScript Minification?",
        content: [
          "JavaScript minification is the process of reducing the size of JavaScript code by removing unnecessary characters without changing its functionality. This includes removing white space, comments, and formatting, as well as shortening variable names when possible.",
          "Minification is an important step in optimizing web applications for faster loading and execution times."
        ]
      },
      {
        title: "Why is JavaScript Minification Important?",
        content: [
          "1. Faster Load Times: Smaller file sizes mean faster downloads, leading to improved page load times.",
          "2. Reduced Bandwidth Usage: Minified files consume less bandwidth, which is beneficial for both users and servers.",
          "3. Improved Website Performance: Smaller JavaScript files can be parsed and executed more quickly by browsers.",
          "4. Better User Experience: Faster-loading websites provide a better user experience and can lead to higher engagement rates.",
          "5. SEO Benefits: Site speed is a factor in search engine rankings, and minification can contribute to faster load times."
        ]
      },
      {
        title: "What Does JavaScript Minification Do?",
        content: [
          "1. Removes whitespace, line breaks, and comments",
          "2. Shortens variable and function names when safe to do so",
          "3. Combines multiple files into one to reduce HTTP requests",
          "4. Optimizes code constructs for size efficiency",
          "5. Removes unused code and dead code paths"
        ]
      },
      {
        title: "Use Cases for JavaScript Minification",
        content: [
          "1. Web Development: Minifying JavaScript files before deploying to production.",
          "2. Single Page Applications: Optimizing large JavaScript bundles in frameworks like React, Angular, or Vue.",
          "3. Mobile Web Apps: Ensuring fast load times on potentially slower mobile connections.",
          "4. Content Delivery Networks (CDNs): Serving minified versions of JavaScript libraries.",
          "5. WordPress and CMS Plugins: Optimizing JavaScript code in plugins and themes.",
          "6. API Responses: Minifying JavaScript code sent as part of API responses."
        ]
      },
      {
        title: "Benefits of Using a JavaScript Minifier Tool",
        content: [
          "1. Efficiency: Quickly minify JavaScript code without manual effort.",
          "2. Consistency: Ensure all JavaScript code is minified to the same standard.",
          "3. Error Prevention: Avoid introducing errors that can occur with manual minification.",
          "4. Time-Saving: Automate the minification process, freeing up developer time for other tasks.",
          "5. Customization: Many tools offer options to customize the level and type of minification.",
          "6. Integration: Can often be integrated into build processes and development workflows."
        ]
      },
      {
        title: "Best Practices for JavaScript Minification",
        content: [
          "1. Always keep an unminified version of your code for development and debugging.",
          "2. Use source maps to make debugging minified code easier.",
          "3. Test thoroughly after minification to ensure functionality is preserved.",
          "4. Consider using a build tool like Webpack or Gulp to automate minification.",
          "5. Be cautious with advanced optimizations that might alter code behavior.",
          "6. Regularly update your minification tools to benefit from the latest optimizations.",
          "7. Combine minification with other optimization techniques like code splitting and lazy loading."
        ]
      },
      {
        title: "Minification vs. Compression",
        content: [
          "While both minification and compression aim to reduce file size, they work differently:",
          "• Minification reduces file size by optimizing the code itself.",
          "• Compression (like gzip) reduces file size during transfer by encoding the file contents.",
          "For best results, use both minification and compression in your web applications."
        ]
      }
    ];
  
    return {
      props: {
        explanations,
      },
    };
  }