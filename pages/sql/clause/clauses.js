export const  clauses = [
    {
      title: "Basic SELECT clause usage",
      code: `SELECT first_name, last_name FROM employees;`,
      explanation: "This query demonstrates the basic use of SELECT to specify columns (first_name and last_name) and FROM to indicate the source table (employees)."
    },
    {
      title: "Simple FROM Clause",
      code: `SELECT first_name FROM employees;`,
      explanation: "This example shows a minimal query using FROM, selecting only the first_name column from the employees table."
    },
    {
      title: "WHERE Clause for Filtering",
      code: `SELECT first_name, last_name FROM employees WHERE department_id = 5;`,
      explanation: "This query uses the WHERE clause to filter results, returning only employees from department 5."
    },
    {
      title: "GROUP BY with Aggregate Function",
      code: `SELECT department_id, COUNT(*) FROM employees\nGROUP BY department_id;`,
      explanation: "This query demonstrates GROUP BY, aggregating employees by department and counting the number in each."
    },
    {
      title: "HAVING Clause with GROUP BY",
      code: `SELECT department_id, COUNT(*) FROM employees\nGROUP BY department_id\nHAVING COUNT(*) > 10;`,
      explanation: "This example uses HAVING to filter grouped results, showing only departments with more than 10 employees."
    },
    {
      title: "ORDER BY for Sorting",
      code: `SELECT first_name, last_name FROM employees ORDER BY last_name ASC;`,
      explanation: "This query sorts the results by last_name in ascending order, demonstrating the use of ORDER BY."
    },
    {
      title: "LIMIT to Restrict Results",
      code: `SELECT first_name, last_name FROM employees LIMIT 10;`,
      explanation: "This final example uses LIMIT to restrict the output to only the first 10 rows of the result set."
    }
  ];