import React, { useState } from 'react';
import styles from '../accordion/code-example-accordion/CodeExampleAccordion.module.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as themes from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Copy, Check } from 'lucide-react';
import { capitalizeWords } from '@/utils/functions';
import Link from 'next/link';
import { lora700, poppins500, poppins400 } from '@/utils/fonts';
import SQLCodeWidget from './SQLCodeWidget';
import prismThemes from './themes';

const createSlug = (text) => {
  const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
  return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
};

const processContent = (content) => {
  if (typeof content !== 'string') return content;

  const svgs = [];
  const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
    svgs.push(match);
    return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
  });

  const lines = contentWithPlaceholders.split('\n');
  let inList = false;
  let currentListItem = [];
  const elements = [];

  const processPart = (part, index) => {
    if (part.startsWith('__SVG_PLACEHOLDER_')) {
      const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
      return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
    } else if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
    } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
      if (linkMatch) {
        const [, text, url] = linkMatch;
        return <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
      }
    } else if (part.trim().startsWith('<') && part.trim().endsWith('>')) {
      return <div key={`html-${index}`} dangerouslySetInnerHTML={{ __html: part }} />;
    }
    return part;
  };

  lines.forEach((line, lineIndex) => {
    const tabCount = line.match(/^\t*/)[0].length;
    const trimmedLine = line.replace(/^\t+/, '');
    
    const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\))/);
    const processedParts = parts.map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

    if (trimmedLine.startsWith('- ')) {
      if (inList && currentListItem.length > 0) {
        elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
        currentListItem = [];
      }
      inList = true;
      currentListItem.push(
        <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
          {processedParts.slice(1)}
        </span>
      );
    } else if (inList) {
      if (trimmedLine === '') {
        elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
        currentListItem = [];
        inList = false;
        elements.push(<br key={`br-${elements.length}`} />);
      } else {
        currentListItem.push(<br key={`br-${currentListItem.length}`} />);
        currentListItem.push(
          <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
            {processedParts}
          </span>
        );
      }
    } else {
      elements.push(
        <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
          {processedParts}
        </span>
      );
      if (lineIndex < lines.length - 1) {
        elements.push(<br key={`br-${elements.length}`} />);
      }
    }
  });

  if (inList && currentListItem.length > 0) {
    elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
  }

  const hasListItems = elements.some(el => el.type === 'li');
  return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
};

// const SQLCodeWidget = ({
//   data,
//   theme = 'tomorrow',
//   showLineNumbers = true,
//   backgroundColor = '#f5f5f5',
//   textColor = '#333',
//   showTitle = true,
//   showExplanation = true
// }) => {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(data.code);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const validTheme = themes[theme] || themes.tomorrow;
//   const formattedCode = data.code.replace(/\s*(SELECT|FROM|WHERE|ORDER BY|LIMIT)\s*/g, '\n$1 ').trim();

//   const showExplanationSection = showExplanation && data.explanation;

//   return (
//     <div className={styles.widget} style={{ backgroundColor }}>
//       {showTitle && data.title && (
//         <div className={styles.header} style={{ backgroundColor, color: textColor }}>
//           <h3 className={styles.title}>{data.title}</h3>
//         </div>
//       )}
//       <div className={`${styles.contentWrapper} ${!showExplanationSection ? styles.fullWidth : ''}`}>
//         <div className={`${styles.codeWrapper} ${!showExplanationSection ? styles.fullWidth : ''}`}>
//           <div className={styles.codeHeader}>
//             <button
//               onClick={handleCopy}
//               className={styles.copyButton}
//             >
//               {copied ? (
//                 <>
//                   <Check className={styles.icon} />
//                   Copied!
//                 </>
//               ) : (
//                 <>
//                   <Copy className={styles.icon} />
//                   Copy
//                 </>
//               )}
//             </button>
//           </div>
//           <div className={styles.codeContainer}>
//             <SyntaxHighlighter
//               language="sql"
//               style={validTheme}
//               showLineNumbers={showLineNumbers}
//               wrapLines={true}
//               customStyle={{
//                 margin: 0,
//                 padding: '1rem',
//                 backgroundColor: 'transparent',
//               }}
//             >
//               {formattedCode}
//             </SyntaxHighlighter>
//           </div>
//         </div>
//         {showExplanationSection && (
//           <div className={styles.explanation} style={{ backgroundColor, color: textColor }}>
//             <h4 className={styles.explanationTitle}>Explanation:</h4>
//             <p>{data.explanation}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

function SQLCodeExampleAccordion({ 
  data, 
  link, 
  width = '1000px', 
  idPrefix = '',
  parentShowTitle=true,
  parentTheme='solarizedlight',
  parentBackgroundColor
 
}) {
  const toggleSection = (sectionId) => {
    const sections = document.querySelectorAll(`.${styles.accordion__section}`);
    sections.forEach(section => {
      if (section.id === sectionId) {
        section.classList.toggle(styles.open);
        if (section.classList.contains(styles.open)) {
          setTimeout(() => {
            const yOffset = -30;
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'smooth'});
          }, 400);
        }
      } else {
        section.classList.remove(styles.open);
      }
    });
  };

  const preventClose = (event) => {
    event.stopPropagation();
  };

  // Handle both array and non-array data structures
  const dataArray = Array.isArray(data) ? data : [data];

  return (
    <div className={styles.accordion} style={{ width }}>
      {dataArray.map((item, index) => (
        <React.Fragment key={index}>
          {item.before && (
            <div className={`${styles.beforeContent} ${poppins500.className}`}>
              {processContent(item.before)}
            </div>
          )}
          <div
            id={`${idPrefix}section${index}`}
            className={styles.accordion__section}
            onClick={() => toggleSection(`${idPrefix}section${index}`)}
          >
            <h2 className={styles.accordion__label}>
              {capitalizeWords(item.title.replaceAll('_', ' '))}
              <span className={styles.chevron}></span>
            </h2>
            <div className={styles.accordion__content} onClick={preventClose}>
              <SQLCodeWidget
                data={item}
                showTitle={parentShowTitle}
                theme={parentTheme}
                backgroundColor={parentBackgroundColor}
               
              />
               <span onClick={toggleSection} className={styles.chevronContainer}>
                  {/* <svg xmlns="http://www.w3.org/2000/svg" width="44" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-chevron-up"><circle cx="12" cy="12" r="10"/><path d="m8 14 4-4 4 4"/></svg> */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="54" viewBox="0 0 24 24" fill="#b3b3b3" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-chevron-up"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m8 14 4-4 4 4"/></svg>
                   </span>
              {item.related_functions && item.related_functions.length > 0 && (
                <div className={styles.related_functions}>
                  <h4>Related Functions:</h4>
                  <ul>
                    {item.related_functions.map((func, funcIndex) => (
                      <li key={funcIndex}>
                        {link ? (
                          <Link href={`${link}/${encodeURIComponent(func.name)}`}>
                            {func.name}
                          </Link>
                        ) : (
                          <span>{func.name}</span>
                        )}
                        <span className={styles.tooltip}>{func.description}</span>
                      </li>
                    ))}
                  </ul>
                  <span onClick={toggleSection} className={styles.chevronContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="grey" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-chevron-up"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m8 14 4-4 4 4"/></svg>
                  </span>
                </div>
              )}
            </div>
          </div>
          {item.after && (
            <div className={`${styles.afterContent} ${poppins400.className}`}>
              {processContent(item.after)}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default SQLCodeExampleAccordion;