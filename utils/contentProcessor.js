// // // // import React from 'react';

// // // // export const processContent = (content) => {
// // // //   if (!content) return null;

// // // //   const svgs = [];
// // // //   const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
// // // //     svgs.push(match);
// // // //     return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
// // // //   });

// // // //   const lines = contentWithPlaceholders.split('\n');
// // // //   let inList = false;
// // // //   let currentListItem = [];
// // // //   const elements = [];

// // // //   const processPart = (part, index) => {
// // // //     if (part.startsWith('__SVG_PLACEHOLDER_')) {
// // // //       const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
// // // //       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
// // // //     } else if (part.startsWith('**') && part.endsWith('**')) {
// // // //       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
// // // //     } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
// // // //       const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
// // // //       if (linkMatch) {
// // // //         const [, text, url] = linkMatch;
// // // //         return <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
// // // //       }
// // // //     } else if (part.trim().startsWith('<') && part.trim().endsWith('>')) {
// // // //       return <div key={`html-${index}`} dangerouslySetInnerHTML={{ __html: part }} />;
// // // //     }
// // // //     return part;
// // // //   };

// // // //   lines.forEach((line, lineIndex) => {
// // // //     const tabCount = line.match(/^\t*/)[0].length;
// // // //     const trimmedLine = line.replace(/^\t+/, '');
    
// // // //     // Update regex to exclude KaTeX patterns
// // // //     const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\))/);
// // // //     const processedParts = parts.map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

// // // //     if (trimmedLine.startsWith('- ')) {
// // // //       if (inList && currentListItem.length > 0) {
// // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // //         currentListItem = [];
// // // //       }
// // // //       inList = true;
// // // //       currentListItem.push(
// // // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // //           {processedParts.slice(1)}
// // // //         </span>
// // // //       );
// // // //     } else if (inList) {
// // // //       if (trimmedLine === '') {
// // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // //         currentListItem = [];
// // // //         inList = false;
// // // //         elements.push(<br key={`br-${elements.length}`} />);
// // // //       } else {
// // // //         currentListItem.push(<br key={`br-${currentListItem.length}`} />);
// // // //         currentListItem.push(
// // // //           <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // //             {processedParts}
// // // //           </span>
// // // //         );
// // // //       }
// // // //     } else {
// // // //       elements.push(
// // // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // //           {processedParts}
// // // //         </span>
// // // //       );
// // // //       if (lineIndex < lines.length - 1) {
// // // //         elements.push(<br key={`br-${elements.length}`} />);
// // // //       }
// // // //     }
// // // //   });

// // // //   if (inList && currentListItem.length > 0) {
// // // //     elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // //   }

// // // //   const hasListItems = elements.some(el => el.type === 'li');
// // // //   return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// // // // };



// // // import React from 'react';

// // // export const processContent = (content) => {
// // //   if (!content) return null;

// // //   // First process the full content for HTML, before line splitting
// // //   const htmlBlocks = [];
// // //   const contentWithHtmlPlaceholders = content.replace(/<[^>]+>.*?<\/[^>]+>|<[^/>]+\/>/g, (match) => {
// // //     htmlBlocks.push(match);
// // //     return `__HTML_PLACEHOLDER_${htmlBlocks.length - 1}__`;
// // //   });

// // //   const svgs = [];
// // //   const contentWithPlaceholders = contentWithHtmlPlaceholders.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
// // //     svgs.push(match);
// // //     return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
// // //   });

// // //   const lines = contentWithPlaceholders.split('\n');
// // //   let inList = false;
// // //   let currentListItem = [];
// // //   const elements = [];

// // //   const processPart = (part, index) => {
// // //     if (!part) return null;
    
// // //     if (part.startsWith('__HTML_PLACEHOLDER_')) {
// // //       const htmlIndex = parseInt(part.match(/__HTML_PLACEHOLDER_(\d+)__/)[1]);
// // //       return <span key={`html-${index}`} dangerouslySetInnerHTML={{ __html: htmlBlocks[htmlIndex] }} />;
// // //     }
// // //     if (part.startsWith('__SVG_PLACEHOLDER_')) {
// // //       const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
// // //       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
// // //     } else if (part.startsWith('**') && part.endsWith('**')) {
// // //       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
// // //     } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
// // //       const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
// // //       if (linkMatch) {
// // //         const [, text, url] = linkMatch;
// // //         return <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
// // //       }
// // //     }
// // //     return part;
// // //   };

// // //   lines.forEach((line, lineIndex) => {
// // //     const tabCount = line.match(/^\t*/)[0].length;
// // //     const trimmedLine = line.replace(/^\t+/, '');
    
// // //     const parts = trimmedLine.split(/(__HTML_PLACEHOLDER_\d+__|__SVG_PLACEHOLDER_\d+__|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\))/g);
// // //     const processedParts = parts.filter(Boolean).map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

// // //     if (trimmedLine.startsWith('- ')) {
// // //       if (inList && currentListItem.length > 0) {
// // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // //         currentListItem = [];
// // //       }
// // //       inList = true;
// // //       currentListItem.push(
// // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // //           {processedParts.slice(1)}
// // //         </span>
// // //       );
// // //     } else if (inList) {
// // //       if (trimmedLine === '') {
// // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // //         currentListItem = [];
// // //         inList = false;
// // //         elements.push(<br key={`br-${elements.length}`} />);
// // //       } else {
// // //         currentListItem.push(<br key={`br-${currentListItem.length}`} />);
// // //         currentListItem.push(
// // //           <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // //             {processedParts}
// // //           </span>
// // //         );
// // //       }
// // //     } else {
// // //       elements.push(
// // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // //           {processedParts}
// // //         </span>
// // //       );
// // //       if (lineIndex < lines.length - 1) {
// // //         elements.push(<br key={`br-${elements.length}`} />);
// // //       }
// // //     }
// // //   });

// // //   if (inList && currentListItem.length > 0) {
// // //     elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // //   }

// // //   const hasListItems = elements.some(el => el.type === 'li');
// // //   return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// // // };

// // import React from 'react';

// // export const processContent = (content) => {
// //   if (!content) return null;

// //   // First process SVGs
// //   const svgs = [];
// //   const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
// //     svgs.push(match);
// //     return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
// //   });

// //   // Then process HTML blocks
// //   const htmlBlocks = [];
// //   const contentWithHtmlPlaceholders = contentWithPlaceholders.replace(/<[^>]+>.*?<\/[^>]+>|<[^/>]+\/>/g, (match) => {
// //     // Skip if it's an SVG placeholder
// //     if (match.includes('__SVG_PLACEHOLDER_')) {
// //       return match;
// //     }
// //     htmlBlocks.push(match);
// //     return `__HTML_PLACEHOLDER_${htmlBlocks.length - 1}__`;
// //   });

// //   const lines = contentWithHtmlPlaceholders.split('\n');
// //   let inList = false;
// //   let currentListItem = [];
// //   const elements = [];

// //   const processPart = (part, index) => {
// //     if (!part) return null;
    
// //     // Process SVG placeholders first
// //     if (part.startsWith('__SVG_PLACEHOLDER_')) {
// //       const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
// //       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
// //     }
    
// //     if (part.startsWith('__HTML_PLACEHOLDER_')) {
// //       const htmlIndex = parseInt(part.match(/__HTML_PLACEHOLDER_(\d+)__/)[1]);
// //       return <span key={`html-${index}`} dangerouslySetInnerHTML={{ __html: htmlBlocks[htmlIndex] }} />;
// //     } else if (part.startsWith('**') && part.endsWith('**')) {
// //       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
// //     } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
// //       const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
// //       if (linkMatch) {
// //         const [, text, url] = linkMatch;
// //         return <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
// //       }
// //     }
// //     return part;
// //   };

// //   lines.forEach((line, lineIndex) => {
// //     const tabCount = line.match(/^\t*/)[0].length;
// //     const trimmedLine = line.replace(/^\t+/, '');
    
// //     // Updated regex to include SVG placeholders
// //     const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|__HTML_PLACEHOLDER_\d+__|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\))/g);
// //     const processedParts = parts.filter(Boolean).map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

// //     if (trimmedLine.startsWith('- ')) {
// //       if (inList && currentListItem.length > 0) {
// //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// //         currentListItem = [];
// //       }
// //       inList = true;
// //       currentListItem.push(
// //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// //           {processedParts.slice(1)}
// //         </span>
// //       );
// //     } else if (inList) {
// //       if (trimmedLine === '') {
// //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// //         currentListItem = [];
// //         inList = false;
// //         elements.push(<br key={`br-${elements.length}`} />);
// //       } else {
// //         currentListItem.push(<br key={`br-${currentListItem.length}`} />);
// //         currentListItem.push(
// //           <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// //             {processedParts}
// //           </span>
// //         );
// //       }
// //     } else {
// //       elements.push(
// //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// //           {processedParts}
// //         </span>
// //       );
// //       if (lineIndex < lines.length - 1) {
// //         elements.push(<br key={`br-${elements.length}`} />);
// //       }
// //     }
// //   });

// //   if (inList && currentListItem.length > 0) {
// //     elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// //   }

// //   const hasListItems = elements.some(el => el.type === 'li');
// //   return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// // };


// import React from 'react';

// export const processContent = (content) => {
//  if (!content) return null;

//  // First process SVGs
//  const svgs = [];
//  const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
//    svgs.push(match);
//    return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
//  });

//  // Then process HTML blocks
//  const htmlBlocks = [];
//  const contentWithHtmlPlaceholders = contentWithPlaceholders.replace(/<[^>]+>.*?<\/[^>]+>|<[^/>]+\/>/g, (match) => {
//    // Skip if it's an SVG placeholder
//    if (match.includes('__SVG_PLACEHOLDER_')) {
//      return match;
//    }
//    htmlBlocks.push(match);
//    return `__HTML_PLACEHOLDER_${htmlBlocks.length - 1}__`;
//  });

//  // Process tab links 
//  const contentWithTabLinks = contentWithHtmlPlaceholders.replace(/#tab:(\w+)#/g, (match) => {
//    const tabName = match.match(/#tab:(\w+)#/)[1];
//    htmlBlocks.push(`<a href="#tab-${tabName}" class="tab-link">${tabName}</a>`);
//    return `__HTML_PLACEHOLDER_${htmlBlocks.length - 1}__`;
//  });

//  const lines = contentWithTabLinks.split('\n');
//  let inList = false;
//  let currentListItem = [];
//  const elements = [];

//  const processPart = (part, index) => {
//    if (!part) return null;

//    // Process SVG placeholders first
//    if (part.startsWith('__SVG_PLACEHOLDER_')) {
//      const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
//      return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
//    }

//    if (part.startsWith('__HTML_PLACEHOLDER_')) {
//      const htmlIndex = parseInt(part.match(/__HTML_PLACEHOLDER_(\d+)__/)[1]);
//      return <span key={`html-${index}`} dangerouslySetInnerHTML={{ __html: htmlBlocks[htmlIndex] }} />;
//    } else if (part.startsWith('**') && part.endsWith('**')) {
//      return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
//    } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
//     const linkMatch = part.match(/\[(.+?)\]\((!)?(.+?)\)/);
//     if (linkMatch) {
//       const [, text, sameTab, url] = linkMatch;
//       return <a key={`link-${index}`} href={url} {...(!sameTab && { target: "_blank", rel: "noopener noreferrer" })}>{text}</a>;
//     }
//   }
// //    else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
// //      const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
// //      if (linkMatch) {
// //        const [, text, url] = linkMatch;
// //        return <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
// //      }
// //    }
//    return part;
//  };

//  lines.forEach((line, lineIndex) => {
//    const tabCount = line.match(/^\t*/)[0].length;
//    const trimmedLine = line.replace(/^\t+/, '');

//    // Updated regex to include SVG placeholders
//    const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|__HTML_PLACEHOLDER_\d+__|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\))/g);
//    const processedParts = parts.filter(Boolean).map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

//    if (trimmedLine.startsWith('- ')) {
//      if (inList && currentListItem.length > 0) {
//        elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
//        currentListItem = [];
//      }
//      inList = true;
//      currentListItem.push(
//        <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
//          {processedParts.slice(1)}
//        </span>
//      );
//    } else if (inList) {
//      if (trimmedLine === '') {
//        elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
//        currentListItem = [];
//        inList = false;
//        elements.push(<br key={`br-${elements.length}`} />);
//      } else {
//        currentListItem.push(<br key={`br-${currentListItem.length}`} />);
//        currentListItem.push(
//          <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
//            {processedParts}
//          </span>
//        );
//      }
//    } else {
//      elements.push(
//        <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
//          {processedParts}
//        </span>
//      );
//      if (lineIndex < lines.length - 1) {
//        elements.push(<br key={`br-${elements.length}`} />);
//      }
//    }
//  });

//  if (inList && currentListItem.length > 0) {
//    elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
//  }

//  const hasListItems = elements.some(el => el.type === 'li');
//  return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// };


import React from 'react';


/*[strtol](!/)-link in the browser
[strtol](/)-new browser 
@[func_name ]@-momospace notation*/

export const processContent = (content) => {
if (!content) return null;

// First process SVGs
const svgs = [];
const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
  svgs.push(match);
  return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
});

// Then process HTML blocks
const htmlBlocks = [];
const contentWithHtmlPlaceholders = contentWithPlaceholders.replace(/<[^>]+>.*?<\/[^>]+>|<[^/>]+\/>/g, (match) => {
  // Skip if it's an SVG placeholder
  if (match.includes('__SVG_PLACEHOLDER_')) {
    return match;
  }
  htmlBlocks.push(match);
  return `__HTML_PLACEHOLDER_${htmlBlocks.length - 1}__`;
});

// Process tab links 
const contentWithTabLinks = contentWithHtmlPlaceholders.replace(/#tab:(\w+)#/g, (match) => {
  const tabName = match.match(/#tab:(\w+)#/)[1];
  htmlBlocks.push(`<a href="#tab-${tabName}" class="tab-link">${tabName}</a>`);
  return `__HTML_PLACEHOLDER_${htmlBlocks.length - 1}__`;
});

const lines = contentWithTabLinks.split('\n');
let inList = false;
let currentListItem = [];
const elements = [];

const processPart = (part, index) => {
  if (!part) return null;

  // Process SVG placeholders first
  if (part.startsWith('__SVG_PLACEHOLDER_')) {
    const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
    return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
  }

  if (part.startsWith('__HTML_PLACEHOLDER_')) {
    const htmlIndex = parseInt(part.match(/__HTML_PLACEHOLDER_(\d+)__/)[1]);
    return <span key={`html-${index}`} dangerouslySetInnerHTML={{ __html: htmlBlocks[htmlIndex] }} />;
  } else if (part.startsWith('**') && part.endsWith('**')) {
    return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
  } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
   const linkMatch = part.match(/\[(.+?)\]\((!)?(.+?)\)/);
   if (linkMatch) {
     const [, text, sameTab, url] = linkMatch;
     return <a key={`link-${index}`} href={url} {...(!sameTab && { target: "_blank", rel: "noopener noreferrer" })}>{text}</a>;
   }
  } else if (part.startsWith('@[') && part.endsWith(']@')) {
    return <span key={`code-${index}`} style={{
      backgroundColor: 'rgba(175, 184, 193, 0.2)',
      padding: '0.2em 0.4em',
      borderRadius: '6px',
      fontFamily: 'ui-monospace, monospace',
      fontSize: '95%',
      color: 'black',
      fontWeight: 300
    }}>{part.slice(2, -2)}</span>;
  }
  return part;
};

lines.forEach((line, lineIndex) => {
  const tabCount = line.match(/^\t*/)[0].length;
  const trimmedLine = line.replace(/^\t+/, '');

  // Updated regex to include SVG placeholders and code blocks
  const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|__HTML_PLACEHOLDER_\d+__|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\)|@\[.+?\]@)/g);
  const processedParts = parts.filter(Boolean).map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

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