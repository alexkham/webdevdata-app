// pages/[language]/[object]/[method].js

import ParametersTabs from '@/app/components/MyTabs/ParametersTabs';
import DynamicAccordion from '@/app/components/accordion/DynamicAccordion';
import { useRouter } from 'next/router';


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
      <span>{data.function}</span>
      <span>{data['return_type']}</span>
      
      <div className='outer-container'>
      <DynamicAccordion data={dataArray}></DynamicAccordion>
      <ParametersTabs tabs={data.parameters}></ParametersTabs>
      </div>
      {/* <h1>{data.function}</h1>
      <p>{data.description}</p> */}
      {/* Render more data as needed */}
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

export async function getStaticProps({ params }) {
  const data = await fetchData(params.language, params.object, params.method);
  if (!data || Object.keys(data).length === 0) {
    // Handle the case where no data is returned
    return {
      notFound: true, // This will render the 404 page
    };
  }
  return { props: { data } };
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
