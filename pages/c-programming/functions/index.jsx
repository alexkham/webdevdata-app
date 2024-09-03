import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
import React from 'react'
import FunctionList from '@/app/components/function-list/FunctionList'
import '../../../pages/pages.css'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import Head from 'next/head'

export default function FunctionsPage({ functionData }) {
  return (
    <>
      <Head>
        <title>C Standard Library Functions Reference | WebDevData</title>
        <meta name="description" content="Comprehensive reference for C Standard Library functions. Explore detailed explanations, syntax, and usage examples for C programming." />
        <meta name="keywords" content="C functions, standard library, programming reference, C programming" />
        <link rel="canonical" href="https://webdevdata.net/c-programming/functions" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>
      <MyNavbar2 />
      <br />
      <br />
      <br />
      <Breadcrumb />
      <main>
        <h1 className='title' style={{marginTop:'-30px', marginBottom:'-30px'}}>C Standard Library Functions Reference</h1>
        <FunctionList data={functionData} />
      </main>
      <br />
      <br />
      <br />
      <ScrollUpButton />
    </>
  )
}

export async function getStaticProps() {
  const data = require('../../../app/api/db/developement/c/functions2.json')
  
  return {
    props: {
      functionData: data
    },
    // Optionally, add revalidation to update the page periodically
    // revalidate: 3600 // Regenerate page every hour
  }
}