import '@/app/globals.css'
import './pages.css'
import Layout from '@/app/components/layout/Layout'

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
