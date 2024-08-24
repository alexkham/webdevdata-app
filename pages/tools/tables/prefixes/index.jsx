// // import React from 'react'
// // import prefixes from '../../../../app/api/db/tables/prefixes.json'
// // import TableWrapper from '../../../../app/components/generic-table/TableWrapper.jsx'
// // import GenericTable2 from '@/app/components/generic-table/GenericTable2'
// // import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
// // import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// // import '../../../pages.css'
// // import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'

// // export default function PrexixesTablePage() {
// //   return (
// //     <>
// //     <MyNavbar2></MyNavbar2>
// //     <br></br>
// //     <br></br>
    
// //     <Breadcrumb></Breadcrumb>
// //     <br></br>
// //     <h1 className='title' style={{marginTop:'-30px',marginBottom:'-30px'}}>Metric Prefices</h1>
// //      <TableWrapper initialData={prefixes} TableComponent={GenericTable2} ></TableWrapper>
    
    
// //     <ScrollUpButton></ScrollUpButton>
// //     </>
    
// //   )
// // }
// import React from 'react'
// import TableWrapper from '@/app/components/generic-table/TableWrapper'
// import GenericTable2 from '@/app/components/generic-table/GenericTable2'
// import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// import Head from 'next/head'
// import '../../../pages.css'

// export default function PrefixesTablePage({ prefixes }) {
//   return (
//     <>
//       <Head>
//         <title>Metric Prefixes Table</title>
//         <meta name="description" content="Comprehensive table of metric prefixes including their symbols and multiplying factors." />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="canonical" href="https:/webdevdata.net/tables/prefixes" />
//       </Head>
//       <MyNavbar2 />
//       <br />
//       <br />
//       <Breadcrumb />
//       <br />
//       <h1 className='title' style={{marginTop:'-30px',marginBottom:'-30px'}}>Metric Prefixes</h1>
//       <TableWrapper initialData={prefixes} TableComponent={GenericTable2} />
//       <ScrollUpButton />
//     </>
//   )
// }

// export async function getStaticProps() {
//   const prefixes = {
//     "tableTitle": "Metric Prefixes",
//     "rows": [
//       {"Name": "quetta", "Symbol": "Q", "Multiplying factor": "10³⁰"},
//       {"Name": "ronna", "Symbol": "R", "Multiplying factor": "10²⁷"},
//       {"Name": "yotta", "Symbol": "Y", "Multiplying factor": "10²⁴"},
//       {"Name": "zetta", "Symbol": "Z", "Multiplying factor": "10²¹"},
//       {"Name": "exa", "Symbol": "E", "Multiplying factor": "10¹⁸"},
//       {"Name": "peta", "Symbol": "P", "Multiplying factor": "10¹⁵"},
//       {"Name": "tera", "Symbol": "T", "Multiplying factor": "10¹²"},
//       {"Name": "giga", "Symbol": "G", "Multiplying factor": "10⁹"},
//       {"Name": "mega", "Symbol": "M", "Multiplying factor": "10⁶"},
//       {"Name": "kilo", "Symbol": "k", "Multiplying factor": "10³"},
//       {"Name": "hecto", "Symbol": "h", "Multiplying factor": "10²"},
//       {"Name": "deca", "Symbol": "da", "Multiplying factor": "10"},
//       {"Name": "deci", "Symbol": "d", "Multiplying factor": "10⁻¹"},
//       {"Name": "centi", "Symbol": "c", "Multiplying factor": "10⁻²"},
//       {"Name": "milli", "Symbol": "m", "Multiplying factor": "10⁻³"},
//       {"Name": "micro", "Symbol": "µ", "Multiplying factor": "10⁻⁶"},
//       {"Name": "nano", "Symbol": "n", "Multiplying factor": "10⁻⁹"},
//       {"Name": "pico", "Symbol": "p", "Multiplying factor": "10⁻¹²"},
//       {"Name": "femto", "Symbol": "f", "Multiplying factor": "10⁻¹⁵"},
//       {"Name": "atto", "Symbol": "a", "Multiplying factor": "10⁻¹⁸"},
//       {"Name": "zepto", "Symbol": "z", "Multiplying factor": "10⁻²¹"},
//       {"Name": "yocto", "Symbol": "y", "Multiplying factor": "10⁻²⁴"},
//       {"Name": "ronto", "Symbol": "r", "Multiplying factor": "10⁻²⁷"},
//       {"Name": "quecto", "Symbol": "q", "Multiplying factor": "10⁻³⁰"}
//     ]
//   };

//   return {
//     props: {
//       prefixes
//     },
//   }
// }
import React from 'react'
import TableWrapper from '@/app/components/generic-table/TableWrapper'
import GenericTable2 from '@/app/components/generic-table/GenericTable2'
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import Head from 'next/head'
import '../../../pages.css'
import prefixes from '../../../../app/api/db/tables/prefixes.json'

export default function PrefixesTablePage({ prefixes }) {
  return (
    <>
      <Head>
        <title>Metric Prefixes Table</title>
        <meta name="description" content="Comprehensive table of metric prefixes including their symbols and multiplying factors." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https:/webdevdata.net/tables/prefixes" />
      </Head>
      <MyNavbar2 />
      <br />
      <br />
      <Breadcrumb />
      <br />
      <h1 className='title' style={{marginTop:'-30px',marginBottom:'-30px'}}>Metric Prefixes</h1>
      <TableWrapper initialData={prefixes} TableComponent={GenericTable2} />
      <ScrollUpButton />
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      prefixes
    },
  }
}