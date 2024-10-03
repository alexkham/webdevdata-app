// // import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// // import SunRayDiagramWithDetails from '@/app/components/d3/SunRayDiagram'
// // import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
// // import React from 'react'
// // import sql from '@/app/components/sql/sqlLang'

// // export default function SQLPage() {
// //   return (
// //     <>
// //     <MyNavbar2></MyNavbar2>
// //     <br/>
// //     <br/>
// //     <Breadcrumb></Breadcrumb>
// //     <br/>
// //     <h1>SQL Language : Learning Guide</h1>
// //     <SunRayDiagramWithDetails></SunRayDiagramWithDetails>
// //     <SunRayDiagramWithDetails 
// //     data={sql} 
// //     angleJitter={0.1} 
// //     zoomLevel={0.53}
// //     nodeWidth={200}></SunRayDiagramWithDetails>
    
    
// //     </>
// //   )
// // }
// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// import SunRayDiagramWithDetails from '@/app/components/d3/SunRayDiagram'
// import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
// import React from 'react'
// import sql from '@/app/components/sql/sqlLang'
// import '../pages.css'
// import SQLCodeWidget from '@/app/components/sql/SQLCodeWidget'
// import prismThemes from '@/app/components/sql/themes'
// import { title } from '@/app/api/db/content/C/general/permutations'
// import SQLCodeExampleAccordion from '@/app/components/sql/SQLCodeExampleAcoordion'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// import ContentBlocks from '@/app/components/page-components/content-components/ContentBlocks'
// import MarkdownComponent from '@/app/components/markdown-component/MarkdownComponent'
// import { books } from '@/app/components/sql/tables'

// export default function SQLPage() {
    

//     const tableData = [
//       { id: 1, name: 'John Doe', age: 30 },
//       { id: 2, name: 'Jane Smith', age: 25 },
//       { id: 3, name: 'Bob Johnson', age: 35 },
//     ];
    
//     const sqlData = {
//         title: "Select All Users",
//         code: `SELECT * FROM users WHERE active = true ORDER BY created_at DESC LIMIT 10;`,
//          explanation: "This query selects all columns from the 'users' table where the 'active' field is true. It orders the results by the 'created_at' field in descending order and limits the output to 10 rows."
//       };

//       const tocItems = [
//         {
//           title: "Clauses",
//           content: [`
//                     A clause in SQL language is a specific part of SQL query that dictates and controls the elements and conditions of database operations.
//                      SQL [clauses](/sql/clause) are integral to structuring commands and queries to perform various operations on data effectively.
//                      Understanding SQL clauses , their role and usage is absolutely crucial for learning SQL programming language.

//                     In SQL language, clauses may be either mandatory or optional:
//                     \n- [SELECT](/sql/clause/select) (Mandatory):
//                      This is a fundamental part of any SQL query: it specifies the columns to be returned in the query's results.
//                       It can not be skipped in any condition ,otherwise the query simply will not "know" what to bring back.
//                     \n- [FROM](/sql/clause/from) (Mandatory):
//                      Identifies the tables from which data should be retrieved, essential for defining the data source in a query.
//                     \n- **WHERE** (Optional):
//                      Applies conditions to filter records, allowing only those that meet specified criteria to be returned.
//                     \n- **GROUP BY** (Optional): This clause aggregates data across multiple records and groups the results of SQL query by one or more columns, useful for summary reports.
//                     \n- **HAVING** (Optional): Filters records on aggregated results, used in conjunction with GROUP BY.
//                     \n- **ORDER BY** (Optional): Specifies the order in which to return the rows, enhancing readability and order of the data.
//                     \n- **LIMIT** (Optional): Restricts the number of rows returned in a query's results, particularly useful for handling large datasets or for pagination.\n
//                     \nThis section introduces the crucial components of SQL language queries, providing a foundational understanding of how data is selected, organized, and manipulated within a database. For a more detailed exploration of each clause and its functionalities, visit the [detailed page](/sql/clause) on clauses.



// `],
//         //   before: ["Before content placeholder for Clauses"],
//         //   after: ["After content placeholder for Clauses"],
//           link: "#clauses"
//         },
//         {
//           title: "Keywords",
//           content: [`
            
//                     In SQL language,like in other programming languages, keywords are reserved words that hold special meaning and are used to define and manipulate data within a database. These keywords form the backbone of SQL queries and commands, making it essential to understand their function to write efficient and correct queries.

//                     \n- **DISTINCT**: Ensures that the query returns only unique records, removing duplicates from the result set.
//                     \n- **AS (aliasing)**: Allows you to temporarily rename a column or table to make queries easier to read and manage.
//                     \n- **IN**: Used to specify multiple values in a WHERE clause, simplifying the filtering of data.
//                     \n- **BETWEEN**: Helps define a range of values in a query, such as selecting data within a specific date or number range.
//                     \n- **LIKE**: Enables pattern matching in queries, useful for searching data using wildcards.
//                     \n- **IS NULL / IS NOT NULL**: Checks whether a field is empty (NULL) or contains a value.
//                     \n- **AND / OR / NOT**: Logical operators used to combine or exclude conditions in a query.
//                     \n- **ALL**: Compares a value against all values in a set or subquery.
//                     \n- **ANY / SOME**: Compares a value against any single value in a set or subquery.
//                     \n- **EXISTS**: Tests whether a subquery returns any rows.\n

//                     Keywords are the building blocks for SQL queries, guiding the database in how to retrieve, manipulate, and store data. Mastering these keywords is a crucial step for anyone learning SQL language.
//           `],
//         //   before: ["Before content placeholder for Keywords"],
//         //   after: ["After content placeholder for Keywords"],
//           link: "#keywords"
//         },
//         {
//           title: "Functions",
//           content: [
//            `      Functions in SQL programming are built-in operations that can be applied to data within a query to perform calculations, manipulate string or date data, and more. They are categorized into two main types: **aggregate** functions and **scalar** functions.

//                   **Aggregate Functions**
//                   These functions perform a calculation on a set of values and return a single value, making them essential for statistical analysis over multiple rows of data. Examples include:
//                   \n- **COUNT()**: Counts the number of rows in a specified column or dataset.
//                   \n- **SUM()**: Adds together all values in a specific column.
//                   \n- **AVG()**: Calculates the average of values in a column.
//                   \n- **MAX()**: Finds the maximum value in a column.
//                   \n- **MIN()**: Determines the minimum value in a column.

//                   **Scalar Functions**
//                   Scalar functions operate on individual values and return a single result per value processed. These functions are crucial for data manipulation within individual rows. Examples include:
//                   \n- **CONCAT**: Joins two or more strings into one.
//                   \n- **SUBSTRING**: Extracts a part of a string.
//                   \n- **UPPER** / **LOWER**: Converts a string to upper or lower case.
//                   \n- **DATEADD**: Adds a specific time interval to a date.
//                   \n- **DATEDIFF**: Calculates the difference between two dates.
//                   \n- **YEAR**, **MONTH**: Extracts the year or month from a date.
//                   \n- **ROUND**, **ABS**, **CEILING**, **FLOOR**: Numerical functions to round numbers or modify them to fit certain criteria.

//                   SQL functions are powerful tools that help refine and customize the retrieval and presentation of data in SQL queries. They enable more dynamic and precise data handling, pivotal for generating meaningful insights from databases.
                 
//                   This section gives an overview of the functions available in SQL, highlighting how they can be used to manipulate and analyze data effectively. Let me know if there's anything else you'd like to add or modify!
//            `
//           ],
//         //   before: ["Before content placeholder for Functions"],
//         //   after: ["After content placeholder for Functions"],
//           link: "#functions"
//         },
//         {
//           title: "Joins",
//           content: [
//             `Joins in SQL language are crucial for combining rows from two or more different tables based on their related columns. This functionality is key to accessing comprehensive data insights when working with relational databases.

//            **Types of Joins**:
//         \n- **INNER JOIN**: This kind of join returns all the rows where there is a match on both tables. It’s used when you need precise matching data from both tables.
//         \n- **LEFT JOIN** (or LEFT OUTER JOIN): This join retrieves all rows from the left table, along with the matching rows from the right table. If  no match is found , the result from the right table will be NULL.
//         \n- **RIGHT JOIN** (or RIGHT OUTER JOIN): It works similar to a left join, but it focuses on the right table. It brings all rows from the right table and only the matching rows from the left table. Non-matching rows from the left table will appear as NULL in the result.
//         \n- **FULL OUTER JOIN**: This join is a combination of left and right joins. We get here all rows from both tables, filling in NULLs for any unmatched columns from either side.

// Joins are essential for querying across multiple tables, allowing for more detailed and complex analyses by linking related data from disparate sources.

//             `
//           ],
//         //   before: ["Before content placeholder for Joins"],
//         //   after: ["After content placeholder for Joins"],
//           link: "#joins"
//         },
//         {
//           title: "Set Operations",
//           content: [
//             `Set operations in SQL queries are powerful tools that allow you to combine the results of two or more queries into a single result set. These operations are based on traditional mathematical set theory and are essential for conducting complex data comparisons and analyses.

//             **Types of Set Operations**:
//             \n- **UNION**: This operation combines the results of two or more SELECT statements into one result set, excluding duplicate rows. It’s like forming a complete puzzle from pieces gathered from different boxes.
//             \n- **INTERSECT**: This operation returns only the rows that are common to all involved SELECT statements. Think of it as the overlapping section in a Venn diagram.
//            \n- **EXCEPT**: This operation returns the rows from one SELECT statement that are not present in the subsequent SELECT statements. It’s similar to subtracting numbers, but with rows of data.

//             Each of these operations can significantly enhance the flexibility and capability of SQL queries, especially when dealing with disjointed or overlapping data sets.

//             `,
//             // <SQLCodeWidget data={sqlData} table={tableData}></SQLCodeWidget>
//           ],
//         //   before: ["Before content placeholder for Set Operations"],
//         //   after: ["After content placeholder for Set Operations"],
//           link: "#set-operations"
//         },
//         {
//           title: "Subqueries",
//           content: [
//            `Subqueries in SQL Language, also known as inner queries or nested queries, are queries placed within other SQL queries. They are a powerful feature that enhances the flexibility and depth of data analysis by allowing one part of a query to depend on another.

//               **Types of Subqueries**
//               \n- **Correlated Subqueries**: These are subqueries that refer back to the outer query for their values. Think of them as a loop; each row processed by the outer query affects the result of the correlated subquery.
//               \n- **Non-correlated Subqueries**: These operate independently of the outer query. They run once, return their results to the outer query, and do not depend on the outer query for their execution.

//               Subqueries can be used in various places within a SQL statement, including the **SELECT** ,**FROM**,**WHERE**, and even the **HAVING** clauses, offering a method to perform operations that would otherwise require multiple queries or complex joins.
//            `,
//           //  <SQLCodeWidget showTitle={false} data={sqlData} table={books}></SQLCodeWidget>
//           ],
//         //   before: ["Before content placeholder for Subqueries"],
//         //   after: ["After content placeholder for Subqueries"],
//           link: "#subqueries"
//         },
//         {
//           title: "Operators and Wildcards",
//           content: [
//             <MarkdownComponent article={`
//   ### Operators and Wildcards in SQL Language
//   Operators and wildcards in SQL language are essential tools used to refine and specify the criteria of a query. They enable precise filtering, comparison, and manipulation of data.

//   #### Types of Operators
//   - **Comparison Operators**: 
//   - = (equals)
//   - <> (not equal)
//   - < (less than)
//   - > (greater than)
//   - <= (less than or equal to)
//   - >= (greater than or equal to)

//   These operators are fundamental for comparing values in a query.

//   - **Arithmetic Operators**: 
//   - + (addition)
//   - - (subtraction)
//   - * (multiplication)
//   - / (division)

//   These operators allow for the manipulation of numeric data directly within the query.

//   #### Wildcards
//   - **% (percent sign)**: Represents zero, one, or multiple characters, useful in searching text fields.
//   - **_ (underscore)**: Represents a single character, also used in text searches.

//   Utilizing these tools enhances the flexibility and capability of SQL queries, supporting complex filtering, searching, and data manipulation tasks.

//             `}></MarkdownComponent>,
//             <>
          
//             </>
//             // <SQLCodeWidget data={sqlData}></SQLCodeWidget>
//           ],
//         //   before: ["Before content placeholder for Operators and Wildcards"],
//         //   after: ["After content placeholder for Operators and Wildcards"],
//           link: "#operators-and-wildcards"
//         }
//       ];
      
      
//      const keyWords=["sql language", "sql programming", "sql query","learn sql"]

      
//   return (
//     <>
//       <MyNavbar2></MyNavbar2>
//       <br/>
//       <br/>
//       <br/>
//       <Breadcrumb></Breadcrumb>
      
//       <h1 className='title' 
//       style={{marginTop:'-40px' ,marginBottom:'-30px'}}
//       id='toc'>SQL Language : Learning Guide</h1>
//       <br/>
       
//       <div style={{display:'flex',flexDirection:'row'}} >
        
//       {/* <span>Some Other Content Here</span> */}
//       {sql ? (
//         <SunRayDiagramWithDetails 
//           data={sql} 
//           angleJitter={0.1} 
//           zoomLevel={0.7}
//           nodeWidth={200}
//           divider={3.1}>
//         </SunRayDiagramWithDetails>
//       ) : (
//         <div style={{ textAlign: 'center', marginTop: '20px' }}>
//           <h2>No Data Available</h2>
//           <p>Please check the data source or try again later.</p>
//         </div>
//       )}
//       {/* <span>Some Other Content Here</span> */}
//       </div>
     
    
//       {/* <div style={{width:'50%'}}>
//       <SQLCodeWidget
//        data={sqlData} 
//        theme='solarizedlight'
//        showTitle={false}
//        backgroundColor="#fdf6e3"
//        showExplanation={false}></SQLCodeWidget>
//       </div>
//       <br/> */}
     
//       {/* <SQLCodeWidget 
//         data={sqlData}
//         theme="solarizedlight"
//         showLineNumbers={true}
//         backgroundColor="#fdf6e3"
//         textColor="#657b83"
//          parentBackgroundColor="#fdf6e3"
        
//       /> */}
     
//       {/* <SQLCodeExampleAccordion
//             data={sqlData}
//             parentTheme='solarizedlight'
//             width="1200px"
//             idPrefix="sql-example-"
//             parentShowTitle={false}
//         /> */}
      
//       <ContentBlocks tocItems={tocItems}></ContentBlocks>
//       <br/>
//       <br/>
//       <br/>
//       <br/>
//       <br/>
//       <br/>
//       <br/>
//       <br/>
//       <br/>
//       <ScrollUpButton/>
//     </>
//   )
// }
import React from 'react';
import Head from 'next/head';
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import SunRayDiagramWithDetails from '@/app/components/d3/SunRayDiagram';
import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2';
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
import ContentBlocks from '@/app/components/page-components/content-components/ContentBlocks';
import MarkdownComponent from '@/app/components/markdown-component/MarkdownComponent';
import { renderContent } from '@/utils/renderContent';
import '../pages.css';
import '../../app/globals.css';

export default function SQLPage({ tocItemsData, sql }) {
  const tocItems = tocItemsData.map(item => ({
    ...item,
    content: renderContent(item.content)
  }));

  return (
    <>
      <Head>
        <title>SQL Language: Learning Guide</title>
        <meta name="description" content="Comprehensive guide to learning SQL language, covering clauses, keywords, functions, joins, set operations, subqueries, operators, and wildcards." />
        <meta name="keywords" content="SQL language, SQL programming, SQL query, learn SQL" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="SQL Language: Learning Guide" />
        <meta property="og:description" content="Comprehensive guide to learning SQL language, covering clauses, keywords, functions, joins, set operations, subqueries, operators, and wildcards." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://webdevdata.net/sql" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="SQL Language: Learning Guide" />
        <meta name="twitter:description" content="Comprehensive guide to learning SQL language, covering clauses, keywords, functions, joins, set operations, subqueries, operators, and wildcards." />
        <link rel="canonical" href="https://webdevdata.net/sql" />
      </Head>
      <MyNavbar2 />
      <br />
      <br />
      <br />
      <Breadcrumb />
      
      <h1 className='title' 
        style={{marginTop:'-40px', marginBottom:'-30px'}}
        id='toc'>SQL Language : Learning Guide</h1>
      <br />
       
      <div style={{display:'flex', flexDirection:'row'}} >
        {sql ? (
          <SunRayDiagramWithDetails 
            data={sql} 
            angleJitter={0.1} 
            zoomLevel={0.7}
            nodeWidth={200}
            divider={3.1}>
          </SunRayDiagramWithDetails>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>No Data Available</h2>
            <p>Please check the data source or try again later.</p>
          </div>
        )}
      </div>
     
      <ContentBlocks tocItems={tocItems} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <ScrollUpButton />
    </>
  );
}

export async function getStaticProps() {
  const sql = await import('@/app/components/sql/sqlLang');

  const tocItems = [
    {
      title: "Clauses",
      content: [
        { type: 'markdown', content: `
A clause in SQL language is a specific part of SQL query that dictates and controls the elements and conditions of database operations.
SQL [clauses](/sql/clause) are integral to structuring commands and queries to perform various operations on data effectively.
Understanding SQL clauses , their role and usage is absolutely crucial for learning SQL programming language.

In SQL language, clauses may be either mandatory or optional:
\n- [SELECT](/sql/clause/select) (Mandatory):
This is a fundamental part of any SQL query: it specifies the columns to be returned in the query's results.
It can not be skipped in any condition ,otherwise the query simply will not "know" what to bring back.
\n- [FROM](/sql/clause/from) (Mandatory):
Identifies the tables from which data should be retrieved, essential for defining the data source in a query.
\n- **WHERE** (Optional):
Applies conditions to filter records, allowing only those that meet specified criteria to be returned.
\n- **GROUP BY** (Optional): This clause aggregates data across multiple records and groups the results of SQL query by one or more columns, useful for summary reports.
\n- **HAVING** (Optional): Filters records on aggregated results, used in conjunction with GROUP BY.
\n- **ORDER BY** (Optional): Specifies the order in which to return the rows, enhancing readability and order of the data.
\n- **LIMIT** (Optional): Restricts the number of rows returned in a query's results, particularly useful for handling large datasets or for pagination.\n
\nThis section introduces the crucial components of SQL language queries, providing a foundational understanding of how data is selected, organized, and manipulated within a database. For a more detailed exploration of each clause and its functionalities, visit the [detailed page](/sql/clause) on clauses.
        ` }
      ],
      link: "#clauses"
    },
    {
      title: "Keywords",
      content: [
        { type: 'markdown', content: `
In SQL language,like in other programming languages, keywords are reserved words that hold special meaning and are used to define and manipulate data within a database. These keywords form the backbone of SQL queries and commands, making it essential to understand their function to write efficient and correct queries.

\n- **DISTINCT**: Ensures that the query returns only unique records, removing duplicates from the result set.
\n- **AS (aliasing)**: Allows you to temporarily rename a column or table to make queries easier to read and manage.
\n- **IN**: Used to specify multiple values in a WHERE clause, simplifying the filtering of data.
\n- **BETWEEN**: Helps define a range of values in a query, such as selecting data within a specific date or number range.
\n- **LIKE**: Enables pattern matching in queries, useful for searching data using wildcards.
\n- **IS NULL / IS NOT NULL**: Checks whether a field is empty (NULL) or contains a value.
\n- **AND / OR / NOT**: Logical operators used to combine or exclude conditions in a query.
\n- **ALL**: Compares a value against all values in a set or subquery.
\n- **ANY / SOME**: Compares a value against any single value in a set or subquery.
\n- **EXISTS**: Tests whether a subquery returns any rows.\n

Keywords are the building blocks for SQL queries, guiding the database in how to retrieve, manipulate, and store data. Mastering these keywords is a crucial step for anyone learning SQL language.
        ` }
      ],
      link: "#keywords"
    },
    {
      title: "Functions",
      content: [
        { type: 'markdown', content: `
Functions in SQL programming are built-in operations that can be applied to data within a query to perform calculations, manipulate string or date data, and more. They are categorized into two main types: **aggregate** functions and **scalar** functions.

**Aggregate Functions**
These functions perform a calculation on a set of values and return a single value, making them essential for statistical analysis over multiple rows of data. Examples include:
\n- **COUNT()**: Counts the number of rows in a specified column or dataset.
\n- **SUM()**: Adds together all values in a specific column.
\n- **AVG()**: Calculates the average of values in a column.
\n- **MAX()**: Finds the maximum value in a column.
\n- **MIN()**: Determines the minimum value in a column.

**Scalar Functions**
Scalar functions operate on individual values and return a single result per value processed. These functions are crucial for data manipulation within individual rows. Examples include:
\n- **CONCAT**: Joins two or more strings into one.
\n- **SUBSTRING**: Extracts a part of a string.
\n- **UPPER** / **LOWER**: Converts a string to upper or lower case.
\n- **DATEADD**: Adds a specific time interval to a date.
\n- **DATEDIFF**: Calculates the difference between two dates.
\n- **YEAR**, **MONTH**: Extracts the year or month from a date.
\n- **ROUND**, **ABS**, **CEILING**, **FLOOR**: Numerical functions to round numbers or modify them to fit certain criteria.

SQL functions are powerful tools that help refine and customize the retrieval and presentation of data in SQL queries. They enable more dynamic and precise data handling, pivotal for generating meaningful insights from databases.

This section gives an overview of the functions available in SQL, highlighting how they can be used to manipulate and analyze data effectively.
        ` }
      ],
      link: "#functions"
    },
    {
      title: "Joins",
      content: [
        { type: 'markdown', content: `
Joins in SQL language are crucial for combining rows from two or more different tables based on their related columns. This functionality is key to accessing comprehensive data insights when working with relational databases.

**Types of Joins**:
\n- **INNER JOIN**: This kind of join returns all the rows where there is a match on both tables. It's used when you need precise matching data from both tables.
\n- **LEFT JOIN** (or LEFT OUTER JOIN): This join retrieves all rows from the left table, along with the matching rows from the right table. If  no match is found , the result from the right table will be NULL.
\n- **RIGHT JOIN** (or RIGHT OUTER JOIN): It works similar to a left join, but it focuses on the right table. It brings all rows from the right table and only the matching rows from the left table. Non-matching rows from the left table will appear as NULL in the result.
\n- **FULL OUTER JOIN**: This join is a combination of left and right joins. We get here all rows from both tables, filling in NULLs for any unmatched columns from either side.

Joins are essential for querying across multiple tables, allowing for more detailed and complex analyses by linking related data from disparate sources.
        ` }
      ],
      link: "#joins"
    },
    {
      title: "Set Operations",
      content: [
        { type: 'markdown', content: `
Set operations in SQL queries are powerful tools that allow you to combine the results of two or more queries into a single result set. These operations are based on traditional mathematical set theory and are essential for conducting complex data comparisons and analyses.

**Types of Set Operations**:
\n- **UNION**: This operation combines the results of two or more SELECT statements into one result set, excluding duplicate rows. It's like forming a complete puzzle from pieces gathered from different boxes.
\n- **INTERSECT**: This operation returns only the rows that are common to all involved SELECT statements. Think of it as the overlapping section in a Venn diagram.
\n- **EXCEPT**: This operation returns the rows from one SELECT statement that are not present in the subsequent SELECT statements. It's similar to subtracting numbers, but with rows of data.

Each of these operations can significantly enhance the flexibility and capability of SQL queries, especially when dealing with disjointed or overlapping data sets.
        ` }
      ],
      link: "#set-operations"
    },
    {
      title: "Subqueries",
      content: [
        { type: 'markdown', content: `
Subqueries in SQL Language, also known as inner queries or nested queries, are queries placed within other SQL queries. They are a powerful feature that enhances the flexibility and depth of data analysis by allowing one part of a query to depend on another.

**Types of Subqueries**
\n- **Correlated Subqueries**: These are subqueries that refer back to the outer query for their values. Think of them as a loop; each row processed by the outer query affects the result of the correlated subquery.
\n- **Non-correlated Subqueries**: These operate independently of the outer query. They run once, return their results to the outer query, and do not depend on the outer query for their execution.

Subqueries can be used in various places within a SQL statement, including the **SELECT** ,**FROM**,**WHERE**, and even the **HAVING** clauses, offering a method to perform operations that would otherwise require multiple queries or complex joins.
        ` }
      ],
      link: "#subqueries"
    },
    {
      title: "Operators and Wildcards",
      content: [
        { type: 'markdown', content: `
### Operators and Wildcards in SQL Language
Operators and wildcards in SQL language are essential tools used to refine and specify the criteria of a query. They enable precise filtering, comparison, and manipulation of data.

#### Types of Operators
- **Comparison Operators**: 
- = (equals)
- <> (not equal)
- < (less than)
- > (greater than)
- <= (less than or equal to)
- >= (greater than or equal to)

These operators are fundamental for comparing values in a query.

- **Arithmetic Operators**: 
- + (addition)
- - (subtraction)
- * (multiplication)
- / (division)

These operators allow for the manipulation of numeric data directly within the query.

#### Wildcards
- **% (percent sign)**: Represents zero, one, or multiple characters, useful in searching text fields.
- **_ (underscore)**: Represents a single character, also used in text searches.

Utilizing these tools enhances the flexibility and capability of SQL queries, supporting complex filtering, searching, and data manipulation tasks.
        ` }
      ],
      link: "#operators-and-wildcards"
    }
  ];

  return {
    props: {
      tocItemsData: tocItems,
      sql: sql.default,
    },
  };
}