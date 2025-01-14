
// import AceEditorComponent from "./components/ace-editor/AceEditorComponent";
// import GridGenerator from "./components/grid-generator/GridGenerator";
// import MethodExplorer from "./components/method-explorer/MethodExplorer";
// import {code,mermaid, markdown} from './api/db/content/C/first_content'
// import ScrollUpButton from "./components/scroll-up-button/ScrollUpButton";
// import MermaidDiagram from "./components/mermaid-diagram/MermaidDiagram";
// import MarkdownComponent from "./components/markdown-component/MarkdownComponent";
// import CodeExample from "./components/code-example/CodeExample";
// import SimpleCodeExample from "./components/code-example/SimpleCodeExample";
// import DynamicAccordionCode from "./components/accordion/DynamicAccordionCode";
// import pointers from './api/db/content/C/do_not/pointers.json'
// import arrays from './api/db/content/C/do_not/arrays.json'
// import integers from './api/db/content/C/do_not/integers.json'
// import './globals.css'
// import Accordion from "./components/accordion/Accordion";
// import AccordionCheckBox from "./components/accordion/AccordionCheckBox";
// import AccordionToggle2 from "./components/accordion/AccordionToggle2";
// import DynamicAccordionExampleCode from "./components/accordion/DynamicAccordionExampleCode";
// import ListSplitVisualizer from "./components/python-list-slicing/ListSplitVisualizer";
// import TreeStructure from "./components/tree-structure/TreeItem";
// import VisualizeLambda from "./components/lambda-visualization/VisualizeLambda";
// import TwoDimArray from "./components/python-list-slicing/TwoDimArray";
// import TwoDimArray2 from "./components/python-list-slicing/TwoDimArray2";
// import TwoDimSlicingInputs from "./components/python-list-slicing/TwoDimSlicingInputs";
// import TwoDimListSplitVisualizer from "./components/python-list-slicing/TwoDimSplitVisualizer";
// import data from './api/db/developement/c/functions.json'
// import FunctionList from "./components/function-list/FunctionList";
// import pythonData from './api/db/developement/python/functions.json'
// import PythonFunctionsList from "./components/function-list/PythonFunctionsList";
// import Carousel from "./components/simple-carousel/Carousel";
// import LanguageButtons from "./components/language-buttons/LanguageButtons";
// import dynamic from 'next/dynamic';
// import ClientCarousel from "./components/simple-carousel/ClientCarousel";
// import GenericTable from "./components/generic-table/GenericTable";
// import asciiData from './api/db/tables/ascii_data.json'
// import AsciiConverter from "./components/converters/AsciiConverter";
// import JsonConverter from "./components/converters/JsonConverter";
// import CssUnitsConverter from "./components/converters/CssUnitsConverter";
// import FunctionDetails from "./components/function-details/FunctionDetails";
// import functionD from './api/db/developement/c/functions_new.json'

// import pythonFunctionData from '../app/api/db/developement/python/functions_new.json'
// import PythonFunctionDetails from "./components/function-details/PythonFunctionDetails";
// import CSSBeautifier from "./components/css-minifier/CSSBeautifier";
// import CaseConverter from "./components/case-converter/CaseConverter";
// import CaseConverter2 from "./components/case-converter/CaseConverter2";
// import { explanations } from "./components/case-converter/caseExplanations";
// import TextAnalyzer from "./components/text-analyzer/TextAnalyzer";
// import styles from './MainPage.module.css';




// export default async function Home({slides}) {
  

 
   
//   const slidesData = [
//     {
//         image: "/pexels-element5-1370295.jpg",
//         title: "C Standard Library Functions Explorer",
//         text: "Explore C Standard Library Functions with comprehensive insights and detailed breakdowns.",
//         link: "/c-programming/functions"
//     },
//     {
//         image: "/do-not-enter2.jpg",
//         title: "Things Not to Do in C Language",
//         text: "Common pitfalls and mistakes that programmers often encounter when working with C .",
//         link: "/c-programming/things-not-to-do"
//     },
    
//   ];


//   const languages = [
    
//     { title: 'Python', color: '#336a99', logo: '/python-logo.svg', url: '/python' },
//     { title: 'C Programming', color: '#007bff', logo: '/32px-C_Programming_Language.svg.png', url: '/c-programming' },
//     { title: 'SQL', color: '#007bff', logo: '/database.svg', url: '/sql' },
//     { title: 'Javascript', color: 'black', logo: '/js.svg', url: '/methods-explorer' },
    
//   ];

//   const exampleData = [
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9],
//     [7, 8, 9],
//     [7, 8, 9],
//     [7, 8, 9],
    
    
//   ];
  
//   const highlightedIndices = ['0-1', '1-1', '2-1'];
  
//     const startRow = 0;
//     const stopRow = 10;
//     const stepRow = 2;
//     const startCol = 1;
//     const stopCol = 5;
//     const stepCol = 1;

//     const dummySetter = () => {};

//     const pythonData=pythonFunctionData[1]
 
 
//   return (
    
//     <div className={styles.mainPageContainer}>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//       <h1 className={styles.title}>Welcome to Webdevdata</h1>
//       <p className={styles.tagline}>Your one-stop resource for web development and programming languages</p>
//       <div className={styles.contentWrapper}>
//         <div className={styles.carouselWrapper}>
//           <Carousel
//             slides={slidesData}
//             classN="my-carousel"
//             autoPlayInterval={3000}
//           />
//         </div>
        
//         <div className={styles.languageButtonsWrapper}>
//           <LanguageButtons languages={languages} />
//         </div>
//       </div>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>

//       <ScrollUpButton />
//     </div>
//   );

// }

// import React from 'react';
// import Carousel from "./components/simple-carousel/Carousel";
// import LanguageButtons from "./components/language-buttons/LanguageButtons";
// import ScrollUpButton from "./components/scroll-up-button/ScrollUpButton";
// import styles from './MainPage.module.css';

// export default function HomePage() {
//   const slidesData = [
//     {
//       image: "/pexels-element5-1370295.jpg",
//       title: "C Standard Library Functions Explorer",
//       text: "Explore C Standard Library Functions with comprehensive insights and detailed breakdowns.",
//       link: "/c-programming/functions"
//     },
//     {
//       image: "/do-not-enter2.jpg",
//       title: "Things Not to Do in C Language",
//       text: "Common pitfalls and mistakes that programmers often encounter when working with C.",
//       link: "/c-programming/things-not-to-do"
//     },
//   ];

//   const languages = [
//     { title: 'Python', color: '#336a99', logo: '/python-logo.svg', url: '/python' },
//     { title: 'C Programming', color: '#007bff', logo: '/32px-C_Programming_Language.svg.png', url: '/c-programming' },
//     { title: 'SQL', color: '#007bff', logo: '/database.svg', url: '/sql' },
//     { title: 'Javascript', color: 'black', logo: '/js.svg', url: '/methods-explorer' },
//   ];

//   const featuredItems = [
//     { title: "Learn Python", description: "Get started with Python programming", link: "/python/intro" },
//     { title: "C Programming Tips", description: "Advanced techniques for C programmers", link: "/c-programming/tips" },
//     { title: "SQL Basics", description: "Understanding database queries", link: "/sql/basics" },
//   ];

//   const latestUpdates = [
//     { title: "New Python Course", excerpt: "We've just launched a new Python course for beginners!", link: "/blog/new-python-course" },
//     { title: "C++ vs C", excerpt: "Exploring the differences between C++ and C", link: "/blog/cpp-vs-c" },
//   ];

//   return (
//     <div className={styles.homePage}>
//       <header className={styles.header}>
//         <h1 className={styles.title}>Welcome to Webdevdata</h1>
//         <p className={styles.tagline}>Your one-stop resource for web development and programming languages</p>
//       </header>

//       <div className={styles.searchContainer}>
//         <input type="text" placeholder="Search for topics..." className={styles.searchInput} />
//         <button className={styles.searchButton}>Search</button>
//       </div>

//       <main className={styles.mainContent}>
//         <section className={styles.carouselSection}>
//           <Carousel
//             slides={slidesData}
//             classN="main-carousel"
//             autoPlayInterval={3000}
//           />
//         </section>

//         <section className={styles.languageSection}>
//           <h2>Explore Languages</h2>
//           <LanguageButtons languages={languages} />
//         </section>

//         <section className={styles.featuredContent}>
//           <h2>Featured Content</h2>
//           <div className={styles.featuredGrid}>
//             {featuredItems.map((item, index) => (
//               <div key={index} className={styles.featuredItem}>
//                 <h3>{item.title}</h3>
//                 <p>{item.description}</p>
//                 <a href={item.link} className={styles.learnMoreLink}>Learn More</a>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section className={styles.latestUpdates}>
//           <h2>Latest Updates</h2>
//           <ul>
//             {latestUpdates.map((update, index) => (
//               <li key={index} className={styles.updateItem}>
//                 <h3>{update.title}</h3>
//                 <p>{update.excerpt}</p>
//                 <a href={update.link} className={styles.readMoreLink}>Read More</a>
//               </li>
//             ))}
//           </ul>
//         </section>
//       </main>

//       <footer className={styles.footer}>
//         <div className={styles.footerContent}>
//           <div className={styles.footerSection}>
//             <h3>About Us</h3>
//             <p>Webdevdata is dedicated to providing high-quality resources and tutorials for web developers and programmers of all levels.</p>
//           </div>
//           <div className={styles.footerSection}>
//             <h3>Quick Links</h3>
//             <ul>
//               <li><a href="/about">About</a></li>
//               <li><a href="/contact">Contact</a></li>
//               <li><a href="/privacy">Privacy Policy</a></li>
//             </ul>
//           </div>
//           <div className={styles.footerSection}>
//             <h3>Connect With Us</h3>
//             <div className={styles.socialLinks}>
//               {/* Add your social media icons/links here */}
//               <a href="#" className={styles.socialIcon}>FB</a>
//               <a href="#" className={styles.socialIcon}>TW</a>
//               <a href="#" className={styles.socialIcon}>LI</a>
//             </div>
//           </div>
//         </div>
//         <div className={styles.copyright}>
//           © 2024 Webdevdata. All rights reserved.
//         </div>
//       </footer>

//       <ScrollUpButton />
//     </div>
//   );
// }
import React from 'react';
import Carousel from "./components/simple-carousel/Carousel";
import LanguageButtons from "./components/language-buttons/LanguageButtons";
import ScrollUpButton from "./components/scroll-up-button/ScrollUpButton";
import styles from './MainPage.module.css';
import Link from 'next/link';

export default function HomePage() {
  const slidesData = [
    {
      image: "/pexels-element5-1370295.jpg",
      title: "C Standard Library Functions Explorer",
      text: "Explore C Standard Library Functions with comprehensive insights and detailed breakdowns.",
      link: "/c-programming/functions"
    },
    {
      image: "/do-not-enter2.jpg",
      title: "Things Not to Do in C Language",
      text: "Common pitfalls and mistakes that programmers often encounter when working with C.",
      link: "/c-programming/things-not-to-do"
    },
    // {
    //   image: "/database.svg",
    //   title: "Things Not to Do in C Language",
    //   text: "Common pitfalls and mistakes that programmers often encounter when working with C.",
    //   link: "/c-programming/things-not-to-do"
    // },
  ];

  const languages = [
    { title: 'Python', color: '#336a99', logo: '/python-logo.svg', url: '/python' },
    { title: 'C Programming', color: '#007bff', logo: '/32px-C_Programming_Language.svg.png', url: '/c-programming' },
    { title: 'SQL', color: '#007bff', logo: '/database.svg', url: '/sql' },
    { title: 'Javascript', color: 'black', logo: '/js.svg', url: '/methods-explorer' },
  ];

  const featuredItems = [
    { title: "Learn Python", description: "Get started with Python programming", link: "/python/intro" },
    { title: "C Programming Tips", description: "Advanced techniques for C programmers", link: "/c-programming/tips" },
    { title: "SQL Basics", description: "Understanding database queries", link: "/sql/basics" },
  ];

  const latestUpdates = [
    { title: "New Python Course", excerpt: "We've just launched a new Python course for beginners!", link: "/blog/new-python-course" },
    { title: "C++ vs C", excerpt: "Exploring the differences between C++ and C", link: "/blog/cpp-vs-c" },
  ];

  return (
    <div className={styles.homePage}>
      <br/>
      <br/>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome to Webdevdata</h1>
        <p className={styles.tagline}>Your one-stop resource for web development and programming languages</p>
      </header>

      {/* <div className={styles.searchContainer}>
        <input type="text" placeholder="Search for topics..." className={styles.searchInput} />
        <button className={styles.searchButton}>Search</button>
      </div> */}

      <main className={styles.mainContent}>
        <div className={styles.topSection}>
          <section className={styles.carouselSection}>
            <Carousel
              slides={slidesData}
              classN="main-carousel"
              autoPlayInterval={3000}
            />
          </section>
          <section className={styles.languageSection}>
            <LanguageButtons languages={languages} />
          </section>
        </div>

        {/* <section className={styles.featuredContent}>
          <h2>Featured Content</h2>
          <div className={styles.featuredGrid}>
            {featuredItems.map((item, index) => (
              <div key={index} className={styles.featuredItem}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a href={item.link} className={styles.learnMoreLink}>Learn More</a>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.latestUpdates}>
          <h2>Latest Updates</h2>
          <ul>
            {latestUpdates.map((update, index) => (
              <li key={index} className={styles.updateItem}>
                <h3>{update.title}</h3>
                <p>{update.excerpt}</p>
                <a href={update.link} className={styles.readMoreLink}>Read More</a>
              </li>
            ))}
          </ul>
        </section> */}
      </main>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>About Us</h3>
            <p>Webdevdata is dedicated to providing high-quality resources and tutorials for web developers and programmers of all levels.</p>
          </div>
          <div className={styles.footerSection}>
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h3>Connect With Us</h3>
            <div className={styles.socialLinks}>
              {/* Add your social media icons/links here */}
              <a href="#" className={styles.socialIcon}>FB</a>
              <a href="#" className={styles.socialIcon}>TW</a>
              <a href="#" className={styles.socialIcon}>LI</a>
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          © 2024 Webdevdata. All rights reserved.
        </div>
      </footer>

      <ScrollUpButton />
    </div>
  );
}