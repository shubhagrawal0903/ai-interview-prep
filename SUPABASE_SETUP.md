# Supabase Setup Guide

This guide will help you set up Supabase for the AI Interview Prep application to save interview sessions.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: ai-interview-prep (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for it to initialize

## Step 2: Set Up the Database Table

1. In your Supabase project dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` and paste it into the query editor
4. Click "Run" to execute the SQL commands
5. Verify the table was created by going to "Table Editor" → you should see `interview_sessions`

## Step 3: Get Your API Keys

1. In your Supabase project dashboard, click on "Project Settings" (gear icon)
2. Click on "API" in the settings menu
3. You'll find two important values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 4: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Make sure you also have your Google API key configured:
   ```env
   GOOGLE_API_KEY=your_google_api_key_here
   ```

## Step 5: Install Dependencies

If you haven't already installed the Supabase client:

```bash
npm install @supabase/supabase-js
```

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. Generate some interview questions

4. Answer a question and click "Get AI Feedback"

5. Check your Supabase dashboard:
   - Go to "Table Editor"
   - Click on `interview_sessions`
   - You should see a new row with your session data!

## Database Schema

The `interview_sessions` table has the following structure:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| topic | TEXT | The interview topic (e.g., "React.js") |
| session_data | JSONB | Array of questions, answers, user answers, and feedback |
| created_at | TIMESTAMP | When the session was created |
| updated_at | TIMESTAMP | Last update time |

## Session Data Format

Each session is saved with this structure:

```json
{
  "topic": "React.js",
  "session_data": [
    {
      "question": "What is React?",
      "answer": "React is a JavaScript library...",
      "userAnswer": "React is a library for building UIs...",
      "feedback": "Good answer! You correctly identified..."
    }
  ]
}
```

## Security Notes

⚠️ **Important**: The current setup allows public read/write access for demo purposes. For production:

1. Enable authentication in Supabase
2. Update the RLS policies to restrict access to authenticated users only
3. Add user_id column to track which user created each session
4. Update the policies to only allow users to see their own sessions

Example production policy:
```sql
-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert" ON interview_sessions
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can only see their own sessions
CREATE POLICY "Users can see own sessions" ON interview_sessions
  FOR SELECT
  USING (auth.uid() = user_id);
```

## Troubleshooting

### "Failed to save session to database"

1. Check your `.env.local` file has the correct Supabase credentials
2. Verify the table exists in Supabase (Table Editor)
3. Check the browser console for detailed error messages
4. Ensure RLS policies are correctly set up

### Data not appearing in Supabase

1. Open browser DevTools → Network tab
2. Look for failed requests to Supabase
3. Check the response for error details
4. Verify your anon key is correct

## Next Steps

- Add user authentication with Supabase Auth
- Create a "My Sessions" page to view past practice sessions
- Add analytics to track progress over time
- Implement session sharing functionality

## Support

For Supabase-specific issues:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com/)

For project issues:
- Check the main README.md
- Review the code in `src/lib/db/sessionSaver.ts`
