
import React from 'react';
import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import PythonFunctionDetails from '@/app/components/function-details/PythonFunctionDetails';
import MyNavbar from '@/app/components/nav-bar/MyNavbar';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
import functionsDb from '../../../../app/api/db/developement/python/functions_new.js';
import '../../../pages.css' 
import MySidebar from '@/app/components/sidebar/Sidebar';
import styles from '@/app/components/sidebar/MySidebar.module.css';

const PythonFunctionPage = ({ functionData, functionName,allNames }) => {
 const pageTitle = functionData
   ? `${functionData.name} Function - Python Reference | WebDevData`
   : `Python Function Reference | WebDevData`;

 const pageDescription = functionData
   ? `${functionData.docstring.slice(0, 155)}...`
   : `Comprehensive Python function documentation and examples. Learn Python programming with our detailed function reference guide.`;
   
  
 
   return (

 
   <>
     <Head>
       <title>{pageTitle}</title>
       <meta name="description" content={pageDescription} />
       <meta name="keywords" content={`python ${functionName?.toLowerCase()}, python functions, python programming, python tutorial, python reference, learn python${functionData ? `, ${functionData.main_category?.toLowerCase()}` : ''}`} />
       <link rel="canonical" href={`https://www.webdevdata.net/python/functions/${functionName || 'not-found'}`} />
       <meta property="og:title" content={pageTitle} />
       <meta property="og:description" content={pageDescription} />
       <meta property="og:url" content={`https://www.webdevdata.net/python/functions/${functionName || 'not-found'}`} />
       <meta property="og:type" content="article" />
       <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
     </Head>
     <main>
     <input type="checkbox" id="sidebar-toggle" className={styles.sidebarToggle} />
     <MySidebar data={allNames} baseUrl={'/python/functions/'}/>
     <div className={styles.pageWrapper}>
       
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
       </div>
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
 const allNames=functionsDb.map(f=>f.name.trim())
 .filter(name => name !== params.function);
 console.log(allNames);
 
 return {
   props: {
     functionData: functionData || null,
     functionName,
     allNames,
   }
 };
}

export default PythonFunctionPage;