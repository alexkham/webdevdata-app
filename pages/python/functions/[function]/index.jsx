

import React from 'react';
import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import PythonFunctionDetails from '@/app/components/function-details/PythonFunctionDetails';
import MyNavbar from '@/app/components/nav-bar/MyNavbar';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
import functionsDb from '../../../../app/api/db/developement/python/functions_new.json';
import '../../../pages.css'
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2';

const PythonFunctionPage = ({ functionData, functionName }) => {
  const pageTitle = functionData
    ? `${functionData.name} Function | Python Documentation`
    : `Function Not Found | Python Documentation`;
  const pageDescription = functionData
    ? functionData.docstring
    : `The Python function "${functionName}" could not be found.`;

  return (
    <>
      <Head>
        <title>{pageTitle} </title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`Python, ${functionName || 'function'}, documentation`} />
        <link rel="canonical" href={`https:/webdevdata.net/python/functions/${functionName || 'not-found'}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>
      <main>
        <MyNavbar2 />
        <br />
        <br />
        <br />
        <Breadcrumb />
        {functionData ? (
          <>
            <h1 className='title' style={{marginTop:'-30px',marginBottom:'-30px'}}>
              Function Details: {functionData.name}
            </h1>
            <PythonFunctionDetails functionData={functionData} />
          </>
        ) : (
          <>
            <h1 className='title' style={{marginTop:'-30px',marginBottom:'-30px'}}>
              Function Not Found
            </h1>
            <p>Sorry, the Python function {functionName} could not be found in our database.</p>
          </>
        )}
      </main>
      <ScrollUpButton />
    </>
  );
};

export async function getStaticPaths() {
  const paths = functionsDb.map((func) => ({
    params: { function: func.name.trim().toLowerCase() },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
    console.log('Overall List '+functionsDb.length)
  const functionName = params.function;
  const functionData = functionsDb.find(
    (item) => item.name.trim().toLowerCase() === functionName.toLowerCase()
  );

  return {
    props: { 
      functionData: functionData || null,
      functionName
    }
  };
}

export default PythonFunctionPage;