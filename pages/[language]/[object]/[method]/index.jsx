// pages/[language]/[object]/[method].js

import CodeTabs from '@/app/components/MyTabs/CodeTabs';
import ParametersTabs from '@/app/components/MyTabs/ParametersTabs';
import DynamicAccordion from '@/app/components/accordion/DynamicAccordion';
import { useRouter } from 'next/router';
import 'prismjs/themes/prism-tomorrow.css'; // Example theme
import 'prismjs/components/prism-python';
import '../../../pages.css'

import path from 'path';
import ConsoleComponentProps5 from '@/app/components/code-widget/ConsoleComponentProps5';
import { renderTextWithLineBreaksSeparator } from '@/utils/functions';



export default function MethodPage({ data }) {
  const router = useRouter();
  const { language, object, method } = router.query;
  const dataArray=[data]
  
  // Render data or loading state
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
            
      <div className='outer-container'>
      <DynamicAccordion data={dataArray} ></DynamicAccordion>
      <div className='syntax'>
        <h3>Syntax</h3>
      <span>{renderTextWithLineBreaksSeparator(data.signature,';')}</span>
      </div>
      <ParametersTabs tabs={data.parameters}></ParametersTabs>
      <CodeTabs 
      tabs={data.use_cases}
      className={"language-js"}></CodeTabs>
     

      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      
    </div>
  );
}

export async function getStaticPaths() {
  // Fetch or define your paths based on available data
  const paths = [
    { params: { language: 'javascript', object: 'array', method: 'push' } },
    // Add more paths as needed
  ];

  return { paths, fallback: true };
}

// export async function getStaticProps({ params }) {
//   // Fetch data for each method based on the params
//   const data = await fetchData(params.language, params.object);
//   return { props: { data } };
// }

// export async function getStaticProps({ params }) {
  
//   const data = await fetchData(params.language, params.object, params.method);
//   if (!data || Object.keys(data).length === 0) {
//     // Handle the case where no data is returned
//     return {
//       notFound: true, // This will render the 404 page
//     };
//   }
//   return { props: { data } };
// }

export async function getStaticProps({ params }) {
  // Dynamically import 'fs' inside getStaticProps
  const fs = require('fs');

  // Construct the file path
  //const filePath = path.join(process.cwd(),  `../../../../app/api/db/development/${params.language}/${params.object}_methods.json`);
  const filePath = path.join(process.cwd(), 'app', 'api', 'db', 'developement', `${params.language}`, `${params.object}_methods.json`);

  // Read and parse the JSON file
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(jsonData);

  // Filter or find the method in the data
  const methodDetails = data.find(m => m.function.toLowerCase().split('(')[0] === `${params.method.toLowerCase()}`);
  
  // Return the found data or an empty object
  return { props: { data: methodDetails || {} } };
}
// async function fetchData(language, object) {
//   // Implement actual data fetching logic based on the parameters
  
//     if (language && object) {
//         const response = await fetch(`/api/${language.toLowerCase()}_${object.toLowerCase()}_Data`);
//         if (response.ok) {
//             const data = await response.json();
            
//         } else {
//             console.error("Failed to fetch data");
//         }
    
// };

//   return data
// }


async function fetchData(language, object,method) {
  // Specify the full API URL
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${baseUrl}/api/${language.toLowerCase()}_${object.toLowerCase()}_Data`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    //console.log(data)
    const methodDetails = data.find(m => m.function.toLowerCase() === method.toLowerCase()+'()');
    console.log(methodDetails)
    return methodDetails; // Make sure to return data within the try block after fetching
  } catch (error) {
    console.error(error.message);
    return null; // Return null or a default object if the fetch fails
  }
}
