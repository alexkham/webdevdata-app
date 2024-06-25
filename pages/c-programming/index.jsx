import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import SectionLinkGroup from '@/app/components/section-link-group/SectionLinkGroup';
import React from 'react'
import '../../pages/pages.css'
import Link from 'next/link';

export default function CProgrammingPage() {
    
    const sections = [
        {

            title:'C  Functions Reference',
            link: 'c-programming/functions',
            text: 'C Standard Library Functions Explorer: Quickly find and explore C functions, searchable by name or filterable by return types and parameters, with instant access to descriptions.',
            image: 'explore.png'
        },
        {
          title:'Things We Never Do in C',
          link: 'c-programming/things-not-to-do',
          text: 'C Programming Pitfalls Guide: Explore common mistakes and unsafe practices in C, categorized by data types, to improve code quality and avoid critical errors in your projects.',
          image: 'do-not.png'
        },
        
        
        
      ];


  return (
   <>
   <MyNavbar></MyNavbar>
   <br></br>
   <br></br>
   <br></br>
   <h1 className='title'>C Programming </h1>
   <br></br>
   <SectionLinkGroup sections={sections}></SectionLinkGroup>
      
   <div className='content'>
   <h2>Welcome to the C Programming Resource Hub</h2>
   <section>
        <p>C Programming stands as one of the most fundamental programming languages that has shaped the software industry. Developed in the early 1970s by Dennis Ritchie for the Unix operating system, it has become a cornerstone in creating efficient, compact, and fast executable software. C programming is renowned for its efficiency and control, embedded in operating systems, system software, and complex computational systems where performance is critical.</p>
    </section>

    <section>
        <h2>Explore C Standard Library Functions</h2>
        <p>Dive into our extensive <Link href={'/c-programming/functions'}>C Standard Library Functions Explorer</Link>, a comprehensive guide to the numerous functions provided by the standard C library. This resource is meticulously organized to help you understand and utilize the standard functions that form the backbone of C programming, ranging from input/output operations to complex mathematical computations.</p>
    </section>

    <section>
        <h2>Learn C Programming Malpractices</h2>
        <p>Visit our <Link href={'/c-programming/things-not-to-do'}>C Programming Malpractices </Link>page to learn about common mistakes and what not to do when coding in C. This section highlights typical coding errors, unsafe practices, and outdated methods that could lead to inefficient, insecure, and unportable code.</p>
    </section>

    <section>
        <h2>Why Learn C?</h2>
        <ul>
            <li>Efficiency and Control: C provides an unmatched level of control over system resources and memory, making it ideal for system programming.</li>
            <li>Foundation for Modern Languages: Understanding C is crucial as it influences numerous modern languages like C++, Java, and even Python.</li>
            <li>Embedded Programming: C remains a popular choice for microcontroller and embedded systems programming.</li>
        </ul>
    </section>

    <section>
        <h2>Resources and Tools</h2>
        <p>Our hub provides links to interactive examples, in-depth tutorials, and tools that can help you compile and debug your C programs efficiently. Whether you are a student starting your programming journey or a professional looking to refine your skills, our resources are tailored to suit your needs.</p>
    </section>

    <section>
        <h2>Stay Updated</h2>
        <p>The world of C programming is ever-evolving with new standards like C18 and upcoming changes. Stay tuned to our updates and enhance your knowledge as you explore the extensive, powerful features of C programming.</p>
    </section>
    </div>
   <br></br>
   <br></br>
   <ScrollUpButton></ScrollUpButton>
   </>
  )
}
