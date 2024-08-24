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

export default function ExamplePage({ data, example }) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>{`${example} Example | C Programming`}</title>
        <meta name="description" content={`Learn about ${example} in C programming with interactive examples`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <MyNavbar2 />
      <br></br>
      <br></br>
      <br></br>
      {/* <main className='container' style={{width:'100%'}} > */}
        <Breadcrumb />
        <h1 className='title text-3xl font-bold mb-6' style={{marginBottom:'0px',marginTop:'-30px'}}>{capitalizeWords(example)} Examples</h1>
        {/* <div className='container' style={{ display: 'flex', justifyContent: 'flex-start' }}> */}
          {/* <DynamicAccordionCode width={'100%'} data={data} /> */}
          <CodeExampleWrapper
            WrappedComponent={CodeExampleAccordion}
            data={data}
            groupByField={"sub_category"}
            link={'/c-programming/functions'}></CodeExampleWrapper>
        {/* </div> */}
      {/* </main> */}
      <ScrollUpButton />
    </>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  const { example } = params
  
  try {
    const data = await import(`../../../../app/api/db/content/C/examples/${example}.json`)
    return {
      props: {
        data: data.default,
        example,
      },
    }
  } catch (error) {
    return { notFound: true }
  }
}