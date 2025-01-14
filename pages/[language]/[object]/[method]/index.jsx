// // // // pages/[language]/[object]/[method].js

// // // import CodeTabs from '@/app/components/MyTabs/CodeTabs';
// // // import ParametersTabs from '@/app/components/MyTabs/ParametersTabs';
// // // import DynamicAccordion from '@/app/components/accordion/DynamicAccordion';
// // // import { useRouter } from 'next/router';
// // // import 'prismjs/themes/prism-tomorrow.css'; // Example theme
// // // import 'prismjs/components/prism-python';
// // // import '../../../pages.css'

// // // import path from 'path';
// // // import ConsoleComponentProps5 from '@/app/components/code-widget/ConsoleComponentProps5';
// // // import { renderTextWithLineBreaksSeparator } from '@/utils/functions';
// // // import MyNavbar from '@/app/components/nav-bar/MyNavbar';
// // // import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2';
// // // import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';



// // // export default function MethodPage({ data }) {
// // //   const router = useRouter();
// // //   const { language, object, method } = router.query;
// // //   const dataArray=[data]
  
// // //   // Render data or loading state
// // //   if (router.isFallback) {
// // //     return <div>Loading...</div>;
// // //   }

// // //   return (
// // //     < >
// // //       <MyNavbar2></MyNavbar2>
      
// // //       <br></br>
// // //       <br></br>
// // //       <Breadcrumb></Breadcrumb>
      
// // //       {/* <div className='outer-container-page'>
// // //       <DynamicAccordion data={dataArray} ></DynamicAccordion>
// // //       <div className='syntax'>
// // //         <br></br>
// // //         <h3>Syntax</h3>
// // //       <span >{renderTextWithLineBreaksSeparator(data.signature,';')}</span>
// // //       </div>
// // //       <ParametersTabs tabs={data.parameters}></ParametersTabs>
      
// // //       <CodeTabs 
// // //       tabs={data.use_cases}
// // //       className={"language-js"}></CodeTabs>
     

// // //       </div> */}
// // //       <br></br>
// // //       <br></br>
// // //       <br></br>
// // //       <br></br>
// // //       <br></br>
// // //       <br></br>
      
// // //     </>
// // //   );
// // // }

// // // export async function getStaticPaths() {
// // //   // Fetch or define your paths based on available data
// // //   const paths = [
// // //     { params: { language: 'javascript', object: 'arrays', method: 'push' } },
// // //     // Add more paths as needed
// // //   ];

// // //   return { paths, fallback: true };
// // // }

// // // // export async function getStaticProps({ params }) {
// // // //   // Fetch data for each method based on the params
// // // //   const data = await fetchData(params.language, params.object);
// // // //   return { props: { data } };
// // // // }

// // // // export async function getStaticProps({ params }) {
  
// // // //   const data = await fetchData(params.language, params.object, params.method);
// // // //   if (!data || Object.keys(data).length === 0) {
// // // //     // Handle the case where no data is returned
// // // //     return {
// // // //       notFound: true, // This will render the 404 page
// // // //     };
// // // //   }
// // // //   return { props: { data } };
// // // // }

// // // export async function getStaticProps({ params }) {
// // //   // Dynamically import 'fs' inside getStaticProps
// // //   const fs = require('fs');

// // //   // Construct the file path
// // //   //const filePath = path.join(process.cwd(),  `../../../../app/api/db/development/${params.language}/${params.object}_methods.json`);
// // //   const filePath = path.join(process.cwd(), 'app', 'api', 'db', 'developement', `${params.language}`, `${params.object}_methods.json`);

// // //   // Read and parse the JSON file
// // //   const jsonData = fs.readFileSync(filePath, 'utf8');
// // //   const data = JSON.parse(jsonData);

// // //   // Filter or find the method in the data
// // //   const methodDetails = data.find(m => m.function.toLowerCase().split('(')[0] === `${params.method.toLowerCase()}`);
  
// // //   // Return the found data or an empty object
// // //   return { props: { data: methodDetails || {} } };
// // // }
// // // // async function fetchData(language, object) {
// // // //   // Implement actual data fetching logic based on the parameters
  
// // // //     if (language && object) {
// // // //         const response = await fetch(`/api/${language.toLowerCase()}_${object.toLowerCase()}_Data`);
// // // //         if (response.ok) {
// // // //             const data = await response.json();
            
// // // //         } else {
// // // //             console.error("Failed to fetch data");
// // // //         }
    
// // // // };

// // // //   return data
// // // // }


// // // async function fetchData(language, object,method) {
// // //   // Specify the full API URL
// // //   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
// // //   const url = `${baseUrl}/api/${language.toLowerCase()}_${object.toLowerCase()}_Data`;

// // //   try {
// // //     const response = await fetch(url);
// // //     if (!response.ok) {
// // //       throw new Error('Failed to fetch data');
// // //     }
// // //     const data = await response.json();
// // //     //console.log(data)
// // //     const methodDetails = data.find(m => m.function.toLowerCase() === method.toLowerCase()+'()');
// // //     console.log(methodDetails)
// // //     return methodDetails; // Make sure to return data within the try block after fetching
// // //   } catch (error) {
// // //     console.error(error.message);
// // //     return null; // Return null or a default object if the fetch fails
// // //   }
// // // }

// // import React from 'react';
// // import Head from 'next/head';
// // import { useRouter } from 'next/router';
// // import path from 'path';
// // import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
// // import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2';
// // import CodeTabs from '@/app/components/MyTabs/CodeTabs';
// // import ParametersTabs from '@/app/components/MyTabs/ParametersTabs';
// // import DynamicAccordion from '@/app/components/accordion/DynamicAccordion';
// // import { renderTextWithLineBreaksSeparator } from '@/utils/functions';
// // import 'prismjs/themes/prism-tomorrow.css';
// // import '../../../pages.css';

// // function MethodPage({ data }) {
// //  const router = useRouter();
 
// //  if (router.isFallback) return <div>Loading...</div>;

// //  const pageTitle = `${data.function} JavaScript Method - Arrays Reference | WebDevData`;
// //  const pageDesc = `Learn how to use JavaScript ${data.function} method. ${data.description?.slice(0, 155)}...`;
// //  const canonicalUrl = `https://www.webdevdata.net/javascript/arrays/${data.function.split('(')[0].toLowerCase()}`;

// //  return (
// //    <>
// //      <Head>
// //        <title>{pageTitle}</title>
// //        <meta name="description" content={pageDesc} />
// //        <meta name="keywords" content={`javascript ${data.function}, javascript arrays, javascript methods, ${data.category?.toLowerCase()}`} />
// //        <link rel="canonical" href={canonicalUrl} />
// //        <meta property="og:title" content={`${data.function} JavaScript Method Reference`} />
// //        <meta property="og:description" content={data.description} />
// //        <meta property="og:type" content="article" />
// //        <meta property="og:url" content={canonicalUrl} />
// //        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
// //      </Head>

// //      <MyNavbar2 />
// //      <main>
// //        <Breadcrumb />
// //        <div className='outer-container-page'>
// //          <DynamicAccordion data={[data]} />
// //          <div className='syntax'>
// //            <h3>Syntax</h3>
// //            <span>{renderTextWithLineBreaksSeparator(data.signature, ';')}</span>
// //          </div>
// //          <ParametersTabs tabs={data.parameters} />
// //          <CodeTabs tabs={data.use_cases} className="language-js" />
// //        </div>
// //      </main>
// //    </>
// //  );
// // }

// // async function getStaticPaths() {
// //  const fs = require('fs');
// //  const filePath = path.join(process.cwd(), 'app', 'api', 'db', 'developement', 'javascript', 'arrays_methods.json');
 
// //  try {
// //    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
// //    const paths = data.map(method => ({
// //      params: {
// //        language: 'javascript',
// //        object: 'arrays',
// //        method: method.function.toLowerCase().split('(')[0]
// //      }
// //    }));
   
// //    return { paths, fallback: false };
// //  } catch {
// //    return { paths: [], fallback: false };
// //  }
// // }

// // async function getStaticProps({ params }) {
// //  if (params.language !== 'javascript') {
// //    return { notFound: true };
// //  }

// //  const fs = require('fs');
// //  try {
// //    const filePath = path.join(process.cwd(), 'app', 'api', 'db', 'developement', 'javascript', `${params.object}_methods.json`);
// //    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
// //    const methodDetails = data.find(m => 
// //      m.function.toLowerCase().split('(')[0] === params.method.toLowerCase()
// //    );

// //    if (!methodDetails) return { notFound: true };

// //    return { 
// //      props: { data: methodDetails },
// //      revalidate: 3600
// //    };
// //  } catch {
// //    return { notFound: true };
// //  }
// // }

// // export { getStaticPaths, getStaticProps };
// // export default MethodPage;


// import React from 'react';
// import Head from 'next/head';
// import { useRouter } from 'next/router';
// import path from 'path';
// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
// import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2';
// import CodeTabs from '@/app/components/MyTabs/CodeTabs';
// import ParametersTabs from '@/app/components/MyTabs/ParametersTabs';
// import DynamicAccordion from '@/app/components/accordion/DynamicAccordion';
// import { renderTextWithLineBreaksSeparator } from '@/utils/functions';
// import 'prismjs/themes/prism-tomorrow.css';
// import '../../../pages.css';

// const MethodPage = ({ data }) => {
//   const router = useRouter();
  
//   if (router.isFallback) return <div>Loading...</div>;

//   const pageTitle = `${data.function} JavaScript Method - ${router.query.object} Reference | WebDevData`;
//   const pageDesc = `Learn how to use JavaScript ${data.function} method. ${data.description?.slice(0, 155)}...`;
//   const canonicalUrl = `https://www.webdevdata.net/javascript/${router.query.object}/${data.function.split('(')[0].toLowerCase()}`;

//   return (
//     <>
//       <Head>
//         <title>{pageTitle}</title>
//         <meta name="description" content={pageDesc} />
//         <meta name="keywords" content={`javascript ${data.function}, javascript ${router.query.object}, javascript methods, ${data.category?.toLowerCase()}`} />
//         <link rel="canonical" href={canonicalUrl} />
//         <meta property="og:title" content={`${data.function} JavaScript Method Reference`} />
//         <meta property="og:description" content={data.description} />
//         <meta property="og:type" content="article" />
//         <meta property="og:url" content={canonicalUrl} />
//         <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
//       </Head>

//       <MyNavbar2 />
//       <main >
//         <Breadcrumb />
//         <div className='outer-container-page'>
         
//           <DynamicAccordion data={[data]} />
//           <div className='syntax'>
//             <h3>Syntax</h3>
//             <span>{renderTextWithLineBreaksSeparator(data.signature, ';')}</span>
//           </div>
//           <ParametersTabs tabs={data.parameters} />
//           <CodeTabs tabs={data.use_cases} className="language-js" />
//         </div>
//       </main>
//     </>
//   );
// }

// async function getStaticPaths() {
//   const fs = require('fs');
//   const jsDir = path.join(process.cwd(), 'app', 'api', 'db', 'developement', 'javascript');
//   const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('_methods.json'));

//   try {
//     const paths = [];
//     for (const file of jsFiles) {
//       const objectType = file.replace('_methods.json', '');
//       const data = JSON.parse(fs.readFileSync(path.join(jsDir, file), 'utf8'));
      
//       const objectPaths = data.map(method => ({
//         params: {
//           language: 'javascript',
//           object: objectType,
//           method: method.function.toLowerCase().split('(')[0]
//         }
//       }));
//       paths.push(...objectPaths);
//     }
    
//     return { paths, fallback: false };
//   } catch (err) {
//     console.error('Error generating paths:', err);
//     return { paths: [], fallback: false };
//   }
// }

// async function getStaticProps({ params }) {
//   if (params.language !== 'javascript') {
//     return { notFound: true };
//   }

//   const fs = require('fs');
//   try {
//     const filePath = path.join(process.cwd(), 'app', 'api', 'db', 'developement', 'javascript', `${params.object}_methods.json`);
//     const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
//     const methodDetails = data.find(m => 
//       m.function.toLowerCase().split('(')[0] === params.method.toLowerCase()
//     );

//     if (!methodDetails) return { notFound: true };

//     return { 
//       props: { data: methodDetails },
//       revalidate: 3600
//     };
//   } catch {
//     return { notFound: true };
//   }
// }

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import path from 'path';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2';
import CodeTabs from '@/app/components/MyTabs/CodeTabs';
import ParametersTabs from '@/app/components/MyTabs/ParametersTabs';
import DynamicAccordion from '@/app/components/accordion/DynamicAccordion';
import { renderTextWithLineBreaksSeparator } from '@/utils/functions';
import 'prismjs/themes/prism-tomorrow.css';
import '../../../pages.css';

const MethodPage = ({ data }) => {
  const router = useRouter();
  
  if (router.isFallback) return <div>Loading...</div>;

  const pageTitle = `${data.function} JavaScript Method - ${router.query.object} Reference | WebDevData`;
  const pageDesc = `Learn how to use JavaScript ${data.function} method. ${data.description?.slice(0, 155)}...`;
  const canonicalUrl = `https://www.webdevdata.net/javascript/${router.query.object}/${data.function.split('(')[0].toLowerCase()}`;
  
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content={`javascript ${data.function}, javascript ${router.query.object}, javascript methods, ${data.category?.toLowerCase()}`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${data.function} JavaScript Method Reference`} />
        <meta property="og:description" content={data.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>

      <MyNavbar2 />
      <main>
        <Breadcrumb />
        <div className='outer-container-page'>
          <DynamicAccordion data={[data]} />
          <div className='syntax'>
            <h3>Syntax</h3>
            <span>{renderTextWithLineBreaksSeparator(data.signature, ';')}</span>
          </div>
          <ParametersTabs tabs={data.parameters} />
          <CodeTabs tabs={data.use_cases} className="language-js" />
        </div>
      </main>
    </>
  );
};

export async function getStaticPaths() {
  const fs = require('fs');
  const jsDir = path.join(process.cwd(), 'app', 'api', 'db', 'developement', 'javascript');
  const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('_methods.json'));

  try {
    const paths = [];
    for (const file of jsFiles) {
      const objectType = file.replace('_methods.json', '');
      const fileContent = fs.readFileSync(path.join(jsDir, file), 'utf8');
      const data = JSON.parse(fileContent);
      
      const objectPaths = data.map(method => ({
        params: {
          language: 'javascript',
          object: objectType,
          method: method.function.split('(')[0].toLowerCase()
        }
      }));
      
      paths.push(...objectPaths);
    }
    
    return { paths, fallback: false };
  } catch (err) {
    console.error('Error generating paths:', err);
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  if (params.language !== 'javascript') {
    return { notFound: true };
  }

  const fs = require('fs');
  try {
    const filePath = path.join(process.cwd(), 'app', 'api', 'db', 'developement', 'javascript', `${params.object}_methods.json`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    const methodDetails = data.find(m => 
      m.function.toLowerCase().split('(')[0] === params.method.toLowerCase()
    );

    if (!methodDetails) return { notFound: true };

    return {
      props: { data: methodDetails },
      revalidate: 3600
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true };
  }
}

export default MethodPage;