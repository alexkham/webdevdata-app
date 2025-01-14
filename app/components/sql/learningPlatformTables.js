// Courses table
export const coursesTable = [
    { course_id: 1, title: "Introduction to JavaScript", description: "Learn the basics of JavaScript programming", instructor_id: 101, category: "Programming", price: 49.99 },
    { course_id: 2, title: "Advanced Machine Learning", description: "Explore advanced topics in ML", instructor_id: 102, category: "Data Science", price: 79.99 },
    { course_id: 3, title: "Digital Marketing Fundamentals", description: "Master the essentials of digital marketing", instructor_id: 103, category: "Marketing", price: 59.99 },
    { course_id: 4, title: "Web Development with React", description: "Build modern web applications with React", instructor_id: 101, category: "Programming", price: 69.99 },
    { course_id: 5, title: "Data Visualization with Python", description: "Create stunning visualizations using Python libraries", instructor_id: 104, category: "Data Science", price: 54.99 },
    { course_id: 6, title: "SEO Strategies", description: "Optimize your website for search engines", instructor_id: 103, category: "Marketing", price: 64.99 },
    { course_id: 7, title: "Mobile App Development with Flutter", description: "Build cross-platform mobile apps", instructor_id: 105, category: "Programming", price: 74.99 }
  ];
  
  // Students table
  export const studentsTable = [
    { student_id: 1001, name: "Alice Johnson", email: "alice@example.com", registration_date: "2023-01-15" },
    { student_id: 1002, name: "Bob Smith", email: "bob@example.com", registration_date: "2023-02-20" },
    { student_id: 1003, name: "Charlie Brown", email: "charlie@example.com", registration_date: "2023-03-10" },
    { student_id: 1004, name: "Diana Ross", email: "diana@example.com", registration_date: "2023-03-25" },
    { student_id: 1005, name: "Edward Norton", email: "edward@example.com", registration_date: "2023-04-05" },
    { student_id: 1006, name: "Fiona Apple", email: "fiona@example.com", registration_date: "2023-04-20" },
    { student_id: 1007, name: "George Clooney", email: "george@example.com", registration_date: "2023-05-01" }
  ];
  
  // Instructors table
  export const instructorsTable = [
    { instructor_id: 101, name: "Dr. Jane Doe", email: "jane.doe@example.com", bio: "Experienced JavaScript developer and educator" },
    { instructor_id: 102, name: "Prof. John Smith", email: "john.smith@example.com", bio: "AI researcher with 10 years of industry experience" },
    { instructor_id: 103, name: "Sarah Williams", email: "sarah.williams@example.com", bio: "Digital marketing expert and consultant" },
    { instructor_id: 104, name: "Michael Johnson", email: "michael.johnson@example.com", bio: "Data scientist and Python enthusiast" },
    { instructor_id: 105, name: "Emily Chen", email: "emily.chen@example.com", bio: "Mobile app developer and Flutter specialist" }
  ];
  
  // Enrollments table
  export const enrollmentsTable = [
    { enrollment_id: 1, student_id: 1001, course_id: 1, enrollment_date: "2023-03-01", completion_status: "In Progress" },
    { enrollment_id: 2, student_id: 1002, course_id: 2, enrollment_date: "2023-03-15", completion_status: "Not Started" },
    { enrollment_id: 3, student_id: 1003, course_id: 3, enrollment_date: "2023-04-01", completion_status: "Completed" },
    { enrollment_id: 4, student_id: 1004, course_id: 4, enrollment_date: "2023-04-10", completion_status: "In Progress" },
    { enrollment_id: 5, student_id: 1005, course_id: 5, enrollment_date: "2023-04-20", completion_status: "Not Started" },
    { enrollment_id: 6, student_id: 1006, course_id: 6, enrollment_date: "2023-05-01", completion_status: "In Progress" },
    { enrollment_id: 7, student_id: 1007, course_id: 7, enrollment_date: "2023-05-10", completion_status: "Not Started" }
  ];
  
  // Lessons table
  export const lessonsTable = [
    { lesson_id: 1, course_id: 1, title: "Variables and Data Types", content: "Learn about JavaScript variables and data types", order: 1 },
    { lesson_id: 2, course_id: 1, title: "Functions and Scope", content: "Understand functions and variable scope in JavaScript", order: 2 },
    { lesson_id: 3, course_id: 2, title: "Neural Networks Basics", content: "Introduction to neural networks and their applications", order: 1 },
    { lesson_id: 4, course_id: 3, title: "Social Media Marketing", content: "Strategies for effective social media marketing", order: 1 },
    { lesson_id: 5, course_id: 4, title: "React Components", content: "Understanding and creating React components", order: 1 },
    { lesson_id: 6, course_id: 5, title: "Matplotlib Basics", content: "Getting started with Matplotlib for data visualization", order: 1 },
    { lesson_id: 7, course_id: 6, title: "On-Page SEO Techniques", content: "Optimizing web pages for search engines", order: 1 }
  ];
  
  // Quizzes table
  export const quizzesTable = [
    { quiz_id: 1, lesson_id: 1, title: "JavaScript Basics Quiz", questions: JSON.stringify([{"question": "What is a variable?", "options": ["A", "B", "C", "D"], "correct_answer": "A"}]), passing_score: 70 },
    { quiz_id: 2, lesson_id: 2, title: "Functions Quiz", questions: JSON.stringify([{"question": "What is a closure?", "options": ["A", "B", "C", "D"], "correct_answer": "B"}]), passing_score: 75 },
    { quiz_id: 3, lesson_id: 3, title: "Neural Networks Quiz", questions: JSON.stringify([{"question": "What is a perceptron?", "options": ["A", "B", "C", "D"], "correct_answer": "C"}]), passing_score: 80 },
    { quiz_id: 4, lesson_id: 4, title: "Social Media Platforms Quiz", questions: JSON.stringify([{"question": "Which platform is best for B2B marketing?", "options": ["A", "B", "C", "D"], "correct_answer": "B"}]), passing_score: 70 },
    { quiz_id: 5, lesson_id: 5, title: "React Components Quiz", questions: JSON.stringify([{"question": "What is a stateless component?", "options": ["A", "B", "C", "D"], "correct_answer": "A"}]), passing_score: 75 },
    { quiz_id: 6, lesson_id: 6, title: "Matplotlib Quiz", questions: JSON.stringify([{"question": "How do you create a line plot?", "options": ["A", "B", "C", "D"], "correct_answer": "C"}]), passing_score: 70 },
    { quiz_id: 7, lesson_id: 7, title: "SEO Fundamentals Quiz", questions: JSON.stringify([{"question": "What is a meta description?", "options": ["A", "B", "C", "D"], "correct_answer": "B"}]), passing_score: 75 }
  ];
  
  // Assignments table
  export const assignmentsTable = [
    { assignment_id: 1, course_id: 1, title: "Create a Simple JavaScript App", description: "Build a calculator using JavaScript", due_date: "2023-04-15" },
    { assignment_id: 2, course_id: 2, title: "Implement a Neural Network", description: "Create a basic neural network using Python", due_date: "2023-05-01" },
    { assignment_id: 3, course_id: 3, title: "Develop a Marketing Strategy", description: "Create a digital marketing plan for a fictional product", due_date: "2023-04-30" },
    { assignment_id: 4, course_id: 4, title: "Build a React Component", description: "Create a reusable React component with props and state", due_date: "2023-05-15" },
    { assignment_id: 5, course_id: 5, title: "Data Visualization Project", description: "Create an interactive dashboard using Python and Matplotlib", due_date: "2023-05-20" },
    { assignment_id: 6, course_id: 6, title: "SEO Audit", description: "Perform an SEO audit on a given website and provide recommendations", due_date: "2023-05-25" },
    { assignment_id: 7, course_id: 7, title: "Mobile App Prototype", description: "Design and implement a prototype for a mobile app using Flutter", due_date: "2023-06-01" }
  ];
  
  // Discussion Forums table
  export const discussionForumsTable = [
    { forum_id: 1, course_id: 1, topic: "JavaScript Best Practices", created_date: "2023-03-10" },
    { forum_id: 2, course_id: 2, topic: "Latest Advancements in AI", created_date: "2023-03-20" },
    { forum_id: 3, course_id: 3, topic: "Social Media Marketing Strategies", created_date: "2023-04-05" },
    { forum_id: 4, course_id: 4, topic: "React Hooks vs Class Components", created_date: "2023-04-15" },
    { forum_id: 5, course_id: 5, topic: "Data Visualization Techniques", created_date: "2023-04-25" },
    { forum_id: 6, course_id: 6, topic: "Google's Latest Algorithm Updates", created_date: "2023-05-05" },
    { forum_id: 7, course_id: 7, topic: "Cross-platform vs Native App Development", created_date: "2023-05-15" }
  ];