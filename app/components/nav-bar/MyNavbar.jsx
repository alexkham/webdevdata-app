// 'use client'
// import React,{useEffect} from 'react'
// import './MyNavbar.css'
// import Link from 'next/link';
// import GoBackButton from '../buttons/GoBackButton';

// function MyNavbar() {

//   useEffect(()=>{
//     const nav = document.querySelector('.nav');

// window.addEventListener('scroll', fixNav);

// function fixNav(){
//   if(window.scrollY > nav.offsetHeight + 150){
//     nav.classList.add('active');
//   }else{
//     nav.classList.remove('active');
//   }
// }

//   },[]);

//   const navigateBack = () => {
//     window.history.back();
//   };
//   return (
//     <>
//     <nav className="nav">
//   <div className="container">
//     {/* <h1 class="logo"><a href="#">My website</a></h1> */}
//     <ul>
//       <li><Link href="/">Home</Link></li>
//       <li><Link href="/methods-explorer">Methods Explorer</Link></li>
//       <li className="dropdown">
//         <Link href="/python">Python</Link>
//         <ul className="dropdown-content">
//             <li><Link href="/python/sequence-slicing">Sequence Slicing</Link></li>
//             <li><Link href="/python/functions">Python Functions</Link></li>
                                          
//          </ul>
//          </li>

//          <li className="dropdown">
//          <Link href="/c-programming">C Programming</Link>
//           <ul className="dropdown-content">
//             <li><Link href="/c-programming/functions">Functions</Link></li>
//             <li><Link href="/c-programming/things-not-to-do">Things Not To Do</Link></li>
                                          
//          </ul>
//          </li>

//          <li className="dropdown">
//          <Link href="/tools">Tools</Link>
//           <ul className="dropdown-content">
//             <li><Link href="/tools/tables/ascii">Ascii Table</Link></li>
            
                                          
//          </ul>
//          </li>
      
      
//       {/* <li><Link href="/tables">Tables</Link></li> */}
//       <li onClick={navigateBack} style={{cursor:'pointer'}}><a>GoBack</a></li>
     
      

//     </ul>
//   </div>
// </nav>

// {/* <div class="hero">
//   <div class="container">
//     <h1>Welcome to our website</h1>
//     <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, repudiandae.</p>
//   </div>
// </div>

// <section class="container content">
//   <h2>content 1</h2>
//   <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque, animi sunt! Libero optio, asperiores quis ipsa eum eveniet labore nihil expedita nostrum laborum dicta at deleniti sapiente atque assumenda quo corrupti exercitationem animi minus nemo vero soluta alias perspiciatis! Aspernatur, laborum consectetur repellat repellendus aliquam sed. Cupiditate accusantium porro at quae, maxime itaque accusamus! Ipsam tempore, illo similique officia neque asperiores eveniet omnis rem veritatis cumque quos amet placeat dignissimos quisquam nesciunt quas. Adipisci perspiciatis veniam, voluptatibus dolores doloremque quisquam qui possimus, vero ab dolorum temporibus soluta libero similique assumenda debitis dolorem ut perferendis incidunt nobis facere eaque. Enim, nemo?</p>
//   <h3>content 2</h3>
//   <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque, animi sunt! Libero optio, asperiores quis ipsa eum eveniet labore nihil expedita nostrum laborum dicta at deleniti sapiente atque assumenda quo corrupti exercitationem animi minus nemo vero soluta alias perspiciatis! Aspernatur, laborum consectetur repellat repellendus aliquam sed. Cupiditate accusantium porro at quae, maxime itaque accusamus! Ipsam tempore, illo similique officia neque asperiores eveniet omnis rem veritatis cumque quos amet placeat dignissimos quisquam nesciunt quas. Adipisci perspiciatis veniam, voluptatibus dolores doloremque quisquam qui possimus, vero ab dolorum temporibus soluta libero similique assumenda debitis dolorem ut perferendis incidunt nobis facere eaque. Enim, nemo?</p>
// </section> */}
//     </>
//   )
// }

// export default MyNavbar
'use client'
import React, { useState, useEffect } from 'react'
import './MyNavbar.css'
import Link from 'next/link'

function MyNavbar() {
  const [isNavActive, setIsNavActive] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsNavActive(true)
      } else {
        setIsNavActive(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigateBack = () => {
    window.history.back()
  }

  return (
    <nav className={`nav ${isNavActive ? 'active' : ''}`}>
      <div className="container">
        <button className="nav-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
        <ul className={isMobileMenuOpen ? 'mobile-open' : ''}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/methods-explorer">Methods Explorer</Link></li>
          <li className="dropdown">
            <Link href="/python">Python</Link>
            <ul className="dropdown-content">
              <li><Link href="/python/sequence-slicing">Sequence Slicing</Link></li>
              <li><Link href="/python/functions">Python Functions</Link></li>
            </ul>
          </li>
          <li className="dropdown">
            <Link href="/c-programming">C Programming</Link>
            <ul className="dropdown-content">
              <li><Link href="/c-programming/functions">Functions</Link></li>
              <li><Link href="/c-programming/things-not-to-do">Things Not To Do</Link></li>
            </ul>
          </li>
          <li className="dropdown">
            <Link href="/tools">Tools</Link>
            <ul className="dropdown-content">
              <li><Link href="/tools/tables/ascii">Ascii Table</Link></li>
              <li><Link href="/tools/tables/html_tags">HTML Tags Table</Link></li>
              <li><Link href="/tools/converters/ascii-converter">Ascii Converter</Link></li>
              <li><Link href="/tools/converters/css-units-converter">CSS Units Converter</Link></li>
              <li><Link href="/tools/coding-tools/url-encoder-decoder">URL Encoder/Decoder</Link></li>
              <li><Link href="/tools/coding-tools/css-minifier">CSS Minifier</Link></li>
              <li><Link href="/tools/coding-tools/html-encoder">HTML Encoder</Link></li>
              <li><Link href="/tools/text/text-analyzer">Text Analyzer</Link></li>
              <li><Link href="/tools/text/case-converter">Case Converter</Link></li>
            </ul>
          </li>
          <li onClick={navigateBack} style={{cursor:'pointer'}}><a>GoBack</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default MyNavbar