import MyNavbar from '@/app/components/nav-bar/MyNavbar'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import React from 'react'
import '../../../pages.css'
import GenericTable from '@/app/components/generic-table/GenericTable'
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'

export default function TablePage({ tableData }) {
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
  const tables = ['ascii', 'other_table1', 'other_table2'] // Add all your table names here

  const paths = tables.map((table) => ({
    params: { table },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const { table } = params
  let tableData

  // Load the appropriate data based on the table parameter
  if (table === 'ascii') {
    tableData = require('../../../../app/api/db/tables/ascii_data.json')
  } else if (table === 'other_table1') {
    // Load data for other_table1
  } else if (table === 'other_table2') {
    // Load data for other_table2
  }

  return {
    props: {
      tableData,
    },
  }
}