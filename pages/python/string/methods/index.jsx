import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import StringProcessorWrapper from '@/app/components/string-processor/StringProcessorWrapper'
import React from 'react'
import { pythonData } from '@/app/components/string-processor/pythonData'
import '../../../pages.css'

export default function MethodsPage() {
  return (
    <>
    <MyNavbar2/>
    <br/>
    <br/>
    <br/>
    <Breadcrumb/>
    <h1 className='title' style={{marginTop:'-30px',marginBottom:'-20px'}}>Python String (Text) Methods</h1>
    <div style={{transform:'scale(0.9)'}}>
   <StringProcessorWrapper
   pythonData={pythonData}
   language='python'
   baseUrl={'/python/functions/'}
   title={''}/>
   </div>
    <br/>
    <br/>
    <br/>
    <ScrollUpButton/>
    </>
  )
}
