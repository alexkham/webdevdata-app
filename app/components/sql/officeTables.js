// Employee table (already provided)
export const employeesTable = [
    { employee_id: 1, first_name: "John", last_name: "Doe", department_id: 5, salary: 50000 },
    { employee_id: 2, first_name: "Jane", last_name: "Smith", department_id: 5, salary: 55000 },
    { employee_id: 3, first_name: "Alice", last_name: "Johnson", department_id: 3, salary: 60000 },
    { employee_id: 4, first_name: "Bob", last_name: "Brown", department_id: 3, salary: 65000 },
    { employee_id: 5, first_name: "Charlie", last_name: "Davis", department_id: 2, salary: 70000 },
    { employee_id: 6, first_name: "Diana", last_name: "Wilson", department_id: 5, salary: 52000 },
    { employee_id: 7, first_name: "Eva", last_name: "Taylor", department_id: 4, salary: 58000 },
    { employee_id: 8, first_name: "Frank", last_name: "Thomas", department_id: 2, salary: 67000 },
    { employee_id: 9, first_name: "Grace", last_name: "Roberts", department_id: 4, salary: 59000 },
    { employee_id: 10, first_name: "Henry", last_name: "Clark", department_id: 3, salary: 63000 },
    { employee_id: 11, first_name: "Ivy", last_name: "Lewis", department_id: 5, salary: 51000 },
    { employee_id: 12, first_name: "Jack", last_name: "Lee", department_id: 4, salary: 57000 }
  ];
  
  // Department table
  export const departmentsTable = [
    { department_id: 1, department_name: "HR", floor: 2, head: "John Doe" },
    { department_id: 2, department_name: "IT", floor: 3, head: "Jane Smith" },
    { department_id: 3, department_name: "Finance", floor: 4, head: "Bob Johnson" },
    { department_id: 4, department_name: "Marketing", floor: 1, head: "Alice Brown" },
    { department_id: 5, department_name: "Sales", floor: 2, head: "Charlie Davis" }
  ];
  
  // Department Budget table (renamed from dbudget)
  export const departmentBudgetTable = [
    { department_id: 1, budget_year: 2023, budget: 500000 },
    { department_id: 2, budget_year: 2023, budget: 1000000 },
    { department_id: 3, budget_year: 2023, budget: 750000 },
    { department_id: 4, budget_year: 2023, budget: 600000 },
    { department_id: 5, budget_year: 2023, budget: 800000 }
  ];
  
  // Project table
  export const projectsTable = [
    { project_id: 1, project_name: "Website Redesign", department_id: 2, budget: 50000, start_date: "2023-01-15" },
    { project_id: 2, project_name: "Marketing Campaign", department_id: 4, budget: 75000, start_date: "2023-02-01" },
    { project_id: 3, project_name: "Financial Audit", department_id: 3, budget: 30000, start_date: "2023-03-10" },
    { project_id: 4, project_name: "Sales Training", department_id: 5, budget: 25000, start_date: "2023-04-05" },
    { project_id: 5, project_name: "HR System Upgrade", department_id: 1, budget: 40000, start_date: "2023-05-20" }
  ];
  
  // OnProject table
  export const onProjectTable = [
    { project_id: 1, employee_id: 3, from_date: "2023-01-15" },
    { project_id: 1, employee_id: 7, from_date: "2023-01-20" },
    { project_id: 2, employee_id: 9, from_date: "2023-02-01" },
    { project_id: 2, employee_id: 11, from_date: "2023-02-05" },
    { project_id: 3, employee_id: 4, from_date: "2023-03-10" },
    { project_id: 3, employee_id: 10, from_date: "2023-03-15" },
    { project_id: 4, employee_id: 6, from_date: "2023-04-05" },
    { project_id: 4, employee_id: 12, from_date: "2023-04-10" },
    { project_id: 5, employee_id: 1, from_date: "2023-05-20" },
    { project_id: 5, employee_id: 2, from_date: "2023-05-25" }
  ];