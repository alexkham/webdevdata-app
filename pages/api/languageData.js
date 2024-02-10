export default function handler(req, res) {
    // Define the entire data set directly within the API route
    const data = {
      javascript: {
        arrays_methods: [
          { name: "push", description: "Adds one or more elements to the end of an array and returns the new length." },
          { name: "pop", description: "Removes the last element from an array and returns that element." },
          // Include more array methods as needed
        ],
        // You can include more categories (like strings_methods, etc.) and other languages
      },
      // Include data for other programming languages as needed
    };
  
    // Serve the entire data set as a response to any request to this API route
    res.status(200).json(data);
  }