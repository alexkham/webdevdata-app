// 'use client'
// import React, { useState, useEffect } from 'react'
// import Link from 'next/link'
// import './MyNavbar2.css'

// function MyNavbar2() {
//   const [isNavActive, setIsNavActive] = useState(false)
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
//   const [activeMegaMenu, setActiveMegaMenu] = useState(null)

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsNavActive(window.scrollY > 150)
//     }

//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   const toggleMegaMenu = (menuName) => {
//     if (window.innerWidth > 768) {
//       setActiveMegaMenu(activeMegaMenu === menuName ? null : menuName)
//     }
//   }

//   const closeMobileMenu = () => {
//     setIsMobileMenuOpen(false)
//     setActiveMegaMenu(null)
//   }

//   const navigateBack = () => {
//     window.history.back()
//   }

//   return (
//     <nav className={`navbar ${isNavActive ? 'active' : ''}`}>
//       <div className="navbar-container">
//         <button className="navbar-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
//           {isMobileMenuOpen ? '✕' : '☰'}
//         </button>
//         <ul className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
//           <li><Link href="/" onClick={closeMobileMenu}>Home</Link></li>
//           <li><Link href="/methods-explorer" onClick={closeMobileMenu}>Methods Explorer</Link></li>
//           <li className="megamenu-item" 
//               onMouseEnter={() => toggleMegaMenu('python')} 
//               onMouseLeave={() => toggleMegaMenu(null)}>
//             <span>Python</span>
//             <div className={`megamenu ${activeMegaMenu === 'python' ? 'active' : ''}`}>
//               <div className="megamenu-content">
//                 <div className="megamenu-column">
//                   <h3>Python Basics</h3>
//                   <ul>
//                     <li><Link href="/python/sequence-slicing" onClick={closeMobileMenu}>Sequence Slicing</Link></li>
//                     <li><Link href="/python/functions" onClick={closeMobileMenu}>Python Functions</Link></li>
//                   </ul>
//                 </div>
//                 {/* Add more columns as needed */}
//               </div>
//             </div>
//           </li>
//           <li className="megamenu-item"
//               onMouseEnter={() => toggleMegaMenu('tools')}
//               onMouseLeave={() => toggleMegaMenu(null)}>
//             <span>Tools</span>
//             <div className={`megamenu ${activeMegaMenu === 'tools' ? 'active' : ''}`}>
//               <div className="megamenu-content">
//                 <div className="megamenu-column">
//                   <h3>Coding Tools</h3>
//                   <ul>
//                     <li><Link href="/tools/coding-tools/url-encoder-decoder" onClick={closeMobileMenu}>URL Encoder/Decoder</Link></li>
//                     <li><Link href="/tools/coding-tools/css-minifier" onClick={closeMobileMenu}>CSS Minifier</Link></li>
//                     <li><Link href="/tools/coding-tools/javascript-minifier" onClick={closeMobileMenu}>Javascript Minifier</Link></li>
//                     <li><Link href="/tools/coding-tools/html-encoder" onClick={closeMobileMenu}>HTML Encoder</Link></li>
//                   </ul>
//                 </div>
//                 <div className="megamenu-column">
//                   <h3>Text Processing</h3>
//                   <ul>
//                     <li><Link href="/tools/text/text-analyzer" onClick={closeMobileMenu}>Text Analyzer</Link></li>
//                     <li><Link href="/tools/text/case-converter" onClick={closeMobileMenu}>Case Converter</Link></li>
//                   </ul>
//                 </div>
//                 <div className="megamenu-column">
//                   <h3>Converters</h3>
//                   <ul>
//                     <li><Link href="/tools/converters/ascii-converter" onClick={closeMobileMenu}>ASCII Converter</Link></li>
//                     <li><Link href="/tools/converters/css-units-converter" onClick={closeMobileMenu}>CSS Units Converter</Link></li>
//                   </ul>
//                 </div>
//                 <div className="megamenu-column">
//                   <h3>Tables</h3>
//                   <ul>
//                     <li><Link href="/tools/tables/ascii" onClick={closeMobileMenu}>ASCII Table</Link></li>
//                     <li><Link href="/tools/tables/html_tags" onClick={closeMobileMenu}>HTML Tags Table</Link></li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </li>
//           <li onClick={navigateBack} style={{cursor:'pointer'}}><a>Go Back</a></li>
//         </ul>
//       </div>
//     </nav>
//   )
// }

// export default MyNavbar2
'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import './MyNavbar2.css'
import SearchBar from './SearchBar'
import SearchBar2 from './SearchBar2'

function MyNavbar2() {
  const [isNavActive, setIsNavActive] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsNavActive(window.scrollY > 150)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMouseEnter = (menuName) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMegaMenu(menuName)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null)
    }, 300) // 300ms delay before closing
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setActiveMegaMenu(null)
  }

  const navigateBack = () => {
    window.history.back()
  }

  return (
    <nav className={`navbar ${isNavActive ? 'active' : ''}`}>
      <div className="navbar-container">
        <button className="navbar-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
        <ul className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li className='navbar-item'><Link href="/" onClick={closeMobileMenu}>Home</Link></li>
          <li className='navbar-item'><Link href="/methods-explorer" onClick={closeMobileMenu}>Methods Explorer</Link></li>
          <li className="megamenu-item" 
              onMouseEnter={() => handleMouseEnter('python')} 
              onMouseLeave={handleMouseLeave}>
            <Link href={'/python'}>
            <span className='navbar-item'>Python</span>
            </Link>
            <div className={`megamenu ${activeMegaMenu === 'python' ? 'active' : ''}`}>
              <div className="megamenu-content">
                <div className="megamenu-column">
                  
                  <ul>
                    <li><Link href="/python/sequence-slicing" onClick={closeMobileMenu}>Sequence Slicing</Link></li>
                    <li><Link href="/python/functions" onClick={closeMobileMenu}>Python Functions</Link></li>
                    {/* Add more Python-related links */}
                  </ul>
                </div>
                {/* Add more columns as needed */}
              </div>
            </div>
          </li>
          <li className="megamenu-item" 
              onMouseEnter={() => handleMouseEnter('c programming')} 
              onMouseLeave={handleMouseLeave}>
            <Link  href={'/c-programming'}>
            <span className='navbar-item'>C Programming</span>
            </Link>
            <div className={`megamenu ${activeMegaMenu === 'c programming' ? 'active' : ''}`}>
              <div className="megamenu-content">
                <div className="megamenu-column">
                 
                  <ul>
                    <li><Link href="/c-programming/things-not-to-do" onClick={closeMobileMenu}>Things Not To Do </Link></li>
                    <li><Link href="/c-programming/functions" onClick={closeMobileMenu}>C Standard Library Functions</Link></li>
                    <li><Link href="/c-programming/examples" onClick={closeMobileMenu}>Code Examples</Link></li>
                   
                  </ul>
                </div>
                {/* Add more columns as needed */}
              </div>
            </div>
          </li>
          <li className="megamenu-item"
              onMouseEnter={() => handleMouseEnter('tools')}
              onMouseLeave={handleMouseLeave}>
            <Link  href={'/tools'}>
            <span className='navbar-item'>Tools</span>
            </Link>
            <div className={`megamenu ${activeMegaMenu === 'tools' ? 'active' : ''}`}>
              <div className="megamenu-content">
                <div className="megamenu-column">
                    <Link href={'/tools/coding-tools'}>
                  <h3>Coding Tools</h3>
                  </Link>
                  <ul>
                    <li><Link href="/tools/coding-tools/url-encoder-decoder" onClick={closeMobileMenu}>URL Encoder/Decoder</Link></li>
                    <li><Link href="/tools/coding-tools/html-encoder" onClick={closeMobileMenu}>HTML Encoder</Link></li>
                    <li><Link href="/tools/coding-tools/css-minifier" onClick={closeMobileMenu}>CSS Minifier</Link></li>
                    <li><Link href="/tools/coding-tools/javascript-minifier" onClick={closeMobileMenu}>Javascript Minifier</Link></li>
                    <li><Link href="/tools/coding-tools/html-minifier" onClick={closeMobileMenu}>HTML Minifier</Link></li>
                    <li><Link href="/tools/coding-tools/json-tree" onClick={closeMobileMenu}>JSON Tree Viewer</Link></li>
                    
                  </ul>
                </div>
                <div className="megamenu-column">
                    <Link href={'/tools/text'}>
                  <h3>Text Processing</h3>
                  </Link>
                  <ul>
                    <li><Link href="/tools/text/text-analyzer" onClick={closeMobileMenu}>Text Analyzer</Link></li>
                    <li><Link href="/tools/text/case-converter" onClick={closeMobileMenu}>Case Converter</Link></li>
                    <li><Link href="/tools/text/markdown-editor" onClick={closeMobileMenu}>Markdown Editor</Link></li>
                  </ul>
                </div>
                <div className="megamenu-column">
                    <Link  href={'/tools/converters'}>
                  <h3>Converters</h3>
                  </Link>
                  <ul>
                    <li><Link href="/tools/converters/ascii-converter" onClick={closeMobileMenu}>ASCII Converter</Link></li>
                    <li><Link href="/tools/converters/css-units-converter" onClick={closeMobileMenu}>CSS Units Converter</Link></li>
                    <li><Link href="/tools/converters/html-entities" onClick={closeMobileMenu}>HTML Entities Converter</Link></li>
                    <li><Link href="/tools/converters/json-xml" onClick={closeMobileMenu}>JSON to XML Converter</Link></li>
                    <li><Link href="/tools/converters/yaml-json" onClick={closeMobileMenu}>YAML to JSON Converter</Link></li>
                  </ul>
                </div>
                <div className="megamenu-column">
                    <Link href={'/tools/tables'}>
                  <h3>Tables</h3>
                  </Link>
                  <ul>
                    <li><Link href="/tools/tables/ascii" onClick={closeMobileMenu}>ASCII Table</Link></li>
                    <li><Link href="/tools/tables/html_tags" onClick={closeMobileMenu}>HTML Tags Table</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li onClick={navigateBack} style={{cursor:'pointer'}} className='navbar-item'><a>Go Back</a></li>
          
          {/* <li><SearchBar width='200px'></SearchBar></li>  */}
          {/* <li><SearchBar2></SearchBar2></li> */}
          <li>
            <div style={{ position: 'relative' ,marginLeft:'100px'}} className='search-block'>
              <SearchBar2 width='200px' />
            </div>
          </li>
        </ul>
        {/* <div className="navbar-search">
      <SearchBar width='200px' />
    </div> */}
      </div>
     
    </nav>
  )
}

export default MyNavbar2