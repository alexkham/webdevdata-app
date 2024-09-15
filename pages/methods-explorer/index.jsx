import MethodExplorer from '@/app/components/method-explorer/MethodExplorer'
import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
import ListSplitVisualizer from '@/app/components/python-list-slicing/ListSplitVisualizer'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import React from 'react'

export default function MethodsExplorerPage() {
  return (
    <>
    <MyNavbar2></MyNavbar2>
    <br></br>
    <br></br>
    <br></br>
    {/* <div className="main-page-container"> */}
   <MethodExplorer></MethodExplorer>
   {/* </div> */}
    <br></br>
    <br></br>
    <ScrollUpButton></ScrollUpButton>
    
    </>
  )
}
