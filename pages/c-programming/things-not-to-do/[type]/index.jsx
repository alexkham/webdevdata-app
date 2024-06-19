import React from 'react';
import DynamicAccordionCode from '@/app/components/accordion/DynamicAccordionCode';
import '../../../pages.css';
//import arrays from '../../../../app/api/db/content/C/do_not/arrays.json'
import { capitalizeWords } from '@/utils/functions';
import MyNavbar from '@/app/components/nav-bar/MyNavbar';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';

const ThingsNotToDoPage = ({ type, content }) => {
  console.log('Type:', type); // Debugging log
  

  return (
    <div>
      <MyNavbar></MyNavbar>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Breadcrumb></Breadcrumb>
      <div className='outer-container-page'>
      <h1>Things Not To Do in C With {capitalizeWords(type.replaceAll('_', ' '))} in C Programming </h1>
      <br></br>
      <br></br>
      {/* <pre>{JSON.stringify(content, null, 2)}</pre>
      {content && Array.isArray(content) ? (
        <DynamicAccordionCode data={content} />
      ) : (
        <p>No content available</p>
      )} */}
      
      {content?<DynamicAccordionCode data={content} />
      : <p>No content available</p>}

      <br></br>
      <br></br>
      <br></br>
      </div>
      <ScrollUpButton></ScrollUpButton>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { type } = context.params;
  let content = {};

  try {
    // Dynamically import the JSON file based on the type
    const data = await import(`../../../../app/api/db/content/C/do_not/${type}.json`);
    console.log('Data:', data); // Debugging log
    content = data.default; // Assuming the JSON file exports an object as default
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
