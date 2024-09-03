// import React from 'react';
// import functionsDb from '../../../../app/api/db/developement/c/functions_new.json';
// import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2';
// import '../../../pages.css';
// import FunctionDetails from '@/app/components/function-details/FunctionDetails';
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
// import Head from 'next/head';
// import Sidebar from '@/app/components/sidebar/Sidebar';
// import MySidebar from '@/app/components/sidebar/Sidebar';

// export default function FunctionPage({ functionData }) {
//     return (
//         <div  >
//           <Head>
//             <title>{functionData ? `${functionData.function_name} Function | C Programming` : 'Function Not Found | C Programming'}</title>
//             <meta name="description" content={functionData ? functionData.description : 'Details about C programming functions'} />
//             <meta name="keywords" content={`C programming, ${functionData ? functionData.function_name : 'function'}, programming, coding`} />
//             <link rel="canonical" href={`https:/webdevdata.net/c/functions/${functionData ? functionData.function_name : 'not-found'}`} />
//             <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
//           </Head>
//             <MyNavbar2 />
//             <br />
//             <br />
//             <br />
//             <Breadcrumb />
          
//             <h1 className='title' style={{marginBottom:'-30px',marginTop:'-30px'}}>
//                 {functionData ? `Function  Details : ${functionData.function_name}` : 'Function Not Found'}
//             </h1>
//             {/* <div style={{width:'100%'}} className='container'>
//                 <MySidebar/>
//             <div style={{flexGrow: 1, marginLeft: '20px'}}>
//             {functionData ? (
//                 <FunctionDetails functionData={functionData} />
//             ) : (
//                 <p>Function data not found.</p>
//             )}
//             </div>
//             </div> */}

// {/* <div style={{width:'100%', display: 'flex'}} className='container'> */}
//   <MySidebar/>
//   <div style={{flexGrow: 1, marginLeft: '20px', overflow: 'auto'}}>
//     {functionData ? (
//       <FunctionDetails functionData={functionData} />
//     ) : (
//       <p>Function data not found.</p>
//     )}
//   </div>
// {/* </div> */}
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//             <ScrollUpButton />
//         </div>
//     );
// }

// export async function getStaticPaths() {
//     const paths = functionsDb.map((func) => ({
//         params: { function: func.function_name },
//     }));
//     return { paths, fallback: false };
// }

// export async function getStaticProps({ params }) {
//     const functionData = functionsDb.find(item => item.function_name === params.function);
//     return { 
//         props: { functionData: functionData || null }
//     };
// }
import React from 'react';
import functionsDb from '../../../../app/api/db/developement/c/functions_new.json';
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2';
import '../../../pages.css';
import FunctionDetails from '@/app/components/function-details/FunctionDetails';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import Head from 'next/head';
import MySidebar from '@/app/components/sidebar/Sidebar';
import styles from '@/app/components/sidebar/MySidebar.module.css';

export default function FunctionPage({ functionData,allFunctionNames }) {
    return (
        <>
            <Head>
                <title>{functionData ? `${functionData.function_name} Function | C Programming` : 'Function Not Found | C Programming'}</title>
                <meta name="description" content={functionData ? functionData.description : 'Details about C programming functions'} />
                <meta name="keywords" content={`C programming, ${functionData ? functionData.function_name : 'function'}, programming, coding`} />
                <link rel="canonical" href={`https:/webdevdata.net/c/functions/${functionData ? functionData.function_name : 'not-found'}`} />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            </Head>
            <input type="checkbox" id="sidebar-toggle" className={styles.sidebarToggle} />
            <MySidebar data={allFunctionNames} />
            <div className={styles.pageWrapper}>
                <MyNavbar2 />
                <br />
                <br />
                <br />
                <Breadcrumb />
                <h1 className='title' style={{marginBottom:'-30px',marginTop:'-30px'}}>
                    {functionData ? `Function Details : ${functionData.function_name}` : 'Function Not Found'}
                </h1>
                <div style={{flexGrow: 1, marginLeft: '20px', overflow: 'auto'}}>
                    {functionData ? (
                        <FunctionDetails functionData={functionData} />
                    ) : (
                        <p>Function data not found.</p>
                    )}
                </div>
               
                {/* Your existing br tags */}
                <ScrollUpButton />
            </div>
        </>
    );
}

export async function getStaticPaths() {
    const paths = functionsDb.map((func) => ({
        params: { function: func.function_name },
    }));
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const functionData = functionsDb.find(item => item.function_name === params.function);
    const allFunctionNames = functionsDb
    .map(item => item.function_name)
    .filter(name => name !== params.function);
    return { 
        props: { functionData: functionData || null,
                 allFunctionNames: allFunctionNames
                
                }
        
        
    };
}