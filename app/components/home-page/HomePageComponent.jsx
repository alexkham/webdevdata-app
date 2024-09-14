// // // // 'use client'

// // // // import React, { useState, useEffect } from 'react';
// // // // import { ArrowRight, ArrowLeft, ArrowUpCircle, BookOpen } from 'lucide-react';
// // // // import styles from './ModifiedHomePage.module.css';
// // // // import { formatTitle } from '@/app/utils/utils-functions';
// // // // import Image from 'next/image';
// // // // import { montserrat, openSans } from '../../utils/fonts'

// // // // // Pre-import all images
// // // // const imageContext = require.context('/public/images', false, /\.(png|jpe?g|svg)$/);
// // // // const images = {};
// // // // imageContext.keys().forEach((key) => {
// // // //   const imageName = key.replace('./', '');
// // // //   images[imageName] = imageContext(key);
// // // // });

// // // // const getImageUrl = (url) => {
// // // //   const path = url.replace(/^https?:\/\/[^\/]+/, '');
// // // //   let imageName = path.replace(/^\//, '').replace(/\//g, '_');
// // // //   if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(imageName)) {
// // // //     imageName += '.jpg';
// // // //   }
// // // //   return images[imageName] || `/images/${imageName}`;
// // // // };

// // // // const ModifiedHomePage = ({ categorizedUrls, metaDescriptions }) => {
// // // //   const [currentSlide, setCurrentSlide] = useState(0);
// // // //   const allUrls = [...categorizedUrls.main, ...Object.values(categorizedUrls.categories).flat(), ...categorizedUrls.leaves];

// // // //   const heroUrls = allUrls.slice(0, 6);
// // // //   const featuredUrls = allUrls.slice(6, 10);

// // // //   useEffect(() => {
// // // //     const timer = setInterval(() => {
// // // //       setCurrentSlide((prevSlide) => (prevSlide + 1) % heroUrls.length);
// // // //     }, 6000);
// // // //     return () => clearInterval(timer);
// // // //   }, [heroUrls.length]);

// // // //   const NewsCard = ({ url, size = 'medium' }) => {
// // // //     const title = formatTitle(url);
// // // //     return (
// // // //       <div className={`${styles.newsCard} ${styles[size]} ${openSans.className}`}>
// // // //         <div className={styles.newsCardHeader}>
// // // //           <div className={styles.newsCardIcon}>
// // // //             <BookOpen />
// // // //           </div>
// // // //           <h3 className={`${styles.newsTitle} subtitle`}>{title}</h3>
// // // //         </div>
// // // //         <div className={styles.newsCardContent}>
// // // //           <p className={`${styles.newsDescription} body-text`}>
// // // //             {metaDescriptions[url.trim()] || 'Description coming soon'}
// // // //           </p>
// // // //           <a href={url} className={`${styles.newsCardLink} body-text-small`}>Read More</a>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   };
 
// // // //   const CategorySection = ({ category, urls }) => (
// // // //     <section className={`${styles.categorySection} ${openSans.className}`} id={category}>
// // // //       <h2 className={`${styles.categoryTitle} title-medium`}>{formatTitle(category)}</h2>
// // // //       <div className={styles.categoryGrid}>
// // // //         {urls.slice(0, 4).map((url, index) => (
// // // //           <div key={index} className={styles.categoryItem}>
// // // //             <Image 
// // // //               src={getImageUrl(url)}
// // // //               alt={formatTitle(url)} 
// // // //               className={styles.categoryImage}
// // // //               width={400}
// // // //               height={300}
// // // //               loading="lazy"
// // // //             />
// // // //             <div className={styles.categoryContent}>
// // // //               <h3 className={`${styles.categoryItemTitle} subtitle`}>{formatTitle(url)}</h3>
// // // //               <p className={`${styles.categoryItemDescription} body-text`}>
// // // //                {metaDescriptions[url.trim()] || 'Description coming soon'}
// // // //               </p>
// // // //               <div className={styles.linksGroup}>
// // // //                 <a href={url} className={`${styles.categoryItemLink} body-text-small`}>Explore</a>
// // // //                 <a href={'#top'} className={styles.backToTop}>
// // // //                   <ArrowUpCircle />
// // // //                 </a>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         ))}
// // // //       </div>
// // // //     </section>
// // // //   );

// // // //   return (
// // // //     <div className={`${styles.container} ${montserrat.variable} ${openSans.variable}`} id='top'>
// // // //       <header className={styles.header}>
// // // //         <h1 className={`${styles.siteTitle} ${montserrat.className} title-large`}>Discover Mathematics</h1>
// // // //         <nav className={`${styles.nav} ${openSans.className}`}>
// // // //           {Object.keys(categorizedUrls.categories).map((category) => (
// // // //             <a key={category} href={`#${category}`} className={`${styles.navLink} body-text`}>
// // // //               {formatTitle(category)}
// // // //             </a>
// // // //           ))}
// // // //         </nav>
// // // //       </header>

// // // //       <main className={`${styles.main} ${openSans.className}`}>
// // // //         <section className={styles.heroSection}>
// // // //           {heroUrls.map((url, index) => (
// // // //             <div key={index} className={`${styles.heroSlide} ${index === currentSlide ? styles.activeSlide : ''}`}>
// // // //               <a href={url} className={styles.heroLink}>
// // // //                 <div className={styles.heroImageWrapper}>
// // // //                   <Image 
// // // //                     src={getImageUrl(url)}
// // // //                     alt={formatTitle(url)}
// // // //                     className={styles.heroImage}
// // // //                     width={1200}
// // // //                     height={600}
// // // //                     priority
// // // //                   />
// // // //                 </div>
// // // //                 <div className={styles.heroContent}>
// // // //                   <h2 className={`${styles.heroTitle} ${montserrat.className} title-medium`}>{formatTitle(url)}</h2>
// // // //                   <p className={`${styles.heroDescription} body-text`}>
// // // //                     {metaDescriptions[url.trim()] || 'Description coming soon'}
// // // //                   </p>
// // // //                 </div>
// // // //               </a>
// // // //             </div>
// // // //           ))}
// // // //           <button className={`${styles.slideButton} ${styles.prevButton}`} onClick={() => setCurrentSlide((currentSlide - 1 + heroUrls.length) % heroUrls.length)}>
// // // //             <ArrowLeft />
// // // //           </button>
// // // //           <button className={`${styles.slideButton} ${styles.nextButton}`} onClick={() => setCurrentSlide((currentSlide + 1) % heroUrls.length)}>
// // // //             <ArrowRight />
// // // //           </button>
// // // //         </section>

// // // //         <section className={styles.featuredSection}>
// // // //           {featuredUrls.map((url, index) => (
// // // //             <NewsCard key={index} url={url} size="medium" />
// // // //           ))}
// // // //         </section>

// // // //         <div className={styles.mainContent}>
// // // //           <div className={styles.primaryContent}>
// // // //             {Object.entries(categorizedUrls.categories).map(([category, urls]) => (
// // // //               <CategorySection key={category} category={category} urls={urls} />
// // // //             ))}
// // // //           </div>
// // // //           <aside className={`${styles.sidebar} ${openSans.className}`}>
// // // //             <h2 className={`${styles.sidebarTitle} ${montserrat.className} subtitle`}>Latest Topics</h2>
// // // //             <ul className={styles.sidebarList}>
// // // //               {allUrls.slice(10, 20).map((url, index) => (
// // // //                 <li key={index} className={styles.sidebarItem}>
// // // //                   <a href={url} className={`${styles.sidebarLink} body-text-small`}>
// // // //                     {formatTitle(url)}
// // // //                   </a>
// // // //                 </li>
// // // //               ))}
// // // //             </ul>
// // // //           </aside>
// // // //         </div>
// // // //       </main>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ModifiedHomePage;
// // // 'use client'

// // // import React, { useState, useEffect } from 'react';
// // // import { ChevronRight, ChevronLeft, SquareChevronUp, Book } from 'lucide-react';
// // // import styles from './HomePageComponent.module.css';
// // // import { formatTitle } from '@/utils/functions';
// // // import Image from 'next/image';
// // // import { lora,roboto } from '@/utils/fonts';
// // // // Pre-import all images
// // // const imageContext = require.context('/public/images', false, /\.(png|jpe?g|svg)$/);
// // // const images = {};
// // // imageContext.keys().forEach((key) => {
// // //   const imageName = key.replace('./', '');
// // //   images[imageName] = imageContext(key);
// // // });

// // // const getImageUrl = (url) => {
// // //   const path = url.replace(/^https?:\/\/[^\/]+/, '');
// // //   let imageName = path.replace(/^\//, '').replace(/\//g, '_');
// // //   if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(imageName)) {
// // //     imageName += '.jpg';
// // //   }
// // //   return images[imageName] || `/images/${imageName}`;
// // // };

// // // const HomePageComponent = ({ categorizedUrls, metaDescriptions }) => {
// // //   const [currentSlide, setCurrentSlide] = useState(0);
// // //   const allUrls = [...categorizedUrls.main, ...Object.values(categorizedUrls.categories).flat(), ...categorizedUrls.leaves];

// // //   const heroUrls = allUrls.slice(0, 5);
// // //   const featuredUrls = allUrls.slice(5, 9);

// // //   useEffect(() => {
// // //     console.log('Meta Descriptions :  ' + metaDescriptions)
// // //   })

// // //   useEffect(() => {
// // //     const timer = setInterval(() => {
// // //       setCurrentSlide((prevSlide) => (prevSlide + 1) % heroUrls.length);
// // //     }, 5000);
// // //     return () => clearInterval(timer);
// // //   }, [heroUrls.length]);

// // //   const NewsCard = ({ url, size = 'medium' }) => {
// // //     const title = formatTitle(url);
// // //     return (
// // //       <div className={`${styles.newsCard} ${styles[size]} ${roboto.className}`}>
// // //         <div className={styles.newsCardHeader}>
// // //           <div className={styles.newsCardIcon}>
// // //             <Book />
// // //           </div>
// // //           <h3 className={`${styles.newsTitle} subtitle`}>{title}</h3>
// // //         </div>
// // //         <div className={styles.newsCardContent}>
// // //           <p className={`${styles.newsDescription} body-text`}>
// // //             {metaDescriptions[url.trim()] || 'No description available at the Moment'}
// // //           </p>
// // //           <a href={url} className={`${styles.newsCardLink} body-text-small`}>Learn More</a>
// // //         </div>
// // //       </div>
// // //     );
// // //   };
 
// // //   const CategorySection = ({ category, urls }) => (
// // //     <section className={`${styles.categorySection} ${roboto.className}`} id={category}>
// // //       <br></br>
// // //       <br></br>
// // //       <br></br>
// // //       <h2 className={`${styles.categoryTitle} title-medium`}>{formatTitle(category)}</h2>
// // //       <div className={styles.categoryGrid}>
// // //         {urls.slice(0, 4).map((url, index) => (
// // //           <div key={index} className={styles.categoryItem}>
// // //             <Image 
// // //               src={getImageUrl(url)}
// // //               alt={formatTitle(url)} 
// // //               className={styles.categoryImage}
// // //               width={400}
// // //               height={300}
// // //               loading="lazy"
// // //             />
// // //             <div className={styles.categoryContent}>
// // //               <h3 className={`${styles.categoryItemTitle} subtitle`}>{formatTitle(url)}</h3>
// // //               <p className={`${styles.categoryItemDescription} body-text`}>
// // //                {metaDescriptions[url.trim()] || 'No description available at the Moment'}
// // //               </p>
// // //               <div className={styles.linksGroup}>
// // //                 <a href={url} className={`${styles.categoryItemLink} body-text-small`}>Learn More</a>
// // //                 <a href={'#top'} className={styles.backToTop}>
// // //                   <svg width="24" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// // //                     <path d="M6 15L12 9L18 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// // //                   </svg>
// // //                 </a>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>
// // //     </section>
// // //   );

// // //   return (
// // //     <div className={`${styles.container} ${lora.variable} ${roboto.variable}`} id='top'>
// // //       <br></br>
     
// // //       <header className={styles.header}>
// // //         <h1 className={`${styles.siteTitle} ${lora.className} title-large`}>Learn Mathematics Online</h1>
// // //         <nav className={`${styles.nav} ${roboto.className}`}>
// // //           {Object.keys(categorizedUrls.categories).map((category) => (
// // //             <a key={category} href={`#${category}`} className={`${styles.navLink} body-text`}>
// // //               {formatTitle(category)}
// // //             </a>
// // //           ))}
// // //         </nav>
// // //       </header>

// // //       <main className={`${styles.main} ${roboto.className}`}>
// // //         <section className={styles.heroSection}>
// // //           {heroUrls.map((url, index) => (
// // //             <div key={index} className={`${styles.heroSlide} ${index === currentSlide ? styles.activeSlide : ''}`}>
// // //               <a href={url} className={styles.heroLink}>
// // //                 <div className={styles.heroImageWrapper}>
// // //                   <Image 
// // //                     src={getImageUrl(url)}
// // //                     alt={formatTitle(url)}
// // //                     className={styles.heroImage}
// // //                     width={1200}
// // //                     height={600}
// // //                     priority
// // //                   />
// // //                 </div>
// // //                 <div className={styles.heroContent}>
// // //                   <h2 className={`${styles.heroTitle} ${lora.className} title-medium`}>{formatTitle(url)}</h2>
// // //                   <p className={`${styles.heroDescription} body-text`}>
// // //                     {metaDescriptions[url.trim()] || 'No description available at the Moment'}
// // //                   </p>
// // //                 </div>
// // //               </a>
// // //             </div>
// // //           ))}
// // //           <button className={`${styles.slideButton} ${styles.prevButton}`} onClick={() => setCurrentSlide((currentSlide - 1 + heroUrls.length) % heroUrls.length)}>
// // //             <ChevronLeft />
// // //           </button>
// // //           <button className={`${styles.slideButton} ${styles.nextButton}`} onClick={() => setCurrentSlide((currentSlide + 1) % heroUrls.length)}>
// // //             <ChevronRight />
// // //           </button>
// // //         </section>

// // //         <section className={styles.featuredSection}>
// // //           {featuredUrls.map((url, index) => (
// // //             <NewsCard key={index} url={url} size="medium" />
// // //           ))}
// // //         </section>

// // //         <div className={styles.mainContent}>
// // //           <div className={styles.primaryContent}>
// // //             {Object.entries(categorizedUrls.categories).map(([category, urls]) => (
// // //               <CategorySection key={category} category={category} urls={urls} />
// // //             ))}
// // //           </div>
// // //           <aside className={`${styles.sidebar} ${roboto.className}`}>
// // //             <br></br>
// // //             <br></br>
// // //             <br></br>
// // //             <h2 className={`${styles.sidebarTitle} ${lora.className} subtitle`}>Latest Updates</h2>
// // //             <ul className={styles.sidebarList}>
// // //               {allUrls.slice(9, 19).map((url, index) => (
// // //                 <li key={index} className={styles.sidebarItem}>
// // //                   <a href={url} className={`${styles.sidebarLink} body-text-small`}>
// // //                     {formatTitle(url)}
// // //                   </a>
// // //                 </li>
// // //               ))}
// // //             </ul>
// // //           </aside>
// // //         </div>
// // //       </main>
// // //     </div>
// // //   );
// // // };

// // // export default HomePageComponent;
// // 'use client'

// // import React, { useState, useEffect } from 'react';
// // import { ChevronRight, ChevronLeft, SquareChevronUp, Book } from 'lucide-react';
// // import styles from './HomePageComponent.module.css';
// // import { formatTitle } from '@/utils/functions';
// // import Image from 'next/image';
// // import { lora, roboto } from '@/utils/fonts';

// // const getImageUrl = (url) => {
// //   const path = url.replace(/^https?:\/\/[^\/]+/, '');
// //   let imageName = path.replace(/^\//, '').replace(/\//g, '_');
// //   if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(imageName)) {
// //     imageName += '.jpg';
// //   }
// //   return `/images/${imageName}`;
// // };

// // const HomePageComponent = ({ categorizedUrls, metaDescriptions }) => {
// //   const [currentSlide, setCurrentSlide] = useState(0);
// //   const allUrls = [...categorizedUrls.main, ...Object.values(categorizedUrls.categories).flat(), ...categorizedUrls.leaves];

// //   const heroUrls = allUrls.slice(0, 5);
// //   const featuredUrls = allUrls.slice(5, 9);

// //   useEffect(() => {
// //     console.log('Meta Descriptions :  ' + metaDescriptions)
// //   })

// //   useEffect(() => {
// //     const timer = setInterval(() => {
// //       setCurrentSlide((prevSlide) => (prevSlide + 1) % heroUrls.length);
// //     }, 5000);
// //     return () => clearInterval(timer);
// //   }, [heroUrls.length]);

// //   const NewsCard = ({ url, size = 'medium' }) => {
// //     const title = formatTitle(url);
// //     return (
// //       <div className={`${styles.newsCard} ${styles[size]} ${roboto.className}`}>
// //         <div className={styles.newsCardHeader}>
// //           <div className={styles.newsCardIcon}>
// //             <Book />
// //           </div>
// //           <h3 className={`${styles.newsTitle} subtitle`}>{title}</h3>
// //         </div>
// //         <div className={styles.newsCardContent}>
// //           <p className={`${styles.newsDescription} body-text`}>
// //             {metaDescriptions[url.trim()] || 'No description available at the Moment'}
// //           </p>
// //           <a href={url} className={`${styles.newsCardLink} body-text-small`}>Learn More</a>
// //         </div>
// //       </div>
// //     );
// //   };
 
// //   const CategorySection = ({ category, urls }) => (
// //     <section className={`${styles.categorySection} ${roboto.className}`} id={category}>
// //       <br></br>
// //       <br></br>
// //       <br></br>
// //       <h2 className={`${styles.categoryTitle} title-medium`}>{formatTitle(category)}</h2>
// //       <div className={styles.categoryGrid}>
// //         {urls.slice(0, 4).map((url, index) => (
// //           <div key={index} className={styles.categoryItem}>
// //             <Image 
// //               src={getImageUrl(url)}
// //               alt={formatTitle(url)} 
// //               className={styles.categoryImage}
// //               width={400}
// //               height={300}
// //               loading="lazy"
// //             />
// //             <div className={styles.categoryContent}>
// //               <h3 className={`${styles.categoryItemTitle} subtitle`}>{formatTitle(url)}</h3>
// //               <p className={`${styles.categoryItemDescription} body-text`}>
// //                {metaDescriptions[url.trim()] || 'No description available at the Moment'}
// //               </p>
// //               <div className={styles.linksGroup}>
// //                 <a href={url} className={`${styles.categoryItemLink} body-text-small`}>Learn More</a>
// //                 <a href={'#top'} className={styles.backToTop}>
// //                   <svg width="24" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// //                     <path d="M6 15L12 9L18 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //                   </svg>
// //                 </a>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </section>
// //   );

// //   return (
// //     <div className={`${styles.container} ${lora.variable} ${roboto.variable}`} id='top'>
// //       <br></br>
     
// //       <header className={styles.header}>
// //         <h1 className={`${styles.siteTitle} ${lora.className} title-large`}>Learn Mathematics Online</h1>
// //         <nav className={`${styles.nav} ${roboto.className}`}>
// //           {Object.keys(categorizedUrls.categories).map((category) => (
// //             <a key={category} href={`#${category}`} className={`${styles.navLink} body-text`}>
// //               {formatTitle(category)}
// //             </a>
// //           ))}
// //         </nav>
// //       </header>

// //       <main className={`${styles.main} ${roboto.className}`}>
// //         <section className={styles.heroSection}>
// //           {heroUrls.map((url, index) => (
// //             <div key={index} className={`${styles.heroSlide} ${index === currentSlide ? styles.activeSlide : ''}`}>
// //               <a href={url} className={styles.heroLink}>
// //                 <div className={styles.heroImageWrapper}>
// //                   <Image 
// //                     src={getImageUrl(url)}
// //                     alt={formatTitle(url)}
// //                     className={styles.heroImage}
// //                     width={1200}
// //                     height={600}
// //                     priority
// //                   />
// //                 </div>
// //                 <div className={styles.heroContent}>
// //                   <h2 className={`${styles.heroTitle} ${lora.className} title-medium`}>{formatTitle(url)}</h2>
// //                   <p className={`${styles.heroDescription} body-text`}>
// //                     {metaDescriptions[url.trim()] || 'No description available at the Moment'}
// //                   </p>
// //                 </div>
// //               </a>
// //             </div>
// //           ))}
// //           <button className={`${styles.slideButton} ${styles.prevButton}`} onClick={() => setCurrentSlide((currentSlide - 1 + heroUrls.length) % heroUrls.length)}>
// //             <ChevronLeft />
// //           </button>
// //           <button className={`${styles.slideButton} ${styles.nextButton}`} onClick={() => setCurrentSlide((currentSlide + 1) % heroUrls.length)}>
// //             <ChevronRight />
// //           </button>
// //         </section>

// //         <section className={styles.featuredSection}>
// //           {featuredUrls.map((url, index) => (
// //             <NewsCard key={index} url={url} size="medium" />
// //           ))}
// //         </section>

// //         <div className={styles.mainContent}>
// //           <div className={styles.primaryContent}>
// //             {Object.entries(categorizedUrls.categories).map(([category, urls]) => (
// //               <CategorySection key={category} category={category} urls={urls} />
// //             ))}
// //           </div>
// //           <aside className={`${styles.sidebar} ${roboto.className}`}>
// //             <br></br>
// //             <br></br>
// //             <br></br>
// //             <h2 className={`${styles.sidebarTitle} ${lora.className} subtitle`}>Latest Updates</h2>
// //             <ul className={styles.sidebarList}>
// //               {allUrls.slice(9, 19).map((url, index) => (
// //                 <li key={index} className={styles.sidebarItem}>
// //                   <a href={url} className={`${styles.sidebarLink} body-text-small`}>
// //                     {formatTitle(url)}
// //                   </a>
// //                 </li>
// //               ))}
// //             </ul>
// //           </aside>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // export default HomePageComponent;
// import React, { useState, useEffect } from 'react';
// import { ChevronRight, ChevronLeft, SquareChevronUp, Book } from 'lucide-react';
// import styles from './HomePageComponent.module.css';
// import { formatTitle } from '@/utils/functions';
// import Image from 'next/image';
// import { lora,roboto } from '@/utils/fonts';

// const getImageUrl = (url) => {
//   if (!url) return '/images/default.jpg';
//   const path = url.replace(/^https?:\/\/[^\/]+/, '');
//   let imageName = path.replace(/^\//, '').replace(/\//g, '_');
//   if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(imageName)) {
//     imageName += '.jpg';
//   }
//   return `/images/${imageName}`;
// };

// const HomePageComponent = ({ categorizedUrls, metaDescriptions }) => {
//   const [currentSlide, setCurrentSlide] = useState(0);
  
//   // Validate input props
//   if (!categorizedUrls || typeof categorizedUrls !== 'object') {
//     console.error('Invalid categorizedUrls prop:', categorizedUrls);
//     return <div>Error: Invalid data structure</div>;
//   }

//   const allUrls = [
//     ...(Array.isArray(categorizedUrls.main) ? categorizedUrls.main : []),
//     ...Object.values(categorizedUrls.categories || {}).flat(),
//     ...(Array.isArray(categorizedUrls.leaves) ? categorizedUrls.leaves : [])
//   ].filter(Boolean);

//   const heroUrls = allUrls.slice(0, 5);
//   const featuredUrls = allUrls.slice(5, 9);

//   useEffect(() => {
//     if (heroUrls.length === 0) return;
//     const timer = setInterval(() => {
//       setCurrentSlide((prevSlide) => (prevSlide + 1) % heroUrls.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, [heroUrls.length]);

//   const NewsCard = ({ url, size = 'medium' }) => {
//     if (!url) return null;
//     const title = formatTitle(url);
//     return (
//       <div className={`${styles.newsCard} ${styles[size]} ${roboto.className}`}>
//         <div className={styles.newsCardHeader}>
//           <div className={styles.newsCardIcon}>
//             <Book />
//           </div>
//           <h3 className={`${styles.newsTitle} subtitle`}>{title}</h3>
//         </div>
//         <div className={styles.newsCardContent}>
//           <p className={`${styles.newsDescription} body-text`}>
//             {(metaDescriptions && metaDescriptions[url.trim()]) || 'No description available at the moment'}
//           </p>
//           <a href={url} className={`${styles.newsCardLink} body-text-small`}>Learn More</a>
//         </div>
//       </div>
//     );
//   };
 
//   const CategorySection = ({ category, urls }) => {
//     if (!category || !Array.isArray(urls)) return null;
//     return (
//       <section className={`${styles.categorySection} ${roboto.className}`} id={category}>
//         <h2 className={`${styles.categoryTitle} title-medium`}>{formatTitle(category)}</h2>
//         <div className={styles.categoryGrid}>
//           {urls.slice(0, 4).map((url, index) => (
//             url && (
//               <div key={index} className={styles.categoryItem}>
//                 <Image 
//                   src={getImageUrl(url)}
//                   alt={formatTitle(url)} 
//                   className={styles.categoryImage}
//                   width={400}
//                   height={300}
//                   loading="lazy"
//                 />
//                 <div className={styles.categoryContent}>
//                   <h3 className={`${styles.categoryItemTitle} subtitle`}>{formatTitle(url)}</h3>
//                   <p className={`${styles.categoryItemDescription} body-text`}>
//                    {(metaDescriptions && metaDescriptions[url.trim()]) || 'No description available at the moment'}
//                   </p>
//                   <div className={styles.linksGroup}>
//                     <a href={url} className={`${styles.categoryItemLink} body-text-small`}>Learn More</a>
//                     <a href={'#top'} className={styles.backToTop}>
//                       <svg width="24" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M6 15L12 9L18 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             )
//           ))}
//         </div>
//       </section>
//     );
//   };

//   if (allUrls.length === 0) {
//     return <div>No content available</div>;
//   }

//   return (
//     <div className={`${styles.container} ${lora.variable} ${roboto.variable}`} id='top'>
//       <header className={styles.header}>
//         <h1 className={`${styles.siteTitle} ${lora.className} title-large`}>Learn Mathematics Online</h1>
//         <nav className={`${styles.nav} ${roboto.className}`}>
//           {Object.keys(categorizedUrls.categories || {}).map((category) => (
//             <a key={category} href={`#${category}`} className={`${styles.navLink} body-text`}>
//               {formatTitle(category)}
//             </a>
//           ))}
//         </nav>
//       </header>

//       <main className={`${styles.main} ${roboto.className}`}>
//         <section className={styles.heroSection}>
//           {heroUrls.map((url, index) => (
//             url && (
//               <div key={index} className={`${styles.heroSlide} ${index === currentSlide ? styles.activeSlide : ''}`}>
//                 <a href={url} className={styles.heroLink}>
//                   <div className={styles.heroImageWrapper}>
//                     <Image 
//                       src={getImageUrl(url)}
//                       alt={formatTitle(url)}
//                       className={styles.heroImage}
//                       width={1200}
//                       height={600}
//                       priority
//                     />
//                   </div>
//                   <div className={styles.heroContent}>
//                     <h2 className={`${styles.heroTitle} ${lora.className} title-medium`}>{formatTitle(url)}</h2>
//                     <p className={`${styles.heroDescription} body-text`}>
//                       {(metaDescriptions && metaDescriptions[url.trim()]) || 'No description available at the moment'}
//                     </p>
//                   </div>
//                 </a>
//               </div>
//             )
//           ))}
//           {heroUrls.length > 1 && (
//             <>
//               <button className={`${styles.slideButton} ${styles.prevButton}`} onClick={() => setCurrentSlide((currentSlide - 1 + heroUrls.length) % heroUrls.length)}>
//                 <ChevronLeft />
//               </button>
//               <button className={`${styles.slideButton} ${styles.nextButton}`} onClick={() => setCurrentSlide((currentSlide + 1) % heroUrls.length)}>
//                 <ChevronRight />
//               </button>
//             </>
//           )}
//         </section>

//         <section className={styles.featuredSection}>
//           {featuredUrls.map((url, index) => (
//             <NewsCard key={index} url={url} size="medium" />
//           ))}
//         </section>

//         <div className={styles.mainContent}>
//           <div className={styles.primaryContent}>
//             {Object.entries(categorizedUrls.categories || {}).map(([category, urls]) => (
//               <CategorySection key={category} category={category} urls={urls} />
//             ))}
//           </div>
//           <aside className={`${styles.sidebar} ${roboto.className}`}>
//             <h2 className={`${styles.sidebarTitle} ${lora.className} subtitle`}>Latest Updates</h2>
//             <ul className={styles.sidebarList}>
//               {allUrls.slice(9, 19).map((url, index) => (
//                 url && (
//                   <li key={index} className={styles.sidebarItem}>
//                     <a href={url} className={`${styles.sidebarLink} body-text-small`}>
//                       {formatTitle(url)}
//                     </a>
//                   </li>
//                 )
//               ))}
//             </ul>
//           </aside>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default HomePageComponent;
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, SquareChevronUp, Book } from 'lucide-react';
import styles from './HomePageComponent.module.css';
import { formatTitle } from '@/utils/functions';
import Image from 'next/image';
import { lora, roboto } from '@/utils/fonts';

const getImageUrl = (url) => {
  if (!url) return '/images/default.jpg';
  const path = url.replace(/^https?:\/\/[^\/]+/, '');
  let imageName = path.replace(/^\//, '').replace(/\//g, '_');
  if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(imageName)) {
    imageName += '.jpg';
  }
  return `/images/${imageName}`;
};

const HomePageComponent = ({ categorizedUrls, metaDescriptions = {} ,title=' ' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Validate and provide defaults for categorizedUrls
  const validatedUrls = {
    main: Array.isArray(categorizedUrls?.main) ? categorizedUrls.main : [],
    categories: categorizedUrls?.categories && typeof categorizedUrls.categories === 'object' ? categorizedUrls.categories : {},
    leaves: Array.isArray(categorizedUrls?.leaves) ? categorizedUrls.leaves : []
  };

  const allUrls = [
    ...validatedUrls.main,
    ...Object.values(validatedUrls.categories).flat(),
    ...validatedUrls.leaves
  ].filter(Boolean);

  const heroUrls = allUrls.slice(0, 5);
  const featuredUrls = allUrls.slice(5, 9);

  useEffect(() => {
    if (heroUrls.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroUrls.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroUrls.length]);

  const NewsCard = ({ url, size = 'medium' }) => {
    if (!url) return null;
    const title = formatTitle(url);
    return (
      <div className={`${styles.newsCard} ${styles[size]} ${roboto.className}`}>
        <div className={styles.newsCardHeader}>
          <div className={styles.newsCardIcon}>
            <Book />
          </div>
          <h3 className={`${styles.newsTitle} subtitle`}>{title}</h3>
        </div>
        <div className={styles.newsCardContent}>
          <p className={`${styles.newsDescription} body-text`}>
            {metaDescriptions[url.trim()] || 'No description available at the moment'}
          </p>
          <a href={url} className={`${styles.newsCardLink} body-text-small`}>Learn More</a>
        </div>
      </div>
    );
  };
 
  const CategorySection = ({ category, urls }) => {
    if (!category || !Array.isArray(urls)) return null;
    return (
      <section className={`${styles.categorySection} ${roboto.className}`} id={category}>
        <h2 className={`${styles.categoryTitle} title-medium`}>{formatTitle(category)}</h2>
        <div className={styles.categoryGrid}>
          {urls.slice(0, 4).map((url, index) => (
            url && (
              <div key={index} className={styles.categoryItem}>
                <Image 
                  src={getImageUrl(url)}
                  alt={formatTitle(url)} 
                  className={styles.categoryImage}
                  width={400}
                  height={300}
                  loading="lazy"
                />
                <div className={styles.categoryContent}>
                  <h3 className={`${styles.categoryItemTitle} subtitle`}>{formatTitle(url)}</h3>
                  <p className={`${styles.categoryItemDescription} body-text`}>
                    {metaDescriptions[url.trim()] || 'No description available at the moment'}
                  </p>
                  <div className={styles.linksGroup}>
                    <a href={url} className={`${styles.categoryItemLink} body-text-small`}>Learn More</a>
                    <a href={'#top'} className={styles.backToTop}>
                      <svg width="24" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 15L12 9L18 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </section>
    );
  };

  if (allUrls.length === 0) {
    return <div>No content available</div>;
  }

  return (
    <div className={`${styles.container} ${lora.variable} ${roboto.variable}`} id='top'>
      <header className={styles.header}>
        <h1 className={`${styles.siteTitle} ${lora.className} title-large`}>{title}</h1>
        <nav className={`${styles.nav} ${roboto.className}`}>
          {Object.keys(validatedUrls.categories).map((category) => (
            <a key={category} href={`#${category}`} className={`${styles.navLink} body-text`}>
              {formatTitle(category)}
            </a>
          ))}
        </nav>
      </header>

      <main className={`${styles.main} ${roboto.className}`}>
        <section className={styles.heroSection}>
          {heroUrls.map((url, index) => (
            url && (
              <div key={index} className={`${styles.heroSlide} ${index === currentSlide ? styles.activeSlide : ''}`}>
                <a href={url} className={styles.heroLink}>
                  <div className={styles.heroImageWrapper}>
                    <Image 
                      src={getImageUrl(url)}
                      alt={formatTitle(url)}
                      className={styles.heroImage}
                      width={1200}
                      height={600}
                      priority
                    />
                  </div>
                  <div className={styles.heroContent}>
                    <h2 className={`${styles.heroTitle} ${lora.className} title-medium`}>{formatTitle(url)}</h2>
                    <p className={`${styles.heroDescription} body-text`}>
                      {metaDescriptions[url.trim()] || 'No description available at the moment'}
                    </p>
                  </div>
                </a>
              </div>
            )
          ))}
          {heroUrls.length > 1 && (
            <>
              <button className={`${styles.slideButton} ${styles.prevButton}`} onClick={() => setCurrentSlide((currentSlide - 1 + heroUrls.length) % heroUrls.length)}>
                <ChevronLeft />
              </button>
              <button className={`${styles.slideButton} ${styles.nextButton}`} onClick={() => setCurrentSlide((currentSlide + 1) % heroUrls.length)}>
                <ChevronRight />
              </button>
            </>
          )}
        </section>

        <section className={styles.featuredSection}>
          {featuredUrls.map((url, index) => (
            <NewsCard key={index} url={url} size="medium" />
          ))}
        </section>

        <div className={styles.mainContent}>
          <div className={styles.primaryContent}>
            {Object.entries(validatedUrls.categories).map(([category, urls]) => (
              <CategorySection key={category} category={category} urls={urls} />
            ))}
          </div>
          <aside className={`${styles.sidebar} ${roboto.className}`}>
            <h2 className={`${styles.sidebarTitle} ${lora.className} subtitle`}>Latest Updates</h2>
            <ul className={styles.sidebarList}>
              {allUrls.slice(9, 19).map((url, index) => (
                url && (
                  <li key={index} className={styles.sidebarItem}>
                    <a href={url} className={`${styles.sidebarLink} body-text-small`}>
                      {formatTitle(url)}
                    </a>
                  </li>
                )
              ))}
            </ul>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default HomePageComponent;