// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
// import MyNavbar from '@/app/components/nav-bar/MyNavbar';
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
// import CardsGroup from '@/app/components/simple-card-group/CardsGroup';
// import React from 'react'
// import '../../pages.css'

// export default function ConvertersPage() {
//     const cardsData = [
//         {
//           title: "Ascii Converter",
//           content: "Convert text to ASCII codes and vice versa with our user-friendly tool. Easily encode or decode messages for various applications in programming, communication, and data processing.",
//           link: "/tools/converters/ascii-converter",
//         //   image: "https://example.com/image1.jpg",
//           color: "#f0f0f0"
//         },
//         // {
//         //   title: "Card 2",
//         //   content: "This is the content for card 2",
//         //   link: "https://example.com/2",
//         //   color: "#e0e0e0"
//         // },
//         // Add more card objects as needed
//       ];


//   return (
//     <>
//     <MyNavbar></MyNavbar>
//     <br></br>
//     <br></br>
//     <br></br>
//     <Breadcrumb></Breadcrumb>
//     <h1 className='title'>Converters</h1>
//     <br></br>
//      <CardsGroup cards={cardsData}></CardsGroup>
//      <br></br>
//      <br></br>
//      <br></br>
//      <ScrollUpButton></ScrollUpButton>

    
    
    
//     </>
//   )
// }
import React from 'react'
import Head from 'next/head'
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import CardsGroup from '@/app/components/simple-card-group/CardsGroup'
import '../../pages.css'
import Layout from '@/pages/Layout'

export default function ConvertersPage({ cardsData }) {
  return (
    <Layout>
      <Head>
        <title>Converters | Webdevdata</title>
        <meta name="description" content="Explore our collection of useful converters for various data formats and units. Tools for ASCII, binary, hex, and more." />
        <meta name="keywords" content="converters, ASCII, binary, hex, data conversion tools" />
        <meta property="og:title" content="Converters | Webdevdata" />
        <meta property="og:description" content="Explore our collection of useful converters for various data formats and units. Tools for ASCII, binary, hex, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://webdevdata.net/tools/converters" />
        <link rel="canonical" href="https:/webdevdata.net/tools/converters" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* <MyNavbar /> */}
      <br></br>
      <br></br>
      <br></br>
      <main >
        <Breadcrumb />
        <h1 className='title' style={{marginTop:'-30px', marginBottom:'-20px'}}>Converters</h1>
        <CardsGroup cards={cardsData} />
      </main>
      <ScrollUpButton />
    </Layout>
  )
}

export async function getStaticProps() {
  const cardsData = [
    {
      title: "ASCII Converter",
      content: "Convert text to ASCII codes and vice versa with our user-friendly tool. Easily encode or decode messages for various applications in programming, communication, and data processing.",
      link: "/tools/converters/ascii-converter",
      color: "#f0f0f0"
    },
    // Add more card objects as needed

    {
        title: "Css Units Converter",
        content: "Instantly convert between all CSS units with precision and ease. From pixels to viewport sizes, ems to rems, percentages to physical units - this powerful tool handles it all. ",
        link: "/tools/converters/css-units-converter",
        color: "#f0f0f0"
      },
      {
        title: "HTML Entities Converter",
        content:"Effortlessly convert text to HTML entities and back . Ensure your web content displays correctly across all browsers and devices with ease.",
        link: "/tools/converters/html-entities",
        color: "#f0f0f0"
      },
  ];

  return {
    props: {
      cardsData
    }
  }
}