
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
  