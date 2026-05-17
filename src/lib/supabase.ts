import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
// Use a valid JWT-like format for the fallback to prevent 'The string did not match the expected pattern' atob errors
const dummyJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.signature';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || dummyJwt;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for server-side admin operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || dummyJwt,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
