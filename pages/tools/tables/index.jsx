import React from 'react'
import Head from 'next/head'
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import CardsGroup from '@/app/components/simple-card-group/CardsGroup'
import '../../pages.css'
import Layout from '@/pages/Layout'

export default function TablesPage({ cardsData }) {
  return (
    <Layout>
      <Head>
        <title>Tables | Webdevdata</title>
        <meta name="description" content="Explore our collection of useful tables for web development. Reference ASCII codes and more." />
        <meta name="keywords" content="tables, ASCII, web development, reference tools" />
        <meta property="og:title" content="Tables | Webdevdata" />
        <meta property="og:description" content="Explore our collection of useful tables for web development. Reference ASCII codes and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://webdevdata.net/tools/tables" />
        <link rel="canonical" href="https://webdevdata.net/tools/tables" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* <MyNavbar /> */}
      <br></br>
      <br></br>
      <br></br>
      <main>
        <Breadcrumb />
        <h1 className='title' style={{marginTop:'-30px', marginBottom:'-20px'}}>Tables</h1>
        <CardsGroup cards={cardsData} />
      </main>
      <ScrollUpButton />
    </Layout>
  )
}

export async function getStaticProps() {
  const cardsData = [
    {
      title: "ASCII Table",
      content: "Complete reference for ASCII codes. Look up character representations, decimal, hexadecimal, and binary values. Essential for text processing and encoding tasks in programming.",
      link: "/tools/tables/ascii",
      color: "#f0f0f0"
    },

    {
      title: "HTML Tags Table",
      content: "Comprehensive inventory of HTML tags, detailing  names, functions, categories, attributes, deprecation status, and usage examples, serving as a concise reference for web developers.",
      link: "/tools/tables/html_tags",
      color: "#f0f0f0"
    },
    {
      title: "Metric Prefixes Table ",
      content:"Comprehensive table of metric prefixes, detailing names, symbols, and corresponding multiplying factors, ranging from quetta (10³⁰) to quecto (10⁻³⁰), serving as a concise reference.",
      link: "/tools/tables/prefixes",
      color: "#f0f0f0"
    },
    // Add more card objects here as you add more tables
  ];

  return {
    props: {
      cardsData
    }
  }
}