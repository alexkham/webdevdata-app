export const select=[

    
        {
          title: "Basic Single Column Selection",
          code: `SELECT column_name FROM table_name;`,
          explanation: "This query demonstrates the simplest form of SELECT statement, retrieving a single column from a table."
        },
        {
          title: "Employee First Name Retrieval",
          code: `SELECT firstName FROM Employees;`,
          explanation: "This query selects only the firstName column from the Employees table, showing a practical application of single column selection."
        },
        {
          title: "Single Column Selection with Join",
          code: `SELECT tableA.column_name FROM tableA JOIN tableB ON tableA.commonColumn = tableB.commonColumn;`,
          explanation: "This query showcases how to select a single column from one table while joining it with another table based on a common column."
        },
        {
          title: "Employee Department ID with Join",
          code: `SELECT Employees.departmentID FROM Employees JOIN Departments ON Employees.deptID = Departments.deptID;`,
          explanation: "This query retrieves the departmentID from the Employees table while joining it with the Departments table, demonstrating a practical join operation."
        },
        {
          title: "DISTINCT Keyword Usage",
          code: `SELECT DISTINCT column_name FROM table_name;`,
          explanation: "This query uses the DISTINCT keyword to eliminate duplicate values in the result set, returning only unique values from the specified column."
        },
        {
          title: "Unique Department Selection",
          code: `SELECT DISTINCT department FROM Employees;`,
          explanation: "This query retrieves a list of unique departments from the Employees table, showcasing a practical use of the DISTINCT keyword."
        },
        {
          title: "Column Aliasing",
          code: `SELECT column_name AS alias_name FROM table_name;`,
          explanation: "This query demonstrates how to use aliases to rename columns in the result set, making the output more readable or meaningful."
        },
        {
          title: "Employee Name Aliasing",
          code: `SELECT firstName AS First, lastName AS Last FROM Employees;`,
          explanation: "This query selects the firstName and lastName columns from the Employees table, aliasing them as 'First' and 'Last' respectively."
        },
        {
          title: "Multiple Column Selection",
          code: `SELECT column1, column2, column3 FROM table_name;`,
          explanation: "This query shows how to select multiple columns from a single table in one SELECT statement."
        },
        {
          title: "Employee Details Retrieval",
          code: `SELECT firstName, lastName, email FROM Employees;`,
          explanation: "This query retrieves multiple pieces of information (first name, last name, and email) about employees from the Employees table."
        },
        {
          title: "Column Calculation",
          code: `SELECT column1, column2, (column1 * column2) AS calculated_column FROM table_name;`,
          explanation: "This query demonstrates how to perform calculations on columns directly in the SELECT statement and alias the result."
        },
        {
          title: "Order Total Cost Calculation",
          code: `SELECT price, quantity, (price * quantity) AS TotalCost FROM Orders;`,
          explanation: "This query calculates the total cost of each order by multiplying price and quantity, aliasing the result as 'TotalCost'."
        },
        {
            "title": "Multi-Table Column Selection",
            "code": "SELECT table1.column1, table2.column2 FROM table1 JOIN table2 ON\ntable1.common_column = table2.common_column;",
            "explanation": "This query demonstrates how to select columns from multiple tables using a JOIN clause. It shows the general syntax for combining data from two tables based on a common column."
          },
        {
          title: "Comprehensive Employee-Department Info",
          code: `SELECT Employees.firstName, Employees.lastName,\n Departments.departmentName, Departments.location FROM Employees \nJOIN Departments ON Employees.deptID = Departments.deptID;`,
          explanation: "This query retrieves detailed information about employees and their departments by selecting multiple columns from joined tables."
        },
        {
          title: "Select All Columns",
          code: `SELECT * FROM table_name;`,
          explanation: "This query uses the asterisk (*) to select all columns from a specified table."
        },
        {
          title: "Retrieve All Employee Data",
          code: `SELECT * FROM Employees;`,
          explanation: "This query selects all columns and rows from the Employees table, demonstrating a practical use of the SELECT * syntax."
        },
        {
          title: "String Concatenation",
          code: `SELECT CONCAT(column1, ' ', column2) AS full_name FROM table_name;`,
          explanation: "This query shows how to concatenate values from multiple columns into a single column using the CONCAT function."
        },
        {
          title: "Employee Full Name Creation",
          code: `SELECT CONCAT(firstName, ' ', lastName) AS FullName FROM Employees;`,
          explanation: "This query concatenates the firstName and lastName columns from the Employees table to create a full name, aliased as 'FullName'."
        },
        {
          title: "Conditional Logic in SELECT",
          code: `SELECT column_name, CASE WHEN condition THEN 'Result1'\nELSE 'Result2' END AS new_column FROM table_name;`,
          explanation: "This query demonstrates the use of a CASE statement within a SELECT clause to apply conditional logic to the result set."
        },
        {
          title: "Employee Salary Range Classification",
          code: `SELECT firstName, CASE WHEN salary > 50000 THEN 'High'\nELSE 'Low' END AS SalaryRange FROM Employees;`,
          explanation: "This query classifies employees' salaries as 'High' or 'Low' based on whether they exceed $50,000, using a CASE statement."
        },
        {
          title: "Subquery in SELECT",
          code: `SELECT column_name, (SELECT AVG(column2) FROM another_table WHERE condition) AS average FROM table_name;`,
          explanation: "This query shows how to use a subquery within a SELECT statement to calculate a value based on data from another table."
        },
        {
          title: "Employee Order Count",
          code: `SELECT employeeID, (SELECT COUNT(*) FROM Orders WHERE Orders.employeeID = Employees.employeeID) AS NumberOfOrders FROM Employees;`,
          explanation: "This query counts the number of orders for each employee using a correlated subquery in the SELECT clause."
        },
        // {
        //   title: "Pattern Matching with LIKE",
        //   code: `SELECT * FROM table_name WHERE column_name LIKE '%pattern%';`,
        //   explanation: "This query demonstrates the use of the LIKE operator for pattern matching in a WHERE clause."
        // },
        // {
        //   title: "Employees with Names Starting with 'A'",
        //   code: `SELECT * FROM Employees WHERE firstName LIKE 'A%';`,
        //   explanation: "This query retrieves all information about employees whose first names start with the letter 'A', showcasing a practical use of the LIKE operator."
        // },
        {
            "title": "Aggregation Functions with GROUP BY",
            "code": "SELECT column1, AGG_FUNCTION(column2) FROM table_name\nGROUP BY column1;",
            "explanation": "This query demonstrates the use of aggregation functions with GROUP BY. It selects a column to group by (column1) and applies an aggregate function (AGG_FUNCTION) to another column (column2). The GROUP BY clause groups rows with the same values in column1, and the aggregate function is applied to each group separately."
          },
          {
            "title": "Employee Count by Department",
            "code": "SELECT department, COUNT(*) as employee_count FROM Employees\nGROUP BY department;",
            "explanation": "This example query counts the number of employees in each department. It groups the rows in the Employees table by the department column, then uses the COUNT(*) function to count the number of rows (employees) in each group. The result provides a summary of how many employees are in each department."
          }
      ]



