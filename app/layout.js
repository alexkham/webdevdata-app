import { Inter } from 'next/font/google'
import './globals.css'
import MyNavbar from './components/nav-bar/MyNavbar'
import ScrollUpButton from './components/scroll-up-button/ScrollUpButton'

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
        {children}
        <ScrollUpButton className={'nav-button'}></ScrollUpButton>
      </body>
    </html>
  )
}
