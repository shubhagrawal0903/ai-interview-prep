-- Create the interview_sessions table in Supabase
CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  session_data JSONB NOT NULL,
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the topic for faster queries
CREATE INDEX IF NOT EXISTS idx_interview_sessions_topic ON interview_sessions(topic);

-- Create an index on user_id for faster user-specific queries
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id);

-- Create an index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_interview_sessions_created_at ON interview_sessions(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert (for demo purposes)
-- In production, you should restrict this to authenticated users only
CREATE POLICY "Allow public insert" ON interview_sessions
  FOR INSERT
  WITH CHECK (true);

-- Create a policy that allows anyone to read their own sessions
CREATE POLICY "Allow public read" ON interview_sessions
  FOR SELECT
  USING (true);

-- Optional: Create a policy for updates (if needed)
CREATE POLICY "Allow public update" ON interview_sessions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
