'use client'
// components/footer/Footer.js
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className={styles.footer}>
      <ul className={styles['footer-nav']}>
        <li>
          <Link href="/disclaimer">Legal Disclaimer</Link>
        </li>
        {/* <li>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </li> */}
      </ul>
      <p className={styles['footer-copy']}>&copy; {year} Webdevdata</p>
    </footer>
  );
};

export default Footer;
