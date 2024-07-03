// import MyNavbar from '@/app/components/nav-bar/MyNavbar'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// import React from 'react'
// import '../pages.css'
// import SectionLinkGroup from '@/app/components/section-link-group/SectionLinkGroup'

// export default function PythonPage() {
     
//     const sections = [
//         {

//             title:'Python Sequence Slicing',
//             link: 'python/sequence-slicing',
//             text: 'Explore the fundamentals of Python sequence slicing with our interactive guide.Clear visualizations to help you understand how slicing works with Python sequences . Learn to  use indices and step parameters to manipulate sequences and extract subsets.',
//             image: 'series-L.jpg'
//         },
//         {

//             title:'Python Functions',
//             link: 'python/functions',
//             text: 'Discover and filter Python functions by various properties, providing a comprehensive tool for exploring and understanding their usage and characteristics.',
//             image: '/python-function2.jpg'
//         },
        
        
        
        
        
//       ];


//   return (
//     <>
//     <MyNavbar></MyNavbar>
//     <br></br>
//     <br></br>
//     <br></br>
//     <br></br>
//     <h1 className='title'>Python Programming</h1>
//     <br></br>
//     <SectionLinkGroup sections={sections}></SectionLinkGroup>
//     <br></br>
//     <br></br>
//     <ScrollUpButton></ScrollUpButton>
    
//     </>
//   )
// }
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import React from 'react'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import Head from 'next/head'
import '../pages.css'
import SectionLinkGroup from '@/app/components/section-link-group/SectionLinkGroup'

export default function PythonPage({ pageTitle, pageDescription, sections }) {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https:/webdevdata.net/python" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https:/webdevdata.net/python" />
      </Head>
      <MyNavbar />
      <br></br>
      <br></br>
      <br></br>
      <main>
        <Breadcrumb />
        <h1 className='title' style={{marginTop:'-30px'}}>Python Programming</h1>
        <SectionLinkGroup sections={sections} />
        <ScrollUpButton />
      </main>
    </>
  )
}

export async function getStaticProps() {
  const sections = [
    {
      title: 'Python Sequence Slicing',
      link: '/python/sequence-slicing',
      text: 'Explore the fundamentals of Python sequence slicing with our interactive guide. Clear visualizations to help you understand how slicing works with Python sequences. ',
      image: 'series-L.jpg'
    },
    {
      title: 'Python Functions',
      link: '/python/functions',
      text: 'Discover and filter Python functions by various properties, providing a comprehensive tool for exploring and understanding their usage and characteristics.',
      image: '/python-function2.jpg'
    },
  ];

  return {
    props: {
      pageTitle: "Python Programming Resources | Webdevdata",
      pageDescription: "Explore our Python programming resources including guides on sequence slicing and comprehensive function references.",
      sections,
    },
  }
}