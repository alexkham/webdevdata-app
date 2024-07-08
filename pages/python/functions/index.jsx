import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import React from 'react'
import '../../pages.css'
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import PythonFunctionsList from '@/app/components/function-list/PythonFunctionsList'
import pythonData from '../../../app/api/db/developement/python/functions_new.json'

export default function PythonFunctionsPage() {
  return (
    <>
    <MyNavbar></MyNavbar>
    
    <br></br>
    <br></br>
    <br></br>
    <Breadcrumb></Breadcrumb>
    <h1 className='title'>Python Functions</h1>
    <PythonFunctionsList data={pythonData}></PythonFunctionsList>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <ScrollUpButton></ScrollUpButton>
    </>
  )
}
