/**
 * Auth Guard - Shared authentication check for all pages
 * Ensures user is logged in before page is fully loaded
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ── CONFIG — Supabase connection ────────────────────────
const SUPABASE_URL  = 'https://tzzuxemddkgvgipsaadr.supabase.co';
const SUPABASE_ANON = 'sb_publishable_hV5vJlRZn0MOwQFErJPbww_9605nepF';
// ────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

async function initAuth() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.replace('login.html');
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    window.location.replace('login.html');
  }
}

// Initialize auth check (runs async in background — no opacity hiding)
initAuth();

// Export supabase client for use in other scripts
export { supabase };
