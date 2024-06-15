import { Inter } from 'next/font/google'
import './globals.css'
import MyNavbar from './components/nav-bar/MyNavbar'
import ScrollUpButton from './components/scroll-up-button/ScrollUpButton'
import Footer from './components/footer/Footer'
import Breadcrumb from './components/breadcrumb/BreadCrumb'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Developers Playground',
  description: 'Developers Playground',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MyNavbar></MyNavbar>
        {/* <br></br>
        <br></br>
        <br></br>
        <br></br>
        <Breadcrumb></Breadcrumb> */}
        {children}
        <ScrollUpButton className={'nav-button'}></ScrollUpButton>
        <Footer></Footer>
      </body>
     
    </html>
  )
}
