-- ========================================
-- COMPLETE SQL SCHEMA FOR AI INTERVIEW PREP
-- ========================================
-- Run this in Supabase SQL Editor to create the interview_sessions table
-- This will create everything from scratch

-- Step 1: Drop table if exists (careful - this deletes all data!)
DROP TABLE IF EXISTS interview_sessions CASCADE;

-- Step 2: Create interview_sessions table with all required columns
CREATE TABLE interview_sessions (
    -- Primary key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Interview topic
    topic TEXT NOT NULL,
    
    -- Session data (stores all questions, answers, feedback)
    session_data JSONB NOT NULL,
    
    -- User identification (from Clerk)
    user_id TEXT NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Step 3: Create indexes for performance
CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX idx_interview_sessions_created_at ON interview_sessions(created_at DESC);
CREATE INDEX idx_interview_sessions_topic ON interview_sessions(topic);

-- Step 4: Add comment to table
COMMENT ON TABLE interview_sessions IS 'Stores AI interview practice sessions with questions, answers, and feedback';

-- Step 5: Enable Row Level Security (Optional - uncomment if needed)
-- ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies (Optional - uncomment if needed)
-- Allow users to read their own sessions
-- CREATE POLICY "Users can view own sessions"
--   ON interview_sessions
--   FOR SELECT
--   USING (auth.uid()::text = user_id);

-- Allow users to insert their own sessions
-- CREATE POLICY "Users can insert own sessions"
--   ON interview_sessions
--   FOR INSERT
--   WITH CHECK (auth.uid()::text = user_id);

-- Allow public read for now (remove in production)
-- CREATE POLICY "Allow public read"
--   ON interview_sessions
--   FOR SELECT
--   USING (true);

-- Step 7: Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create trigger to auto-update updated_at
CREATE TRIGGER update_interview_sessions_updated_at
    BEFORE UPDATE ON interview_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 9: Reload schema cache (important!)
NOTIFY pgrst, 'reload schema';

-- Step 10: Verify table was created successfully
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'interview_sessions'
ORDER BY ordinal_position;

-- Step 11: Check table info
SELECT 
    'interview_sessions' as table_name,
    COUNT(*) as row_count
FROM interview_sessions;

-- ========================================
-- SUCCESS! Table created successfully
-- ========================================
-- Next steps:
-- 1. Restart your Next.js dev server
-- 2. Test saving a session from your app
-- 3. Check the dashboard to see saved sessions
-- ========================================
