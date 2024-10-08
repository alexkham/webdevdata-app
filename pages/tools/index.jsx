import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
import React from 'react'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import Head from 'next/head'
import '../pages.css'

import SectionLinkGroup from '@/app/components/section-link-group/SectionLinkGroup'

export default function ToolsPage({ pageTitle, pageDescription, sections }) {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <link rel="canonical" href="https:/webdevdata.net/tools" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https:/webdevdata.net/tools" />
      </Head>
      <MyNavbar2 />
      <br></br>
      <br></br>
      <br></br>
      <main>
        <Breadcrumb />
        <h1 className='title' style={{marginTop:'-30px'}}>Web Development Tools</h1>
        <SectionLinkGroup sections={sections} />
        <ScrollUpButton />
      </main>
    </>
  )
}

export async function getStaticProps() {
  const sections = [
    {
      title: 'Tables',
      link: '/tools/tables',
      text: 'Explore our collection of interactive tables. From data visualization to complex comparisons, our table tools help you organize and present information effectively.',
    //   image: '/images/tables-icon.jpg'
    },
    {
      title: 'Converters',
      link: '/tools/converters',
      text: 'Access a variety of conversion tools for different units and formats. Our converters simplify calculations and transformations for developers and designers.',
    //   image: '/images/converters-icon.jpg'
    },
    {
      title: 'Coding Tools',
      link: '/tools/coding-tools',
      text: 'Enhance Your Coding Efficiency with Our Digital Toolbox. From URL and HTML Encoding to CSS Minification, Our Conversion Tools Streamline Common Development Tasks and Optimize Your Code.',
    //   image: '/images/converters-icon.jpg'
    },
    {
      title: 'Text Processing Tools',
      link: '/tools/text',
      text: 'Powerful utilities for text manipulation and analysis. Features include a Text Analyzer , and a Case Converter. Essential for writers, developers, and anyone working with text content.',
    //   image: '/images/converters-icon.jpg'
    },
  ];

  return {
    props: {
      pageTitle: "Web Development Tools | Webdevdata",
      pageDescription: "Discover our collection of web development tools including interactive tables and versatile converters.",
      sections,
    },
  }
}