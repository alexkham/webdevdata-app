

// export const from = [
//     {
//       title: "Basic SELECT Syntax",
//       code: `SELECT column_name FROM table_name;`,
//       explanation: "This example illustrates the foundational syntax for a SELECT query, specifying a column to be retrieved from a designated table."
//     },
//     {
//       title: "Basic SELECT Example",
//       code: `SELECT first_name, last_name FROM employees;`,
//       explanation: "This specific query retrieves 'first_name' and 'last_name' from the 'employees' table, demonstrating the SELECT command in action."
//     },
//     {
//       title: "Selecting From Multiple Tables Syntax",
//       code: `SELECT a.column_name, b.column_name FROM tableA a, tableB b WHERE a.common_column = b.common_column;`,
//       explanation: "This syntax outlines how to perform a simple join between two tables, leveraging a common column to combine data effectively."
//     },
//     {
//       title: "Selecting From Multiple Tables Example",
//       code: `SELECT e.first_name, d.department_name FROM employees e, departments d WHERE e.department_id = d.department_id;`,
//       explanation: "Here, the query joins 'employees' and 'departments' to output the first names of employees along with their department names, showcasing the utility of simple joins."
//     },
//     {
//       title: "Using Aliases in FROM Syntax",
//       code: `SELECT e.column_name FROM table_name AS e;`,
//       explanation: "This syntax shows how to simplify SQL queries by using aliases for table names, enhancing readability and manageability."
//     },
//     {
//       title: "Using Aliases in FROM Example",
//       code: `SELECT e.first_name, e.last_name FROM employees AS e;`,
//       explanation: "In this query, the 'employees' table is aliased as 'e', simplifying the column references when selecting employee names."
//     },
//     {
//       title: "Inner Joins Syntax",
//       code: `SELECT a.column_name, b.column_name FROM tableA a INNER JOIN tableB b ON a.common_column = b.common_column;`,
//       explanation: "This syntax details the use of an inner join to merge rows from two tables where there are matching values in a specified column."
//     },
//     {
//       title: "Inner Joins Example",
//       code: `SELECT e.first_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id;`,
//       explanation: "This example utilizes an inner join to fetch employees' first names and their associated department names, illustrating the practical application of joining tables."
//     },
//     {
//       title: "Nested Queries in FROM Syntax",
//       code: `SELECT column_name FROM (SELECT column_name FROM table_name WHERE condition) AS subtable;`,
//       explanation: "This syntax introduces the concept of nested queries within the FROM clause, used for advanced data manipulation and filtering."
//     },
//     {
//       title: "Nested Queries in FROM Example",
//       code: `SELECT avg_salary FROM (SELECT department_id, AVG(salary) AS avg_salary FROM employees GROUP BY department_id) AS department_salaries;`,
//       explanation: "Here, a nested query calculates the average salary by department, displaying its ability to handle complex aggregations within subqueries."
//     },
//     {
//       title: "Complex Joins Syntax",
//       code: `SELECT e.first_name, d.department_name, p.project_name FROM employees e JOIN departments d ON\n e.department_id = d.department_id JOIN\n projects p ON d.department_id = p.department_id;`,
//       explanation: "This syntax extends the concept of joins by linking multiple tables in a single query to form comprehensive datasets."
//     },
//     {
//       title: "Complex Joins Example",
//       code: `SELECT e.first_name, d.department_name, p.project_name FROM employees e JOIN departments d ON\n e.department_id = d.department_id JOIN\n projects p ON d.department_id = p.department_id;`,
//       explanation: "This query demonstrates complex joining, retrieving detailed information from interconnected tables—employees, departments, and projects."
//     }
//   ];
export const from = [
    {
      title: "Basic FROM Syntax",
      code: `SELECT column_name FROM table_name;`,
      explanation: "This example illustrates the foundational syntax for a SELECT query, specifying a column to be retrieved from a designated table."
    },
    {
      title: "Basic FROM Example",
      code: `SELECT first_name, last_name FROM employees;`,
      explanation: "This specific query retrieves 'first_name' and 'last_name' from the 'employees' table, demonstrating the SELECT command in action."
    },
    {
      title: "Selecting From Multiple Tables Syntax",
      code: `SELECT a.column_name, b.column_name FROM tableA a, tableB b WHERE a.common_column = b.common_column;`,
      explanation: "This syntax outlines how to perform a simple join between two tables, leveraging a common column to combine data effectively."
    },
    {
      title: "Selecting From Multiple Tables Example",
      code: `SELECT e.first_name, d.department_name FROM employees e, departments d WHERE e.department_id = d.department_id;`,
      explanation: "Here, the query joins 'employees' and 'departments' to output the first names of employees along with their department names, showcasing the utility of simple joins."
    },
    {
      title: "Using Aliases in FROM Syntax",
      code: `SELECT e.column_name FROM table_name AS e;`,
      explanation: "This syntax shows how to simplify SQL queries by using aliases for table names, enhancing readability and manageability."
    },
    {
      title: "Using Aliases in FROM Example",
      code: `SELECT e.first_name, e.last_name FROM employees AS e;`,
      explanation: "In this query, the 'employees' table is aliased as 'e', simplifying the column references when selecting employee names."
    },
    {
      title: "Inner Joins Syntax",
      code: `SELECT a.column_name, b.column_name FROM tableA a INNER JOIN tableB b ON a.common_column = b.common_column;`,
      explanation: "This syntax details the use of an inner join to merge rows from two tables where there are matching values in a specified column."
    },
    {
      title: "Inner Joins Example",
      code: `SELECT e.first_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id;`,
      explanation: "This example utilizes an inner join to fetch employees' first names and their associated department names, illustrating the practical application of joining tables."
    },
    {
      title: "Nested Queries in FROM Syntax",
      code: `SELECT column_name FROM (SELECT column_name FROM table_name WHERE condition) AS subtable;`,
      explanation: "This syntax introduces the concept of nested queries within the FROM clause, used for advanced data manipulation and filtering."
    },
    {
      title: "Nested Queries in FROM Example",
      code: `SELECT avg_salary FROM (SELECT department_id, AVG(salary) AS avg_salary FROM employees GROUP BY department_id) AS department_salaries;`,
      explanation: "Here, a nested query calculates the average salary by department, displaying its ability to handle complex aggregations within subqueries."
    },
    {
      title: "Complex Joins Syntax",
      code: `SELECT e.first_name, d.department_name, p.project_name FROM employees e JOIN departments d ON\n e.department_id = d.department_id JOIN\n projects p ON d.department_id = p.department_id;`,
      explanation: "This syntax extends the concept of joins by linking multiple tables in a single query to form comprehensive datasets."
    },
    {
      title: "Complex Joins Example",
      code: `SELECT e.first_name, d.department_name, p.project_name FROM employees e JOIN departments d ON\n e.department_id = d.department_id JOIN\n projects p ON d.department_id = p.department_id;`,
      explanation: "This query demonstrates complex joining, retrieving detailed information from interconnected tables—employees, departments, and projects."
    }
];

export const tocItems = [
    {
      title: "Introduction",
      content: [
        {
          type: 'markdown',
          content: `The FROM clause, alongside the [SELECT](/sql/clause/select), forms the backbone of SQL queries, being one of only two mandatory clauses required to execute a basic SQL statement. This clause is crucial for specifying the source table or tables from which data is retrieved, serving as the starting point for data manipulation and retrieval in the SQL environment.

The FROM clause is fundamental in defining the context of the data being queried. It not only dictates the table(s) involved in the transaction but also sets the stage for how these tables interact with other SQL clauses and keywords. For example, it enables the structuring of joins, which are vital for combining rows from two or more tables based on related columns between them. This interaction is pivotal when performing more complex queries that require data consolidation from multiple sources.

Moreover, the FROM clause works in tandem with other SQL clauses like WHERE, GROUP BY, and HAVING, which filter and aggregate data based on specified conditions. It acts as the foundation upon which these clauses build to refine the dataset returned by a query. For instance, the WHERE clause applies conditions to the rows selected from the tables specified in the FROM clause, effectively narrowing the data based on specific criteria before any grouping or aggregation occurs.

Additionally, the FROM clause is instrumental in implementing SQL's powerful features like subqueries and nested queries, which allow for advanced data manipulation within a single query expression. These elements show the versatile nature of the FROM clause in facilitating complex data retrieval and manipulation strategies, highlighting its central role in SQL query construction.

Understanding the FROM clause's operation and its interplay with other SQL components is essential for anyone looking to master SQL. This knowledge forms the basis for crafting efficient and effective queries that leverage the full potential of relational databases.`
        }
      ],
      link: "#introduction"
    },
    {
      title: "Selecting From a Single Table",
      content: [
        { type: 'sql', data: from[0] },
        {
          type: 'markdown',
          content: `This is the most basic form of the FROM clause, used to specify the source table from which data is retrieved.`
        },
        { type: 'sql', data: from[1] }
      ],
      link: "#selecting_from_a_single_table"
    },
    {
      title: "Selecting From Multiple Tables",
      content: [
        {
          type: 'markdown',
          content: `Combining data from multiple tables using simple joins is a foundational skill in SQL.`
        },
        { type: 'sql', data: from[2] },
        { type: 'sql', data: from[3] },
        {
          type: 'markdown',
          content: `This example demonstrates a simple join (also known as a Cartesian join) between two tables.`
        }
      ],
      link: "#selecting_from_multiple_tables"
    },
    {
      title: "Using Aliases in FROM",
      content: [
        {
          type: 'markdown',
          content: `Aliases are used to simplify table names and qualify columns with table names.`
        },
        { type: 'sql', data: from[4] },
        { type: 'sql', data: from[5] },
        {
          type: 'markdown',
          content: `Aliasing is particularly useful in queries involving multiple tables to make SQL statements more readable.`
        }
      ],
      link: "#using_aliases_in_from"
    },
    {
      title: "Inner Joins",
      content: [
        {
          type: 'markdown',
          content: `Inner joins retrieve rows that have matching values in both tables.`
        },
        { type: 'sql', data: from[6] },
        { type: 'sql', data: from[7] }
      ],
      link: "#inner_joins"
    },
    {
      title: "Nested Queries in FROM",
      content: [
        { type: 'sql', data: from[8] },
        { type: 'sql', data: from[9] },
        {
          type: 'markdown',
          content: `Nested queries within the FROM clause allow for complex data manipulations and filtering at an advanced level.`
        }
      ],
      link: "#nested_queries_in_from"
    },
    {
      title: "Complex Joins",
      content: [
        {
          type: 'markdown',
          content: `Complex queries often involve multiple joins that link several tables together to form more comprehensive datasets.`
        },
        { type: 'sql', data: from[10] },
        { type: 'sql', data: from[11] }
      ],
      link: "#complex_joins"
    },
    {
      title: "Conclusion",
      content: [
        {
          type: 'markdown',
          content: `Understanding the FROM clause and its diverse applications, from single-table selections to complex multi-table operations, is key to mastering SQL. This guide provides a foundational understanding that will aid in building more sophisticated queries.`
        }
      ],
      link: "#conclusion"
    }
];

export const keyWords = ["sql language", "sql programming", "sql query", "learn sql", "sql from"];