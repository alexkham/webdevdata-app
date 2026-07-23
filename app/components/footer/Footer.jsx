import Link from 'next/link';
import navItems from '@/data/navigation';

const styles = {
  footer: {
    background: '#1e293b',
    padding: '56px 24px 28px',
    color: '#cbd5e1',
    marginTop: '64px',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '40px',
  },
  brandBlock: {
    minWidth: '220px',
  },
  brandWordmark: {
    color: 'white',
    fontSize: '22px',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    margin: '0 0 12px',
  },
  meta: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: 1.6,
    maxWidth: '40ch',
    margin: 0,
  },
  colHeading: {
    color: '#94a3b8',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    margin: '0 0 14px',
    fontWeight: 600,
  },
  colLink: {
    display: 'block',
    color: '#cbd5e1',
    fontSize: '14px',
    padding: '4px 0',
    textDecoration: 'none',
  },
  bottom: {
    maxWidth: '1200px',
    margin: '40px auto 0',
    paddingTop: '22px',
    borderTop: '1px solid #334155',
    textAlign: 'center',
    fontSize: '13px',
    color: '#94a3b8',
  },
};

// "Explore" comes straight from data/navigation.js (auto-generated on each build),
// so new top-level sections show up here without touching this file.
const FOOTER_COLUMNS = [
  {
    heading: 'Explore',
    links: navItems,
  },
  {
    heading: 'Site',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Sitemap', href: '/sitemap.xml' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Legal Disclaimer', href: '/disclaimer' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms and Conditions', href: '/terms-and-conditions' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.brandBlock}>
          <div style={styles.brandWordmark}>WebDevData</div>
          <p style={styles.meta}>
            Practical reference guides for SQL, Python and C, plus a growing
            collection of free developer tools &mdash; converters, minifiers,
            tables and more.
          </p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <h6 style={styles.colHeading}>{col.heading}</h6>
            {col.links.map((link) => (
              <Link key={link.href} href={link.href} style={styles.colLink}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div style={styles.bottom}>
        &copy; {year} webdevdata.net. All rights reserved.
      </div>
    </footer>
  );
}
