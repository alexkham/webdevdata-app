// import DynamicAccordionCode from '@/app/components/accordion/DynamicAccordionCode'
// import React from 'react'
// import { useRouter } from 'next/router'
// import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// import '../../../pages.css'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// import Head from 'next/head'
// import { capitalizeWords } from '@/utils/functions'
// import CodeExampleWrapper from '@/app/components/accordion/code-example-accordion/CodeExampleWrapper'
// import CodeExampleAccordion from '@/app/components/accordion/code-example-accordion/CodeExampleAccordion'

// export default function ExamplePage({ data, example }) {
//   const router = useRouter()

//   if (router.isFallback) {
//     return <div>Loading...</div>
//   }

//   return (
//     <>
//       <Head>
        
//         <title>{`${example} Example | C Programming`}</title>
//         <meta name="description" content={`Learn about ${example} in C programming with interactive examples`} />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="canonical" href={`https://www.webdevdata.net/c-programming/examples/${example}`} />

//       </Head>
//       <MyNavbar2 />
//       <br></br>
//       <br></br>
//       <br></br>
//       {/* <main className='container' style={{width:'100%'}} > */}
//         <Breadcrumb />
//         <h1 className='title text-3xl font-bold mb-6' style={{marginBottom:'0px',marginTop:'-30px'}}>{capitalizeWords(example)} Examples</h1>
//         {/* <div className='container' style={{ display: 'flex', justifyContent: 'flex-start' }}> */}
//           {/* <DynamicAccordionCode width={'100%'} data={data} /> */}
//           <CodeExampleWrapper
//             WrappedComponent={CodeExampleAccordion}
//             data={data}
//             groupByField={"sub_category"}
//             link={'/c-programming/functions'}></CodeExampleWrapper>
//         {/* </div> */}
//       {/* </main> */}
//       <ScrollUpButton />
//     </>
//   )
// }

// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: true
//   }
// }

// export async function getStaticProps({ params }) {
//   const { example } = params
  
//   try {
//     const data = await import(`../../../../app/api/db/content/C/examples/${example}.json`)
//     return {
//       props: {
//         data: data.default,
//         example,
//       },
//     }
//   } catch (error) {
//     return { notFound: true }
//   }
// }


import DynamicAccordionCode from '@/app/components/accordion/DynamicAccordionCode'
import React from 'react'
import { useRouter } from 'next/router'
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import '../../../pages.css'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import Head from 'next/head'
import { capitalizeWords } from '@/utils/functions'
import CodeExampleWrapper from '@/app/components/accordion/code-example-accordion/CodeExampleWrapper'
import CodeExampleAccordion from '@/app/components/accordion/code-example-accordion/CodeExampleAccordion'
import fs from 'fs'
import path from 'path'

export default function ExamplePage({ data, example, relatedExamples }) {
  const router = useRouter()

  // Enhanced SEO metadata
  const pageTitle = `${capitalizeWords(example)} Example | C Programming Tutorial`
  const pageDescription = `Learn ${capitalizeWords(example)} in C programming with interactive examples, code snippets, and explanations. Free C programming tutorial.`

  // Schema.org data for rich snippets
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": `${capitalizeWords(example)} in C Programming`,
    "description": pageDescription,
    "articleSection": "Programming Tutorial",
    "programmingLanguage": "C",
    "educationalLevel": "Beginner to Advanced",
    "url": `https://www.webdevdata.net/c-programming/examples/${example}`
  }

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content={`c programming, ${example}, c tutorial, programming examples, ${example} tutorial, c programming examples`} />
        <link rel="canonical" href={`https://www.webdevdata.net/c-programming/examples/${example}`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.webdevdata.net/c-programming/examples/${example}`} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Head>
      
      <MyNavbar2 />
      <br></br>
      <br></br>
      <br></br>
      
      <Breadcrumb />
      <h1 className='title text-3xl font-bold mb-6' style={{marginBottom:'0px',marginTop:'-30px'}}>
        {capitalizeWords(example)} Examples
      </h1>
      
      <CodeExampleWrapper
        WrappedComponent={CodeExampleAccordion}
        data={data}
        groupByField={"sub_category"}
        link={'/c-programming/functions'}>
      </CodeExampleWrapper>

      {relatedExamples && relatedExamples.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Related Examples</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {relatedExamples.map((related) => (
              <li key={related}>
                <a href={`/c-programming/examples/${related}`} className="text-blue-600 hover:underline">
                  {capitalizeWords(related)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <ScrollUpButton />
    </>
  )
}

export async function getStaticPaths() {
  // Get all example files from the directory
  const examplesDirectory = path.join(process.cwd(), 'app/api/db/content/C/examples')
  const filenames = fs.readdirSync(examplesDirectory)
  
  // Create paths for all existing examples
  const paths = filenames
    .filter(filename => filename.endsWith('.json'))
    .map(filename => ({
      params: {
        example: filename.replace('.json', '')
      }
    }))

  return {
    paths,
    fallback: 'blocking' // Use blocking to ensure SEO-friendly behavior
  }
}

export async function getStaticProps({ params }) {
  const { example } = params

  try {
    // Get the main example data
    const data = await import(`../../../../app/api/db/content/C/examples/${example}.json`)
    
    // Get related examples (optional)
    const examplesDirectory = path.join(process.cwd(), 'app/api/db/content/C/examples')
    const allExamples = fs.readdirSync(examplesDirectory)
      .filter(filename => filename.endsWith('.json'))
      .map(filename => filename.replace('.json', ''))
    
    // Filter out current example and get up to 6 related examples
    const relatedExamples = allExamples
      .filter(name => name !== example)
      .slice(0, 6)

    return {
      props: {
        data: data.default,
        example,
        relatedExamples,
      },
      revalidate: 3600, // Revalidate pages every hour
    }
  } catch (error) {
    return { notFound: true }
  }
}