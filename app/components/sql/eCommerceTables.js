// Products table
export const productsTable = [
    { product_id: 1, name: "Smartphone X", description: "Latest model with advanced features", price: 799.99, category_id: 1, stock_quantity: 100 },
    { product_id: 2, name: "Laptop Pro", description: "High-performance laptop for professionals", price: 1299.99, category_id: 1, stock_quantity: 50 },
    { product_id: 3, name: "Wireless Headphones", description: "Noise-cancelling Bluetooth headphones", price: 199.99, category_id: 1, stock_quantity: 200 },
    { product_id: 4, name: "Running Shoes", description: "Lightweight shoes for athletes", price: 89.99, category_id: 2, stock_quantity: 150 },
    { product_id: 5, name: "Organic Coffee Beans", description: "Fair-trade coffee from Colombia", price: 14.99, category_id: 3, stock_quantity: 300 },
    { product_id: 6, name: "Yoga Mat", description: "Non-slip exercise mat", price: 29.99, category_id: 2, stock_quantity: 100 },
    { product_id: 7, name: "LED TV 55\"", description: "4K Ultra HD Smart TV", price: 599.99, category_id: 1, stock_quantity: 75 }
  ];
  
  // Customers table
  export const customersTable = [
    { customer_id: 1, name: "John Doe", email: "john@example.com", address: "123 Main St, Anytown, USA", phone_number: "555-1234" },
    { customer_id: 2, name: "Jane Smith", email: "jane@example.com", address: "456 Elm St, Somewhere, USA", phone_number: "555-5678" },
    { customer_id: 3, name: "Bob Johnson", email: "bob@example.com", address: "789 Oak Ave, Nowhere, USA", phone_number: "555-9012" },
    { customer_id: 4, name: "Alice Brown", email: "alice@example.com", address: "321 Pine Rd, Elsewhere, USA", phone_number: "555-3456" },
    { customer_id: 5, name: "Charlie Wilson", email: "charlie@example.com", address: "654 Maple Ln, Anyplace, USA", phone_number: "555-7890" },
    { customer_id: 6, name: "Eva Garcia", email: "eva@example.com", address: "987 Cedar Blvd, Somewhere, USA", phone_number: "555-2345" }
  ];
  
  // Orders table
  export const ordersTable = [
    { order_id: 1, customer_id: 1, order_date: "2023-05-01", total_amount: 999.98, status: "Delivered" },
    { order_id: 2, customer_id: 2, order_date: "2023-05-03", total_amount: 1299.99, status: "Shipped" },
    { order_id: 3, customer_id: 3, order_date: "2023-05-05", total_amount: 244.97, status: "Processing" },
    { order_id: 4, customer_id: 4, order_date: "2023-05-07", total_amount: 599.99, status: "Shipped" },
    { order_id: 5, customer_id: 5, order_date: "2023-05-09", total_amount: 104.98, status: "Delivered" },
    { order_id: 6, customer_id: 6, order_date: "2023-05-11", total_amount: 829.98, status: "Processing" },
    { order_id: 7, customer_id: 1, order_date: "2023-05-13", total_amount: 199.99, status: "Shipped" }
  ];
  
  // Order Items table
  export const orderItemsTable = [
    { order_item_id: 1, order_id: 1, product_id: 1, quantity: 1, price: 799.99 },
    { order_item_id: 2, order_id: 1, product_id: 3, quantity: 1, price: 199.99 },
    { order_item_id: 3, order_id: 2, product_id: 2, quantity: 1, price: 1299.99 },
    { order_item_id: 4, order_id: 3, product_id: 4, quantity: 2, price: 89.99 },
    { order_item_id: 5, order_id: 3, product_id: 5, quantity: 1, price: 14.99 },
    { order_item_id: 6, order_id: 4, product_id: 7, quantity: 1, price: 599.99 },
    { order_item_id: 7, order_id: 5, product_id: 6, quantity: 2, price: 29.99 },
    { order_item_id: 8, order_id: 5, product_id: 5, quantity: 3, price: 14.99 },
    { order_item_id: 9, order_id: 6, product_id: 1, quantity: 1, price: 799.99 },
    { order_item_id: 10, order_id: 6, product_id: 6, quantity: 1, price: 29.99 },
    { order_item_id: 11, order_id: 7, product_id: 3, quantity: 1, price: 199.99 }
  ];
  
  // Categories table
  export const categoriesTable = [
    { category_id: 1, name: "Electronics", description: "Gadgets and electronic devices" },
    { category_id: 2, name: "Sports & Outdoors", description: "Athletic equipment and outdoor gear" },
    { category_id: 3, name: "Food & Beverages", description: "Consumable goods and drinks" },
    { category_id: 4, name: "Home & Garden", description: "Furniture and home improvement items" },
    { category_id: 5, name: "Clothing", description: "Apparel and accessories" },
    { category_id: 6, name: "Books", description: "Physical and digital books" }
  ];
  
  // Reviews table
  export const reviewsTable = [
    { review_id: 1, product_id: 1, customer_id: 1, rating: 5, comment: "Great phone, very fast!", review_date: "2023-05-05" },
    { review_id: 2, product_id: 2, customer_id: 2, rating: 4, comment: "Good laptop, but battery life could be better", review_date: "2023-05-07" },
    { review_id: 3, product_id: 3, customer_id: 3, rating: 5, comment: "Excellent sound quality", review_date: "2023-05-09" },
    { review_id: 4, product_id: 4, customer_id: 4, rating: 4, comment: "Comfortable shoes, great for running", review_date: "2023-05-11" },
    { review_id: 5, product_id: 5, customer_id: 5, rating: 5, comment: "Delicious coffee, will buy again", review_date: "2023-05-13" },
    { review_id: 6, product_id: 6, customer_id: 6, rating: 3, comment: "Decent yoga mat, but could be thicker", review_date: "2023-05-15" },
    { review_id: 7, product_id: 7, customer_id: 1, rating: 5, comment: "Amazing picture quality, love this TV", review_date: "2023-05-17" }
  ];
  
  // Inventory table
  export const inventoryTable = [
    { inventory_id: 1, product_id: 1, quantity: 100, last_updated: "2023-05-01" },
    { inventory_id: 2, product_id: 2, quantity: 50, last_updated: "2023-05-01" },
    { inventory_id: 3, product_id: 3, quantity: 200, last_updated: "2023-05-01" },
    { inventory_id: 4, product_id: 4, quantity: 150, last_updated: "2023-05-01" },
    { inventory_id: 5, product_id: 5, quantity: 300, last_updated: "2023-05-01" },
    { inventory_id: 6, product_id: 6, quantity: 100, last_updated: "2023-05-01" },
    { inventory_id: 7, product_id: 7, quantity: 75, last_updated: "2023-05-01" }
  ];
  
  // Shipping table
  export const shippingTable = [
    { shipping_id: 1, order_id: 1, shipping_method: "Express", tracking_number: "EX123456789", status: "Delivered" },
    { shipping_id: 2, order_id: 2, shipping_method: "Standard", tracking_number: "ST987654321", status: "In Transit" },
    { shipping_id: 3, order_id: 3, shipping_method: "Express", tracking_number: "EX456789123", status: "Processing" },
    { shipping_id: 4, order_id: 4, shipping_method: "Standard", tracking_number: "ST789123456", status: "In Transit" },
    { shipping_id: 5, order_id: 5, shipping_method: "Express", tracking_number: "EX321654987", status: "Delivered" },
    { shipping_id: 6, order_id: 6, shipping_method: "Standard", tracking_number: "ST654987321", status: "Processing" },
    { shipping_id: 7, order_id: 7, shipping_method: "Express", tracking_number: "EX987321654", status: "In Transit" }
  ];