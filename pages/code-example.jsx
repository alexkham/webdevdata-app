import CodeExample from '@/app/components/code-example/CodeExample'
import CodeExample2 from '@/app/components/code-example/CodeExample2'
import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import React from 'react'

export default function CodeExamplePage() {
  return (
    <>
    <MyNavbar></MyNavbar>
    <br></br>
    <br></br>
    <br></br>
     <div>
    <CodeExample 
    language={'C'}
    category={'general'}
     fileName={'permutations'}></CodeExample>
    </div>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <CodeExample2 
    language={'C'}
    fileName={'permutations'}
    desiredTitle={'dolly'}></CodeExample2>
    <br></br>
    <ScrollUpButton></ScrollUpButton>
    </>
  )
}
