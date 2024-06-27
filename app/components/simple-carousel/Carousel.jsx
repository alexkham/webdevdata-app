// // // // // // // // // 'use client'
// // // // // // // // // import React, { useState } from 'react';

// // // // // // // // // const Carousel = ({ slides }) => {
// // // // // // // // //     console.log(slides);
// // // // // // // // //     const [activeIndex, setActiveIndex] = useState(0);

// // // // // // // // //     const nextSlide = () => {
// // // // // // // // //         setActiveIndex((current) => (current + 1) % slides.length);
// // // // // // // // //     };

// // // // // // // // //     const prevSlide = () => {
// // // // // // // // //         setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
// // // // // // // // //     };

// // // // // // // // //     return (
// // // // // // // // //         <div style={{ position: 'relative', width: '60%', height: '400px', overflow: 'hidden' }}>
// // // // // // // // //             {slides.map((slide, index) => (
// // // // // // // // //                 <div
// // // // // // // // //                     key={index}
// // // // // // // // //                     style={{
// // // // // // // // //                         width: '100%',
// // // // // // // // //                         height: '100%',
// // // // // // // // //                         background: `url(${slide.image}) no-repeat center center / cover`,
// // // // // // // // //                         position: 'absolute',
// // // // // // // // //                         left: `${(index - activeIndex) * 100}%`,
// // // // // // // // //                         transition: 'left 0.5s ease',
// // // // // // // // //                         display: 'flex',
// // // // // // // // //                         flexDirection: 'column',
// // // // // // // // //                         justifyContent: 'center',
// // // // // // // // //                         alignItems: 'center',
// // // // // // // // //                         color: '#fff'
// // // // // // // // //                     }}
// // // // // // // // //                 >
// // // // // // // // //                     <h2>{slide.title}</h2>
// // // // // // // // //                     <p>{slide.text}</p>
// // // // // // // // //                     <a href={slide.link} style={{ color: '#fff', textDecoration: 'underline' }}>
// // // // // // // // //                         Read more
// // // // // // // // //                     </a>
// // // // // // // // //                 </div>
// // // // // // // // //             ))}
// // // // // // // // //             <button onClick={prevSlide} style={{ position: 'absolute', top: '50%', left: '20px', zIndex: 100 }}>Prev</button>
// // // // // // // // //             <button onClick={nextSlide} style={{ position: 'absolute', top: '50%', right: '20px', zIndex: 100 }}>Next</button>
// // // // // // // // //         </div>
// // // // // // // // //     );
// // // // // // // // // };

// // // // // // // // // export default Carousel;
// // // // // // // // 'use client'
// // // // // // // // import React, { useState } from 'react';

// // // // // // // // const Carousel = ({ slides ,classN }) => {
// // // // // // // //     if (!slides || slides.length === 0) {
// // // // // // // //         console.log('No slides data available.');
// // // // // // // //         return <div>No slides available</div>;
// // // // // // // //     }

// // // // // // // //     const [activeIndex, setActiveIndex] = useState(0);
// // // // // // // //     console.log("Carousel component called");
// // // // // // // //     console.log(slides);


// // // // // // // //     const nextSlide = () => {
// // // // // // // //         setActiveIndex(current => (current + 1) % slides.length);
// // // // // // // //     };

// // // // // // // //     const prevSlide = () => {
// // // // // // // //         setActiveIndex(current => (current - 1 + slides.length) % slides.length);
// // // // // // // //     };

// // // // // // // //     return (
// // // // // // // //         <div className={classN} style={{ position: 'relative', width: '60%', height: '400px', overflow: 'hidden' }}>
// // // // // // // //             {slides.map((slide, index) => (
// // // // // // // //                 <div
// // // // // // // //                     key={index}
// // // // // // // //                     style={{
// // // // // // // //                         width: '100%',
// // // // // // // //                         height: '100%',
// // // // // // // //                         background: `url(${slide.image}) no-repeat center center / cover`,
// // // // // // // //                         position: 'absolute',
// // // // // // // //                         left: `${(index - activeIndex) * 100}%`,
// // // // // // // //                         transition: 'left 0.5s ease',
// // // // // // // //                         display: 'flex',
// // // // // // // //                         flexDirection: 'column',
// // // // // // // //                         justifyContent: 'center',
// // // // // // // //                         alignItems: 'center',
// // // // // // // //                         color: '#fff'
// // // // // // // //                     }}
// // // // // // // //                 >
// // // // // // // //                     <h2>{slide.title}</h2>
// // // // // // // //                     <p>{slide.text}</p>
// // // // // // // //                     <a href={slide.link} style={{ color: '#fff', textDecoration: 'underline' }}>
// // // // // // // //                         Read more
// // // // // // // //                     </a>
// // // // // // // //                 </div>
// // // // // // // //             ))}
// // // // // // // //             <button onClick={prevSlide} style={{ position: 'absolute', top: '50%', left: '20px', zIndex: 100 }}>Prev</button>
// // // // // // // //             <button onClick={nextSlide} style={{ position: 'absolute', top: '50%', right: '20px', zIndex: 100 }}>Next</button>
// // // // // // // //         </div>
// // // // // // // //     );
// // // // // // // // };

// // // // // // // // export default Carousel;
// // // // // // // 'use client'

// // // // // // // import React, { useState, useEffect } from 'react';

// // // // // // // const Carousel = ({ slides, classN }) => {
// // // // // // //     const [activeIndex, setActiveIndex] = useState(0);
// // // // // // //     const [isClient, setIsClient] = useState(false);

// // // // // // //     useEffect(() => {
// // // // // // //         setIsClient(true);
// // // // // // //     }, []);

// // // // // // //     if (!slides || slides.length === 0 || !isClient) {
// // // // // // //         return <div>Loading...</div>;
// // // // // // //     }

// // // // // // //     const nextSlide = () => {
// // // // // // //         setActiveIndex(current => (current + 1) % slides.length);
// // // // // // //     };

// // // // // // //     const prevSlide = () => {
// // // // // // //         setActiveIndex(current => (current - 1 + slides.length) % slides.length);
// // // // // // //     };

// // // // // // //     return (
// // // // // // //         <div className={classN} style={{ position: 'relative', width: '50%', height: '400px', overflow: 'hidden' }}>
// // // // // // //             {slides.map((slide, index) => (
// // // // // // //                 <div
// // // // // // //                     key={index}
// // // // // // //                     style={{
// // // // // // //                         width: '100%',
// // // // // // //                         height: '100%',
// // // // // // //                         position: 'absolute',
// // // // // // //                         left: `${(index - activeIndex) * 100}%`,
// // // // // // //                         transition: 'left 0.5s ease',
// // // // // // //                         display: 'flex',
// // // // // // //                         flexDirection: 'column',
// // // // // // //                         justifyContent: 'center',
// // // // // // //                         alignItems: 'center',
// // // // // // //                         color: '#fff',
// // // // // // //                         backgroundColor: '#333', // Fallback color
// // // // // // //                     }}
// // // // // // //                 >
// // // // // // //                     {slide.image && (
// // // // // // //                         <img 
// // // // // // //                             src={slide.image} 
// // // // // // //                             alt={slide.title} 
// // // // // // //                             style={{
// // // // // // //                                 position: 'absolute',
// // // // // // //                                 top: 0,
// // // // // // //                                 left: 0,
// // // // // // //                                 width: '100%',
// // // // // // //                                 height: '100%',
// // // // // // //                                 objectFit: 'cover',
// // // // // // //                             }}
// // // // // // //                         />
// // // // // // //                     )}
// // // // // // //                     <div style={{ position: 'relative', 
// // // // // // //                        zIndex: 1, textAlign: 'center',
// // // // // // //                        backgroundColor:'gray',padding:'20px' }}>
// // // // // // //                         <h2>{slide.title}</h2>
// // // // // // //                         <p>{slide.text}</p>
// // // // // // //                         {slide.link && (
// // // // // // //                             <a href={slide.link} style={{ color: '#fff', textDecoration: 'underline' }}>
// // // // // // //                                 Read more
// // // // // // //                             </a>
// // // // // // //                         )}
// // // // // // //                     </div>
// // // // // // //                 </div>
// // // // // // //             ))}
// // // // // // //             <button 
// // // // // // //                 onClick={prevSlide} 
// // // // // // //                 style={{ position: 'absolute', top: '50%', left: '20px', zIndex: 2 }}
// // // // // // //             >
// // // // // // //                 Prev
// // // // // // //             </button>
// // // // // // //             <button 
// // // // // // //                 onClick={nextSlide} 
// // // // // // //                 style={{ position: 'absolute', top: '50%', right: '20px', zIndex: 2 }}
// // // // // // //             >
// // // // // // //                 Next
// // // // // // //             </button>
// // // // // // //         </div>
// // // // // // //     );
// // // // // // // };

// // // // // // // export default Carousel;
// // // // // // 'use client'

// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import styles from './Carousel.module.css'; // You'll create this CSS module

// // // // // // const Carousel = ({ slides, classN }) => {
// // // // // //     const [activeIndex, setActiveIndex] = useState(0);
// // // // // //     const [isClient, setIsClient] = useState(false);

// // // // // //     useEffect(() => {
// // // // // //         setIsClient(true);
// // // // // //     }, []);

// // // // // //     if (!slides || slides.length === 0 || !isClient) {
// // // // // //         return <div>Loading...</div>;
// // // // // //     }

// // // // // //     const nextSlide = () => {
// // // // // //         setActiveIndex(current => (current + 1) % slides.length);
// // // // // //     };

// // // // // //     const prevSlide = () => {
// // // // // //         setActiveIndex(current => (current - 1 + slides.length) % slides.length);
// // // // // //     };

// // // // // //     return (
// // // // // //         <div className={classN} style={{ position: 'relative', width: '65%', height: '400px', overflow: 'hidden' }}>
// // // // // //             {slides.map((slide, index) => (
// // // // // //                 <div
// // // // // //                     key={index}
// // // // // //                     style={{
// // // // // //                         width: '100%',
// // // // // //                         height: '100%',
// // // // // //                         position: 'absolute',
// // // // // //                         left: `${(index - activeIndex) * 100}%`,
// // // // // //                         transition: 'left 0.5s ease',
// // // // // //                     }}
// // // // // //                 >
// // // // // //                     {slide.image && (
// // // // // //                         <img 
// // // // // //                             src={slide.image} 
// // // // // //                             alt={slide.title} 
// // // // // //                             style={{
// // // // // //                                 position: 'absolute',
// // // // // //                                 top: 0,
// // // // // //                                 left: 0,
// // // // // //                                 width: '100%',
// // // // // //                                 height: '100%',
// // // // // //                                 objectFit: 'cover',
// // // // // //                             }}
// // // // // //                         />
// // // // // //                     )}
// // // // // //                     <div className={styles.slideContent}>
// // // // // //                         <h2>{slide.title}</h2>
// // // // // //                         <p>{slide.text}</p>
// // // // // //                         {slide.link && (
// // // // // //                             <a href={slide.link}>Read more</a>
// // // // // //                         )}
// // // // // //                     </div>
// // // // // //                 </div>
// // // // // //             ))}
// // // // // //             <button 
// // // // // //                 onClick={prevSlide} 
// // // // // //                 className={styles.carouselButton}
// // // // // //                 style={{ left: '20px' }}
// // // // // //             >
// // // // // //                 Prev
// // // // // //             </button>
// // // // // //             <button 
// // // // // //                 onClick={nextSlide} 
// // // // // //                 className={styles.carouselButton}
// // // // // //                 style={{ right: '20px' }}
// // // // // //             >
// // // // // //                 Next
// // // // // //             </button>
// // // // // //         </div>
// // // // // //     );
// // // // // // };

// // // // // // export default Carousel;
// // // // // 'use client'

// // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // import styles from './Carousel.module.css';

// // // // // const Carousel = ({ slides, classN, autoPlayInterval = 10000,width }) => {
// // // // //     const [activeIndex, setActiveIndex] = useState(0);
// // // // //     const [isClient, setIsClient] = useState(false);

// // // // //     const nextSlide = useCallback(() => {
// // // // //         setActiveIndex(current => (current + 1) % slides.length);
// // // // //     }, [slides.length]);

// // // // //     const prevSlide = useCallback(() => {
// // // // //         setActiveIndex(current => (current - 1 + slides.length) % slides.length);
// // // // //     }, [slides.length]);

// // // // //     useEffect(() => {
// // // // //         setIsClient(true);

// // // // //         // Set up auto-play
// // // // //         const intervalId = setInterval(nextSlide, autoPlayInterval);

// // // // //         // Clean up the interval on component unmount
// // // // //         return () => clearInterval(intervalId);
// // // // //     }, [nextSlide, autoPlayInterval]);

// // // // //     if (!slides || slides.length === 0 || !isClient) {
// // // // //         return <div>Loading...</div>;
// // // // //     }

// // // // //     return (
// // // // //         <div style={{width:`${width}%`}} className={`${styles.carousel} ${classN}`}>
// // // // //             {slides.map((slide, index) => (
// // // // //                 <div
// // // // //                     key={index}
// // // // //                     className={styles.slide}
// // // // //                     style={{
// // // // //                         left: `${(index - activeIndex) * 100}%`,
// // // // //                     }}
// // // // //                 >
// // // // //                     {slide.image && (
// // // // //                         <img 
// // // // //                             src={slide.image} 
// // // // //                             alt={slide.title} 
// // // // //                             className={styles.slideImage}
// // // // //                         />
// // // // //                     )}
// // // // //                     <div className={styles.slideContent}>
// // // // //                         <h2>{slide.title}</h2>
// // // // //                         <p>{slide.text}</p>
// // // // //                         {slide.link && (
// // // // //                             <a href={slide.link}>Read more</a>
// // // // //                         )}
// // // // //                     </div>
// // // // //                 </div>
// // // // //             ))}
// // // // //             <button 
// // // // //                 onClick={prevSlide} 
// // // // //                 className={`${styles.carouselButton} ${styles.prevButton}`}
// // // // //             >
// // // // //                 Prev
// // // // //             </button>
// // // // //             <button 
// // // // //                 onClick={nextSlide} 
// // // // //                 className={`${styles.carouselButton} ${styles.nextButton}`}
// // // // //             >
// // // // //                 Next
// // // // //             </button>
// // // // //         </div>
// // // // //     );
// // // // // };

// // // // // export default Carousel;
// // // // 'use client'
// // // // // components/Carousel.jsx
// // // // import React, { useState, useEffect } from 'react';
// // // // import styles from './Carousel.module.css';

// // // // const Carousel = ({ slides, autoPlayInterval = 3000, width = 100 }) => {
// // // //     const [activeIndex, setActiveIndex] = useState(0);

// // // //     useEffect(() => {
// // // //         if (slides.length > 0) {
// // // //             const interval = setInterval(() => {
// // // //                 setActiveIndex(current => (current + 1) % slides.length);
// // // //             }, autoPlayInterval);

// // // //             return () => clearInterval(interval);
// // // //         }
// // // //     }, [slides.length, autoPlayInterval]);

// // // //     if (!slides || slides.length === 0) {
// // // //         return <div>Loading...</div>;
// // // //     }

// // // //     return (
// // // //         <div style={{ width: `${width}%` }} className={styles.carousel}>
// // // //             {slides.map((slide, index) => (
// // // //                 <div 
// // // //                     key={index} 
// // // //                     className={`${styles.slide} ${index === activeIndex ? styles.active : ''}`} 
// // // //                     style={{ transform: `translateX(-${activeIndex * 100}%)` }}
// // // //                 >
// // // //                     <img src={slide.image} alt={slide.title} className={styles.image} />
// // // //                     <div className={styles.caption}>{slide.title}</div>
// // // //                 </div>
// // // //             ))}
// // // //             <button 
// // // //                 onClick={() => setActiveIndex((current) => (current - 1 + slides.length) % slides.length)} 
// // // //                 className={styles.prevButton}
// // // //             >
// // // //                 Prev
// // // //             </button>
// // // //             <button 
// // // //                 onClick={() => setActiveIndex((current) => (current + 1) % slides.length)} 
// // // //                 className={styles.nextButton}
// // // //             >
// // // //                 Next
// // // //             </button>
// // // //         </div>
// // // //     );
// // // // };

// // // // export default Carousel;
// // // 'use client'
// // // import React, { useState, useEffect } from 'react';
// // // import styles from './Carousel.module.css';

// // // const Carousel = ({ slides, autoPlayInterval = 3000, width = 100 }) => {
// // //     const [activeIndex, setActiveIndex] = useState(0);

// // //     useEffect(() => {
// // //         if (slides.length > 0) {
// // //             const interval = setInterval(() => {
// // //                 setActiveIndex(current => (current + 1) % slides.length);
// // //             }, autoPlayInterval);

// // //             return () => clearInterval(interval);
// // //         }
// // //     }, [slides.length, autoPlayInterval]);

// // //     if (!slides || slides.length === 0) {
// // //         return <div>Loading...</div>;
// // //     }

// // //     return (
// // //         <div style={{ width: `${width}%` }} className={styles.carousel}>
// // //             {slides.map((slide, index) => (
// // //                 <div 
// // //                     key={index} 
// // //                     className={`${styles.slide} ${index === activeIndex ? styles.active : ''}`} 
// // //                     style={{ transform: `translateX(-${activeIndex * 100}%)` }}
// // //                 >
// // //                     <img src={slide.image} alt={slide.title} className={styles.image} />
// // //                     <div className={styles.slideContent}>
// // //                         <h2>{slide.title}</h2>
// // //                         <p>{slide.text}</p>
// // //                         {slide.link && (
// // //                             <a href={slide.link} className={styles.link}>Read more</a>
// // //                         )}
// // //                     </div>
// // //                 </div>
// // //             ))}
// // //             <button 
// // //                 onClick={() => setActiveIndex((current) => (current - 1 + slides.length) % slides.length)} 
// // //                 className={styles.prevButton}
// // //             >
// // //                 Prev
// // //             </button>
// // //             <button 
// // //                 onClick={() => setActiveIndex((current) => (current + 1) % slides.length)} 
// // //                 className={styles.nextButton}
// // //             >
// // //                 Next
// // //             </button>
// // //         </div>
// // //     );
// // // };

// // // export default Carousel;
// // 'use client'
// // import React, { useState, useEffect } from 'react';
// // import styles from './Carousel.module.css';

// // const Carousel = ({ slides, autoPlayInterval = 3000, width = 100 }) => {
// //     const [activeIndex, setActiveIndex] = useState(0);

// //     useEffect(() => {
// //         if (slides.length > 0) {
// //             const interval = setInterval(() => {
// //                 setActiveIndex(current => (current + 1) % slides.length);
// //             }, autoPlayInterval);

// //             return () => clearInterval(interval);
// //         }
// //     }, [slides.length, autoPlayInterval]);

// //     if (!slides || slides.length === 0) {
// //         return <div>Loading...</div>;
// //     }

// //     return (
// //         <div style={{ width: `${width}%` }} className={styles.carousel}>
// //             {slides.map((slide, index) => (
// //                 <div 
// //                     key={index} 
// //                     className={`${styles.slide} ${index === activeIndex ? styles.active : ''}`} 
// //                     style={{ transform: `translateX(-${activeIndex * 100}%)` }}
// //                 >
// //                     <img src={slide.image} alt={slide.title} className={styles.image} />
// //                     <div className={styles.slideContent}>
// //                         <h2>{slide.title}</h2>
// //                         <p>{slide.text}</p>
// //                         {slide.link && (
// //                             <a href={slide.link} className={styles.link}>Read more</a>
// //                         )}
// //                     </div>
// //                 </div>
// //             ))}
// //             <button 
// //                 onClick={() => setActiveIndex((current) => (current - 1 + slides.length) % slides.length)} 
// //                 className={styles.prevButton}
// //             >
// //                 Prev
// //             </button>
// //             <button 
// //                 onClick={() => setActiveIndex((current) => (current + 1) % slides.length)} 
// //                 className={styles.nextButton}
// //             >
// //                 Next
// //             </button>
// //         </div>
// //     );
// // };

// // export default Carousel;
// 'use client'
// import React, { useState, useEffect } from 'react';
// import styles from './Carousel.module.css';

// const Carousel = ({ slides, autoPlayInterval = 3000, width = 100 }) => {
//     const [activeIndex, setActiveIndex] = useState(0);

//     useEffect(() => {
//         if (slides.length > 0) {
//             const interval = setInterval(() => {
//                 setActiveIndex(current => (current + 1) % slides.length);
//             }, autoPlayInterval);

//             return () => clearInterval(interval);
//         }
//     }, [slides.length, autoPlayInterval]);

//     if (!slides || slides.length === 0) {
//         return <div>Loading...</div>;
//     }

//     const goToPrevious = () => {
//         setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
//     };

//     const goToNext = () => {
//         setActiveIndex((current) => (current + 1) % slides.length);
//     };

//     return (
//         <div style={{ width: `${width}%` }} className={styles.carousel}>
//             <div className={styles.slideWrapper} style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
//                 {slides.map((slide, index) => (
//                     <div key={index} className={styles.slide}>
//                         <img src={slide.image} alt={slide.title} className={styles.image} />
//                         <div className={styles.slideContent}>
//                             <h2>{slide.title}</h2>
//                             <p>{slide.text}</p>
//                             {slide.link && (
//                                 <a href={slide.link} className={styles.link}>Read more</a>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             <button onClick={goToPrevious} className={styles.prevButton}>
//                 Prev
//             </button>
//             <button onClick={goToNext} className={styles.nextButton}>
//                 Next
//             </button>
//         </div>
//     );
// };

// export default Carousel;
'use client'
import React, { useState, useEffect } from 'react';
import styles from './Carousel.module.css';

const Carousel = ({ slides, autoPlayInterval = 3000, width = 100 }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (slides.length > 0) {
            const interval = setInterval(() => {
                setActiveIndex(current => (current + 1) % slides.length);
            }, autoPlayInterval);

            return () => clearInterval(interval);
        }
    }, [slides.length, autoPlayInterval]);

    if (!slides || slides.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ width: `${width}%` }} className={styles.carousel}>
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`${styles.slide} ${index === activeIndex ? styles.active : ''}`}
                >
                    <img src={slide.image} alt={slide.title} className={styles.image} />
                    <div className={styles.slideContent}>
                        <h2>{slide.title}</h2>
                        <p>{slide.text}</p>
                        {slide.link && (
                            <a href={slide.link} className={styles.link}>Read more</a>
                        )}
                    </div>
                </div>
            ))}
            
            <button
                onClick={() => setActiveIndex((current) => (current - 1 + slides.length) % slides.length)}
                className={styles.prevButton}
            >
                Prev
            </button>
            <button
                onClick={() => setActiveIndex((current) => (current + 1) % slides.length)}
                className={styles.nextButton}
            >
                Next
            </button>
        </div>
    );
};

export default Carousel;