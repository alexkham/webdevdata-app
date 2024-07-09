import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import React from 'react'
import '../../../pages.css'
import GenericTable from '@/app/components/generic-table/GenericTable'
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import Head from 'next/head'

export default function TablePage({ tableData, tableName }) {
  if (!tableData) {
    return <div>No data available for this table.</div>
  }

  return (
    <>
      <Head>
        <title>{`${tableName} Table `}</title>
        <meta name="description" content={`Detailed information about the ${tableName} table`} />
      </Head>
      <MyNavbar />
      <br />
      <br />
      <br />
      <Breadcrumb />
      <h1 className='title' style={{marginTop:'-30px', marginBottom:'-30px'}}>{`${tableName} Table`}</h1>
      <GenericTable data={tableData} />
      <br />
      <ScrollUpButton />
    </>
  )
}

export async function getStaticPaths() {
  const tables = ['ascii'] // Only include tables you have data for

  const paths = tables.map((table) => ({
    params: { table },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const { table } = params
  let tableData = null

  if (table === 'ascii') {
    try {
      tableData = require('../../../../app/api/db/tables/ascii_data.json')
    } catch (error) {
      console.error(`Error loading data for ${table} table:`, error)
    }
  }
  // Add more conditions here for other tables

  if (tableData === null) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      tableData,
      tableName: table.charAt(0).toUpperCase() + table.slice(1), // Capitalize the table name
    },
  }
}