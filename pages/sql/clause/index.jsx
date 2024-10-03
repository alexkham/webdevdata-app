// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
// import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2';
// import ContentBlocks from '@/app/components/page-components/content-components/ContentBlocks';
// import React from 'react'
// import '../../pages.css'
// import TableOfContents from '@/app/components/page-components/table-of-contents/TableOfContents';
// import MarkdownComponent from '@/app/components/markdown-component/MarkdownComponent';
// import { employees,employeesTable,books, culinaryFusions } from '@/app/components/sql/tables';
// import {clauses} from './clauses';
// import SQLCodeWidget from '@/app/components/sql/SQLCodeWidget';
// import { carsTable,clientsTable,clientBillTable } from '@/app/components/sql/carRentTables';
// import '../../../app/globals.css'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';



// export default function SQLClausePage() {
    

//     const tocItems = [
//         {
//           title: "Introduction",
//           content: [
//            <MarkdownComponent article={ `SQL clauses are fundamental components in constructing queries for data manipulation, management, and retrieval in relational databases. Each clause serves a specific purpose in shaping the query's logic, 
//             influencing how data is accessed, filtered, aggregated, and presented. A thorough understanding of these clauses and their interactions is crucial for crafting efficient and precise SQL queries.
//             `}/>
//         ],
//           link: "#introduction"
//         },
//         {
//           title: "SQL Query Structure",
//           content: [
//             <MarkdownComponent article={`
// In SQL, the order in which clauses are written follows a specific structure that ensures the query is syntactically correct and logically coherent:

// 1. [SELECT](#select_clause) – Defines which columns of data will be shown in the results. This is always the first clause in the SQL statement.
// 2. [FROM](#from_clause) – Specifies the source table(s) from which the data will be retrieved.
// 3. [WHERE](#where_clause) – Applies conditions to filter rows before any grouping or aggregation occurs.
// 4. [GROUP BY](#group_by_clause) – Aggregates rows based on specified columns, grouping similar data together.
// 5. [HAVING](#having_clause) – Filters the groups created by the GROUP BY clause. It is used after GROUP BY to apply conditions to the aggregated data.
// 6. [ORDER BY](#order_by_clause) – Sorts the results in either ascending or descending order based on specified columns.
// 7. [LIMIT](#limit_clause) – Restricts the number of rows returned by the query, useful for handling large datasets and improving performance.

    
// `}/>],
//           link: "#query-structure"
//         },
//         {
//           title: "Query Execution Order",
//           content: [
            
//             <MarkdownComponent article={`
// While the SQL query is written following the order outlined above, the database engine processes the query in a different logical sequence to ensure optimal performance. This execution order is determined by the database's need to access and filter data efficiently:

// 1. [FROM](#from_clause) – The query first identifies the tables from which the data will be retrieved.
// 2. [WHERE](#where_clause) – The conditions defined in the WHERE clause are applied to filter the dataset.
// 3. [GROUP BY](#group_by_clause) – The filtered data is then grouped by the specified columns.
// 4. [HAVING](#having_clause) – Conditions are applied to the grouped data to filter the results further.
// 5. [SELECT](#select_clause) – After filtering and grouping, the selected columns are retrieved.
// 6. [ORDER BY](#order_by_clause) – The final results are then sorted as per the ORDER BY clause.
// 7. [LIMIT](#limit_clause) – Finally, the number of rows is limited, based on the LIMIT clause.

// This internal execution order ensures that the database processes the query efficiently, reducing the computational cost and delivering the required results more quickly.         

//           `}/>],
//           link: "#execution-sequence"
//         },
//         {
//           title: "SELECT Clause (Mandatory)",
//           content: [`
//       The SELECT clause specifies which columns should be returned in the query results. It forms the output of the query.`,
//       <SQLCodeWidget theme={'darcula'} data={clauses[0]}/>,
      
//        <MarkdownComponent article={ `      
//   **Use cases**:
// - Retrieving specific columns to optimize query performance
// - Employing functions or expressions to transform data
// - Using with DISTINCT to eliminate duplicate records\n

    
// [Detailed exploration of SELECT clause](/sql/clause/select)
//           `}/>],
//           link: "#select-clause"
//         },
//         {
//           title: "FROM Clause (Mandatory)",
//           content: [`
//       The FROM clause identifies the table or tables from which data is to be retrieved.
      
//       Example:`,
//       <SQLCodeWidget theme={'darcula'} data={clauses[1]} 
//       ></SQLCodeWidget>,

//     <MarkdownComponent article={`      
// **Use cases**:
// - Specifying multiple tables for joins
// - Utilizing subqueries as derived tables
// - Applying table aliases for improved query readability   

//  [More in-depth analysis and use cases of FROM clause](/sql/clause/from)
     
//           `}/>],

//           // [In-depth analysis of FROM clause](#)
//           link: "#from-clause"
//         },
//         {
//           title: "WHERE Clause (Optional)",
//           content: [`
//       The WHERE clause filters records based on specified conditions before any grouping occurs.`,
      
//       <SQLCodeWidget theme={'darcula'} data={clauses[2]}/>,
      
//      <MarkdownComponent article={`
// **Use cases**:
// - Implementing complex filtering with logical operators (AND, OR, NOT)
// - Utilizing comparison operators for data range selection
// - Employing subqueries for dynamic filtering

//           `}/>],

//           // [Comprehensive guide to WHERE clause](#)
//           link: "#where-clause"
//         },
//         {
//           title: "GROUP BY Clause (Optional)",
//           content: [`
//       The GROUP BY clause aggregates rows that share common values in specified columns, essential for summary reporting.`,
//       <SQLCodeWidget theme={'darcula'} data={clauses[3]}/>,
      
     
//     <MarkdownComponent article={` 
// **Use cases**:
// - Creating summary statistics across categories
// - Preparing data for aggregate functions
// - Identifying unique combinations of multiple columns      
    
//           `}/>],
//           // [Detailed examination of GROUP BY clause](#)
//           link: "#group-by-clause"
//         },
//         {
//           title: "HAVING Clause (Optional)",
//           content: [`
//       The HAVING clause filters the results of GROUP BY aggregations, allowing for conditions on grouped data.`,
//         <SQLCodeWidget theme={'darcula'} data={clauses[4]}/>,
      
//      <MarkdownComponent article={`
//   **Use cases**:
// - Filtering aggregated data based on aggregate function results
// - Implementing complex conditions on grouped data
// - Refining summary reports to focus on significant groups     
//           `}/>],
//           // [In-depth analysis of HAVING clause](#)

//           link: "#having-clause"
//         },
//         {
//           title: "ORDER BY Clause (Optional)",
//           content: [`
//       The ORDER BY clause sorts the query results based on specified columns or expressions.`,
//       <SQLCodeWidget theme={'darcula'} data={clauses[5]}/>,
      
//     <MarkdownComponent article={`
//   **Use cases**:
// - Implementing multi-level sorting for complex data presentation
// - Utilizing expressions or functions for custom sorting logic
// - Combining with LIMIT for top-N or bottom-N queries   
      
//           `}/>],

//           // [Comprehensive guide to ORDER BY clause](#)
//           link: "#order-by-clause"
//         },
//         {
//           title: "LIMIT Clause (Optional)",
//           content: [`
//       The LIMIT clause restricts the number of rows returned by the query, crucial for performance optimization and pagination.`,
//       <SQLCodeWidget theme={'darcula'} data={clauses[6]}/>,
      
//      <MarkdownComponent article={`
//    **Use cases**:
//   - Implementing pagination in user interfaces
//   - Optimizing query performance for large datasets
//   - Sampling data for analysis or testing     
//           `}/>],
//           // [Detailed exploration of LIMIT clause](#)
//           link: "#limit-clause"
//         },
//         {
//           title: "Clause Interactions",
//           content: [`
//       The interplay between SQL clauses, such as the relationship between WHERE and SELECT, or GROUP BY and HAVING, demonstrates the nuanced complexity of SQL query construction. Understanding these interactions is key to mastering advanced query design and optimization techniques.
//           `],
//           link: "#clause-interactions"
//         },
//         {
//           title: "Conclusion",
//           content: [`
//       Proficiency in SQL clauses is essential for effective data management, analysis, and retrieval in relational databases. Each clause contributes to the power and flexibility of SQL as a data manipulation language. For comprehensive discussions on individual clauses, including advanced examples and best practices, refer to the detailed pages linked throughout this overview.
//           `],
//           link: "#conclusion"
//         }
//       ];
    

//   return (
//     <>
//     <MyNavbar2></MyNavbar2>
//     <br/>
//     <br/>
//     <br/>
//     <Breadcrumb/>
//     <h1 className='title' style={{marginTop:'-40px'}}>SQL Clauses</h1>
//     <TableOfContents tocItems={tocItems}  showNumbers={false} ></TableOfContents>
//     <ContentBlocks tocItems={tocItems}></ContentBlocks>
//     <ScrollUpButton right='150px'/>
    
//     </>
//   )
// }
import React from 'react';
import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2';
import ContentBlocks from '@/app/components/page-components/content-components/ContentBlocks';
import TableOfContents from '@/app/components/page-components/table-of-contents/TableOfContents';
import MarkdownComponent from '@/app/components/markdown-component/MarkdownComponent';
import SQLCodeWidget from '@/app/components/sql/SQLCodeWidget';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
import { renderContent } from '@/utils/renderContent';
import '../../pages.css';
import '../../../app/globals.css';

export default function SQLClausePage({ tocItemsData }) {
  const tocItems = tocItemsData.map(item => ({
    ...item,
    content: renderContent(item.content)
  }));

  return (
    <>
      <Head>
        <title>SQL Clauses - Comprehensive Guide</title>
        <meta name="description" content="Explore SQL clauses: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, and LIMIT. Learn their uses and interactions in database queries." />
        <meta name="keywords" content="SQL, database, clauses, SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="SQL Clauses - Comprehensive Guide" />
        <meta property="og:description" content="Explore SQL clauses: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, and LIMIT. Learn their uses and interactions in database queries." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://webdevdata.net/sql/clauses" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="SQL Clauses - Comprehensive Guide" />
        <meta name="twitter:description" content="Explore SQL clauses: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, and LIMIT. Learn their uses and interactions in database queries." />
        <link rel="canonical" href="https://webdevdata.net/sql/clauses" />
      </Head>
      <MyNavbar2 />
      <br />
      <br />
      <br />
      <Breadcrumb />
      <h1 className='title' style={{marginTop:'-40px'}}>SQL Clauses</h1>
      <TableOfContents tocItems={tocItems} showNumbers={false} />
      <ContentBlocks tocItems={tocItems} />
      <ScrollUpButton right='150px' />
    </>
  );
}

export async function getStaticProps() {
  const { clauses } = await import('./clauses');

  const tocItems = [
    {
      title: "Introduction",
      content: [
        { type: 'markdown', content: `SQL clauses are fundamental components in constructing queries for data manipulation, management, and retrieval in relational databases. Each clause serves a specific purpose in shaping the query's logic, influencing how data is accessed, filtered, aggregated, and presented. A thorough understanding of these clauses and their interactions is crucial for crafting efficient and precise SQL queries.` }
      ],
      link: "#introduction"
    },
    {
      title: "SQL Query Structure",
      content: [
        { type: 'markdown', content: `
In SQL, the order in which clauses are written follows a specific structure that ensures the query is syntactically correct and logically coherent:

1. [SELECT](#select_clause) – Defines which columns of data will be shown in the results. This is always the first clause in the SQL statement.
2. [FROM](#from_clause) – Specifies the source table(s) from which the data will be retrieved.
3. [WHERE](#where_clause) – Applies conditions to filter rows before any grouping or aggregation occurs.
4. [GROUP BY](#group_by_clause) – Aggregates rows based on specified columns, grouping similar data together.
5. [HAVING](#having_clause) – Filters the groups created by the GROUP BY clause. It is used after GROUP BY to apply conditions to the aggregated data.
6. [ORDER BY](#order_by_clause) – Sorts the results in either ascending or descending order based on specified columns.
7. [LIMIT](#limit_clause) – Restricts the number of rows returned by the query, useful for handling large datasets and improving performance.
        ` }
      ],
      link: "#query-structure"
    },
    {
      title: "Query Execution Order",
      content: [
        { type: 'markdown', content: `
While the SQL query is written following the order outlined above, the database engine processes the query in a different logical sequence to ensure optimal performance. This execution order is determined by the database's need to access and filter data efficiently:

1. [FROM](#from_clause) – The query first identifies the tables from which the data will be retrieved.
2. [WHERE](#where_clause) – The conditions defined in the WHERE clause are applied to filter the dataset.
3. [GROUP BY](#group_by_clause) – The filtered data is then grouped by the specified columns.
4. [HAVING](#having_clause) – Conditions are applied to the grouped data to filter the results further.
5. [SELECT](#select_clause) – After filtering and grouping, the selected columns are retrieved.
6. [ORDER BY](#order_by_clause) – The final results are then sorted as per the ORDER BY clause.
7. [LIMIT](#limit_clause) – Finally, the number of rows is limited, based on the LIMIT clause.

This internal execution order ensures that the database processes the query efficiently, reducing the computational cost and delivering the required results more quickly.         
        ` }
      ],
      link: "#execution-sequence"
    },
    {
      title: "SELECT Clause (Mandatory)",
      content: [
        { type: 'markdown', content: `The SELECT clause specifies which columns should be returned in the query results. It forms the output of the query.` },
        { type: 'sql', data: clauses[0] },
        { type: 'markdown', content: `      
**Use cases**:
- Retrieving specific columns to optimize query performance
- Employing functions or expressions to transform data
- Using with DISTINCT to eliminate duplicate records

[Detailed exploration of SELECT clause](/sql/clause/select)
        ` }
      ],
      link: "#select-clause"
    },
    {
      title: "FROM Clause (Mandatory)",
      content: [
        { type: 'markdown', content: `The FROM clause identifies the table or tables from which data is to be retrieved.` },
        { type: 'sql', data: clauses[1] },
        { type: 'markdown', content: `      
**Use cases**:
- Specifying multiple tables for joins
- Utilizing subqueries as derived tables
- Applying table aliases for improved query readability   

[More in-depth analysis and use cases of FROM clause](/sql/clause/from)
        ` }
      ],
      link: "#from-clause"
    },
    {
      title: "WHERE Clause (Optional)",
      content: [
        { type: 'markdown', content: `The WHERE clause filters records based on specified conditions before any grouping occurs.` },
        { type: 'sql', data: clauses[2] },
        { type: 'markdown', content: `
**Use cases**:
- Implementing complex filtering with logical operators (AND, OR, NOT)
- Utilizing comparison operators for data range selection
- Employing subqueries for dynamic filtering
        ` }
      ],
      link: "#where-clause"
    },
    {
      title: "GROUP BY Clause (Optional)",
      content: [
        { type: 'markdown', content: `The GROUP BY clause aggregates rows that share common values in specified columns, essential for summary reporting.` },
        { type: 'sql', data: clauses[3] },
        { type: 'markdown', content: ` 
**Use cases**:
- Creating summary statistics across categories
- Preparing data for aggregate functions
- Identifying unique combinations of multiple columns      
        ` }
      ],
      link: "#group-by-clause"
    },
    {
      title: "HAVING Clause (Optional)",
      content: [
        { type: 'markdown', content: `The HAVING clause filters the results of GROUP BY aggregations, allowing for conditions on grouped data.` },
        { type: 'sql', data: clauses[4] },
        { type: 'markdown', content: `
**Use cases**:
- Filtering aggregated data based on aggregate function results
- Implementing complex conditions on grouped data
- Refining summary reports to focus on significant groups     
        ` }
      ],
      link: "#having-clause"
    },
    {
      title: "ORDER BY Clause (Optional)",
      content: [
        { type: 'markdown', content: `The ORDER BY clause sorts the query results based on specified columns or expressions.` },
        { type: 'sql', data: clauses[5] },
        { type: 'markdown', content: `
**Use cases**:
- Implementing multi-level sorting for complex data presentation
- Utilizing expressions or functions for custom sorting logic
- Combining with LIMIT for top-N or bottom-N queries   
        ` }
      ],
      link: "#order-by-clause"
    },
    {
      title: "LIMIT Clause (Optional)",
      content: [
        { type: 'markdown', content: `The LIMIT clause restricts the number of rows returned by the query, crucial for performance optimization and pagination.` },
        { type: 'sql', data: clauses[6] },
        { type: 'markdown', content: `
**Use cases**:
- Implementing pagination in user interfaces
- Optimizing query performance for large datasets
- Sampling data for analysis or testing     
        ` }
      ],
      link: "#limit-clause"
    },
    {
      title: "Clause Interactions",
      content: [
        { type: 'markdown', content: `The interplay between SQL clauses, such as the relationship between WHERE and SELECT, or GROUP BY and HAVING, demonstrates the nuanced complexity of SQL query construction. Understanding these interactions is key to mastering advanced query design and optimization techniques.` }
      ],
      link: "#clause-interactions"
    },
    {
      title: "Conclusion",
      content: [
        { type: 'markdown', content: `Proficiency in SQL clauses is essential for effective data management, analysis, and retrieval in relational databases. Each clause contributes to the power and flexibility of SQL as a data manipulation language. For comprehensive discussions on individual clauses, including advanced examples and best practices, refer to the detailed pages linked throughout this overview.` }
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