// import React from 'react'
// import functionsDb from '../../../../app/api/db/developement/c/functions_new.json'
// import MyNavbar from '@/app/components/nav-bar/MyNavbar'
// import '../../../pages.css'
// import FunctionDetails from '@/app/components/function-details/FunctionDetails'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'

// export default function FunctionPage({params}) {
//     console.log(functionsDb[0].function_name)
//     const functionName = params.function;
//     const functionData=functionsDb.filter((item)=>item.function_name===functionName);
//     console.log(functionName);
//     console.log(functionData)

//   return (
//     <>
//     <MyNavbar></MyNavbar>
//     <br></br>
//     <br></br>
//     <br></br>
//     <h1 className='title'>Function {functionName} Details</h1>
//     <FunctionDetails functionData={functionData}></FunctionDetails>
//     <br></br>
//     <ScrollUpButton></ScrollUpButton>
    
//     </>
//   )
// }

// export async function getServerSideProps({ params }) {
//     return { props: { params } };  // Return params directly
// }
// import React from 'react';
// import functionsDb from '../../../../app/api/db/developement/c/functions_new.json';
// import MyNavbar from '@/app/components/nav-bar/MyNavbar';
// import '../../../pages.css';
// import FunctionDetails from '@/app/components/function-details/FunctionDetails';
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';

// // This component displays details about a C function selected by the user
// export default function FunctionPage({ params }) {
//     console.log('First function name in DB:', functionsDb[0].function_name);

//     // Retrieve function name from URL params
//     const { function: functionName } = params;
//     // Filter the function data from the database using the function name
//     const functionData = functionsDb.find(item => item.function_name === functionName);

//     // Logging for debugging purposes
//     console.log('Selected function name:', functionName);
//     console.log('Retrieved function data:', functionData);

//     return (
//         <>
//             <MyNavbar />
//             <br />
//             <br />
//             <br />
//             <Breadcrumb></Breadcrumb>
//             <h1 className='title' style={{marginBottom:'-30px',marginTop:'-30px'}}>Function {functionName} Details</h1>
//             <div style={{width:'100%'}}>
//             {/* Pass the retrieved function data to the FunctionDetails component */}
//             {functionData ? (
//                 <FunctionDetails functionData={functionData} />
//             ) : (
//                 <p>Function data not found.</p>
//             )}
//             </div>
//             <br />
//             <ScrollUpButton />
//         </>
//     );
// }

// // getServerSideProps ensures the params are available at the time of server-side rendering
// export async function getServerSideProps({ params }) {
//     return { props: { params } };
// }
import React from 'react';
import functionsDb from '../../../../app/api/db/developement/c/functions_new.json';
import MyNavbar from '@/app/components/nav-bar/MyNavbar';
import '../../../pages.css';
import FunctionDetails from '@/app/components/function-details/FunctionDetails';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import Head from 'next/head';

export default function FunctionPage({ functionData }) {
    return (
        <>
          <Head>
            <title>{functionData ? `${functionData.function_name} Function | C Programming` : 'Function Not Found | C Programming'}</title>
            <meta name="description" content={functionData ? functionData.description : 'Details about C programming functions'} />
            <meta name="keywords" content={`C programming, ${functionData ? functionData.function_name : 'function'}, programming, coding`} />
            <link rel="canonical" href={`https:/webdevdata.net/c/functions/${functionData ? functionData.function_name : 'not-found'}`} />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          </Head>
            <MyNavbar />
            <br />
            <br />
            <br />
            <Breadcrumb />
            <h1 className='title' style={{marginBottom:'-30px',marginTop:'-30px'}}>
                {functionData ? `Function  Details : ${functionData.function_name}` : 'Function Not Found'}
            </h1>
            <div style={{width:'100%'}}>
            {functionData ? (
                <FunctionDetails functionData={functionData} />
            ) : (
                <p>Function data not found.</p>
            )}
            </div>
            <br />
            <ScrollUpButton />
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
    return { 
        props: { functionData: functionData || null }
    };
}