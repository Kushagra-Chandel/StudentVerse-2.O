# StudentVerse - All-in-One Student Platform

StudentVerse is a comprehensive learning platform designed specifically for students, combining study resources, practice exercises, mock tests, tech news, and career opportunities in one unified experience.

## Features

### Core Functionality

1. **Authentication System**
   - Secure email/password signup and login
   - User profile management with branch and semester tracking
   - Role-based access control (User/Admin)

2. **Notes Section**
   - Browse and filter notes by subject, branch, and semester
   - Download study materials
   - Bookmark important notes for quick access

3. **Practice Section**
   - Topic-wise practice questions
   - Multiple difficulty levels (Easy, Medium, Hard)
   - Instant feedback with explanations
   - Track your practice progress

4. **Mock Test System**
   - Timed full-length tests
   - Real-time question navigator
   - Auto-submit on time completion
   - Comprehensive scoring system

5. **Result Dashboard**
   - Detailed performance analytics
   - Score and accuracy tracking
   - Topic-wise performance breakdown
   - Time management insights

6. **AI Performance Analyzer**
   - Risk level assessment (High, Medium, Low)
   - Weak topic identification
   - Personalized study recommendations
   - Data-driven improvement suggestions

7. **Tech News**
   - Latest technology updates
   - Category-based filtering (AI, Tech Trends, Industry, etc.)
   - External source links
   - Stay updated with industry trends

8. **Opportunities Section**
   - Hackathons
   - Internships
   - Off-campus drives
   - Online courses
   - Deadline tracking

9. **Bookmark System**
   - Save content across all sections
   - Personal dashboard view
   - Quick access to saved items

10. **Admin Panel**
    - Upload notes and study materials
    - Add practice questions
    - Create mock tests with multiple questions
    - Post tech news
    - Add career opportunities

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## First Time Setup

### Creating an Admin Account

To access the admin panel and add content:

1. Sign up for a new account through the signup form
2. After signup, you'll need to manually update your role to 'admin' in the database
3. Go to your Supabase dashboard
4. Navigate to the `user_profiles` table
5. Find your user record and change the `role` field from 'user' to 'admin'
6. Refresh the application and you'll see the Admin Panel option in the navigation

### Adding Sample Content

Use the Admin Panel to:
- Upload notes for different subjects and branches
- Add practice questions across various topics
- Create mock tests with multiple questions
- Post tech news and updates
- Add career opportunities

## Key Features Explained

### Learning Flow
1. User signs up and creates a profile
2. Browse and study notes for their branch/semester
3. Practice topic-wise questions
4. Attempt full mock tests
5. Review performance with AI-powered analysis
6. Identify weak areas and improve

### AI Performance Analysis
The platform analyzes test results to provide:
- **Risk Assessment**: Identifies if students are at high, medium, or low risk based on performance
- **Weak Topic Detection**: Automatically finds topics where performance is below 60%
- **Personalized Suggestions**: Provides specific study recommendations based on scores and time management

### Admin Capabilities
Admins can manage all content on the platform:
- Upload study materials for any subject/branch/semester
- Create practice question banks
- Design comprehensive mock tests
- Keep students updated with tech news
- Post career opportunities

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Admins have controlled access to content creation
- Secure authentication with Supabase Auth

## Database Structure

The platform uses the following main tables:
- `user_profiles`: User information and roles
- `notes`: Study materials
- `practice_questions`: Practice problem bank
- `mock_tests`: Test definitions
- `test_questions`: Questions for each test
- `test_attempts`: User test submissions and results
- `tech_news`: Technology news and updates
- `opportunities`: Career opportunities
- `bookmarks`: User saved items

## Future Enhancements

Potential features for future development:
- File upload support for notes
- Real-time leaderboards
- Discussion forums
- Study groups
- Progress tracking over time
- Mobile application
- Email notifications for opportunities
