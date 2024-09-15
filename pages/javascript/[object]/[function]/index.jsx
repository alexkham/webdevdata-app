import CodeTabs from '@/app/components/MyTabs/CodeTabs';
import ParametersTabs from '@/app/components/MyTabs/ParametersTabs';
import DynamicAccordion from '@/app/components/accordion/DynamicAccordion';
import { useRouter } from 'next/router';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';


import path from 'path';

import { renderTextWithLineBreaksSeparator } from '@/utils/functions';

import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
import JSFunctionDetails from '@/app/components/function-details/JSFunctionDetails';
import MySidebar from '@/app/components/sidebar/Sidebar';
import styles from '../../../../app/components/sidebar/MySidebar.module.css'
import '../../../pages.css'
import Head from 'next/head';

export default function FunctionPage({ data , nameList }) {
  const router = useRouter();
  const { object, function: functionName } = router.query;
  const dataArray = [data];
  const functionNames=nameList.map(item=>item.replace('()','').trim());

  
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
          <Head></Head>
         <input type="checkbox" id="sidebar-toggle" className={styles.sidebarToggle} />
         <MySidebar data={functionNames}
         baseUrl={`/javascript/${object}`} />   
        <div className={styles.pageWrapper}>
      <MyNavbar2 />
      <br />
      <br />
      <Breadcrumb />  
      
     
      <h1 className='title' style={{marginBottom:'-20px',marginTop:'-40px'}}>
                    {data ? `Function Details : ${data.function}` : 'Function Not Found'}
                </h1>
                <div style={{flexGrow: 1, marginLeft: '20px', overflow: 'auto'}}>
                    {data ? (
                        <JSFunctionDetails functionData={data}/>
                    ) : (
                        <p>Function data not found.</p>
                    )}
                </div>
      
      <br />
      <br />
      <br />
      <br />
      <br />
      <ScrollUpButton></ScrollUpButton>
      <br />
      </div>
    </div>
  );
}

// export async function getStaticPaths() {
//   const paths = [
//     { params: { object: 'arrays', function: 'push' } },
//     // Add more paths as needed
//   ];

//   return { paths, fallback: true };
// }

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const fs = require('fs');
  const path = require('path');

  const filePath = path.join(process.cwd(), 'app', 'api', 'db', 'developement', 'javascript', `${params.object}_methods.json`);

  const jsonData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(jsonData);
  
  const nameList=data.map(item=>item.function);
  
 

  const functionDetails = data.find(f => f.function.toLowerCase().split('(')[0] === `${params.function.toLowerCase()}`);
  
  return { props: { data: functionDetails || {} ,
                    nameList:nameList } || {} };
}