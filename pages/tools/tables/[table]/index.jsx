import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import React from 'react'
import '../../../pages.css'
import GenericTable from '@/app/components/generic-table/GenericTable'
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'

export default function TablePage({ tableData }) {
  if (!tableData) {
    return <div>No data available for this table.</div>
  }

  return (
    <>
      <MyNavbar />
      <br />
      <br />
      <br />
      <Breadcrumb />
      <h1 className='title'>Table</h1>
      <GenericTable data={tableData} />
      <br />
      <ScrollUpButton />
    </>
  )
}

export async function getStaticPaths() {
  // Define the possible values for [table]
  const tables = ['ascii'] // Only include tables you have data for

  const paths = tables.map((table) => ({
    params: { table },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const { table } = params
  let tableData = null // Initialize with null instead of undefined

  // Load the appropriate data based on the table parameter
  if (table === 'ascii') {
    try {
      tableData = require('../../../../app/api/db/tables/ascii_data.json')
    } catch (error) {
      console.error(`Error loading data for ${table} table:`, error)
      // If there's an error loading the data, we'll keep tableData as null
    }
  }
  // Add more conditions here if you have other tables with data
  // For example:
  // else if (table === 'another_table') {
  //   try {
  //     tableData = require('../../../../app/api/db/tables/another_table_data.json')
  //   } catch (error) {
  //     console.error(`Error loading data for ${table} table:`, error)
  //   }
  // }

  // If we don't have data for this table, return notFound
  if (tableData === null) {
    return {
      notFound: true, // This will render the 404 page
    }
  }

  return {
    props: {
      tableData,
    },
  }
}