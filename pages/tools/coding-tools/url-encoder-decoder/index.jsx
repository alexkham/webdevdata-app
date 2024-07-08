// import MyNavbar from '@/app/components/nav-bar/MyNavbar'
// import React from 'react'
// import '../../pages.css'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// import URLEncoder from '@/app/components/url-encoder/URLEncoder2'
// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'

// export default function URLEncoderDecoderPage() {
//   return (
//     <>
//     <MyNavbar></MyNavbar>
//     <br></br>
//     <br></br>
//     <br></br>
//     <Breadcrumb></Breadcrumb>
//     <h1 className='title' style={{marginTop:'-30px',marginBottom:'-30px'}}>URL Encoder/Decoder</h1>
//     <URLEncoder></URLEncoder>
//     <ScrollUpButton></ScrollUpButton>
//     </>
//   )
// }
import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import React from 'react'
import '../../../pages.css'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import URLEncoder from '@/app/components/url-encoder/URLEncoder2'
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import Head from 'next/head'

export default function URLEncoderDecoderPage() {
  return (
    <>
      <Head>
        <title>URL Encoder/Decoder Tool</title>
        <meta name="description" content="Free online tool to encode and decode URLs. Convert special characters to their URL-safe format and vice versa." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https:/webdevdata.net/tools/coding-tools/url-encoder-decoder" />
      </Head>
      <MyNavbar />
      <br></br>
      <br></br>
      <br></br>
      <main >
        <Breadcrumb />
        <h1 className="title"  style={{marginTop:'-30px',marginBottom:'-30px'}}>URL Encoder/Decoder</h1>
        <URLEncoder />
      </main>
      <ScrollUpButton />
    </>
  )
}

// This function enables static generation
export async function getStaticProps() {
  return {
    props: {}, // Will be passed to the page component as props
  }
}