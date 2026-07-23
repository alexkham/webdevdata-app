import Head from 'next/head'

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About | WebDevData</title>
        <meta
          name="description"
          content="About WebDevData — practical reference guides for SQL, Python and C, plus free developer tools."
        />
      </Head>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <h1>About WebDevData</h1>
        <p>
          WebDevData offers practical reference guides for SQL, Python and C,
          plus a growing collection of free developer tools &mdash; converters,
          minifiers, tables and more.
        </p>
      </div>
    </>
  )
}
