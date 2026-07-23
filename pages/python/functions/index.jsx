
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import PythonFunctionsList from '@/app/components/function-list/PythonFunctionsList'
import pythonData from '../../../app/api/db/developement/python/functions_new.js'
import Head from 'next/head'
import '../../pages.css'

export default function PythonFunctionsPage({ pythonFunctions }) {
  return (
    <>
      <Head>
        <title>Python Functions List | WebDevData</title>
        <meta name="description" content="Comprehensive list of Python functions with filtering and search capabilities. Explore Python's built-in functions and their usage." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.webdevdata.net/python-functions" />
      </Head>
      
      <br></br>
      <br></br>
      <br></br>
      <Breadcrumb />
      <h1 className='title' style={{marginTop:'-30px',marginBottom:'-20px'}}>Python Functions</h1>
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