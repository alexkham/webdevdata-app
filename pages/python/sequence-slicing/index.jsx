import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import ListSplitVisualizer from '@/app/components/python-list-slicing/ListSplitVisualizer'
import React from 'react'
import './python.css'

export default function PythonSequenceSlicingPage() {
  return (
    <>
    <MyNavbar></MyNavbar>
        
    <div className='outer-container'>
    <ListSplitVisualizer></ListSplitVisualizer>
    </div>
    </>
)}
