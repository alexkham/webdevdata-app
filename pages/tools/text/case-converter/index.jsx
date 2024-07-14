import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import '../../../pages.css'
import { explanations } from '@/app/components/case-converter/caseExplanations'
import CaseConverter2 from '@/app/components/case-converter/CaseConverter2'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import '../../../../app/components/case-converter/CaseConverter.module.css'
import Head from 'next/head'
import Layout from '@/pages/Layout'


export default function CaseConverterPage() {
  return (
   <Layout>
    <Head>
        <title>Case Converter Tool - Convert Text Case Online</title>
        <meta name="description" content="Free online case converter tool. Convert text to uppercase, lowercase, title case, and more. Easy to use and completely free." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https:/webdevdata.net/tools/text/case-converter" />
      </Head>
   {/* <MyNavbar></MyNavbar> */}
   <br></br>
   <br></br>
   <br></br>
   <main>
   <Breadcrumb></Breadcrumb>
   <h1 className='title' style={{marginTop:'-30px',marginBottom:'-30px'}}>Case Converter</h1>
    <CaseConverter2 explanations={explanations}/>
    </main>
   <ScrollUpButton></ScrollUpButton>
   </Layout>
  )
}

export async function getStaticProps() {
    return {
      props: {
        explanations: explanations ?? {}
      }
    }
  }
