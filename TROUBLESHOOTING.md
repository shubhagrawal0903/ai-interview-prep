# Troubleshooting Guide - Session Fetching Error

## ❌ Error: "Error fetching past sessions: {}"

This error occurs when the dashboard tries to fetch sessions from Supabase but fails.

## 🔍 Common Causes & Solutions

### 1. **Missing `user_id` Column in Supabase**

**Symptom:** Error in console when visiting dashboard

**Solution:**
1. Go to your Supabase project dashboard
2. Click on "SQL Editor"
3. Copy and paste the contents of `supabase-migration-add-user-id.sql`
4. Click "Run"
5. Verify the column was added successfully

**Quick SQL:**
```sql
ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id);
```

### 2. **Missing Supabase Environment Variables**

**Symptom:** Console shows "Missing Supabase environment variables!"

**Solution:**
1. Check your `.env.local` file has:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
2. Restart your dev server:
   ```bash
   npm run dev
   ```

### 3. **Supabase Table Doesn't Exist**

**Symptom:** Error about missing table `interview_sessions`

**Solution:**
1. Go to Supabase → SQL Editor
2. Run the complete schema from `supabase-schema.sql`
3. Verify table exists in Table Editor

### 4. **Row Level Security (RLS) Blocking Access**

**Symptom:** Empty array returned even though data exists

**Solution:**
1. Go to Supabase → Authentication → Policies
2. Check `interview_sessions` table policies
3. Temporarily disable RLS for testing:
   ```sql
   ALTER TABLE interview_sessions DISABLE ROW LEVEL SECURITY;
   ```
4. Or update policies to allow public read:
   ```sql
   CREATE POLICY "Allow public read" ON interview_sessions
     FOR SELECT USING (true);
   ```

### 5. **Network/CORS Issues**

**Symptom:** Network error or CORS error in browser console

**Solution:**
1. Check Supabase project is running (not paused)
2. Verify API URL is correct
3. Check browser network tab for failed requests

## 🛠️ Enhanced Error Handling

The code has been updated with better error handling:

### What's New:
- ✅ Detailed error logging with error codes
- ✅ Fallback query if `user_id` column doesn't exist
- ✅ Environment variable validation
- ✅ Console logs for debugging

### Debug Output:
Check your browser console for these messages:
```
Fetching sessions for userId: user_xxx
Supabase error details: { message: "...", code: "..." }
Successfully fetched sessions: 5
```

## 🧪 Testing Steps

### Step 1: Check Environment Variables
```bash
# In terminal
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Step 2: Test Supabase Connection
1. Go to browser console
2. Run:
   ```javascript
   import { supabase } from '@/lib/supabaseClient';
   const { data, error } = await supabase.from('interview_sessions').select('*').limit(1);
   console.log('Data:', data, 'Error:', error);
   ```

### Step 3: Verify Table Structure
In Supabase SQL Editor:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'interview_sessions';
```

Should show:
- `id` (uuid)
- `topic` (text)
- `session_data` (jsonb)
- `user_id` (text) ← **Must exist**
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Step 4: Check Data
```sql
SELECT COUNT(*) FROM interview_sessions;
SELECT * FROM interview_sessions LIMIT 5;
```

## 🔧 Quick Fixes

### Fix 1: Restart Everything
```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Restart dev server
npm run dev
```

### Fix 2: Clear Next.js Cache
```bash
# Delete .next folder
rmdir /s /q .next

# Restart
npm run dev
```

### Fix 3: Re-run Database Setup
1. Copy all SQL from `supabase-schema.sql`
2. Go to Supabase SQL Editor
3. Paste and run
4. Refresh the page

## 📊 Expected Behavior

### When Working Correctly:

**Console Output:**
```
Fetching sessions for userId: user_2xxx
Successfully fetched sessions: 3
```

**Dashboard Display:**
- Shows summary cards (Total Sessions, Average Score)
- Lists all user's past sessions
- Each session is expandable

### When No Sessions Exist:
```
Fetching sessions for userId: user_2xxx
Successfully fetched sessions: 0
```
- Shows "No Sessions Yet" message
- Encourages user to start practicing

## 🆘 Still Not Working?

### Check These:

1. **Supabase Project Status**
   - Go to Supabase dashboard
   - Check if project is active (not paused)

2. **API Keys**
   - Verify keys are from correct project
   - Make sure using `anon` key, not `service_role`

3. **Browser Console**
   - Look for any red errors
   - Check Network tab for failed requests

4. **Server Logs**
   - Check terminal running `npm run dev`
   - Look for any error messages

### Get Help:
1. Check browser console for detailed error
2. Check Supabase logs in dashboard
3. Review `API_SESSION_SETUP.md` for API details
4. Check `SUPABASE_SETUP.md` for setup guide

## ✅ Success Checklist

- [ ] `.env.local` has correct Supabase credentials
- [ ] Supabase table `interview_sessions` exists
- [ ] Table has `user_id` column
- [ ] RLS policies allow read access
- [ ] Dev server restarted after changes
- [ ] Browser console shows "Successfully fetched sessions"
- [ ] Dashboard loads without errors

---

Once all checks pass, your dashboard should work perfectly! 🎉
