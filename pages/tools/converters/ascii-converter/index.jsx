// // import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// // import MyNavbar from '@/app/components/nav-bar/MyNavbar'
// // import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// // import React from 'react'
// // import '../../../pages.css'
// // import AsciiConverter from '@/app/components/converters/AsciiConverter'

// // export default function AsciiConveretrPage() {
// //   return (
// //     <>
// //     <MyNavbar></MyNavbar>
// //     <br></br>
// //     <br></br>
// //     <br></br>
// //     <Breadcrumb></Breadcrumb>
// //     <h1 className='title'>Ascii Converter</h1>
// //     <AsciiConverter></AsciiConverter>
// //     <br></br>
// //     <br></br>
// //     <ScrollUpButton></ScrollUpButton>  
    
// //     </>
// //   )
// // }
// import React from 'react'
// import Head from 'next/head'
// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// import MyNavbar from '@/app/components/nav-bar/MyNavbar'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// import AsciiConverter from '@/app/components/converters/AsciiConverter'
// import styles from '../../../../app/components/converters/AsciiConverter.module.css'

// export default function AsciiConverterPage({ staticContent }) {
//   return (
//     <>
//       <Head>
//         <title>ASCII Converter | Webdevdata</title>
//         <meta name="description" content="Convert text to ASCII and vice versa with our easy-to-use ASCII converter tool." />
//         <meta name="keywords" content="ASCII, converter, text, encoding, decoding" />
//         <meta property="og:title" content="ASCII Converter | Webdevdata" />
//         <meta property="og:description" content="Convert text to ASCII and vice versa with our easy-to-use ASCII converter tool." />
//         <meta property="og:type" content="website" />
//         <meta property="og:url" content="https://webdevdata.net/tools/converters/ascii-converter" />
//         <link rel="canonical" href="https://webdevdata.net/tools/converters/ascii-converter" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//       </Head>
//       <MyNavbar />
//       <main >
//         <Breadcrumb />
//         <h1 className={styles.title}>ASCII Converter</h1>
//         <AsciiConverter />
//         {staticContent && (
//           <section >
//             <h2>{staticContent.title}</h2>
//             <div dangerouslySetInnerHTML={{ __html: staticContent.content }} />
//           </section>
//         )}
//       </main>
//       <ScrollUpButton />
//     </>
//   )
// }

// export async function getStaticProps() {
//   // This is where you would fetch your static content in the future
//   // For now, we'll just return an empty object
//   const staticContent = {
//     title: "",
//     content: ""
//   }

//   // In the future, you might fetch content like this:
//   // const res = await fetch('https://your-api.com/static-content')
//   // const staticContent = await res.json()

//   return {
//     props: {
//       staticContent
//     },
//     // Optionally, specify a revalidation period in seconds
//     // revalidate: 3600, // Revalidate every hour
//   }
// }
import React from 'react'
import Head from 'next/head'
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import AsciiConverter from '@/app/components/converters/AsciiConverter'
import '../../../pages.css'

export default function AsciiConverterPage({ staticContent }) {
  return (
    <>
      <Head>
        <title>ASCII Converter | Webdevdata</title>
        <meta name="description" content="Convert text to ASCII and vice versa with our easy-to-use ASCII converter tool." />
        <meta name="keywords" content="ASCII, converter, text, encoding, decoding" />
        <meta property="og:title" content="ASCII Converter | Webdevdata" />
        <meta property="og:description" content="Convert text to ASCII and vice versa with our easy-to-use ASCII converter tool." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://webdevdata.net/tools/converters/ascii-converter" />
        <link rel="canonical" href="https://webdevdata.net/tools/converters/ascii-converter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <MyNavbar />
      <br />
      <br />
      <br />
      <Breadcrumb />
      <h1 className='title' style={{marginTop:'-30px', marginBottom:'-30px'}}>ASCII Converter</h1>
      <AsciiConverter />
      {staticContent && (
        <section>
          <h2>{staticContent.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: staticContent.content }} />
        </section>
      )}
      <br />
      <br />
      <ScrollUpButton />
    </>
  )
}

export async function getStaticProps() {
  // This is where you would fetch your static content in the future
  // For now, we'll just return an empty object
  const staticContent = {
    title: "",
    content: ""
  }

  return {
    props: {
      staticContent
    }
  }
}