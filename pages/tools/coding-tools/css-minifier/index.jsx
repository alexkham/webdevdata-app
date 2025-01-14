
// import CSSMinifier from '@/app/components/css-minifier/CssMinifier'
// import MyNavbar from '@/app/components/nav-bar/MyNavbar'
// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// import styles from '../../../../app/components/css-minifier/CSSMinifier.module.css'
// import '../../../pages.css'
// import Head from 'next/head'
// import Layout from '@/pages/Layout'

// export default function CSSMinifierPage() {
//   const keyWords=[
//     'css minifier','compress css','css minifier online'
//   ]
//   return (
//     <Layout>
//     <Head>
//         <title>CSS Minifier | Optimize Your Stylesheets</title>
//         <meta name="description" content="Free online CSS minifier tool. Compress your CSS code, remove unnecessary spaces and comments, and optimize your stylesheets for better website performance." />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <meta name="robots" content="index, follow" />
//         <link rel="canonical" href="https://www.webdevdata.net/tools/coding-tools/css-minifier" />
//         <meta property="og:title" content="CSS Minifier | Optimize Your Stylesheets" />
//         <meta property="og:description" content="Free online CSS minifier tool. Compress your CSS code and optimize your stylesheets for better website performance." />
//         <meta property="og:url" content="https:/webdevdata.net/tools/coding-tools/css-minifier" />
//         <meta property="og:type" content="website" />
//         <meta name="twitter:card" content="summary" />
//         <meta name="twitter:title" content="CSS Minifier | Optimize Your Stylesheets" />
//         <meta name="twitter:description" content="Free online CSS minifier tool. Compress your CSS code and optimize your stylesheets for better website performance." />
//       </Head>
//       {/* <MyNavbar /> */}
//       <br />
//       <br />
//       <br />
//       <Breadcrumb />
//       <h1 className='title' style={{marginTop:'-50px', marginBottom:'-50px'}}>CSS Minifier</h1>
//       <div className={styles.container}>
//         <div className={styles.leftOuter}>
//           <CSSMinifier />
//         </div>
//         <div className={styles.rightPanel}>
//           <h2>CSS Minifier Explained</h2>
//           <p>This tool helps you to compress your CSS code by removing unnecessary spaces, comments, and formatting. The minification process makes your stylesheets lighter and reduces loading time, which is beneficial for website performance.</p>
//           <ul>
//             <li>Removes comments and unnecessary whitespace.</li>
//             <li>Condenses multiple spaces into a single space where appropriate.</li>
//             <li>Optimizes CSS for better performance.</li>
//           </ul>
//           <p>Simply enter your CSS in the left panel and click &quot;Minify CSS&quot;. You can then copy the result or reset to start over.</p>
//         </div>
//       </div>
//       <br />
//       <br />
//       <br />
//       <br />
//       <ScrollUpButton />
//     </Layout>
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

export default function CSSMinifierPage({ pageData, keywords, metaTags }) {
  return (
    <Layout>
      <Head>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content={keywords.join(', ')} />
        <link rel="canonical" href={metaTags.canonical} />
        
        {/* Open Graph */}
        <meta property="og:title" content={metaTags.ogTitle} />
        <meta property="og:description" content={metaTags.ogDescription} />
        <meta property="og:url" content={metaTags.ogUrl} />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={metaTags.twitterTitle} />
        <meta name="twitter:description" content={metaTags.twitterDescription} />
      </Head>

      <br />
      <br />
      <br />
      <Breadcrumb />
      <h1 className='title' style={{marginTop:'-50px', marginBottom:'-50px'}}>
        {pageData.title}
      </h1>

      <div className={styles.container}>
        <div className={styles.leftOuter}>
          <CSSMinifier />
        </div>
        <div className={styles.rightPanel}>
          <h2>{pageData.explanationTitle}</h2>
          <p>{pageData.mainDescription}</p>
          <ul>
            {pageData.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <p>{pageData.instructions}</p>
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

export async function getStaticProps() {
  const keywords = [
    'css minifier',
    'compress css',
    'css minifier online',
    'minify css',
    'css compression tool',
    'css optimizer',
    'online css compressor',
    'css code minifier'
  ];

  const metaTags = {
    title: 'CSS Minifier | Optimize Your Stylesheets',
    description: 'Free online CSS minifier tool. Compress your CSS code, remove unnecessary spaces and comments, and optimize your stylesheets for better website performance.',
    canonical: 'https://www.webdevdata.net/tools/coding-tools/css-minifier',
    ogTitle: 'CSS Minifier | Optimize Your Stylesheets',
    ogDescription: 'Free online CSS minifier tool. Compress your CSS code and optimize your stylesheets for better website performance.',
    ogUrl: 'https://webdevdata.net/tools/coding-tools/css-minifier',
    twitterTitle: 'CSS Minifier | Optimize Your Stylesheets',
    twitterDescription: 'Free online CSS minifier tool. Compress your CSS code and optimize your stylesheets for better website performance.'
  };

  const pageData = {
    title: 'CSS Minifier',
    explanationTitle: 'CSS Minifier Explained',
    mainDescription: 'This tool helps you to compress your CSS code by removing unnecessary spaces, comments, and formatting. The minification process makes your stylesheets lighter and reduces loading time, which is beneficial for website performance.',
    features: [
      'Removes comments and unnecessary whitespace.',
      'Condenses multiple spaces into a single space where appropriate.',
      'Optimizes CSS for better performance.',
      'Reduces file size without changing functionality.',
      'Improves website loading speed.',
      'Maintains CSS specificity and order.'
    ],
    instructions: 'Simply enter your CSS in the left panel and click "Minify CSS". You can then copy the result or reset to start over.'
  };

  return {
    props: {
      pageData,
      keywords,
      metaTags
    }
  }
}