import Footer from "@/app/components/footer/Footer"
import styles from './layout.module.css'
import MyNavbar2 from "@/app/components/nav-bar/MyNavbar2"

export default function Layout({ children }) {
  return (
    <div className={styles.outerContainer}>
        <MyNavbar2></MyNavbar2>
      <div className={styles.contentWrap}>
        <main>{children}</main>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    
      <footer className={styles.footer}>
      <br></br>
        <Footer />
      </footer>
    </div>
  )
}
