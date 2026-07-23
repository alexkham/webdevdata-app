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
import navItems from '@/data/navigation'

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

  // Purely visual: initials shown in the megamenu symbol chip.
  const symbolFor = (label) => {
    const words = label.split(' ').filter(Boolean)
    return words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : label.slice(0, 2)
  }

  return (
    <nav className={`navbar ${isNavActive ? 'active' : ''}`}>
      <div className="navbar-container">
        <Link href="/" className="brand" onClick={closeMobileMenu}>
          <span className="brand-mark">W</span>
          <span className="brand-name">WebDevData</span>
        </Link>
        {/* <li className='navbar-item'><Link href="/methods-explorer" onClick={closeMobileMenu}>Javascript Methods</Link></li> */}
        <ul className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => {
            if (!item.children?.length) {
              return (
                <li key={item.href}>
                  <Link href={item.href} className="nav-item">
                    {item.label}
                  </Link>
                </li>
              )
            }

            return (
              <li key={item.href} className="megamenu-item"
                  onMouseEnter={() => handleMouseEnter(item.href)}
                  onMouseLeave={handleMouseLeave}>
                <Link href={item.href}
                      className={`nav-item ${activeMegaMenu === item.href ? 'open' : ''}`}>
                  {item.label}
                  <span className="chev" aria-hidden="true">&#9662;</span>
                </Link>
                <div className={`megamenu ${activeMegaMenu === item.href ? 'active' : ''}`}>
                  <div className="mm-blurb">
                    <div className="mm-blurb-tag">{item.label}</div>
                    <h3 className="mm-blurb-title">Guides, references and tools</h3>
                    <p className="mm-blurb-lede">Everything in the {item.label} section, organized by topic.</p>
                    <Link href={item.href} className="mm-blurb-cta" onClick={closeMobileMenu}>
                      Browse all &rarr;
                    </Link>
                  </div>
                  <div className="mm-ops">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="mm-op" onClick={closeMobileMenu}>
                        <span className="mm-sym">{symbolFor(child.label)}</span>
                        <span className="mm-op-body">
                          <span className="mm-op-name">{child.label}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            )
          })}
          <li onClick={navigateBack} style={{cursor:'pointer'}}><a className="nav-item">Go Back</a></li>

          {/* <li><SearchBar width='200px'></SearchBar></li>  */}
          {/* <li><SearchBar2></SearchBar2></li> */}
          <li className="search-li">
            <div className='search-block'>
              <SearchBar2 width='240px' />
            </div>
          </li>
        </ul>
        <button className="navbar-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}>
          {isMobileMenuOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="5" x2="19" y2="19"></line>
              <line x1="19" y1="5" x2="5" y2="19"></line>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" y1="7" x2="21" y2="7"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="17" x2="21" y2="17"></line>
            </svg>
          )}
        </button>
        {/* <div className="navbar-search">
      <SearchBar width='200px' />
    </div> */}
      </div>

    </nav>
  )
}

export default MyNavbar2