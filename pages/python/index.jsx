import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import React from 'react'
import '../pages.css'
import SectionLinkGroup from '@/app/components/section-link-group/SectionLinkGroup'

export default function PythonPage() {
     
    const sections = [
        {

            title:'Python Sequence Slicing',
            link: 'python/sequence-slicing',
            text: 'Explore the fundamentals of Python sequence slicing with our interactive guide.Clear visualizations to help you understand how slicing works with Python sequences . Learn to  use indices and step parameters to manipulate sequences and extract subsets.',
            image: 'series-L.jpg'
        },
        
        
        
        
      ];


  return (
    <>
    <MyNavbar></MyNavbar>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <h1 className='title'>Python Programming</h1>
    <br></br>
    <SectionLinkGroup sections={sections}></SectionLinkGroup>
    <br></br>
    <br></br>
    <ScrollUpButton></ScrollUpButton>
    
    </>
  )
}
