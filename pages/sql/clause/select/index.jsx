// import React from 'react'
// import MarkdownComponent from '@/app/components/markdown-component/MarkdownComponent';
// import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2';
// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
// import TableOfContents from '@/app/components/page-components/table-of-contents/TableOfContents';
// import ContentBlocks from '@/app/components/page-components/content-components/ContentBlocks';
// import '../../../pages.css'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
// import SQLCodeWidget from '@/app/components/sql/SQLCodeWidget';
// import { select } from './select';

// export default function SelectPage() {

//     const tocItems = [
//         {
//           title: "Introduction",
//           content: [
//             <MarkdownComponent article={`The SELECT clause in SQL is fundamental for retrieving data from a database. This detailed exploration will cover various use cases to enhance your understanding and skills in crafting efficient SQL queries.`}/>
//           ],
//           link: "#introduction"
//         },
//         {
//           title: "Selecting a Single Column",
//           content: [
//             <SQLCodeWidget data={select[0]} />,
//             <SQLCodeWidget data={select[1]} />,
//             <MarkdownComponent article={`
// This is the simplest form of the SELECT statement, used to retrieve a single column from a database table.
      
// `}/>
//           ],
//           link: "#selecting_a_single_column"
//         },
//         {
//           title: "Selecting a Single Column from Multiple Tables",
//           content: [
//             <SQLCodeWidget data={select[2]} />,
//             <SQLCodeWidget data={select[3]} />,
//             <MarkdownComponent article={`
// Retrieve a single column from multiple tables using a join. This query is essential for integrating data across different tables.

//   `}/>
//           ],
//           link: "#selecting_a_single_column_from_multiple_tables"
//         },
//         {
//           title: "Using DISTINCT to Eliminate Duplicates",
//           content: [
//             <SQLCodeWidget data={select[4]} />,
//             <SQLCodeWidget data={select[5]} />,
//             <MarkdownComponent article={`
// The DISTINCT keyword is used to remove duplicate values from your results, ensuring that each row is unique.

//             `}/>
//           ],
//           link: "#using_distinct_to_eliminate_duplicates"
//         },
//         {
//           title: "Selecting with Aliases",
//           content: [
//             <SQLCodeWidget data={select[6]} />,
//             <SQLCodeWidget data={select[7]} />,
//             <MarkdownComponent article={`
// Aliases allow you to rename a column or table for the duration of the query, making the output easier to read and use.
//             `}/>
//           ],
//           link: "#selecting_with_aliases"
//         },
//         {
//           title: "Selecting Multiple Columns from a Single Table",
//           content: [
//             <SQLCodeWidget data={select[8]} />,
//             <SQLCodeWidget data={select[9]} />,
//             <MarkdownComponent article={`
// Select multiple columns from a single table to retrieve more complex data sets in one query.
//             `}/>
//           ],
//           link: "#selecting_multiple_columns_from_a_single_table"
//         },
//         {
//           title: "Performing Calculations on Columns",
//           content: [
//             <SQLCodeWidget data={select[10]} />,
//             <SQLCodeWidget data={select[11]} />,
//             <MarkdownComponent article={`
// SQL allows for arithmetic operations directly in the SELECT statement, which can be used to calculate new values.
//             `}/>
//           ],
//           link: "#performing_calculations_on_columns"
//         },
//         {
//           title: "Selecting Columns from Multiple Tables",
//           content: [
//             <SQLCodeWidget data={select[12]} />,
//             <SQLCodeWidget data={select[13]} />,
//             <MarkdownComponent article={`
// Combine columns from multiple tables using joins, crucial for queries that integrate data across the database.

//   `}/>
//           ],
//           link: "#selecting_columns_from_multiple_tables"
//         },
//         {
//           title: "Selecting All Columns",
//           content: [
//             <SQLCodeWidget data={select[14]} />,
//             <SQLCodeWidget data={select[15]} />,
//             <MarkdownComponent article={`
// Using the asterisk (*) symbol to select all columns from a table simplifies queries when all data is needed.
//            `}/>
//           ],
//           link: "#selecting_all_columns"
//         },
//         {
//           title: "Concatenating Columns",
//           content: [
//             <SQLCodeWidget data={select[16]} />,
//             <SQLCodeWidget data={select[17]} />,
//             <MarkdownComponent article={`
// Concatenate two or more columns into a single column in the output to combine data elements.
//            `}/>
//           ],
//           link: "#concatenating_columns"
//         },
//         {
//           title: "Using Conditional Logic in Select",
//           content: [
//             <SQLCodeWidget data={select[18]} />,
//             <SQLCodeWidget data={select[19]} />,
//             <MarkdownComponent article={`
// The CASE statement allows for conditional logic within the SELECT clause, useful for creating dynamic results.
//             `}/>
//           ],
//           link: "#using_conditional_logic_in_select"
//         },
//         {
//           title: "Nested Queries in SELECT",
//           content: [
//             <SQLCodeWidget data={select[20]} />,
//             <SQLCodeWidget data={select[21]} />,
//             <MarkdownComponent article={`
// Embed subqueries within the SELECT clause to perform complex calculations or filter data dynamically.
//             `}/>
//           ],
//           link: "#nested_queries_in_select"
//         },
// //         {
// //           title: "Using Pattern Matching with LIKE",
// //           content: [
// //             <SQLCodeWidget data={select[22]} />,
// //             <SQLCodeWidget data={select[23]} />,
// //             <MarkdownComponent article={`
// // LIKE is used to filter rows based on pattern matching in column data, essential for text searches.

// // **Syntax:**
// // \`\`\`sql
// // SELECT * FROM table_name WHERE column_name LIKE '%pattern%';
// // \`\`\`
// // **Example:**
// // \`\`\`sql
// // SELECT * FROM Employees WHERE firstName LIKE 'A%';
// // \`\`\`
// //             `}/>
// //           ],
// //           link: "#using_pattern_matching_with_like"
// //         },
// {
//     title: "Aggregation Functions with GROUP BY",
//     content: [
//         <SQLCodeWidget data={select[22]} />,
//          <SQLCodeWidget data={select[23]} />,
//       <MarkdownComponent article={`
//   Aggregation functions combined with GROUP BY allow you to perform calculations across groups of rows, essential for data summarization and analysis.
//        `}/>
//     ],
//     link: "#aggregation_functions_with_group_by"
//   }

// ,
//         {
//           title: "Conclusion",
//           content: [
//             <MarkdownComponent article={`Mastering the SELECT clause is essential for effective data querying in SQL. This guide provides a comprehensive look at various scenarios to help you understand and apply the SELECT clause effectively in different contexts.`}/>
//           ],
//           link: "#conclusion"
//         }
//       ];
      
      


//   return (
//     <>
//     <MyNavbar2/>
//     <br/>
//     <br/>
//     <br/>
//     <Breadcrumb/>
//     <h1 className='title' style={{marginTop:'-30px',marginBottom:'-30px'}}>Select SQL Clause</h1>
//     <TableOfContents tocItems={tocItems} showNumbers={false}/>
//     <ContentBlocks tocItems={tocItems}/>
//     <ScrollUpButton right='150px'/>
    
    
    
//     </>
//   )
// }
import React from 'react';
import Head from 'next/head';
import MarkdownComponent from '@/app/components/markdown-component/MarkdownComponent';
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import TableOfContents from '@/app/components/page-components/table-of-contents/TableOfContents';
import ContentBlocks from '@/app/components/page-components/content-components/ContentBlocks';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
import SQLCodeWidget from '@/app/components/sql/SQLCodeWidget';
import { renderContent } from '@/utils/renderContent';
import '../../../pages.css';
import '../../../../app/globals.css';

export default function SelectPage({ tocItemsData }) {
  const tocItems = tocItemsData.map(item => ({
    ...item,
    content: renderContent(item.content)
  }));

  return (
    <>
      <Head>
        <title>Select SQL Clause - Learn SQL</title>
        <meta name="description" content="Master the SELECT clause in SQL with comprehensive examples and explanations." />
        <meta name="keywords" content="SQL, SELECT clause, database queries, SQL tutorial" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Select SQL Clause - Learn SQL" />
        <meta property="og:description" content="Master the SELECT clause in SQL with comprehensive examples and explanations." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://webdevdata.net/sql/clause/select" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Select SQL Clause - Learn SQL" />
        <meta name="twitter:description" content="Master the SELECT clause in SQL with comprehensive examples and explanations." />
        <link rel="canonical" href="https://webdevdata.net/sql/clause/select" />
      </Head>
      <MyNavbar2 />
      <br />
      <br />
      <br />
      <Breadcrumb />
      <h1 className='title' style={{marginTop:'-30px',marginBottom:'-30px'}}>Select SQL Clause</h1>
      <TableOfContents tocItems={tocItems} showNumbers={false} />
      <ContentBlocks tocItems={tocItems} />
      <ScrollUpButton right='150px' />
    </>
  );
}

export async function getStaticProps() {
  const { select } = await import('../../../api/sql/_selectData');

  const tocItems = [
    {
      title: "Introduction",
      content: [
        { type: 'markdown', content: `The SELECT clause in SQL is fundamental for retrieving data from a database. This detailed exploration will cover various use cases to enhance your understanding and skills in crafting efficient SQL queries.` }
      ],
      link: "#introduction"
    },
    {
      title: "Selecting a Single Column",
      content: [
        { type: 'sql', data: select[0] },
        { type: 'sql', data: select[1] },
        { type: 'markdown', content: `This is the simplest form of the SELECT statement, used to retrieve a single column from a database table.` }
      ],
      link: "#selecting_a_single_column"
    },
    {
      title: "Selecting a Single Column from Multiple Tables",
      content: [
        { type: 'sql', data: select[2] },
        { type: 'sql', data: select[3] },
        { type: 'markdown', content: `Retrieve a single column from multiple tables using a join. This query is essential for integrating data across different tables.` }
      ],
      link: "#selecting_a_single_column_from_multiple_tables"
    },
    {
      title: "Using DISTINCT to Eliminate Duplicates",
      content: [
        { type: 'sql', data: select[4] },
        { type: 'sql', data: select[5] },
        { type: 'markdown', content: `The DISTINCT keyword is used to remove duplicate values from your results, ensuring that each row is unique.` }
      ],
      link: "#using_distinct_to_eliminate_duplicates"
    },
    {
      title: "Selecting with Aliases",
      content: [
        { type: 'sql', data: select[6] },
        { type: 'sql', data: select[7] },
        { type: 'markdown', content: `Aliases allow you to rename a column or table for the duration of the query, making the output easier to read and use.` }
      ],
      link: "#selecting_with_aliases"
    },
    {
      title: "Selecting Multiple Columns from a Single Table",
      content: [
        { type: 'sql', data: select[8] },
        { type: 'sql', data: select[9] },
        { type: 'markdown', content: `Select multiple columns from a single table to retrieve more complex data sets in one query.` }
      ],
      link: "#selecting_multiple_columns_from_a_single_table"
    },
    {
      title: "Performing Calculations on Columns",
      content: [
        { type: 'sql', data: select[10] },
        { type: 'sql', data: select[11] },
        { type: 'markdown', content: `SQL allows for arithmetic operations directly in the SELECT statement, which can be used to calculate new values.` }
      ],
      link: "#performing_calculations_on_columns"
    },
    {
      title: "Selecting Columns from Multiple Tables",
      content: [
        { type: 'sql', data: select[12] },
        { type: 'sql', data: select[13] },
        { type: 'markdown', content: `Combine columns from multiple tables using joins, crucial for queries that integrate data across the database.` }
      ],
      link: "#selecting_columns_from_multiple_tables"
    },
    {
      title: "Selecting All Columns",
      content: [
        { type: 'sql', data: select[14] },
        { type: 'sql', data: select[15] },
        { type: 'markdown', content: `Using the asterisk (*) symbol to select all columns from a table simplifies queries when all data is needed.` }
      ],
      link: "#selecting_all_columns"
    },
    {
      title: "Concatenating Columns",
      content: [
        { type: 'sql', data: select[16] },
        { type: 'sql', data: select[17] },
        { type: 'markdown', content: `Concatenate two or more columns into a single column in the output to combine data elements.` }
      ],
      link: "#concatenating_columns"
    },
    {
      title: "Using Conditional Logic in Select",
      content: [
        { type: 'sql', data: select[18] },
        { type: 'sql', data: select[19] },
        { type: 'markdown', content: `The CASE statement allows for conditional logic within the SELECT clause, useful for creating dynamic results.` }
      ],
      link: "#using_conditional_logic_in_select"
    },
    {
      title: "Aggregation Functions with GROUP BY",
      content: [
        { type: 'sql', data: select[22] },
        { type: 'sql', data: select[23] },
        { type: 'markdown', content: `Aggregation functions combined with GROUP BY allow you to perform calculations across groups of rows, essential for data summarization and analysis.` }
      ],
      link: "#aggregation_functions_with_group_by"
    },
    {
      title: "Conclusion",
      content: [
        { type: 'markdown', content: `Mastering the SELECT clause is essential for effective data querying in SQL. This guide provides a comprehensive look at various scenarios to help you understand and apply the SELECT clause effectively in different contexts.` }
      ],
      link: "#conclusion"
    }
  ];

  return {
    props: {
      tocItemsData: tocItems,
    },
  };
}