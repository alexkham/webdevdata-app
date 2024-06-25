import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import React from 'react'
import data from '../../../app/api/db/developement/c/functions2.json'
import FunctionList from '@/app/components/function-list/FunctionList'
import '../../../pages/pages.css'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'

export default function FunctionsPage() {
  return (
    <>
    <MyNavbar></MyNavbar>
    <br></br>
    <br></br>
    <br></br>
    
    <Breadcrumb></Breadcrumb>
    <h1 className='title'>C Standard Library Functions Reference</h1>
    
    <FunctionList data={data}></FunctionList>
    <br></br>
    <br></br>
    <br></br>
    <ScrollUpButton></ScrollUpButton>
    
    </>
  )
}
