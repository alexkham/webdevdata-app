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

export default function WherePage({ tocItemsData ,keyWords}) {
  const tocItems = tocItemsData.map(item => ({
    ...item,
    content: renderContent(item.content)
  }));

  return (
    <>
      <Head>
        <title>WHERE SQL Clause - Learn SQL</title>
        <meta name="description" content="Master the WHERE clause in SQL with comprehensive examples and explanations." />
        <meta name="keywords" content={keyWords.join(', ')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content=" Where SQL Clause - Learn SQL" />
        <meta property="og:description" content="Master the WHERE clause in SQL with comprehensive examples and explanations." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://webdevdata.net/sql/clause/where" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="WHERE SQL Clause - Learn SQL" />
        <meta name="twitter:description" content="Master the WHERE clause in SQL with comprehensive examples and explanations." />
        <link rel="canonical" href="https://webdevdata.net/sql/clause/where" />
      </Head>
      <MyNavbar2 />
      <br />
      <br />
      <br />
      <Breadcrumb />
      <h1 className='title' style={{marginTop:'-30px',marginBottom:'-30px'}}>WHERE SQL Clause</h1>
      <TableOfContents tocItems={tocItems} showNumbers={false} />
      <ContentBlocks tocItems={tocItems} />
      <ScrollUpButton  />
    </>
  );
}

export async function getStaticProps() {
  const { where ,keyWords } = await import('../../../api/sql/_whereData');

  const tocItems = [
    {
        title: "Introduction",
        link: "#introduction",
        content: [
            {
                type: 'markdown',
                content: `Despite the fact that the WHERE clause is not mandatory like the SELECT and FROM clauses, its importance for SQL queries cannot be understated. Positioned strategically after the FROM clause and typically before GROUP BY, HAVING, and ORDER BY clauses, the WHERE clause serves as a critical filter that refines the scope of data retrieval. By specifying conditions, it directly influences which records are processed in the subsequent parts of the query.

The WHERE clause's interactions extend to nearly every aspect of SQL queries. It works in conjunction with JOIN operations to determine which rows from connected tables meet the specified conditions, impacting how tables are merged. In complex queries involving subqueries, the WHERE clause can apply conditions to both the main query and the nested subqueries, providing multiple layers of filtering that enhance query precision and performance.

Additionally, the WHERE clause interacts with SQL keywords and functions like IN, NOT, AND, OR, and LIKE. This interaction allows for dynamic and complex condition checks that can adapt to a variety of data examination needs. By setting the groundwork for aggregation in GROUP BY, the WHERE clause ensures that only relevant data is included in groupings, which is essential for accurate aggregate calculations and summaries in the HAVING clause.

In essence, while the WHERE clause is optional, its ability to integrate tightly with other SQL components and dictate the flow of data processing underscores its pivotal role in crafting efficient, effective, and precise SQL queries.
 ` 
            }
        ]
    },
    {
        title: "No WHERE Clause",
        link: "#no_where_clause",
        content: [
            {
                type: 'markdown',
                content: `  `  // Markdown before SQL
            },
            {
                type: 'sql',
                data: where[0]
            },
            {
                type: 'markdown',
                content: `  `  // Markdown after SQL
            }
        ]
    },
    {
        title: "Basic Filtering",
        link: "#basic_filtering",
        content: [
            {
                type: 'markdown',
                content: `  `
            },
            {
                type: 'sql',
                data: where[1]
            },
            {
                type: 'markdown',
                content: `  `
            }
        ]
    },
    {
        title: "Multiple Conditions (AND)",
        link: "#multiple_conditions_and",
        content: [
            {
                type: 'markdown',
                content: `  `
            },
            {
                type: 'sql',
                data: where[2]
            },
            {
                type: 'markdown',
                content: `  `
            }
        ]
    },
    {
        title: "Multiple Conditions (OR)",
        link: "#multiple_conditions_or",
        content: [
            {
                type: 'markdown',
                content: `  `
            },
            {
                type: 'sql',
                data: where[3]
            },
            {
                type: 'markdown',
                content: `  `
            }
        ]
    },
    {
        title: "Range Conditions",
        link: "#range_conditions",
        content: [
            {
                type: 'markdown',
                content: `  `
            },
            {
                type: 'sql',
                data: where[4]
            },
            {
                type: 'markdown',
                content: `  `
            }
        ]
    },
    {
        title: "Null Values",
        link: "#null_values",
        content: [
            {
                type: 'markdown',
                content: `  `
            },
            {
                type: 'sql',
                data: where[5]
            },
            {
                type: 'markdown',
                content: `  `
            }
        ]
    },
    {
        title: "Pattern Matching (LIKE) ",
        link: "#pattern_matching_like",
        content: [
            {
                type: 'markdown',
                content: `  `
            },
            {
                type: 'sql',
                data: where[6]
            },
            {
                type: 'markdown',
                content: `  `
            }
        ]
    },
    {
        title: "Inclusion in a List (IN)",
        link: "#inclusion_in_a_list_in",
        content: [
            {
                type: 'markdown',
                content: `  `
            },
            {
                type: 'sql',
                data: where[7]
            },
            {
                type: 'markdown',
                content: `  `
            }
        ]
    },
    {
        title: "Subqueries ",
        link: "#subqueries",
        content: [
            {
                type: 'markdown',
                content: `  `
            },
            {
                type: 'sql',
                data: where[8]
            },
            {
                type: 'markdown',
                content: `  `
            }
        ]
    },
    {
        title: "Case Sensitivity and Collations",
        link: "#case_sensitivity_and_collations",
        content: [
            {
                type: 'markdown',
                content: `  `
            },
            {
                type: 'sql',
                data: where[9]
            },
            {
                type: 'markdown',
                content: `  `
            }
        ]
    },
    {
        title: "Filtering with Joins",
        link: "#filtering_with_joins",
        content: [
            {
                type: 'markdown',
                content: `  `
            },
            {
                type: 'sql',
                data: where[10]
            },
            {
                type: 'markdown',
                content: `  `
            }
        ]
    },
    {
        title: "Conclusion",
        link: "#conclusion",
        content: [
            {
                type: 'markdown',
                content: `In conclusion, while the WHERE clause is technically optional in SQL queries, its strategic application is indispensable for conducting targeted and efficient data analysis. It not only refines the data that enters the workflow of a query by filtering out irrelevant records but also orchestrates a cohesive interaction with other SQL clauses and operations. This synchronization allows for more sophisticated data manipulations and ensures that operations like joins, aggregations, and sorting are executed on precisely filtered datasets.
Understanding and utilizing the WHERE clause effectively empowers developers and analysts to harness the full potential of SQL, transforming expansive datasets into actionable insights. With its capability to integrate conditions seamlessly across various parts of a query, the WHERE clause is a cornerstone of efficient database querying, making it a critical skill in the arsenal of anyone working with SQL.
This conclusion highlights the crucial yet optional nature of the WHERE clause, emphasizing its role in enhancing query performance and accuracy, and underscores its importance in SQL programming.
  `  
            }
        ]
    }
];

  return {
    props: {
      tocItemsData: tocItems,
      keyWords
    },
  };
}