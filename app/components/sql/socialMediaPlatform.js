// Users table
export const usersTable = [
    { user_id: 1, username: "john_doe", email: "john@example.com", password_hash: "hashed_password_1", full_name: "John Doe", bio: "I love technology!", join_date: "2023-01-15" },
    { user_id: 2, username: "jane_smith", email: "jane@example.com", password_hash: "hashed_password_2", full_name: "Jane Smith", bio: "Nature enthusiast", join_date: "2023-02-20" },
    { user_id: 3, username: "bob_johnson", email: "bob@example.com", password_hash: "hashed_password_3", full_name: "Bob Johnson", bio: "Sports fanatic", join_date: "2023-03-10" },
    { user_id: 4, username: "alice_brown", email: "alice@example.com", password_hash: "hashed_password_4", full_name: "Alice Brown", bio: "Art lover", join_date: "2023-04-05" },
    { user_id: 5, username: "charlie_davis", email: "charlie@example.com", password_hash: "hashed_password_5", full_name: "Charlie Davis", bio: "Foodie", join_date: "2023-05-01" },
    { user_id: 6, username: "emma_wilson", email: "emma@example.com", password_hash: "hashed_password_6", full_name: "Emma Wilson", bio: "Travel addict", join_date: "2023-05-15" }
  ];
  
  // Posts table
  export const postsTable = [
    { post_id: 1, user_id: 1, content: "Just finished a great book!", timestamp: "2023-06-01 10:30:00", likes_count: 15 },
    { post_id: 2, user_id: 2, content: "Beautiful sunset at the beach", timestamp: "2023-06-02 19:45:00", likes_count: 32 },
    { post_id: 3, user_id: 3, content: "Big game tonight! Who's watching?", timestamp: "2023-06-03 18:00:00", likes_count: 8 },
    { post_id: 4, user_id: 4, content: "New art exhibition opening this weekend", timestamp: "2023-06-04 14:20:00", likes_count: 21 },
    { post_id: 5, user_id: 5, content: "Tried an amazing new restaurant!", timestamp: "2023-06-05 20:10:00", likes_count: 27 },
    { post_id: 6, user_id: 6, content: "Packing for my next adventure", timestamp: "2023-06-06 09:15:00", likes_count: 19 },
    { post_id: 7, user_id: 1, content: "Learning a new programming language", timestamp: "2023-06-07 16:40:00", likes_count: 11 }
  ];
  
  // Comments table
  export const commentsTable = [
    { comment_id: 1, post_id: 1, user_id: 2, content: "What book was it?", timestamp: "2023-06-01 11:00:00" },
    { comment_id: 2, post_id: 2, user_id: 3, content: "Wow, stunning view!", timestamp: "2023-06-02 20:00:00" },
    { comment_id: 3, post_id: 3, user_id: 1, content: "I'll be watching!", timestamp: "2023-06-03 18:30:00" },
    { comment_id: 4, post_id: 4, user_id: 5, content: "Sounds interesting, where is it?", timestamp: "2023-06-04 15:00:00" },
    { comment_id: 5, post_id: 5, user_id: 6, content: "What's the restaurant name?", timestamp: "2023-06-05 21:00:00" },
    { comment_id: 6, post_id: 6, user_id: 4, content: "Have a great trip!", timestamp: "2023-06-06 10:00:00" },
    { comment_id: 7, post_id: 7, user_id: 2, content: "Which language?", timestamp: "2023-06-07 17:00:00" }
  ];
  
  // Likes table
  export const likesTable = [
    { like_id: 1, user_id: 2, post_id: 1, timestamp: "2023-06-01 10:45:00" },
    { like_id: 2, user_id: 3, post_id: 1, timestamp: "2023-06-01 11:15:00" },
    { like_id: 3, user_id: 1, post_id: 2, timestamp: "2023-06-02 20:00:00" },
    { like_id: 4, user_id: 4, post_id: 2, timestamp: "2023-06-02 20:30:00" },
    { like_id: 5, user_id: 5, post_id: 3, timestamp: "2023-06-03 18:45:00" },
    { like_id: 6, user_id: 6, post_id: 4, timestamp: "2023-06-04 16:00:00" },
    { like_id: 7, user_id: 1, post_id: 5, timestamp: "2023-06-05 21:30:00" }
  ];
  
  // Friendships table
  export const friendshipsTable = [
    { friendship_id: 1, user_id_1: 1, user_id_2: 2, status: "Accepted", timestamp: "2023-02-25 14:30:00" },
    { friendship_id: 2, user_id_1: 1, user_id_2: 3, status: "Accepted", timestamp: "2023-03-15 09:45:00" },
    { friendship_id: 3, user_id_1: 2, user_id_2: 4, status: "Accepted", timestamp: "2023-04-10 16:20:00" },
    { friendship_id: 4, user_id_1: 3, user_id_2: 5, status: "Pending", timestamp: "2023-05-05 11:10:00" },
    { friendship_id: 5, user_id_1: 4, user_id_2: 6, status: "Accepted", timestamp: "2023-05-20 13:55:00" },
    { friendship_id: 6, user_id_1: 5, user_id_2: 1, status: "Pending", timestamp: "2023-06-01 10:30:00" }
  ];
  
  // Messages table
  export const messagesTable = [
    { message_id: 1, sender_id: 1, receiver_id: 2, content: "Hey, how's it going?", timestamp: "2023-06-01 09:00:00", read_status: true },
    { message_id: 2, sender_id: 2, receiver_id: 1, content: "Hi! All good, how about you?", timestamp: "2023-06-01 09:05:00", read_status: true },
    { message_id: 3, sender_id: 3, receiver_id: 4, content: "Are you coming to the event tonight?", timestamp: "2023-06-02 18:30:00", read_status: false },
    { message_id: 4, sender_id: 5, receiver_id: 6, content: "Check out this cool article!", timestamp: "2023-06-03 14:20:00", read_status: true },
    { message_id: 5, sender_id: 4, receiver_id: 1, content: "Happy birthday!", timestamp: "2023-06-04 00:01:00", read_status: false },
    { message_id: 6, sender_id: 6, receiver_id: 2, content: "Can you send me the project files?", timestamp: "2023-06-05 11:45:00", read_status: true }
  ];
  
  // Groups table
  export const groupsTable = [
    { group_id: 1, name: "Book Club", description: "For avid readers", creator_id: 1, created_at: "2023-03-01 15:30:00", member_count: 25 },
    { group_id: 2, name: "Hiking Enthusiasts", description: "Explore nature together", creator_id: 2, created_at: "2023-03-15 10:00:00", member_count: 50 },
    { group_id: 3, name: "Tech Innovators", description: "Discuss latest tech trends", creator_id: 3, created_at: "2023-04-01 14:45:00", member_count: 75 },
    { group_id: 4, name: "Foodies Unite", description: "Share recipes and restaurant reviews", creator_id: 5, created_at: "2023-04-20 09:30:00", member_count: 100 },
    { group_id: 5, name: "Movie Buffs", description: "For cinema lovers", creator_id: 4, created_at: "2023-05-10 20:15:00", member_count: 60 }
  ];
  
  // Events table
  export const eventsTable = [
    { event_id: 1, creator_id: 1, title: "Summer Book Fair", description: "Annual book exhibition and sale", location: "City Library", start_time: "2023-07-15 10:00:00", end_time: "2023-07-15 18:00:00", attendee_count: 200 },
    { event_id: 2, creator_id: 2, title: "Mountain Trail Hike", description: "Group hike in the mountains", location: "Mountain National Park", start_time: "2023-08-05 08:00:00", end_time: "2023-08-05 16:00:00", attendee_count: 30 },
    { event_id: 3, creator_id: 3, title: "Tech Startup Pitch Night", description: "Pitch your innovative ideas", location: "Innovation Hub", start_time: "2023-09-10 19:00:00", end_time: "2023-09-10 22:00:00", attendee_count: 150 },
    { event_id: 4, creator_id: 5, title: "International Food Festival", description: "Taste cuisines from around the world", location: "City Square", start_time: "2023-10-01 11:00:00", end_time: "2023-10-03 20:00:00", attendee_count: 500 },
    { event_id: 5, creator_id: 4, title: "Classic Movie Marathon", description: "24-hour screening of classic films", location: "Retro Cinema", start_time: "2023-11-11 18:00:00", end_time: "2023-11-12 18:00:00", attendee_count: 100 },
    { event_id: 6, creator_id: 6, title: "Travel Photography Workshop", description: "Learn tips and tricks for travel photography", location: "Community Center", start_time: "2023-12-05 14:00:00", end_time: "2023-12-05 17:00:00", attendee_count: 50 }
  ];