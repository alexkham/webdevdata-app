import React from 'react'



export function getSVGIcon(svgContent) {
    return (
      <div dangerouslySetInnerHTML={{ __html: svgContent }} />
    );
  }



  export function TextFormatter({ text }) {
    if (!text) {
      // Handle the case where text is undefined, null, or empty
      return null; // or some fallback UI
    }
    // Split text on period followed by a space
    const sentences = text.split('. ').map(sentence => sentence.trim());
  
    return (
      <div>
        {sentences.map((sentence, index) => (
          <p key={index}>{sentence}.</p>
        ))}
      </div>
    );
  }
  // export const capitalizeWords=(str) =>{
  //   return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  // }

  export const capitalizeWords = (str) => {
    if (!str) return ''; // Return an empty string or some default value if str is undefined or null
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  

  // Split explanation into sentences and render with line breaks
  export const renderTextWithLineBreaks = (text) => {
    if(text){
    const sentences = text.match(/[^.!?]+[.!?]*/g) || [];
    return sentences.map((sentence, index) => (
        <React.Fragment key={index}>
            {sentence.trim()}
            <br />
        </React.Fragment>
    ));}
};

export const renderTextWithLineBreaksSeparator = (text, separator) => {
  if (text) {
    // Split the text based on the provided separator
    const parts = text.split(separator);
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part.trim()}
        <br />
      </React.Fragment>
    ));
  }
};
