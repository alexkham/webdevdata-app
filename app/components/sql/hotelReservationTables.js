// Rooms table
export const roomsTable = [
    { room_id: 101, room_number: "101", type: "Standard", capacity: 2, price_per_night: 100.00, status: "Available" },
    { room_id: 102, room_number: "102", type: "Deluxe", capacity: 2, price_per_night: 150.00, status: "Occupied" },
    { room_id: 201, room_number: "201", type: "Suite", capacity: 4, price_per_night: 250.00, status: "Available" },
    { room_id: 202, room_number: "202", type: "Standard", capacity: 2, price_per_night: 100.00, status: "Maintenance" },
    { room_id: 301, room_number: "301", type: "Deluxe", capacity: 2, price_per_night: 150.00, status: "Available" },
    { room_id: 302, room_number: "302", type: "Suite", capacity: 4, price_per_night: 250.00, status: "Occupied" },
    { room_id: 401, room_number: "401", type: "Penthouse", capacity: 6, price_per_night: 500.00, status: "Available" }
  ];
  
  // Guests table
  export const guestsTable = [
    { guest_id: 1, name: "John Doe", email: "johndoe@email.com", phone_number: "555-1234", address: "123 Main St, Anytown, USA" },
    { guest_id: 2, name: "Jane Smith", email: "janesmith@email.com", phone_number: "555-5678", address: "456 Elm St, Somewhere, USA" },
    { guest_id: 3, name: "Robert Johnson", email: "rjohnson@email.com", phone_number: "555-9012", address: "789 Oak Ave, Nowhere, USA" },
    { guest_id: 4, name: "Emily Brown", email: "emilybrown@email.com", phone_number: "555-3456", address: "321 Pine Rd, Elsewhere, USA" },
    { guest_id: 5, name: "Michael Wilson", email: "mwilson@email.com", phone_number: "555-7890", address: "654 Maple Ln, Anywhere, USA" },
    { guest_id: 6, name: "Sarah Davis", email: "sarahdavis@email.com", phone_number: "555-2345", address: "987 Cedar Blvd, Someplace, USA" }
  ];
  
  // Reservations table
  export const reservationsTable = [
    { reservation_id: 1, guest_id: 1, room_id: 101, check_in_date: "2023-06-01", check_out_date: "2023-06-03", total_price: 200.00 },
    { reservation_id: 2, guest_id: 2, room_id: 102, check_in_date: "2023-06-02", check_out_date: "2023-06-05", total_price: 450.00 },
    { reservation_id: 3, guest_id: 3, room_id: 201, check_in_date: "2023-06-05", check_out_date: "2023-06-10", total_price: 1250.00 },
    { reservation_id: 4, guest_id: 4, room_id: 301, check_in_date: "2023-06-07", check_out_date: "2023-06-09", total_price: 300.00 },
    { reservation_id: 5, guest_id: 5, room_id: 302, check_in_date: "2023-06-10", check_out_date: "2023-06-15", total_price: 1250.00 },
    { reservation_id: 6, guest_id: 6, room_id: 401, check_in_date: "2023-06-20", check_out_date: "2023-06-25", total_price: 2500.00 },
    { reservation_id: 7, guest_id: 1, room_id: 101, check_in_date: "2023-07-01", check_out_date: "2023-07-03", total_price: 200.00 }
  ];
  
  // Services table
  export const servicesTable = [
    { service_id: 1, name: "Room Service", description: "In-room dining", price: 20.00 },
    { service_id: 2, name: "Spa Treatment", description: "Full body massage", price: 80.00 },
    { service_id: 3, name: "Laundry", description: "Wash and fold service", price: 15.00 },
    { service_id: 4, name: "Airport Shuttle", description: "Round trip airport transfer", price: 50.00 },
    { service_id: 5, name: "Gym Access", description: "24/7 fitness center access", price: 10.00 },
    { service_id: 6, name: "Late Check-out", description: "Extended check-out until 2 PM", price: 30.00 }
  ];
  
  // Employees table
  export const employeesTable = [
    { employee_id: 1, name: "Alice Johnson", position: "Front Desk Manager", contact_info: "alicejohnson@hotel.com, 555-1111", schedule: "Mon-Fri, 9AM-5PM" },
    { employee_id: 2, name: "Bob Smith", position: "Concierge", contact_info: "bobsmith@hotel.com, 555-2222", schedule: "Wed-Sun, 10AM-6PM" },
    { employee_id: 3, name: "Carol Davis", position: "Housekeeper", contact_info: "caroldavis@hotel.com, 555-3333", schedule: "Mon-Fri, 7AM-3PM" },
    { employee_id: 4, name: "David Wilson", position: "Maintenance Technician", contact_info: "davidwilson@hotel.com, 555-4444", schedule: "Tue-Sat, 11AM-7PM" },
    { employee_id: 5, name: "Emma Brown", position: "Chef", contact_info: "emmabrown@hotel.com, 555-5555", schedule: "Wed-Sun, 2PM-10PM" },
    { employee_id: 6, name: "Frank Lee", position: "Bellhop", contact_info: "franklee@hotel.com, 555-6666", schedule: "Thu-Mon, 8AM-4PM" }
  ];
  
  // Billing table
  export const billingTable = [
    { bill_id: 1, reservation_id: 1, total_amount: 240.00, payment_status: "Paid", bill_date: "2023-06-03" },
    { bill_id: 2, reservation_id: 2, total_amount: 530.00, payment_status: "Paid", bill_date: "2023-06-05" },
    { bill_id: 3, reservation_id: 3, total_amount: 1330.00, payment_status: "Pending", bill_date: "2023-06-10" },
    { bill_id: 4, reservation_id: 4, total_amount: 320.00, payment_status: "Paid", bill_date: "2023-06-09" },
    { bill_id: 5, reservation_id: 5, total_amount: 1340.00, payment_status: "Paid", bill_date: "2023-06-15" },
    { bill_id: 6, reservation_id: 6, total_amount: 2600.00, payment_status: "Pending", bill_date: "2023-06-25" },
    { bill_id: 7, reservation_id: 7, total_amount: 220.00, payment_status: "Pending", bill_date: "2023-07-03" }
  ];
  
  // Facilities table
  export const facilitiesTable = [
    { facility_id: 1, name: "Swimming Pool", description: "Outdoor pool with loungers", capacity: 50 },
    { facility_id: 2, name: "Fitness Center", description: "24/7 gym with modern equipment", capacity: 30 },
    { facility_id: 3, name: "Conference Room A", description: "Large meeting room with A/V equipment", capacity: 100 },
    { facility_id: 4, name: "Restaurant", description: "Fine dining restaurant", capacity: 80 },
    { facility_id: 5, name: "Spa", description: "Relaxation and massage services", capacity: 20 },
    { facility_id: 6, name: "Business Center", description: "Computers and printing services", capacity: 10 },
    { facility_id: 7, name: "Rooftop Bar", description: "Bar with panoramic city views", capacity: 60 }
  ];