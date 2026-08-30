import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import HierarchyPyramid from '@/app/components/hierarchy-diagrams/HierarchyPyramid';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
import React from 'react'
import Head from 'next/head'
import '../../pages.css'

const SITE_URL = 'https://www.webdevdata.net';

const keyWords = [
    'operators in c', 'operators precedence in c', 'operators precedence', 'c programming',
    'c language'
];

const seoData = {
    title:       'Operators in C: Precedence and Associativity | WebDevData',
    description: 'C operator precedence and associativity as a visual hierarchy — primary, unary, multiplicative, additive, shift, relational, bitwise, logical, assignment and comma operators.',
    name:        'Operators in C',
    url:         '/c-programming/operators',
    keywords:    keyWords.join(', '),
};

export default function OperatorsPage() {


    const operatorsData = [
        {
          title: "Primary Operators",
          bgColor: "#ffed4b",
          content: [
            {
              title: "Same precedence (left-to-right):",
              items: ['()', '[]', '.', '->']
            }
          ]
        },
        {
          title: "Unary Operators",
          bgColor: "#bceb57",
          content: [
            {
              title: "Same precedence (right-to-left):",
              items: ['+', '-', '!', '~', '++', '--', '&', '*', 'sizeof']
            }
          ]
        },
        {
          title: "Multiplicative Operators",
          bgColor: "#64edab",
          content: [
            {
              title: "Same precedence (left-to-right):",
              items: ['*', '/', '%']
            }
          ]
        },
        {
          title: "Additive Operators",
          bgColor: "#4dd3ff",
          content: [
            {
              title: "Same precedence (left-to-right):",
              items: ['+', '-']
            }
          ]
        },
        {
          title: "Bitwise Shift Operators",
          bgColor: "#76aaff",
          content: [
            {
              title: "Same precedence (left-to-right):",
              items: ['<<', '>>']
            }
          ]
        },
        {
          title: "Relational Operators",
          bgColor: "#9cc2ff",
          content: [
            {
              title: "Same precedence (left-to-right):",
              items: ['<', '<=', '>', '>=']
            }
          ]
        },
        {
          title: "Equality Operators",
          bgColor: "#a792ff",
          content: [
            {
              title: "Same precedence (left-to-right):",
              items: ['==', '!=']
            }
          ]
        },
        {
          title: "Bitwise Operators",
          bgColor: "#cf92ff",
          content: [
            {
              title: "Separate precedence (left-to-right):",
              items: ['& (higher)', '^ (middle)', '| (lower)']
            }
          ]
        },
        {
          title: "Logical Operators",
          bgColor: "#ff92f6",
          content: [
            {
              title: "Separate precedence (left-to-right):",
              items: ['&& (higher)', '|| (lower)']
            }
          ]
        },
        {
          title: "Conditional Operator",
          bgColor: "#ff92c2",
          content: [
            {
              title: "Single precedence (right-to-left):",
              items: ['?:']
            }
          ]
        },
        {
          title: "Assignment Operators",
          bgColor: "#ff9292",
          content: [
            {
              title: "Same precedence (right-to-left):",
              items: ['=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '&=', '^=', '|=']
            }
          ]
        },
        {
          title: "Comma Operator",
          bgColor: "#ffb692",
          content: [
            {
              title: "No internal hierarchy (left-to-right):",
              items: [',']
            }
          ]
        }
      ];
      

  return (
    <>
    <Head>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={`${SITE_URL}${seoData.url}`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <link rel="canonical" href={`${SITE_URL}${seoData.url}`} />
    </Head>

    <br/>
    <br/>

    <Breadcrumb/>
    <h1 className='title' style={{marginTop:'-50px',marginBottom:'-50px'}}>Operators in C Language</h1>
    <div style={{transform:'scale(0.8)',width:'60%',marginTop:'-70px'}}>
    <HierarchyPyramid data={operatorsData} />
    </div>

    <ScrollUpButton/>
    </>
  )
}
