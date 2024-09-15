// import MyNavbar from '@/app/components/nav-bar/MyNavbar'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// import React from 'react'
// import '../../pages.css'
// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// import PythonFunctionsList from '@/app/components/function-list/PythonFunctionsList'
// import pythonData from '../../../app/api/db/developement/python/functions_new.json'
// import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'

// export default function PythonFunctionsPage() {
//   return (
//     <>
//     <MyNavbar2></MyNavbar2>
    
//     <br></br>
//     <br></br>
//     <br></br>
//     <Breadcrumb></Breadcrumb>
//     <h1 className='title' style={{marginTop:'-40px',marginBottom:'-20px'}}>Python Functions</h1>
//     <PythonFunctionsList data={pythonData}></PythonFunctionsList>
//     <br></br>
//     <br></br>
//     <br></br>
//     <br></br>
//     <br></br>
//     <ScrollUpButton></ScrollUpButton>
//     </>
//   )
// }
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import PythonFunctionsList from '@/app/components/function-list/PythonFunctionsList'
import pythonData from '../../../app/api/db/developement/python/functions_new.json'
import Head from 'next/head'

export default function PythonFunctionsPage({ pythonFunctions }) {
  return (
    <>
      <Head>
        <title>Python Functions List | WebDevData</title>
        <meta name="description" content="Comprehensive list of Python functions with filtering and search capabilities. Explore Python's built-in functions and their usage." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://webdevdata.net/python-functions" />
      </Head>
      <MyNavbar2 />
      <br></br>
      <br></br>
      <br></br>
      <Breadcrumb />
      <h1 className='title' style={{marginTop:'-40px',marginBottom:'-20px'}}>Python Functions</h1>
      <PythonFunctionsList data={pythonFunctions} />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <ScrollUpButton />
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      pythonFunctions: pythonData
    }
  }
}