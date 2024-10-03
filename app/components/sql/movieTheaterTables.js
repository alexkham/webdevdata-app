// Movies table
export const moviesTable = [
    { movie_id: 1, title: "The Space Adventure", genre: "Sci-Fi", director: "Jane Doe", duration: 120, rating: "PG-13" },
    { movie_id: 2, title: "Love in Paris", genre: "Romance", director: "John Smith", duration: 110, rating: "PG" },
    { movie_id: 3, title: "The Mystery of the Lost City", genre: "Adventure", director: "Alice Johnson", duration: 135, rating: "PG-13" },
    { movie_id: 4, title: "Laugh Out Loud", genre: "Comedy", director: "Bob Williams", duration: 95, rating: "R" },
    { movie_id: 5, title: "Midnight Shadows", genre: "Horror", director: "Emma Brown", duration: 105, rating: "R" },
    { movie_id: 6, title: "The Great Heist", genre: "Action", director: "Michael Lee", duration: 130, rating: "PG-13" }
  ];
  
  // Theaters table
  export const theatersTable = [
    { theater_id: 1, name: "Starlight Cinema", location: "123 Main St, Cityville", capacity: 200, screens: 5 },
    { theater_id: 2, name: "Metroplex", location: "456 Oak Ave, Townsburg", capacity: 500, screens: 10 },
    { theater_id: 3, name: "Sunset Drive-In", location: "789 Beach Rd, Coastville", capacity: 150, screens: 2 },
    { theater_id: 4, name: "Downtown Cinemas", location: "321 Elm St, Urbanville", capacity: 300, screens: 6 },
    { theater_id: 5, name: "Mall Movieplex", location: "654 Shop Lane, Malltown", capacity: 400, screens: 8 }
  ];
  
  // Screenings table
  export const screeningsTable = [
    { screening_id: 1, movie_id: 1, theater_id: 1, screen_number: 1, start_time: "2023-06-15 19:00:00", end_time: "2023-06-15 21:00:00", available_seats: 180 },
    { screening_id: 2, movie_id: 2, theater_id: 1, screen_number: 2, start_time: "2023-06-15 20:00:00", end_time: "2023-06-15 21:50:00", available_seats: 150 },
    { screening_id: 3, movie_id: 3, theater_id: 2, screen_number: 1, start_time: "2023-06-16 18:30:00", end_time: "2023-06-16 20:45:00", available_seats: 200 },
    { screening_id: 4, movie_id: 4, theater_id: 3, screen_number: 1, start_time: "2023-06-16 21:00:00", end_time: "2023-06-16 22:35:00", available_seats: 100 },
    { screening_id: 5, movie_id: 5, theater_id: 4, screen_number: 3, start_time: "2023-06-17 22:00:00", end_time: "2023-06-17 23:45:00", available_seats: 120 },
    { screening_id: 6, movie_id: 6, theater_id: 5, screen_number: 2, start_time: "2023-06-17 19:30:00", end_time: "2023-06-17 21:40:00", available_seats: 180 },
    { screening_id: 7, movie_id: 1, theater_id: 2, screen_number: 3, start_time: "2023-06-18 14:00:00", end_time: "2023-06-18 16:00:00", available_seats: 250 }
  ];
  
  // Tickets table
  export const ticketsTable = [
    { ticket_id: 1, screening_id: 1, customer_id: 1, seat_number: "A12", price: 12.50, purchase_time: "2023-06-14 10:30:00" },
    { ticket_id: 2, screening_id: 1, customer_id: 2, seat_number: "B7", price: 12.50, purchase_time: "2023-06-14 11:45:00" },
    { ticket_id: 3, screening_id: 2, customer_id: 3, seat_number: "C5", price: 12.50, purchase_time: "2023-06-15 09:15:00" },
    { ticket_id: 4, screening_id: 3, customer_id: 4, seat_number: "D10", price: 15.00, purchase_time: "2023-06-15 14:20:00" },
    { ticket_id: 5, screening_id: 4, customer_id: 5, seat_number: "E8", price: 10.00, purchase_time: "2023-06-16 16:00:00" },
    { ticket_id: 6, screening_id: 5, customer_id: 6, seat_number: "F3", price: 13.50, purchase_time: "2023-06-16 20:30:00" },
    { ticket_id: 7, screening_id: 6, customer_id: 1, seat_number: "G11", price: 14.00, purchase_time: "2023-06-17 12:45:00" }
  ];
  
  // Customers table
  export const customersTable = [
    { customer_id: 1, name: "Alice Johnson", email: "alice@email.com", phone: "555-1234", membership_status: "Gold" },
    { customer_id: 2, name: "Bob Smith", email: "bob@email.com", phone: "555-5678", membership_status: "Silver" },
    { customer_id: 3, name: "Charlie Brown", email: "charlie@email.com", phone: "555-9012", membership_status: "Bronze" },
    { customer_id: 4, name: "Diana Ross", email: "diana@email.com", phone: "555-3456", membership_status: "Gold" },
    { customer_id: 5, name: "Edward Norton", email: "edward@email.com", phone: "555-7890", membership_status: "Silver" },
    { customer_id: 6, name: "Fiona Apple", email: "fiona@email.com", phone: "555-2345", membership_status: "Bronze" }
  ];
  
  // Concessions table
  export const concessionsTable = [
    { item_id: 1, name: "Large Popcorn", price: 8.99, stock_quantity: 100 },
    { item_id: 2, name: "Medium Soda", price: 4.99, stock_quantity: 150 },
    { item_id: 3, name: "Nachos", price: 6.99, stock_quantity: 75 },
    { item_id: 4, name: "Candy Box", price: 3.99, stock_quantity: 200 },
    { item_id: 5, name: "Hot Dog", price: 5.99, stock_quantity: 80 },
    { item_id: 6, name: "Ice Cream", price: 4.50, stock_quantity: 60 }
  ];
  
  // Employees table
  export const employeesTable = [
    { employee_id: 1, name: "John Doe", position: "Manager", email: "john@theater.com", phone: "555-1111", hire_date: "2020-01-15" },
    { employee_id: 2, name: "Jane Smith", position: "Ticket Seller", email: "jane@theater.com", phone: "555-2222", hire_date: "2021-03-20" },
    { employee_id: 3, name: "Mike Johnson", position: "Usher", email: "mike@theater.com", phone: "555-3333", hire_date: "2022-05-10" },
    { employee_id: 4, name: "Sarah Williams", position: "Concession Stand", email: "sarah@theater.com", phone: "555-4444", hire_date: "2021-07-05" },
    { employee_id: 5, name: "Tom Brown", position: "Projectionist", email: "tom@theater.com", phone: "555-5555", hire_date: "2020-11-30" },
    { employee_id: 6, name: "Emily Davis", position: "Cleaner", email: "emily@theater.com", phone: "555-6666", hire_date: "2022-02-14" }
  ];
  
  // Reviews table
  export const reviewsTable = [
    { review_id: 1, movie_id: 1, customer_id: 1, rating: 4.5, comment: "Great special effects!", review_date: "2023-06-15" },
    { review_id: 2, movie_id: 2, customer_id: 2, rating: 3.5, comment: "Charming but predictable", review_date: "2023-06-16" },
    { review_id: 3, movie_id: 3, customer_id: 3, rating: 5, comment: "Kept me on the edge of my seat!", review_date: "2023-06-17" },
    { review_id: 4, movie_id: 4, customer_id: 4, rating: 4, comment: "Hilarious from start to finish", review_date: "2023-06-18" },
    { review_id: 5, movie_id: 5, customer_id: 5, rating: 3, comment: "Scary but not terrifying", review_date: "2023-06-19" },
    { review_id: 6, movie_id: 6, customer_id: 6, rating: 4.5, comment: "Action-packed and thrilling", review_date: "2023-06-20" },
    { review_id: 7, movie_id: 1, customer_id: 2, rating: 4, comment: "Enjoyable sci-fi adventure", review_date: "2023-06-21" }
  ];