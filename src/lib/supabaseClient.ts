import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  '';

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  '';

if (!supabaseUrl.startsWith('http')) {
  throw new Error(
    'Invalid supabaseUrl from env: ' + JSON.stringify(supabaseUrl)
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
