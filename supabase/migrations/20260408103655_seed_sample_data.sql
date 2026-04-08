/*
  # Seed Sample Data for StudentVerse

  ## Overview
  This migration adds sample data to demonstrate all platform features without requiring manual data entry.

  ## Sample Data Added

  ### Notes
  - Sample study materials for CSE and IT branches
  - Multiple subjects and semesters

  ### Practice Questions
  - Various topics (Arrays, Strings, etc.)
  - Different difficulty levels

  ### Mock Test
  - Complete test with questions

  ### Tech News
  - Sample technology news articles

  ### Opportunities
  - Sample hackathons, internships, and courses

  ## Note
  This is optional seed data for demonstration purposes.
*/

-- Insert sample notes
INSERT INTO notes (title, subject, branch, semester, file_url, description) VALUES
('Data Structures Complete Notes', 'Data Structures', 'CSE', 3, 'https://example.com/ds-notes.pdf', 'Comprehensive notes covering all data structures including arrays, linked lists, trees, and graphs'),
('Operating Systems Fundamentals', 'Operating Systems', 'CSE', 4, 'https://example.com/os-notes.pdf', 'Complete OS concepts: processes, threads, memory management, and file systems'),
('Database Management Systems', 'Database', 'IT', 3, 'https://example.com/dbms-notes.pdf', 'SQL, normalization, transactions, and database design'),
('Computer Networks Basics', 'Networks', 'CSE', 5, 'https://example.com/networks-notes.pdf', 'OSI model, TCP/IP, routing, and network protocols'),
('Algorithm Design', 'Algorithms', 'CSE', 4, 'https://example.com/algo-notes.pdf', 'Greedy, dynamic programming, divide and conquer approaches')
ON CONFLICT DO NOTHING;

-- Insert sample practice questions
INSERT INTO practice_questions (title, topic, difficulty, question_text, options, correct_answer, explanation) VALUES
('Find Maximum Element', 'Arrays', 'easy', 'What is the time complexity of finding the maximum element in an unsorted array of n elements?', '["O(1)", "O(log n)", "O(n)", "O(n²)"]', 'O(n)', 'We need to check every element once to find the maximum, resulting in O(n) time complexity.'),
('Reverse a String', 'Strings', 'easy', 'Which is the most efficient way to reverse a string in-place?', '["Use two pointers", "Create new string", "Use recursion", "Use stack"]', 'Use two pointers', 'Using two pointers (one at start, one at end) and swapping is the most space-efficient approach.'),
('Binary Search', 'Searching', 'medium', 'What is the prerequisite for binary search to work?', '["Array must be sorted", "Array must have unique elements", "Array size must be even", "None of the above"]', 'Array must be sorted', 'Binary search requires the array to be sorted to work correctly by eliminating half the search space in each iteration.'),
('Linked List Cycle', 'Linked Lists', 'medium', 'Which algorithm is used to detect a cycle in a linked list?', '["Floyd''s Algorithm", "Dijkstra''s Algorithm", "Kruskal''s Algorithm", "Prim''s Algorithm"]', 'Floyd''s Algorithm', 'Floyd''s Cycle Detection Algorithm (Tortoise and Hare) uses two pointers moving at different speeds.'),
('Tree Traversal', 'Trees', 'medium', 'In which tree traversal is the root visited last?', '["Preorder", "Inorder", "Postorder", "Level order"]', 'Postorder', 'In postorder traversal, we visit left subtree, then right subtree, and finally the root node.'),
('Graph BFS', 'Graphs', 'hard', 'What data structure is used to implement BFS?', '["Stack", "Queue", "Heap", "Tree"]', 'Queue', 'BFS uses a queue to explore nodes level by level in a graph.'),
('Dynamic Programming', 'Dynamic Programming', 'hard', 'What is the key principle of dynamic programming?', '["Divide and conquer", "Optimal substructure", "Greedy choice", "Backtracking"]', 'Optimal substructure', 'DP relies on optimal substructure, where optimal solution can be constructed from optimal solutions of subproblems.'),
('Sorting Complexity', 'Sorting', 'medium', 'Which sorting algorithm has O(n log n) worst-case time complexity?', '["Quick Sort", "Merge Sort", "Bubble Sort", "Selection Sort"]', 'Merge Sort', 'Merge Sort consistently has O(n log n) complexity in all cases, unlike Quick Sort which can degrade to O(n²).')
ON CONFLICT DO NOTHING;

-- Insert sample mock test
INSERT INTO mock_tests (title, description, duration_minutes, total_questions, topics, difficulty_level) VALUES
('DSA Fundamentals Test', 'Test your knowledge of fundamental data structures and algorithms', 45, 5, ARRAY['Arrays', 'Strings', 'Sorting', 'Searching', 'Trees'], 'medium')
ON CONFLICT DO NOTHING;

-- Insert test questions for the mock test
DO $$
DECLARE
  test_id_var uuid;
BEGIN
  SELECT id INTO test_id_var FROM mock_tests WHERE title = 'DSA Fundamentals Test' LIMIT 1;
  
  IF test_id_var IS NOT NULL THEN
    INSERT INTO test_questions (test_id, question_text, options, correct_answer, topic, marks) VALUES
    (test_id_var, 'What is the time complexity of accessing an element in an array by index?', '["O(1)", "O(log n)", "O(n)", "O(n²)"]', 'O(1)', 'Arrays', 2),
    (test_id_var, 'Which data structure uses LIFO principle?', '["Queue", "Stack", "Array", "Linked List"]', 'Stack', 'Data Structures', 2),
    (test_id_var, 'What is the worst-case time complexity of Quick Sort?', '["O(n log n)", "O(n²)", "O(n)", "O(log n)"]', 'O(n²)', 'Sorting', 2),
    (test_id_var, 'In a binary search tree, where is the minimum element located?', '["Root", "Leftmost node", "Rightmost node", "Any leaf"]', 'Leftmost node', 'Trees', 2),
    (test_id_var, 'Which algorithm is used to find the shortest path in an unweighted graph?', '["DFS", "BFS", "Dijkstra", "Bellman-Ford"]', 'BFS', 'Searching', 2)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Insert sample tech news
INSERT INTO tech_news (title, content, category, image_url, source_url) VALUES
('AI Revolutionizes Code Generation', 'Artificial Intelligence tools are transforming how developers write code, with new models capable of generating complex functions and debugging existing code with unprecedented accuracy.', 'AI', 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg', 'https://example.com/ai-news'),
('Web3 and Blockchain Technology Trends', 'Decentralized applications and blockchain technology continue to evolve, offering new opportunities for developers in finance, gaming, and social media platforms.', 'Tech Trends', 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg', 'https://example.com/blockchain'),
('Top Programming Languages in 2024', 'Python, JavaScript, and TypeScript remain the most popular languages, with Rust and Go gaining significant traction for system programming and backend development.', 'Development', 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg', 'https://example.com/languages'),
('Cloud Computing Market Growth', 'Cloud services market continues to expand, with AWS, Azure, and Google Cloud leading the way. Companies are increasingly adopting multi-cloud strategies.', 'Industry', 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg', 'https://example.com/cloud')
ON CONFLICT DO NOTHING;

-- Insert sample opportunities
INSERT INTO opportunities (title, type, company, description, deadline, apply_url) VALUES
('Global Hackathon 2024', 'hackathon', 'TechCorp', 'Join developers worldwide in building innovative solutions. Prizes worth $50,000. Categories: AI/ML, Web3, Mobile Apps, and IoT.', (CURRENT_DATE + INTERVAL '30 days')::timestamptz, 'https://example.com/hackathon'),
('Summer Internship Program', 'internship', 'Google', 'Software Engineering internship for students. Work on real products, mentorship from engineers, competitive stipend. Duration: 3 months.', (CURRENT_DATE + INTERVAL '45 days')::timestamptz, 'https://example.com/internship'),
('Off-Campus Drive for 2024 Graduates', 'drive', 'Microsoft', 'Hiring for Software Development Engineer roles. All branches welcome. CTC: 12-15 LPA. Multiple rounds including coding and system design.', (CURRENT_DATE + INTERVAL '20 days')::timestamptz, 'https://example.com/drive'),
('Full Stack Development Course', 'course', 'Coursera', 'Learn MERN stack from scratch. Build 5 projects, get certificate. Early bird discount: 30% off. Limited seats available.', (CURRENT_DATE + INTERVAL '15 days')::timestamptz, 'https://example.com/course'),
('AI/ML Workshop Series', 'hackathon', 'Stanford University', 'Free online workshop series on Machine Learning fundamentals. Learn from industry experts. Covers supervised learning, neural networks, and more.', (CURRENT_DATE + INTERVAL '25 days')::timestamptz, 'https://example.com/workshop')
ON CONFLICT DO NOTHING;
