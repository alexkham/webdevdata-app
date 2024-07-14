// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// import MyNavbar from '@/app/components/nav-bar/MyNavbar'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// import TextAnalyzer from '@/app/components/text-analyzer/TextAnalyzer'
// import React from 'react'
// import '../../../pages.css'

// export default function TextAnalyzerPage() {
//   return (
//     <>
//     <MyNavbar></MyNavbar>
//     <br></br>
//     <br></br>
//     <br></br>
//     <Breadcrumb></Breadcrumb>
//     <h1 className='title' style={{marginTop:'-50px',marginBottom:'-30px'}} >Text Analyzer</h1>
//     <TextAnalyzer></TextAnalyzer>
    
//     <ScrollUpButton></ScrollUpButton>
//     </>
//   )
// }
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import TextAnalyzer from '@/app/components/text-analyzer/TextAnalyzer'
import React from 'react'
import Head from 'next/head'
import '../../../pages.css'
import Layout from '@/pages/Layout'

export default function TextAnalyzerPage() {
  return (
    <Layout>
      <Head>
        <title>Text Analyzer | Your Website Name</title>
        <meta name="description" content="Analyze your text with our powerful Text Analyzer tool. Get insights on word count, character count, and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourwebsite.com/tools/text-analyzer" />
      </Head>
      {/* <MyNavbar /> */}
      <br />
      <br />
      <br />
      <Breadcrumb />
      <h1 className='title' style={{marginTop:'-50px', marginBottom:'-30px'}}>Text Analyzer</h1>
      <TextAnalyzer />
      <ScrollUpButton />
    </Layout>
  )
}

// This function is optional and only needed if you want to block
// static generation for this page during build time.
export async function getStaticProps() {
  return {
    props: {}, // Will be passed to the page component as props
  }
}