// import MethodExplorer from '@/app/components/method-explorer/MethodExplorer'
// import MyNavbar from '@/app/components/nav-bar/MyNavbar'
// import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
// import ListSplitVisualizer from '@/app/components/python-list-slicing/ListSplitVisualizer'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// import React from 'react'

// export default function MethodsExplorerPage() {
//   return (
//     <>
//     <MyNavbar2></MyNavbar2>
//     <br></br>
//     <br></br>
//     <br></br>
//     {/* <div className="main-page-container"> */}
//    <MethodExplorer></MethodExplorer>
//    {/* </div> */}
//     <br></br>
//     <br></br>
//     <ScrollUpButton></ScrollUpButton>
    
//     </>
//   )
// }

import React from 'react';
import Head from 'next/head';
import MethodExplorer from '@/app/components/method-explorer/MethodExplorer';
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';

function MethodsExplorerPage() {
 return (
   <>
     <Head>
       <title>JavaScript Methods Explorer | Interactive Method Reference</title>
       <meta name="description" content="Interactive JavaScript methods explorer with comprehensive documentation, examples and syntax for arrays, strings, objects and more." />
       <meta name="keywords" content="javascript, js, javascript methods, javascript reference, javascript arrays, javascript strings" />
       <link rel="canonical" href="https://www.webdevdata.net/methods-explorer" />
       <meta property="og:title" content="JavaScript Methods Explorer" />
       <meta property="og:description" content="Interactive JavaScript methods explorer with comprehensive documentation and examples" />
       <meta property="og:type" content="website" />
       <meta property="og:url" content="https://www.webdevdata.net/methods-explorer" />
     </Head>
     
     <MyNavbar2 />
     <br/>
     <br/>
     <br/>
     <br/>
     <main>
       <MethodExplorer />
     </main>
     <ScrollUpButton />
   </>
 );
}

export async function getStaticProps() {
 return {
   props: {},
   revalidate: 3600
 }
}

export default MethodsExplorerPage;