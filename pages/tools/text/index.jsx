import Head from 'next/head'
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import React from 'react'
import '../../pages.css'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import CardsGroup from '@/app/components/simple-card-group/CardsGroup'
import Layout from '@/pages/Layout'

export default function TextToolsPage({ cardsData }) {
  return (
    <Layout>
      <Head>
        <title>Text Tools | Webdevdata</title>
        <meta name="description" content="Explore our collection of text tools including Text Analyzer and Case Converter. Enhance your text processing workflow with these essential utilities." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://webdevdata.net/tools/text" />
        <meta property="og:title" content="Text Tools | Webdevdata" />
        <meta property="og:description" content="Explore our collection of text tools including Text Analyzer and Case Converter." />
        <meta property="og:url" content="https://webdevdata.net/tools/text" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Text Tools | Webdevdata" />
        <meta name="twitter:description" content="Explore our collection of text tools including Text Analyzer and Case Converter." />
      </Head>
      {/* <MyNavbar /> */}
      <br />
      <br />
      <br />
      <Breadcrumb />
      <h1 className='title' style={{marginTop:'-30px', marginBottom:'-10px'}}>Text Tools</h1>
      <CardsGroup cards={cardsData} />
      <ScrollUpButton />
    </Layout>
  )
}

export async function getStaticProps() {
  const cardsData = [
    {
      title: "Text Analyzer",
      content: "Analyze your text for word count, character count, and more. Get insights into your writing with our comprehensive text analysis tool. Useful for content creators, students, and professionals working with text.",
      link: "/tools/text/text-analyzer",
      color: "#f0f0f0"
    },
    {
      title: "Case Converter",
      content: "Convert text between different cases such as lowercase, uppercase, title case, and more. Quickly transform your text for various formatting needs. Essential for coding, writing, and text formatting tasks.",
      link: "/tools/text/case-converter",
      color: "#f0f0f0"
    },
  ]

  return {
    props: {
      cardsData
    },
  }
}