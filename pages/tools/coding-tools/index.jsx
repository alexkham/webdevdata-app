// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// import MyNavbar from '@/app/components/nav-bar/MyNavbar'
// import React from 'react'
// import '../../pages.css'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// import CardsGroup from '@/app/components/simple-card-group/CardsGroup'

// export default function CodingToolsPage() {

// const cardsData = [
//     {
//       title: "URL Encoder/Decoder",
//       content: "Convert URLs between readable and encoded formats. Handles special characters for proper web transmission. Crucial for working with complex URLs, API requests, and ensuring cross-system compatibility in web development.",
//       link: "/tools/coding-tools/url-encoder-decoder",
//       color: "#f0f0f0"
//     },
//     {
//         title: "CSS Minifier",
//         content: "Compress CSS code by removing unnecessary characters and optimizing syntax. Reduces file size for faster website loading. Essential for web performance optimization and efficient stylesheet management..",
//         link: "/tools/coding-tools/css-minifier",
//         color: "#f0f0f0"
//       },
// ]



   
//    return (
//    <>
//     <MyNavbar></MyNavbar>
//     <br></br>
//     <br></br>
//     <br></br>
//     <Breadcrumb></Breadcrumb>
//     <h1 className='title' style={{marginTop:'-30px', marginBottom:'-10px'}}>Coding Tools</h1>
//     <CardsGroup cards={cardsData}></CardsGroup>
    
    
    
//     <ScrollUpButton></ScrollUpButton>
//     </>
//   )
// }
import Head from 'next/head'
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import React from 'react'
import '../../pages.css'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import CardsGroup from '@/app/components/simple-card-group/CardsGroup'

export default function CodingToolsPage({ cardsData }) {
    
  return (
    <>
      <Head>
        <title>Coding Tools | Webdevdata</title>
        <meta name="description" content="Explore our collection of coding tools including URL Encoder/Decoder and CSS Minifier. Enhance your web development workflow with these essential utilities." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https:/webdevdata.net/tools/coding-tools" />
        <meta property="og:title" content="Coding Tools | Your Website Name" />
        <meta property="og:description" content="Explore our collection of coding tools including URL Encoder/Decoder and CSS Minifier." />
        <meta property="og:url" content="https:/webdevdata.net/tools/coding-tools" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Coding Tools | Webdevdata" />
        <meta name="twitter:description" content="Explore our collection of coding tools including URL Encoder/Decoder and CSS Minifier." />
      </Head>
      <MyNavbar></MyNavbar>
      <br></br>
      <br></br>
      <br></br>
      <Breadcrumb></Breadcrumb>
      <h1 className='title' style={{marginTop:'-30px', marginBottom:'-10px'}}>Coding Tools</h1>
      <CardsGroup cards={cardsData}></CardsGroup>                   
      <ScrollUpButton></ScrollUpButton>
    </>
  )
}

export async function getStaticProps() {
  const cardsData = [
    {
      title: "URL Encoder/Decoder",
      content: "Convert URLs between readable and encoded formats. Handles special characters for proper web transmission. Crucial for working with complex URLs, API requests, and ensuring cross-system compatibility in web development.",
      link: "/tools/coding-tools/url-encoder-decoder",
      color: "#f0f0f0"
    },
    {
      title: "HTML Encoder/Decoder",
      content: "Transform HTML content between its raw and encoded forms with precision. This HTML Encoder/Decoder tool is essential for web developers, content managers, and security professionals working with markup languages.",
      link: "/tools/coding-tools/html-encoder",
      color: "#f0f0f0"
    },
    {
      title: "CSS Minifier",
      content: "Compress CSS code by removing unnecessary characters and optimizing syntax. Reduces file size for faster website loading. Essential for web performance optimization and efficient stylesheet management.",
      link: "/tools/coding-tools/css-minifier",
      color: "#f0f0f0"
    },
  ]

  return {
    props: {
      cardsData
    },
  }
}