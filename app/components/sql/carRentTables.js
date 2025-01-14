// Cars table
export const carsTable = [
    { car_id: 1, car_type: "Sedan", day_rate: 50, manufacture_year: 2020, license_type: "Standard" },
    { car_id: 2, car_type: "SUV", day_rate: 70, manufacture_year: 2021, license_type: "Standard" },
    { car_id: 3, car_type: "Luxury", day_rate: 100, manufacture_year: 2022, license_type: "Premium" },
    { car_id: 4, car_type: "Economy", day_rate: 40, manufacture_year: 2019, license_type: "Standard" },
    { car_id: 5, car_type: "Van", day_rate: 80, manufacture_year: 2020, license_type: "Commercial" }
  ];
  
  // Clients table
  export const clientsTable = [
    { client_id: 101, client_name: "John Doe", address: "123 Main St", phone_number: "555-1234", birth_date: "1985-05-15", license_type: "Standard" },
    { client_id: 102, client_name: "Jane Smith", address: "456 Elm St", phone_number: "555-5678", birth_date: "1990-08-22", license_type: "Standard" },
    { client_id: 103, client_name: "Bob Johnson", address: "789 Oak Ave", phone_number: "555-9012", birth_date: "1978-11-30", license_type: "Premium" },
    { client_id: 104, client_name: "Alice Brown", address: "321 Pine Rd", phone_number: "555-3456", birth_date: "1995-02-10", license_type: "Standard" },
    { client_id: 105, client_name: "Charlie Davis", address: "654 Maple Ln", phone_number: "555-7890", birth_date: "1982-07-05", license_type: "Commercial" }
  ];
  
  // CarRent table
  export const carRentTable = [
    { car_id: 1, client_id: 101, rental_date: "2023-06-01", rental_period: 3 },
    { car_id: 2, client_id: 102, rental_date: "2023-06-02", rental_period: 5 },
    { car_id: 3, client_id: 103, rental_date: "2023-06-03", rental_period: 2 },
    { car_id: 4, client_id: 104, rental_date: "2023-06-04", rental_period: 7 },
    { car_id: 5, client_id: 105, rental_date: "2023-06-05", rental_period: 4 }
  ];
  
  // Bills table
  export const billsTable = [
    { order_id: 1001, bill_date: "2023-06-04", payment_date: "2023-06-04", total_payment: 150 },
    { order_id: 1002, bill_date: "2023-06-07", payment_date: "2023-06-07", total_payment: 350 },
    { order_id: 1003, bill_date: "2023-06-05", payment_date: "2023-06-05", total_payment: 200 },
    { order_id: 1004, bill_date: "2023-06-11", payment_date: "2023-06-11", total_payment: 280 },
    { order_id: 1005, bill_date: "2023-06-09", payment_date: "2023-06-09", total_payment: 320 }
  ];
  
  // ClientBill table
  export const clientBillTable = [
    { order_id: 1001, client_id: 101, status: "Paid" },
    { order_id: 1002, client_id: 102, status: "Paid" },
    { order_id: 1003, client_id: 103, status: "Pending" },
    { order_id: 1004, client_id: 104, status: "Paid" },
    { order_id: 1005, client_id: 105, status: "Pending" }
  ];
  
  // OrderCarRent table
  export const orderCarRentTable = [
    { order_id: 1001, car_id: 1 },
    { order_id: 1002, car_id: 2 },
    { order_id: 1003, car_id: 3 },
    { order_id: 1004, car_id: 4 },
    { order_id: 1005, car_id: 5 }
  ];