// 'use client'
// import React, { useState, useEffect } from 'react';

// const ScrollUpButton = () => {
//   const [isVisible, setIsVisible] = useState(false);

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth'
//     });
//   };

//   useEffect(() => {
//     const toggleVisibility = () => {
//       if (window.pageYOffset > 100) {
//         setIsVisible(true);
//       } else {
//         setIsVisible(false);
//       }
//     };

//     window.addEventListener('scroll', toggleVisibility);

//     // Clean-up
//     return () => {
//       window.removeEventListener('scroll', toggleVisibility);
//     };
//   }, []);

//   return (
//     isVisible && 
//       <button onClick={scrollToTop} 
//       style={{ position: 'fixed', bottom: '20px', right: '30px', 
//       zIndex: 1000, backgroundColor: 'blue', color: 'white',padding:'10px'
//       ,borderRadius:'5px',border:'none' }}>
//         Scroll to Top
//       </button>
//   );
// }

// export default ScrollUpButton;
'use client'
import React, { useState, useEffect } from 'react';

const ScrollUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

 
 
 
  return (
    <>
      {isVisible && (
        <button 
          onClick={scrollToTop}
          aria-label="Scroll to top"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            backgroundColor: '#4d4dff', // Adjust color as needed
            width: '50px',
            height: '50px',
            borderRadius: '8px', // Adjust for desired shape
            border: 'none',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.3s, transform 0.3s'
          }}
        >
          {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5L5 12H19L12 5Z" fill="white"/>
          </svg> */}
           {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8L6 14H18L12 8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg> */}
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 15L12 9L18 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </>
  );



}

export default ScrollUpButton;