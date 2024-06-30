// import React from 'react';
// import DynamicAccordionCode from '@/app/components/accordion/DynamicAccordionCode';
// import '../../../pages.css';
// //import arrays from '../../../../app/api/db/content/C/do_not/arrays.json'
// import { capitalizeWords } from '@/utils/functions';
// import MyNavbar from '@/app/components/nav-bar/MyNavbar';
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';

// const ThingsNotToDoPage = ({ type, content }) => {
//   console.log('Type:', type); // Debugging log
  

//   return (
//     <div>
//       <MyNavbar></MyNavbar>
//       <br></br>
//       <br></br>
//       <br></br>
//       <br></br>
//       <Breadcrumb></Breadcrumb>
//       <div className='outer-container-page'>
//       <h1>Things Not To Do in C With {capitalizeWords(type.replaceAll('_', ' '))} in C Programming </h1>
//       <br></br>
//       <br></br>
//       {/* <pre>{JSON.stringify(content, null, 2)}</pre>
//       {content && Array.isArray(content) ? (
//         <DynamicAccordionCode data={content} />
//       ) : (
//         <p>No content available</p>
//       )} */}
      
//       {content?<DynamicAccordionCode data={content} />
//       : <p>No content available</p>}

//       <br></br>
//       <br></br>
//       <br></br>
//       </div>
//       <ScrollUpButton></ScrollUpButton>
//     </div>
//   );
// };

// export async function getServerSideProps(context) {
//   const { type } = context.params;
//   let content = {};

//   try {
//     // Dynamically import the JSON file based on the type
//     const data = await import(`../../../../app/api/db/content/C/do_not/${type}.json`);
//     console.log('Data:', data); // Debugging log
//     content = data.default; // Assuming the JSON file exports an object as default
//   } catch (error) {
//     console.error(`Error loading content for type: ${type}`, error);
//   }

//   return {
//     props: {
//       type,
//       content,
//     },
//   };
// }

// export default ThingsNotToDoPage;
import React from 'react';
import DynamicAccordionCode from '@/app/components/accordion/DynamicAccordionCode';
import '../../../pages.css';
import { capitalizeWords } from '@/utils/functions';
import MyNavbar from '@/app/components/nav-bar/MyNavbar';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';

const ThingsNotToDoPage = ({ type, content }) => {
  const pageTitle = `Things Not To Do with ${capitalizeWords(type.replaceAll('_', ' '))} in C Programming`;
  const pageDescription = `Learn about common mistakes and things to avoid when working with ${type.replaceAll('_', ' ')} in C programming.`;

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`C programming, ${type.replaceAll('_', ' ')}, best practices, common mistakes`} />
        <link rel="canonical" href={`https://webdevdata.net/c-programming/things-not-to-do/${type}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>
      <main>
      <MyNavbar />
      <br />
      <br />
      <br />
      
      <Breadcrumb />
      
        <h1 className='title'>{pageTitle}</h1>
       <div  style={{marginLeft:'50px'}}>
        {content ? <DynamicAccordionCode data={content} /> : <p>No content available</p>}
        </div>
        <br />
        <br />
        <br />
        </main>
      <ScrollUpButton />
    </div>
  );
};

export async function getStaticPaths() {
  const doNotDir = path.join(process.cwd(), 'app', 'api', 'db', 'content', 'C', 'do_not');
  const files = fs.readdirSync(doNotDir);
  
  const paths = files
    .filter(filename => filename.endsWith('.json'))
    .map(filename => ({
      params: { type: filename.replace('.json', '') },
    }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { type } = params;
  let content = {};

  try {
    const filePath = path.join(process.cwd(), 'app', 'api', 'db', 'content', 'C', 'do_not', `${type}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    content = JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error loading content for type: ${type}`, error);
  }

  return {
    props: {
      type,
      content,
    },
  };
}

export default ThingsNotToDoPage;