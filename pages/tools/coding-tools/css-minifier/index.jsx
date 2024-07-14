// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// import CSSMinifier from '@/app/components/css-minifier/CssMinifier'
// import MyNavbar from '@/app/components/nav-bar/MyNavbar'
// import React from 'react';
// import '../../../pages.css'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';

// export default function CSSMinifierPage() {
//   return (
//     <>
//     <MyNavbar></MyNavbar>
//     <br></br>
//     <br></br>
//     <br></br>
//     <Breadcrumb></Breadcrumb>
//     <h1 className='title' style={{marginTop:'-40px', marginBottom:'-50px'}}>CSS Minifier</h1>
//     <CSSMinifier></CSSMinifier>
//     <br></br>
//     <br></br>
//     <br></br>
//     <br></br>
//     <ScrollUpButton></ScrollUpButton> 
    
//     </>
//   )
// }
import CSSMinifier from '@/app/components/css-minifier/CssMinifier'
import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import styles from '../../../../app/components/css-minifier/CSSMinifier.module.css'
import '../../../pages.css'
import Head from 'next/head'
import Layout from '@/pages/Layout'

export default function CSSMinifierPage() {
  return (
    <Layout>
    <Head>
        <title>CSS Minifier | Optimize Your Stylesheets</title>
        <meta name="description" content="Free online CSS minifier tool. Compress your CSS code, remove unnecessary spaces and comments, and optimize your stylesheets for better website performance." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https:/webdevdata.net/tools/coding-tools/css-minifier" />
        <meta property="og:title" content="CSS Minifier | Optimize Your Stylesheets" />
        <meta property="og:description" content="Free online CSS minifier tool. Compress your CSS code and optimize your stylesheets for better website performance." />
        <meta property="og:url" content="https:/webdevdata.net/tools/coding-tools/css-minifier" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="CSS Minifier | Optimize Your Stylesheets" />
        <meta name="twitter:description" content="Free online CSS minifier tool. Compress your CSS code and optimize your stylesheets for better website performance." />
      </Head>
      {/* <MyNavbar /> */}
      <br />
      <br />
      <br />
      <Breadcrumb />
      <h1 className='title' style={{marginTop:'-50px', marginBottom:'-50px'}}>CSS Minifier</h1>
      <div className={styles.container}>
        <div className={styles.leftOuter}>
          <CSSMinifier />
        </div>
        <div className={styles.rightPanel}>
          <h2>CSS Minifier Explained</h2>
          <p>This tool helps you to compress your CSS code by removing unnecessary spaces, comments, and formatting. The minification process makes your stylesheets lighter and reduces loading time, which is beneficial for website performance.</p>
          <ul>
            <li>Removes comments and unnecessary whitespace.</li>
            <li>Condenses multiple spaces into a single space where appropriate.</li>
            <li>Optimizes CSS for better performance.</li>
          </ul>
          <p>Simply enter your CSS in the left panel and click &quot;Minify CSS&quot;. You can then copy the result or reset to start over.</p>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <ScrollUpButton />
    </Layout>
  )
}