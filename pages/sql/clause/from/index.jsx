// import React from 'react'
// import TableOfContents from '@/app/components/page-components/table-of-contents/TableOfContents'
// import ContentBlocks from '@/app/components/page-components/content-components/ContentBlocks'
// import MarkdownComponent from '@/app/components/markdown-component/MarkdownComponent'
// import SQLCodeWidget from '@/app/components/sql/SQLCodeWidget'
// import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// import '../../../pages.css'
// import { from } from './from'
// import '../../../../app/globals.css'


// export default function FromPage() {
  

//     const tocItems = [
//         {
//           title: "Introduction",
//           content: [
//             <MarkdownComponent article={`
//  The FROM clause, alongside the [SELECT](/sql/clause/select), forms the backbone of SQL queries, being one of only two mandatory clauses required to execute a basic SQL statement. This clause is crucial for specifying the source table or tables from which data is retrieved, serving as the starting point for data manipulation and retrieval in the SQL environment.

// The FROM clause is fundamental in defining the context of the data being queried. It not only dictates the table(s) involved in the transaction but also sets the stage for how these tables interact with other SQL clauses and keywords. For example, it enables the structuring of joins, which are vital for combining rows from two or more tables based on related columns between them. This interaction is pivotal when performing more complex queries that require data consolidation from multiple sources.

// Moreover, the FROM clause works in tandem with other SQL clauses like WHERE, GROUP BY, and HAVING, which filter and aggregate data based on specified conditions. It acts as the foundation upon which these clauses build to refine the dataset returned by a query. For instance, the WHERE clause applies conditions to the rows selected from the tables specified in the FROM clause, effectively narrowing the data based on specific criteria before any grouping or aggregation occurs.

// Additionally, the FROM clause is instrumental in implementing SQL’s powerful features like subqueries and nested queries, which allow for advanced data manipulation within a single query expression. These elements show the versatile nature of the FROM clause in facilitating complex data retrieval and manipulation strategies, highlighting its central role in SQL query construction.

// Understanding the FROM clause’s operation and its interplay with other SQL components is essential for anyone looking to master SQL. This knowledge forms the basis for crafting efficient and effective queries that leverage the full potential of relational databases.
//                 `}/>
//           ],
//           link: "#introduction"
//         },
//         {
//           title: "Selecting From a Single Table",
//           content: [
//             <SQLCodeWidget data={from[0]}/>,
//             <MarkdownComponent article={`
// This is the most basic form of the FROM clause, used to specify the source table from which data is retrieved.
//             `}/>,
//             <SQLCodeWidget data={from[1]}/>
//           ],
//           link: "#selecting_from_a_single_table"
//         },
//         {
//           title: "Selecting From Multiple Tables",
//           content: [
//             `Combining data from multiple tables using simple joins is a foundational skill in SQL.`,
//              <SQLCodeWidget data={from[2]}/>,
//              <SQLCodeWidget data={from[3]}/>,

//             <MarkdownComponent article={`

// This example demonstrates a simple join (also known as a Cartesian join) between two tables.
//             `}/>
//           ],
//           link: "#selecting_from_multiple_tables"
//         },
//         {
//           title: "Using Aliases in FROM",
//           content: [
//             `Aliases are used to simplify table names and qualify columns with table names.`,
//             <SQLCodeWidget data={from[4]}/>,
//             <SQLCodeWidget data={from[5]}/>,
//             <MarkdownComponent article={`
// Aliasing is particularly useful in queries involving multiple tables to make SQL statements more readable.
//             `}/>
//           ],
//           link: "#using_aliases_in_from"
//         },
//         {
//           title: "Inner Joins",
//           content: [
//             `Inner joins retrieve rows that have matching values in both tables.`,

//             <SQLCodeWidget data={from[6]}/>,
//             <SQLCodeWidget data={from[7]}/>,
//             <MarkdownComponent article={`

//             `}/>
//           ],
//           link: "#inner_joins"
//         },
//         {
//           title: "Nested Queries in FROM",
//           content: [
//             <SQLCodeWidget data={from[8]}/>,
//             <SQLCodeWidget data={from[9]}/>,
            
// <MarkdownComponent article={`
// Nested queries within the FROM clause allow for complex data manipulations and filtering at an advanced level.

//             `}/>
//           ],
//           link: "#nested_queries_in_from"
//         },
//         {
//           title: "Complex Joins",
//           content: [
//             `Complex queries often involve multiple joins that link several tables together to form more comprehensive datasets.`,
            
//             <SQLCodeWidget data={from[10]}/>,
//             <SQLCodeWidget data={from[11]}/>,

//             <MarkdownComponent article={`
//         `}/>
//           ],
//           link: "#complex_joins"
//         },
//         {
//           title: "Conclusion",
//           content: [
//             <MarkdownComponent article={`Understanding the FROM clause and its diverse applications, from single-table selections to complex multi-table operations, is key to mastering SQL. This guide provides a foundational understanding that will aid in building more sophisticated queries.`}/>
//           ],
//           link: "#conclusion"
//         }
//       ];

//       const keyWords=["sql language", "sql programming", "sql query","learn sql" ,"sql from"]
      

//   return (
//     <>
//     <MyNavbar2/>
//     <br/>
//     <br/>
//     <br/>
//     <Breadcrumb/>
//     <h1 className='title' style={{marginTop:'-30px',marginBottom:'-30px'}}>From SQL Clause</h1>
//     <TableOfContents tocItems={tocItems} showNumbers={false}/>
//     <ContentBlocks tocItems={tocItems}  />
//     <ScrollUpButton right='150px'/>
    
    
    
//     </>

//   )
// }
import React from 'react';
import Head from 'next/head';
import TableOfContents from '@/app/components/page-components/table-of-contents/TableOfContents';
import ContentBlocks from '@/app/components/page-components/content-components/ContentBlocks';
import MarkdownComponent from '@/app/components/markdown-component/MarkdownComponent';
import SQLCodeWidget from '@/app/components/sql/SQLCodeWidget';
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
import '../../../pages.css';
import '../../../../app/globals.css';
import { renderContent } from '@/utils/renderContent';

export default function FromPage({ tocItemsData, keyWords }) {
//   const renderContent = (content) => {
//     return content.map((item, index) => {
//       if (React.isValidElement(item)) {
//         return React.cloneElement(item, { key: index });
//       }
//       if (typeof item === 'string') {
//         return <MarkdownComponent key={index} article={item} />;
//       }
//       if (item && typeof item === 'object' && 'type' in item) {
//         if (item.type === 'sql' && item.data) {
//           return <SQLCodeWidget key={index} data={item.data} />;
//         }
//         if (item.type === 'markdown') {
//           return <MarkdownComponent key={index} article={item.content} />;
//         }
//       }
//       return null;
//     });
//   };

  const tocItems = tocItemsData.map(item => ({
    ...item,
    content: renderContent(item.content)
  }));

  return (
    <>
      <Head>
        <title>From SQL Clause - Learn SQL</title>
        <meta name="description" content="Learn about the FROM clause in SQL, its usage, and advanced techniques." />
        <meta name="keywords" content={keyWords.join(', ')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="From SQL Clause - Learn SQL" />
        <meta property="og:description" content="Learn about the FROM clause in SQL, its usage, and advanced techniques." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://webdevdata.net/sql/clause/from" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="From SQL Clause - Learn SQL" />
        <meta name="twitter:description" content="Learn about the FROM clause in SQL, its usage, and advanced techniques." />
        <link rel="canonical" href="https://webdevdata.net/sql/clause/from" />
        </Head>
      <MyNavbar2 />
      <br />
      <br />
      <br />
      <Breadcrumb />
      <h1 className='title' style={{marginTop:'-30px',marginBottom:'-30px'}}>From SQL Clause</h1>
      <TableOfContents tocItems={tocItems} showNumbers={false} />
      <ContentBlocks tocItems={tocItems} />
      <ScrollUpButton  />
    </>
  );
}

export async function getStaticProps() {
  const { tocItems, keyWords } = await import('../../../api/sql/_fromData');

  const serializableTocItems = tocItems.map(item => ({
    ...item,
    content: item.content.map(contentItem => {
      if (React.isValidElement(contentItem)) {
        if (contentItem.type === MarkdownComponent) {
          return { type: 'markdown', content: contentItem.props.article };
        }
        if (contentItem.type === SQLCodeWidget) {
          return { type: 'sql', data: contentItem.props.data };
        }
      }
      return contentItem;
    })
  }));

  return {
    props: {
      tocItemsData: serializableTocItems,
      keyWords,
    },
  };
}


