// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// import MyNavbar from '@/app/components/nav-bar/MyNavbar'
// import React from 'react'
// import CssUnitsConverter from '@/app/components/converters/CssUnitsConverter'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// import '../../../pages.css'

// export default function CssUnitConverterPage() {
//   return (
//     <>
//     <MyNavbar></MyNavbar>
//     <br></br>
//     <br></br>
//     <br></br>
//     <Breadcrumb></Breadcrumb>
    
//     <h1 className='title' style={{marginTop:'-30px'}}>Css Units Converter</h1>
//     <CssUnitsConverter></CssUnitsConverter>
//      <br></br>
//      <br></br>
//      <br></br>
//      <br></br>
//      <ScrollUpButton></ScrollUpButton> 
    
    
//     </>
//   )
// }
// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// import MyNavbar from '@/app/components/nav-bar/MyNavbar'
// import React from 'react'
// import CssUnitsConverter from '@/app/components/converters/CssUnitsConverter'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// import Head from 'next/head'
// import '../../../pages.css'

// export default function CssUnitConverterPage({ pageTitle, pageDescription }) {
//   return (
//     <>
//       <Head>
//         <title>{pageTitle}</title>
//         <meta name="description" content={pageDescription} />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//       </Head>
//       <MyNavbar />
//       <br></br>
//       <br></br>
//       <br></br>
//       <main >
//         <Breadcrumb />
//         <h1 className='title' style={{marginTop:'-30px'}}>CSS Units Converter</h1>
//         <CssUnitsConverter />
//         <ScrollUpButton />
//       </main>
//     </>
//   )
// }

// export async function getStaticProps() {
//   return {
//     props: {
//       pageTitle: "CSS Units Converter | Webdevdata",
//       pageDescription: "Convert between different CSS units easily with our online CSS Units Converter tool.",
//     },
//   }
// }
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import React from 'react'
import CssUnitsConverter from '@/app/components/converters/CssUnitsConverter'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import Head from 'next/head'
import '../../../pages.css'
import Layout from '@/pages/Layout'

export default function CssUnitConverterPage({ pageTitle, pageDescription }) {
  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://webdevdata.net/tools/css-units-converter" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://webdevdata.net/tools/css-units-converter" />
        {/* <meta property="og:image" content="https://webdevdata.net/images/css-units-converter.png" /> */}
        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://webdevdata.net/images/css-units-converter.png" /> */}
      </Head>
      {/* <MyNavbar /> */}
      <br></br>
      <br></br>
      <br></br>
      <main >
        <Breadcrumb />
        <h1 className='title' style={{marginTop:'-30px'}}>CSS Units Converter</h1>
        <CssUnitsConverter />
        <ScrollUpButton />
      </main>
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {
      pageTitle: "CSS Units Converter | Webdevdata",
      pageDescription: "Convert between different CSS units easily with our online CSS Units Converter tool.",
    },
  }
}